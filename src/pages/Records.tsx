import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { 
  FileText, 
  Download, 
  Search, 
  Calendar, 
  User, 
  Stethoscope,
  Pill,
  TestTube2,
  Share,
} from 'lucide-react';

const Records: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { records, loading } = useMedicalRecords();

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'consultation': return Stethoscope;
      case 'prescription': return Pill;
      case 'lab-result': return TestTube2;
      default: return FileText;
    }
  };

  const getRecordColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'text-medical-primary';
      case 'prescription': return 'text-medical-secondary';
      case 'lab-result': return 'text-medical-accent';
      default: return 'text-muted-foreground';
    }
  };
  
  const filteredRecords = records.filter(record => 
    record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (record.summary && record.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-6 py-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Medical Records</h1>
          <p className="text-muted-foreground">
            View, download, and manage your complete medical history.
          </p>
        </div>

        <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search records by title or summary..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {loading && <p className="text-center text-muted-foreground">Loading records...</p>}
              {!loading && filteredRecords.map((record) => {
                const RecordIcon = getRecordIcon(record.type);
                const doctorName = record.consultations?.doctors?.profiles?.name || 'Self Uploaded';
                return (
                  <Card key={record.id} className="hover:shadow-medium transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-surface-elevated to-surface-muted flex items-center justify-center`}>
                          <RecordIcon className={`h-6 w-6 ${getRecordColor(record.type)}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold">{record.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span>{doctorName}</span>
                                <span>•</span>
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(record.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <Badge variant="outline" className="capitalize">{record.type.replace('_', ' ')}</Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">{record.summary}</p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {!loading && filteredRecords.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Records Found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Try adjusting your search terms.' : 'Your medical records will appear here after consultations.'}
                  </p>
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
};

export default Records;