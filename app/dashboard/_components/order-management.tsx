"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Package, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck,
  Eye,
  Edit,
  User,
  Calendar,
  Filter,
  Search,
  RefreshCw
} from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceType: string;
  description: string;
  quantity?: number;
  price?: number;
  status: string;
  priority: string;
  deliveryAddress?: string;
  notes?: string;
  assignedTo?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  createdAt: string;
  updatedAt: string;
  messages?: any[];
  feedback?: any;
}

interface OrderManagementProps {
  onUpdate: () => void;
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  READY_FOR_DELIVERY: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800"
};

const statusIcons = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  IN_PROGRESS: Package,
  READY_FOR_DELIVERY: Truck,
  DELIVERED: CheckCircle,
  CANCELLED: XCircle,
  REFUNDED: XCircle
};

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800",
  NORMAL: "bg-blue-100 text-blue-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800"
};

export default function OrderManagement({ onUpdate }: OrderManagementProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    status: "",
    assignedTo: "",
    estimatedDelivery: "",
    notes: ""
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, priorityFilter, searchTerm]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "ALL") {
      filtered = filtered.filter(order => order.priority === priorityFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId: string, updates: any) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, ...updates })
      });

      if (response.ok) {
        fetchOrders(); // Refresh orders
        setShowEditModal(false);
        onUpdate();
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const response = await fetch(`/api/orders?orderId=${orderId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchOrders(); // Refresh orders
        onUpdate();
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const openEditModal = (order: Order) => {
    setSelectedOrder(order);
    setEditForm({
      status: order.status,
      assignedTo: order.assignedTo || "",
      estimatedDelivery: order.estimatedDelivery ? 
        new Date(order.estimatedDelivery).toISOString().split('T')[0] : "",
      notes: order.notes || ""
    });
    setShowEditModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      inProgress: orders.filter(o => o.status === 'IN_PROGRESS').length,
      delivered: orders.filter(o => o.status === 'DELIVERED').length,
      cancelled: orders.filter(o => o.status === 'CANCELLED').length
    };
    return stats;
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Orders</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-xs sm:text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{stats.inProgress}</div>
            <div className="text-xs sm:text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.delivered}</div>
            <div className="text-xs sm:text-sm text-gray-600">Delivered</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-xs sm:text-sm text-gray-600">Cancelled</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-xl sm:rounded-2xl shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <Filter className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
            Order Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
            <div>
              <Label htmlFor="search" className="text-sm font-medium">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="READY_FOR_DELIVERY">Ready for Delivery</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Priority</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={fetchOrders} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-3 font-medium">Order #</th>
                  <th className="text-left p-3 font-medium">Customer</th>
                  <th className="text-left p-3 font-medium">Service</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Priority</th>
                  <th className="text-left p-3 font-medium">Price</th>
                  <th className="text-left p-3 font-medium">Created</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-gray-500">
                      No orders found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
                    return (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="font-medium">{order.orderNumber}</div>
                          <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-gray-500">{order.customerEmail}</div>
                          {order.customerPhone && (
                            <div className="text-sm text-gray-500">{order.customerPhone}</div>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="font-medium">{order.serviceType}</div>
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {order.description}
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {order.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge className={priorityColors[order.priority as keyof typeof priorityColors]}>
                            {order.priority}
                          </Badge>
                        </td>
                        <td className="p-3">
                          {order.price ? `$${order.price}` : 'Quote'}
                        </td>
                        <td className="p-3 text-sm">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(order)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            
                            {['PENDING', 'CONFIRMED'].includes(order.status) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => cancelOrder(order.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedOrder.orderNumber}</CardTitle>
                  <Badge className={statusColors[selectedOrder.status as keyof typeof statusColors]}>
                    {selectedOrder.status.replace('_', ' ')}
                  </Badge>
                </div>
                <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Customer Information</h3>
                  <div className="space-y-2">
                    <div>
                      <Label>Name</Label>
                      <p className="font-medium">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm">{selectedOrder.customerEmail}</p>
                    </div>
                    {selectedOrder.customerPhone && (
                      <div>
                        <Label>Phone</Label>
                        <p className="text-sm">{selectedOrder.customerPhone}</p>
                      </div>
                    )}
                    {selectedOrder.deliveryAddress && (
                      <div>
                        <Label>Delivery Address</Label>
                        <p className="text-sm">{selectedOrder.deliveryAddress}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Order Details</h3>
                  <div className="space-y-2">
                    <div>
                      <Label>Service Type</Label>
                      <p className="font-medium">{selectedOrder.serviceType}</p>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <p className="text-sm text-gray-600">{selectedOrder.description}</p>
                    </div>
                    {selectedOrder.quantity && (
                      <div>
                        <Label>Quantity</Label>
                        <p className="font-medium">{selectedOrder.quantity}</p>
                      </div>
                    )}
                    {selectedOrder.price && (
                      <div>
                        <Label>Total Price</Label>
                        <p className="font-bold text-lg text-blue-600">${selectedOrder.price}</p>
                      </div>
                    )}
                    <div>
                      <Label>Priority</Label>
                      <Badge className={priorityColors[selectedOrder.priority as keyof typeof priorityColors]}>
                        {selectedOrder.priority}
                      </Badge>
                    </div>
                    {selectedOrder.assignedTo && (
                      <div>
                        <Label>Assigned To</Label>
                        <p className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {selectedOrder.assignedTo}
                        </p>
                      </div>
                    )}
                    {selectedOrder.estimatedDelivery && (
                      <div>
                        <Label>Estimated Delivery</Label>
                        <p className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(selectedOrder.estimatedDelivery)}
                        </p>
                      </div>
                    )}
                    {selectedOrder.actualDelivery && (
                      <div>
                        <Label>Actual Delivery</Label>
                        <p className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(selectedOrder.actualDelivery)}
                        </p>
                      </div>
                    )}
                    {selectedOrder.notes && (
                      <div>
                        <Label>Notes</Label>
                        <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages Section */}
              {selectedOrder.messages && selectedOrder.messages.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-4">Communication History</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                    {selectedOrder.messages.map((message) => (
                      <div key={message.id} className="border-b pb-3 last:border-0">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium">
                            {message.senderType === 'CUSTOMER' ? 'Customer' : 'Staff'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                        {!message.isRead && message.senderType === 'STAFF' && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">New</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback Section */}
              {selectedOrder.feedback && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    Customer Feedback
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>Overall Rating: {selectedOrder.feedback.rating}/5</div>
                    {selectedOrder.feedback.serviceQuality && (
                      <div>Service Quality: {selectedOrder.feedback.serviceQuality}/5</div>
                    )}
                    {selectedOrder.feedback.deliverySpeed && (
                      <div>Delivery Speed: {selectedOrder.feedback.deliverySpeed}/5</div>
                    )}
                    {selectedOrder.feedback.staffProfessionalism && (
                      <div>Staff Professionalism: {selectedOrder.feedback.staffProfessionalism}/5</div>
                    )}
                    {selectedOrder.feedback.comment && (
                      <div className="md:col-span-2">
                        <Label>Comment</Label>
                        <p className="text-sm text-gray-600">{selectedOrder.feedback.comment}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Update Order: {selectedOrder.orderNumber}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="READY_FOR_DELIVERY">Ready for Delivery</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input
                  id="assignedTo"
                  placeholder="Staff member name"
                  value={editForm.assignedTo}
                  onChange={(e) => setEditForm({...editForm, assignedTo: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
                <Input
                  id="estimatedDelivery"
                  type="date"
                  value={editForm.estimatedDelivery}
                  onChange={(e) => setEditForm({...editForm, estimatedDelivery: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes..."
                  value={editForm.notes}
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => updateOrderStatus(selectedOrder.id, editForm)}
                  disabled={!editForm.status}
                >
                  Update Order
                </Button>
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
