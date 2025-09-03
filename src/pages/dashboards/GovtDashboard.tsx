import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { 
  BarChart3, 
  TrendingUp,
  Users,
  Building,
  MapPin,
  Calendar,
  Download,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';

const GovtDashboard: React.FC = () => {
  const overviewStats = [
    { 
      label: 'Total Consultations', 
      value: '2,847', 
      change: '+12%',
      trend: 'up',
      icon: Activity
    },
    { 
      label: 'Active Doctors', 
      value: '156', 
      change: '+8',
      trend: 'up',
      icon: Users
    },
    { 
      label: 'Villages Connected', 
      value: '67', 
      change: '+3',
      trend: 'up',
      icon: MapPin
    },
    { 
      label: 'Medicine Shortages', 
      value: '23', 
      change: '-5',
      trend: 'down',
      icon: AlertTriangle
    }
  ];

  const villageData = [
    { name: 'Nabha', consultations: 245, doctors: 12, pharmacies: 3, status: 'excellent' },
    { name: 'Dhanaula', consultations: 189, doctors: 8, pharmacies: 2, status: 'good' },
    { name: 'Patiala Rural', consultations: 156, doctors: 6, pharmacies: 2, status: 'fair' },
    { name: 'Rajpura', consultations: 134, doctors: 5, pharmacies: 1, status: 'needs-attention' },
    { name: 'Ghanaur', consultations: 98, doctors: 4, pharmacies: 1, status: 'needs-attention' }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'shortage',
      message: 'Critical medicine shortage reported in Ghanaur',
      time: '2 hours ago',
      severity: 'high'
    },
    {
      id: 2,
      type: 'system',
      message: 'Network connectivity issues in Rajpura resolved',
      time: '4 hours ago',
      severity: 'medium'
    },
    {
      id: 3,
      type: 'quality',
      message: 'New doctor verification completed - Dr. Manpreet Singh',
      time: '6 hours ago',
      severity: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-medical-success bg-medical-success/10';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'fair':
        return 'text-medical-warning bg-medical-warning/10';
      case 'needs-attention':
        return 'text-medical-error bg-medical-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-medical-error bg-medical-error/10';
      case 'medium':
        return 'text-medical-warning bg-medical-warning/10';
      case 'low':
        return 'text-medical-success bg-medical-success/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentUser={{ name: 'Punjab Health Dept', role: 'government' }} />
      
      <div className="container px-6 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Healthcare Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Punjab Rural Healthcare Monitoring • {new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {overviewStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className="text-right">
                      <IconComponent className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        stat.trend === 'up' ? 'text-medical-success bg-medical-success/10' : 'text-medical-error bg-medical-error/10'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Village Performance */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Village-wise Healthcare Performance</CardTitle>
                    <CardDescription>
                      Healthcare access and utilization across {villageData.length} villages
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      This Month
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {villageData.map((village, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border bg-surface-elevated/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">{village.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{village.consultations} consultations</span>
                            <span>{village.doctors} doctors</span>
                            <span>{village.pharmacies} pharmacies</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(village.status)}`}>
                          {village.status.replace('-', ' ')}
                        </span>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analytics Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Healthcare Trends</CardTitle>
                <CardDescription>
                  Monthly consultation and medication trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-surface-elevated/50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Interactive charts will be displayed here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Showing consultation trends, medicine usage, and health outcomes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="medical" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Doctor Registry
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <Building className="h-4 w-4 mr-2" />
                  Pharmacy Network
                </Button>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card className="border-medical-warning/30 bg-medical-warning/5">
              <CardHeader>
                <CardTitle className="text-base text-medical-warning flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 rounded-lg bg-background/50">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {alert.time}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-3">
                  View All Alerts
                </Button>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-medical-success" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Platform Uptime</span>
                  <span className="text-sm font-medium">99.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Sessions</span>
                  <span className="text-sm font-medium">234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Data Sync Status</span>
                  <span className="text-sm font-medium text-medical-success">Synced</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Backup</span>
                  <span className="text-sm font-medium">2 hours ago</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-medical-success rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">New doctor registered</p>
                      <p className="text-muted-foreground">Dr. Rajesh Kumar - Nabha</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-medical-warning rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">Medicine shortage alert</p>
                      <p className="text-muted-foreground">Insulin - Ghanaur Pharmacy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-medical-success rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-medium">System maintenance completed</p>
                      <p className="text-muted-foreground">Database optimization</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovtDashboard;