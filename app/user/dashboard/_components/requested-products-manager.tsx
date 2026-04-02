"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Clock, 
  AlertCircle,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RequestedProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  province: string;
  status: 'pending' | 'approved' | 'cancelled' | 'delivered' | 'in_process';
  requestedDate: string;
  quantity: number;
  notes?: string;
}

export default function RequestedProductsManager({ userId }: { userId: string }) {
  const [requestedProducts, setRequestedProducts] = useState<RequestedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchRequestedProducts();
  }, []);

  const fetchRequestedProducts = async () => {
    try {
      // Fetch actual customer orders from the database
      const response = await fetch(`/api/customer-orders?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customer orders');
      }
      const data = await response.json();
      
      // Transform order data to match RequestedProduct interface
      const transformedData: RequestedProduct[] = data.map((order: any) => ({
        id: order.id,
        title: order.items.map((item: any) => item.title).join(', '),
        description: `Order with ${order.items.length} item${order.items.length > 1 ? 's' : ''}`,
        price: order.total,
        category: 'order',
        customerName: order.customer.fullName,
        customerEmail: order.customer.email,
        customerPhone: order.customer.phone,
        deliveryAddress: order.customer.deliveryAddress,
        city: order.customer.city,
        province: order.customer.province,
        status: order.status || 'pending',
        requestedDate: order.createdAt,
        quantity: order.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
        notes: order.customer.notes
      }));
      
      setRequestedProducts(transformedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching requested products:", error);
      
      // Fallback to mock data if API fails
      const mockData: RequestedProduct[] = [
        {
          id: "1",
          title: "Laptop Dell XPS 15",
          description: "High-performance laptop with 16GB RAM",
          price: 2500000,
          category: "electronics",
          customerName: "John Doe",
          customerEmail: "john@example.com",
          customerPhone: "+250788123456",
          deliveryAddress: "KG 123 Street",
          city: "Kigali",
          province: "Kigali",
          status: "pending",
          requestedDate: "2026-04-01T10:30:00Z",
          quantity: 1,
          notes: "Urgent delivery needed"
        }
      ];
      
      setRequestedProducts(mockData);
      setLoading(false);
    }
  };

  const updateProductStatus = async (productId: string, newStatus: RequestedProduct['status']) => {
    try {
      // Update actual order status in the database
      const response = await fetch(`/api/customer-orders/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update order status');
      }
      
      // Update local state
      setRequestedProducts(prev => 
        prev.map(product => 
          product.id === productId 
            ? { ...product, status: newStatus }
            : product
        )
      );
    } catch (error) {
      console.error("Error updating product status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this requested product?")) return;
    
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/requested-products/${productId}`, {
      //   method: 'DELETE'
      // });
      
      // Update local state
      setRequestedProducts(prev => prev.filter(product => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const getStatusBadge = (status: RequestedProduct['status']) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      approved: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Approved' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' },
      delivered: { color: 'bg-green-100 text-green-800', icon: Truck, label: 'Delivered' },
      in_process: { color: 'bg-purple-100 text-purple-800', icon: AlertCircle, label: 'In Process' }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return `FRW ${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const filteredProducts = filter === 'all' 
    ? requestedProducts 
    : requestedProducts.filter(product => product.status === filter);

  if (loading) {
    return <div>Loading requested products...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <Package className="w-6 h-6 mr-3 text-blue-600" />
          Requested Products Management
        </h2>
        <p className="text-gray-600">Manage and track all product requests from customers</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in_process">In Process</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'request' : 'requests'} found
          </div>
        </div>
      </div>

      {/* Products List */}
      {filteredProducts.length > 0 ? (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Category: {product.category}</span>
                          <span>Quantity: {product.quantity}</span>
                          <span className="font-semibold text-gray-800">{formatPrice(product.price)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(product.status)}
                      </div>
                    </div>
                    
                    {/* Customer Info */}
                    <div className="bg-gray-50 rounded-lg p-3 mt-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Customer:</span> {product.customerName}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {product.customerEmail}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {product.customerPhone}
                        </div>
                        <div>
                          <span className="font-medium">Address:</span> {product.deliveryAddress}, {product.city}
                        </div>
                      </div>
                      {product.notes && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Notes:</span> {product.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => alert(`Order Details:\n\nCustomer: ${product.customerName}\nEmail: ${product.customerEmail}\nPhone: ${product.customerPhone}\nAddress: ${product.deliveryAddress}\n\nItems: ${product.title}\nQuantity: ${product.quantity}\nTotal: ${formatPrice(product.price)}\n\nStatus: ${product.status}`)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => alert(`Edit functionality coming soon for order: ${product.id} - ${product.title}`)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Request
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteProduct(product.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Status Actions */}
                    <div className="flex gap-2">
                      {product.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => updateProductStatus(product.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => updateProductStatus(product.id, 'cancelled')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                      
                      {product.status === 'approved' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateProductStatus(product.id, 'in_process')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Start Process
                        </Button>
                      )}
                      
                      {product.status === 'in_process' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateProductStatus(product.id, 'delivered')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Truck className="w-4 h-4 mr-1" />
                          Mark Delivered
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Requested Products</h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? "No customers have requested products yet." 
              : `No products with status "${filter}" found.`
            }
          </p>
        </div>
      )}
    </div>
  );
}
