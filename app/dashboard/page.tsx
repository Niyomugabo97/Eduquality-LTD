"use client";

import { useState, useEffect } from "react";
import { requireAdminAuth } from "@/app/actions/auth";
import LogoutButton from "./_components/logout-button";
import AdminStats from "./_components/admin-stats";
import TeamManagement from "./_components/team-management";
import OrderManagement from "./_components/order-management";
import RecordsTable from "./_components/records-table";
import { getRegistrations } from "../actions/register";
import { getAllProductsForAdmin, getAdminStats, deleteProductByAdmin, toggleProductVisibility } from "../actions/admin";
import { getAllTeamMembers } from "../actions/team";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  Users2, 
  FileText, 
  Package, 
  Truck,
  Settings,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  TrendingUp,
  UserCheck,
  Eye,
  EyeOff
} from "lucide-react";

const allServices = [
  "Management Consultancy",
  "Business Strategy Development",
  "Chemical Manufacturing",
  "Fertilizers & Nitrogen Compounds",
  "Pesticides & Agrochemicals",
  "Paints & Coatings",
  "Soap & Detergents",
  "Global Trading Services",
  "Wholesale Trade",
  "Airtime Service Retail",
  "Cargo Handling",
];

export default function DashboardPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [deliveryRequests, setDeliveryRequests] = useState<any[]>([]);
  const [services, setServices] = useState(allServices);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch data with limits for faster loading
      const [registrationsRes, productsRes, statsRes, teamRes] = await Promise.all([
        getRegistrations(),
        getAllProductsForAdmin(50), // Limit to 50 products
        getAdminStats(),
        getAllTeamMembers(20), // Limit to 20 team members
      ]);

      if (registrationsRes.success) {
        setRegistrations(registrationsRes.data || []);
      }

      if (productsRes.success) {
        setProducts(productsRes.data || []);
      }

      if (statsRes.success) {
        setStats(statsRes.data);
      }

      if (teamRes.success) {
        setTeamMembers(teamRes.data || []);
      }

      // Mock data for new features (replace with actual API calls)
      setDeliveryRequests([
        { id: 1, customer: "John Doe", product: "Fertilizer Package", status: "pending", date: "2026-03-30" },
        { id: 2, customer: "Jane Smith", product: "Chemical Supply", status: "delivered", date: "2026-03-29" },
        { id: 3, customer: "Bob Johnson", product: "Paint Set", status: "in-transit", date: "2026-03-28" },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set empty arrays to prevent undefined errors
      setRegistrations([]);
      setProducts([]);
      setTeamMembers([]);
      setStats(null);
      setDeliveryRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteProductByAdmin(productId);
      if (result.success) {
        // Refresh data
        await fetchData();
        alert(result.message);
      } else {
        alert(result.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApproveProduct = async (productId: string) => {
    try {
      // Implement approve product logic
      alert("Product approved successfully!");
      await fetchData();
    } catch (error) {
      console.error("Error approving product:", error);
      alert("Failed to approve product");
    }
  };

  const handleToggleProductVisibility = async (productId: string, currentHiddenStatus: boolean) => {
    try {
      const result = await toggleProductVisibility(productId, !currentHiddenStatus);
      if (result.success) {
        await fetchData();
        alert(result.message);
      } else {
        alert(result.message || "Failed to update product visibility");
      }
    } catch (error) {
      console.error("Error toggling product visibility:", error);
      alert("An error occurred while updating product visibility");
    }
  };

  const handleUpdateDeliveryStatus = async (requestId: string, status: string) => {
    try {
      // Implement delivery status update logic
      setDeliveryRequests(prev => 
        prev.map(req => 
          req.id === parseInt(requestId) ? { ...req, status } : req
        )
      );
      alert(`Delivery status updated to ${status}`);
    } catch (error) {
      console.error("Error updating delivery status:", error);
      alert("Failed to update delivery status");
    }
  };

  const handleAddService = (newService: string) => {
    setServices(prev => [...prev, newService]);
    alert("Service added successfully!");
  };

  const handleDeleteService = (serviceIndex: number) => {
    setServices(prev => prev.filter((_, index) => index !== serviceIndex));
    alert("Service deleted successfully!");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col">
        <div className="flex-grow container mx-auto px-4 py-12 mt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex-grow container mx-auto px-4 py-12 mt-24">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <Settings className="w-8 h-8 mr-3" />
                Admin Dashboard
              </h1>
              <p className="text-blue-100 text-lg">Full System Control Panel</p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white rounded-xl shadow-md p-2">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg">
              <Users2 className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg">
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg">
              <FileText className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg">
              <Truck className="w-4 h-4" />
              Delivery
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg">
              <Settings className="w-4 h-4" />
              Services
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {stats && (
              <AdminStats
                totalUsers={stats.totalUsers}
                totalProducts={stats.totalProducts}
                recentUsers={stats.recentUsers}
                recentProducts={stats.recentProducts}
              />
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="flex items-center">
                  <UserCheck className="w-5 h-5 mr-2" />
                  Registered Users & Board Members
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Service Registrations</h3>
                    <div className="space-y-3">
                      {registrations.slice(0, 5).map((reg, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-800">{reg.name}</p>
                            <p className="text-sm text-gray-600">{reg.email}</p>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {reg.selectedServices?.length || 0} services
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Board of Directors</h3>
                    <TeamManagement 
                      initialTeamMembers={teamMembers}
                      onUpdate={fetchData}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Product Publications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className={`flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 ${product.hidden ? 'border-orange-200 bg-orange-50' : 'border-gray-200'}`}>
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {product.mainImage || (product.images && product.images.length > 0) ? (
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border">
                            <img
                              src={product.mainImage || product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-gray-100 border flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-semibold text-gray-800 truncate">{product.title}</h4>
                          {product.hidden && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium shrink-0">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                        
                        {/* User Info */}
                        <div className="flex items-center gap-2 mt-2 text-sm">
                          <Users2 className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {product.user?.name || 'Unknown User'}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-blue-600 font-medium">
                            {product.price ? `RWF ${product.price.toLocaleString()}` : 'No price'}
                          </span>
                        </div>
                        
                        {/* Additional Info */}
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span>ID: {product.id.slice(0, 8)}...</span>
                          <span>•</span>
                          <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className={product.available ? 'text-green-600' : 'text-red-600'}>
                            {product.available ? 'Available' : 'Not Available'}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          onClick={() => handleApproveProduct(product.id)}
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                          title="Approve Product"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleToggleProductVisibility(product.id, product.hidden)}
                          variant={product.hidden ? "default" : "outline"}
                          size="sm"
                          className={product.hidden ? "bg-orange-600 hover:bg-orange-700 text-white" : ""}
                          title={product.hidden ? "Unhide Product" : "Hide Product"}
                        >
                          {product.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          onClick={() => handleDeleteProduct(product.id)}
                          variant="destructive"
                          size="sm"
                          disabled={isDeleting}
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery Tab */}
          <TabsContent value="delivery" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Delivery Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {deliveryRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{request.customer}</h4>
                        <p className="text-sm text-gray-600">{request.product}</p>
                        <p className="text-sm text-gray-500">{request.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          request.status === 'in-transit' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                        <select
                          value={request.status}
                          onChange={(e) => handleUpdateDeliveryStatus(request.id.toString(), e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-transit">In Transit</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Manage Services
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="font-medium text-gray-800">{service}</span>
                      <Button
                        onClick={() => handleDeleteService(index)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="mt-4">
                    <Button
                      onClick={() => {
                        const newService = prompt("Enter new service name:");
                        if (newService) handleAddService(newService);
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Service
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <OrderManagement onUpdate={fetchData} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
