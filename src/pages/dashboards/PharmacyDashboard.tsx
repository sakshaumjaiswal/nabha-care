import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { AddMedicineModal } from '@/components/modals/AddMedicineModal';
import { usePharmacy } from '@/hooks/usePharmacy';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Clock,
  Truck,
  Plus,
  Upload,
  Edit,
  FileText
} from 'lucide-react';

const PharmacyDashboard: React.FC = () => {
  const { medicines, inventory, fetchInventory, updateInventory } = usePharmacy();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [addMedicineModal, setAddMedicineModal] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Filter inventory in real-time
  };

  const handleImportCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast({
          title: "CSV Import Started",
          description: `Importing inventory from ${file.name}`,
        });
        // In real app, process the CSV file
      }
    };
    input.click();
  };

  const handleEditItem = (itemId: string) => {
    setEditingItem(itemId);
    toast({
      title: "Edit Item",
      description: "Opening inventory item editor",
    });
  };

  const handleOrderAction = (orderId: string, action: 'delivered' | 'prepare') => {
    const actionText = action === 'delivered' ? 'marked as delivered' : 'being prepared';
    toast({
      title: "Order Updated",
      description: `Order ${orderId} has been ${actionText}`,
    });
  };

  const handleQuickAction = (action: string) => {
    const actions = {
      'add-medicine': () => setAddMedicineModal(true),
      'bulk-update': () => toast({ title: "Bulk Update", description: "Opening bulk inventory update" }),
      'low-stock': () => toast({ title: "Low Stock", description: "Showing low stock items" }),
      'sales-report': () => toast({ title: "Sales Report", description: "Generating sales report" }),
      'reorder': () => toast({ title: "Reorder Stock", description: "Initiating stock reorder process" })
    };
    
    actions[action]?.();
  };

  const handleViewAllOrders = () => {
    toast({
      title: "All Orders",
      description: "Opening comprehensive order management",
    });
  };
  const inventoryItems = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      generic: 'Acetaminophen',
      stock: 150,
      lowThreshold: 50,
      status: 'in-stock',
      lastUpdated: '2 hours ago'
    },
    {
      id: 2,
      name: 'Amoxicillin 250mg',
      generic: 'Amoxicillin',
      stock: 25,
      lowThreshold: 50,
      status: 'low-stock',
      lastUpdated: '1 day ago'
    },
    {
      id: 3,
      name: 'Metformin 500mg',
      generic: 'Metformin HCl',
      stock: 0,
      lowThreshold: 30,
      status: 'out-of-stock',
      lastUpdated: '3 days ago'
    },
    {
      id: 4,
      name: 'Aspirin 75mg',
      generic: 'Acetylsalicylic acid',
      stock: 200,
      lowThreshold: 75,
      status: 'in-stock',
      lastUpdated: '4 hours ago'
    }
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      patient: 'Sahil Kumar',
      doctor: 'Dr. Amar Singh',
      items: 3,
      status: 'ready',
      time: '10:30 AM'
    },
    {
      id: 'ORD-002',
      patient: 'Priya Singh',
      doctor: 'Dr. Seema Kaur',
      items: 2,
      status: 'preparing',
      time: '11:15 AM'
    }
  ];

  const stats = [
    { label: 'Total Medicines', value: '245', icon: Package },
    { label: 'Low Stock Items', value: '8', icon: AlertTriangle },
    { label: 'Orders Today', value: '15', icon: Truck },
    { label: 'Revenue Today', value: '₹12,450', icon: TrendingUp }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'text-medical-success bg-medical-success/10';
      case 'low-stock':
        return 'text-medical-warning bg-medical-warning/10';
      case 'out-of-stock':
        return 'text-medical-error bg-medical-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock':
        return CheckCircle;
      case 'low-stock':
        return AlertTriangle;
      case 'out-of-stock':
        return XCircle;
      default:
        return Package;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentUser={{ name: 'Nabha Pharmacy', role: 'pharmacy' }} />
      
      <div className="container px-6 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pharmacy Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your inventory and track orders • Nabha Medical Store
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <IconComponent className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Inventory Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Inventory Management</CardTitle>
                    <CardDescription>
                      {inventoryItems.length} medicines in stock
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleImportCSV}>
                      <Upload className="h-4 w-4 mr-2" />
                      Import CSV
                    </Button>
                    <Button variant="medical" size="sm" onClick={() => setAddMedicineModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Medicine
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search medicines..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Inventory List */}
                <div className="space-y-3">
                  {inventoryItems.map((item) => {
                    const StatusIcon = getStatusIcon(item.status);
                    return (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-surface-elevated/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-surface-elevated to-surface-muted flex items-center justify-center">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.generic} • Updated {item.lastUpdated}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold">{item.stock} units</p>
                            <p className="text-xs text-muted-foreground">
                              Min: {item.lowThreshold}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(item.status)}`}>
                              <StatusIcon className="h-3 w-3" />
                              {item.status.replace('-', ' ')}
                            </span>
                            <Button variant="ghost" size="sm" onClick={() => handleEditItem(item.id.toString())}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Prescription orders requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div 
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-surface-elevated/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
                          <Truck className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {order.patient} • Prescribed by {order.doctor}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            {order.time}
                            <span className="mx-1">•</span>
                            {order.items} items
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'ready' 
                            ? 'bg-medical-success/10 text-medical-success'
                            : 'bg-medical-warning/10 text-medical-warning'
                        }`}>
                          {order.status}
                        </span>
                        <Button 
                          variant="medical" 
                          size="sm"
                          onClick={() => handleOrderAction(order.id, order.status === 'ready' ? 'delivered' : 'prepare')}
                        >
                          {order.status === 'ready' ? 'Mark Delivered' : 'Prepare Order'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={handleViewAllOrders}>
                  <FileText className="h-4 w-4 mr-2" />
                  View All Orders
                </Button>
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
                <Button 
                  variant="medical" 
                  className="w-full justify-start"
                  onClick={() => handleQuickAction('add-medicine')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Medicine
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full justify-start"
                  onClick={() => handleQuickAction('bulk-update')}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Update Stock
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full justify-start"
                  onClick={() => handleQuickAction('low-stock')}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  View Low Stock
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full justify-start"
                  onClick={() => handleQuickAction('sales-report')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Sales Report
                </Button>
              </CardContent>
            </Card>

            {/* Stock Alerts */}
            <Card className="border-medical-warning/30 bg-medical-warning/5">
              <CardHeader>
                <CardTitle className="text-base text-medical-warning flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium">8 medicines below threshold</p>
                    <p className="text-muted-foreground">Including Amoxicillin, Metformin</p>
                  </div>
                  <Button variant="warning" size="sm" className="w-full" onClick={() => handleQuickAction('reorder')}>
                    <Package className="h-4 w-4 mr-2" />
                    Reorder Stock
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Today's Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Today's Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Orders Fulfilled</span>
                  <span className="text-sm font-medium">12/15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Revenue</span>
                  <span className="text-sm font-medium">₹12,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">New Prescriptions</span>
                  <span className="text-sm font-medium">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Delivery Requests</span>
                  <span className="text-sm font-medium">3</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AddMedicineModal
        isOpen={addMedicineModal}
        onClose={() => setAddMedicineModal(false)}
      />
    </div>
  );
};

export default PharmacyDashboard;