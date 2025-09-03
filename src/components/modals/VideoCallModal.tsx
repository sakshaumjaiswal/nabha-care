import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Video, VideoOff, Mic, MicOff, Phone, Monitor, Users } from 'lucide-react';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  roomId?: string;
}

export function VideoCallModal({ isOpen, onClose, patientName, roomId }: VideoCallModalProps) {
  const [callStarted, setCallStarted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStarted) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStarted]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    setCallStarted(true);
    toast({
      title: "Call Started",
      description: `Connected with ${patientName}`,
    });
  };

  const handleEndCall = () => {
    setCallStarted(false);
    setCallDuration(0);
    toast({
      title: "Call Ended",
      description: `Call with ${patientName} has ended`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            {callStarted ? 'Video Consultation' : 'Start Video Call'}
          </DialogTitle>
          <DialogDescription>
            {callStarted ? `In call with ${patientName}` : `Connecting with ${patientName}`}
            {roomId && <span className="block text-xs mt-1">Room ID: {roomId}</span>}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Video Call Interface */}
          <div className="relative bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
            {callStarted ? (
              <>
                {/* Main video area */}
                <div className="text-white text-center">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">{patientName}</p>
                  <Badge variant="secondary" className="mt-2">
                    {formatDuration(callDuration)}
                  </Badge>
                </div>
                
                {/* Local video preview */}
                <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Monitor className="h-8 w-8 text-white opacity-50" />
                </div>
                
                {/* Call status indicators */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {videoEnabled && <Badge className="bg-green-500">Video On</Badge>}
                  {audioEnabled && <Badge className="bg-green-500">Audio On</Badge>}
                  <Badge variant="secondary">
                    <Users className="h-3 w-3 mr-1" />
                    2 participants
                  </Badge>
                </div>
              </>
            ) : (
              <div className="text-white text-center">
                <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Ready to start call</p>
                <p className="text-sm opacity-75">Click "Start Call" to begin</p>
              </div>
            )}
          </div>

          {/* Call Controls */}
          <div className="flex justify-center gap-4">
            <Button
              variant={videoEnabled ? "outline" : "destructive"}
              size="sm"
              onClick={() => setVideoEnabled(!videoEnabled)}
              disabled={!callStarted}
            >
              {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            
            <Button
              variant={audioEnabled ? "outline" : "destructive"}
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
              disabled={!callStarted}
            >
              {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>

            {callStarted ? (
              <Button variant="destructive" size="sm" onClick={handleEndCall}>
                <Phone className="h-4 w-4 mr-2" />
                End Call
              </Button>
            ) : (
              <Button variant="medical" size="sm" onClick={handleStartCall}>
                <Video className="h-4 w-4 mr-2" />
                Start Call
              </Button>
            )}
          </div>

          {/* Call Notes */}
          {callStarted && (
            <div className="p-4 bg-surface-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Call Notes:</p>
              <p className="text-xs text-muted-foreground">
                • Video quality: Good<br/>
                • Connection: Stable<br/>
                • Patient can see and hear clearly
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {callStarted ? 'Minimize' : 'Cancel'}
          </Button>
          {callStarted && (
            <Button variant="ghost" size="sm">
              Add Notes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}