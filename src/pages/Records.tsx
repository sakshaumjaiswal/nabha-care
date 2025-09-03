import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Upload, 
  Search, 
  Calendar, 
  User, 
  Stethoscope,
  Pill,
  TestTube2,
  Camera,
  QrCode,
  Share,
  Lock,
  Wifi,
  WifiOff
} from 'lucide-react';

const Records: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>('all');
  
  const mockRecords = [
    {
      id: '1',
      type: 'consultation',
      title: 'Video Consultation - General Medicine',
      doctor: 'Dr. Amar Singh',
      date: '2024-01-15',
      time: '14:30',
      summary: 'Routine checkup for fever and headache. Prescribed paracetamol and rest.',
      status: 'completed',
      attachments: [
        { name: 'Prescription.pdf', type: 'pdf', size: '125 KB' },
        { name: 'Lab_Report.pdf', type: 'pdf', size: '89 KB' }
      ]
    },
    {
      id: '2',
      type: 'prescription',
      title: 'Prescription - Hypertension',
      doctor: 'Dr. Seema Kaur',
      date: '2024-01-12',
      time: '10:00',
      summary: 'Blood pressure medication adjustment. Continue with Amlodipine 5mg.',
      status: 'active',
      attachments: [
        { name: 'Prescription_Jan2024.pdf', type: 'pdf', size: '67 KB' }
      ]
    },
    {
      id: '3',
      type: 'lab-result',
      title: 'Blood Test Results',
      doctor: 'Dr. Rajesh Patel',
      date: '2024-01-10',
      time: '09:00',
      summary: 'Complete blood count and lipid profile. All values within normal range.',
      status: 'reviewed',
      attachments: [
        { name: 'Blood_Test_Results.pdf', type: 'pdf', size: '234 KB' },
        { name: 'Lab_Images.jpg', type: 'image', size: '1.2 MB' }
      ]
    },
    {
      id: '4',
      type: 'vaccination',
      title: 'COVID-19 Vaccination Record',
      doctor: 'Vaccination Center',
      date: '2024-01-05',
      time: '11:30',
      summary: 'Second booster dose of COVID-19 vaccine administered.',
      status: 'completed',
      attachments: [
        { name: 'Vaccination_Certificate.pdf', type: 'pdf', size: '98 KB' }
      ]
    }
  ];

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'consultation': return Stethoscope;
      case 'prescription': return Pill;
      case 'lab-result': return TestTube2;
      case 'vaccination': return FileText;
      default: return FileText;
    }
  };

  const getRecordColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'text-medical-primary';
      case 'prescription': return 'text-medical-secondary';
      case 'lab-result': return 'text-medical-accent';
      case 'vaccination': return 'text-medical-success';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-medical-success/10 text-medical-success';
      case 'active': return 'bg-medical-primary/10 text-medical-primary';
      case 'reviewed': return 'bg-medical-secondary/10 text-medical-secondary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredRecords = mockRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === 'all' || record.type === selectedTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-6 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Medical Records</h1>
          <p className="text-muted-foreground">
            View, download, and manage your complete medical history
          </p>
        </div>

        {/* Sync Status */}
        <Card className="mb-8 border-l-4 border-l-medical-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wifi className="h-5 w-5 text-medical-success" />
                <div>
                  <p className="font-medium">Records Synced</p>
                  <p className="text-sm text-muted-foreground">
                    Last synced: 2 minutes ago • {mockRecords.length} records available offline
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
                <Button variant="ghost" size="sm">
                  <QrCode className="h-4 w-4 mr-2" />
                  Share QR
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex gap-4 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search records, doctors, or conditions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Filter by Date
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Record Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All Records</TabsTrigger>
                <TabsTrigger value="consultation">Consultations</TabsTrigger>
                <TabsTrigger value="prescription">Prescriptions</TabsTrigger>
                <TabsTrigger value="lab-result">Lab Results</TabsTrigger>
                <TabsTrigger value="vaccination">Vaccinations</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Records Timeline */}
            <div className="space-y-4">
              {filteredRecords.map((record) => {
                const RecordIcon = getRecordIcon(record.type);
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
                                <span>{record.doctor}</span>
                                <span>•</span>
                                <Calendar className="h-4 w-4" />
                                <span>{record.date} at {record.time}</span>
                              </div>
                            </div>
                            <Badge className={getStatusColor(record.status)}>
                              {record.status}
                            </Badge>
                          </div>
                          
                          <p className="text-muted-foreground mb-4">{record.summary}</p>
                          
                          {/* Attachments */}
                          {record.attachments.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-medium mb-2">Attachments:</p>
                              <div className="flex flex-wrap gap-2">
                                {record.attachments.map((attachment, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 px-3 py-2 bg-surface-muted rounded-lg text-sm"
                                  >
                                    <FileText className="h-4 w-4" />
                                    <span>{attachment.name}</span>
                                    <span className="text-muted-foreground">({attachment.size})</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                            <Button variant="ghost" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredRecords.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Records Found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Try adjusting your search terms' : 'Your medical records will appear here'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upload New Record */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add New Record</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
                <Button variant="outline" className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
                <Button variant="medical" className="w-full" asChild>
                  <a href="/consult">Book Consultation</a>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Record Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Records</span>
                  <span className="font-medium">{mockRecords.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Consultations</span>
                  <span className="font-medium">
                    {mockRecords.filter(r => r.type === 'consultation').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Prescriptions</span>
                  <span className="font-medium">
                    {mockRecords.filter(r => r.type === 'prescription').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Lab Results</span>
                  <span className="font-medium">
                    {mockRecords.filter(r => r.type === 'lab-result').length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Offline Backup */}
            <Card className="border-medical-primary/30 bg-medical-primary/5">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Secure Backup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Create an encrypted offline backup of your records
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Create Backup
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Access */}
            <Card className="border-medical-error/30 bg-medical-error/5">
              <CardHeader>
                <CardTitle className="text-base text-medical-error">Emergency Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Generate QR code for emergency medical access
                </p>
                <Button variant="destructive" size="sm" className="w-full">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Records;