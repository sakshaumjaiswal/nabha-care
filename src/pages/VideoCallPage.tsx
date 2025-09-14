import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, PhoneOff, UserCheck, Hourglass, Video } from 'lucide-react';

type CallStatus = 'connecting' | 'waiting' | 'in-progress' | 'completed' | 'error';

const VideoCallPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = searchParams.get('room');
  const { user, profile } = useAuth();

  const [status, setStatus] = useState<CallStatus>('connecting');
  const [consultation, setConsultation] = useState(null);

  useEffect(() => {
    if (!roomId) {
      navigate('/dashboard/patient');
      return;
    }

    // Fetch initial consultation details
    const fetchConsultation = async () => {
      const { data, error } = await supabase
        .from('consultations')
        .select(`*, doctors:profiles!doctor_id(name), patients:profiles!patient_id(name)`)
        .eq('id', roomId)
        .single();
      
      if (error || !data) {
        setStatus('error');
        return;
      }
      setConsultation(data);
      setStatus(data.status as CallStatus);
    };

    fetchConsultation();

    // Set up Supabase Realtime subscription
    const channel = supabase
      .channel(`consultation-${roomId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'consultations', filter: `id=eq.${roomId}` },
        (payload) => {
          console.log('Realtime update received:', payload);
          const newStatus = payload.new.status;
          setConsultation(prev => ({...prev, ...payload.new}));
          setStatus(newStatus as CallStatus);
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, navigate]);
  
  const getStatusContent = () => {
      const role = profile?.role;
      const peerName = role === 'patient' ? consultation?.doctors?.name : consultation?.patients?.name;

      switch (status) {
          case 'connecting':
              return <div className="text-center"><Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" /><p>Connecting to the call room...</p></div>;
          case 'waiting':
          case 'scheduled':
              return <div className="text-center"><Hourglass className="h-12 w-12 mx-auto mb-4" /><p>Waiting for Dr. {peerName} to join the call...</p></div>;
          case 'in-progress':
              return <div className="text-center"><UserCheck className="h-12 w-12 text-medical-success mx-auto mb-4" /><p>You are now connected with Dr. {peerName}.</p></div>;
          case 'completed':
              return <div className="text-center"><PhoneOff className="h-12 w-12 text-medical-error mx-auto mb-4" /><p>This consultation has ended.</p></div>;
          case 'error':
              return <div className="text-center"><p className="text-medical-error">Could not find consultation. It may have been cancelled.</p></div>;
          default:
              return <div className="text-center"><p>An unknown status has occurred.</p></div>;
      }
  };

  return (
    <div className="min-h-screen bg-surface-elevated">
      <Header />
      <div className="container flex items-center justify-center py-16">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <Video className="h-10 w-10 mx-auto text-primary mb-2" />
            <CardTitle className="text-2xl">Video Consultation</CardTitle>
            <CardDescription>Room ID: {roomId}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center text-white mb-6">
              {getStatusContent()}
            </div>
            <div className="flex justify-center">
                <Button variant="destructive" onClick={() => navigate('/dashboard/patient')}>
                    <PhoneOff className="mr-2 h-4 w-4" />
                    Leave Call
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoCallPage;