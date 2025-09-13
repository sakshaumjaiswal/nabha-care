import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { AddMedicineModal } from '@/components/modals/AddMedicineModal';
import { usePharmacy, PharmacyInventory, PrescriptionOrder } from '@/hooks/usePharmacy';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Package, Search, AlertTriangle, CheckCircle, XCircle, TrendingUp, Clock, Truck, Plus, Upload, Edit, FileText, Loader2
} from 'lucide-react';


// NEW: Modal for editing inventory items
const EditInventoryModal = ({ item, isOpen, onClose, onUpdate }) => {
    const [quantity, setQuantity] = useState(item?.quantity || 0);
    const [price, setPrice] = useState(item?.price || 0);
    const { updateInventory } = usePharmacy();
    const { toast } = useToast();

    useEffect(() => {
        setQuantity(item?.quantity || 0);
        setPrice(item?.price || 0);
    }, [item]);

    const handleSave = async () => {
        try {
            await updateInventory(item.id, { quantity: Number(quantity), price: Number(price) });
            onUpdate(item.id, { quantity, price });
            onClose();
        } catch (error) {
            // Error is handled in the hook
        }
    };

    if (!item) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit: {item.medicines?.name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <Label htmlFor="quantity">Stock Quantity</Label>
                        <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


const PharmacyDashboard: React.FC = () => {
  const { inventory, prescriptionOrders, loading, fetchInventory, fetchPrescriptionOrders } = usePharmacy();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [addMedicineModal, setAddMedicineModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PharmacyInventory | null>(null);
  
  useEffect(() => {
      fetchInventory();
      fetchPrescriptionOrders();
  }, []);

  const filteredInventory = inventory.filter(item => 
    item.medicines?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
      totalMedicines: inventory.length,
      lowStockItems: inventory.filter(i => i.quantity < (i.low_stock_threshold || 10)).length,
      ordersToday: prescriptionOrders.filter(o => new Date(o.created_at) > new Date(new Date().setHours(0,0,0,0))).length,
  };

  const getStatus = (item: PharmacyInventory) => {
      if (item.quantity === 0) return { text: 'Out of Stock', color: 'text-medical-error', icon: XCircle };
      if (item.quantity < (item.low_stock_threshold || 10)) return { text: 'Low Stock', color: 'text-medical-warning', icon: AlertTriangle };
      return { text: 'In Stock', color: 'text-medical-success', icon: CheckCircle };
  };

  const handleInventoryUpdate = (itemId, updates) => {
      const newInventory = inventory.map(item => item.id === itemId ? { ...item, ...updates } : item);
      // Optimistic update - this is a bit simplified
      // setInventory(newInventory); 
      // For now, we rely on a full refresh for simplicity.
      fetchInventory();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pharmacy Dashboard</h1>
          <p className="text-muted-foreground">Manage your inventory and track prescription orders</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Medicines</p><p className="text-2xl font-bold">{stats.totalMedicines}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Low Stock</p><p className="text-2xl font-bold">{stats.lowStockItems}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Orders Today</p><p className="text-2xl font-bold">{stats.ordersToday}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Revenue (TBD)</p><p className="text-2xl font-bold">₹0</p></CardContent></Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                 <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Inventory Management</CardTitle>
                    <CardDescription>{filteredInventory.length} medicines found</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="medical" size="sm" onClick={() => setAddMedicineModal(true)}><Plus className="h-4 w-4 mr-2" />Add Medicine</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search medicines..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
                {loading && !inventory.length ? <div className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></div> : 
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {filteredInventory.map((item) => {
                    const status = getStatus(item);
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border bg-surface-elevated/50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-surface-elevated to-surface-muted flex items-center justify-center"><Package className="h-5 w-5 text-primary" /></div>
                          <div>
                            <h3 className="font-medium">{item.medicines?.name}</h3>
                            <p className="text-sm text-muted-foreground">Stock: {item.quantity} units</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${status.color}`}><status.icon className="h-3 w-3" />{status.text}</span>
                            <Button variant="ghost" size="sm" onClick={() => setEditingItem(item)}><Edit className="h-4 w-4 mr-2" />Edit</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Recent Prescription Orders</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loading && !prescriptionOrders.length ? <div className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></div> :
                  prescriptionOrders.length > 0 ? prescriptionOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border bg-surface-elevated/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center"><Truck className="h-5 w-5 text-white" /></div>
                        <div>
                          <h3 className="font-medium">Order for {order.consultations?.patients.name}</h3>
                          <p className="text-sm text-muted-foreground">Prescribed by Dr. {order.consultations?.doctors.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            {new Date(order.created_at).toLocaleString()}
                            <span className="mx-1">•</span>
                            {order.data?.items.length || 0} items
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  )) : <p className="text-center text-muted-foreground py-4">No new prescription orders.</p>}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                 <Button variant="secondary" className="w-full justify-start"><AlertTriangle className="h-4 w-4 mr-2" />View Low Stock</Button>
                 <Button variant="secondary" className="w-full justify-start"><TrendingUp className="h-4 w-4 mr-2" />Sales Report</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AddMedicineModal isOpen={addMedicineModal} onClose={() => setAddMedicineModal(false)} />
      <EditInventoryModal item={editingItem} isOpen={!!editingItem} onClose={() => setEditingItem(null)} onUpdate={handleInventoryUpdate} />
    </div>
  );
};

export default PharmacyDashboard;