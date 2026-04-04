"use client";

import { useState, useEffect } from "react";
import { requireAdminAuth } from "@/app/actions/auth";
import LogoutButton from "./_components/logout-button";
import AdminStats from "./_components/admin-stats";
import TeamManagement from "./_components/team-management";
import OrderManagement from "./_components/order-management";
import OrderSummary from "./_components/order-summary";
import RecordsTable from "./_components/records-table";
import ProductPriceCalculator from "../user/dashboard/_components/product-price-calculator";
import UserFeedback from "../user/dashboard/_components/user-feedback";
import RequestedProductsManager from "../user/dashboard/_components/requested-products-manager";
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
  EyeOff,
  Award,
  Menu,
  Users,
  MessageSquare,
  Calculator,
  ShoppingBag,
  MessageCircle,
  Download
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

      // Fetch real orders from API
      try {
        const ordersResponse = await fetch('/api/orders?limit=50', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          if (ordersData.success && ordersData.data) {
            // Transform the orders to match the expected format
            const transformedOrders = ordersData.data.map((order: any) => ({
              id: order.id,
              orderNumber: order.orderNumber,
              customerName: order.customerName,
              customerEmail: order.customerEmail,
              customerPhone: order.customerPhone || 'N/A',
              customerAddress: order.deliveryAddress || 'N/A',
              customerCity: 'N/A',
              customerProvince: 'N/A',
              customerIdNumber: 'N/A',
              serviceType: order.serviceType,
              description: order.description,
              quantity: order.quantity || 1,
              price: order.price || 0,
              status: order.status.toLowerCase(),
              priority: order.priority.toLowerCase(),
              deliveryAddress: order.deliveryAddress || 'N/A',
              notes: order.notes || '',
              createdAt: order.createdAt,
              updatedAt: order.updatedAt,
              assignedTo: order.assignedTo || '',
              estimatedDelivery: order.estimatedDelivery || '',
              actualDelivery: order.actualDelivery || '',
            }));
            setDeliveryRequests(transformedOrders);
          } else {
            console.error("API returned error:", ordersData);
            setDeliveryRequests([]);
          }
        } else {
          console.error("Failed to fetch orders:", ordersResponse.statusText);
          setDeliveryRequests([]);
        }
      } catch (error) {
        console.error("Error fetching orders from API:", error);
        setDeliveryRequests([]);
      }
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
      <div className="flex-grow container mx-auto px-3 sm:px-4 py-6 sm:py-12 mt-20 sm:mt-24">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-8 mb-6 sm:mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 flex items-center">
                <Settings className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
                Admin Dashboard
              </h1>
              <p className="text-blue-100 text-sm sm:text-lg">Full System Control Panel</p>
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden flex justify-between items-center mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Admin Dashboard</h2>
          <div className="w-10"></div>
        </div>

        {/* Mobile Sidebar */}
        <div className={`sm:hidden fixed inset-0 z-50 ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
          <div className="fixed left-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Admin Navigation</h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              <button
                onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "overview" 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Overview</span>
              </button>
              <button
                onClick={() => { setActiveTab("users"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "users" 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Users2 className="w-5 h-5" />
                <span className="font-medium">Users</span>
              </button>
              <button
                onClick={() => { setActiveTab("products"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "products" 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Package className="w-5 h-5" />
                <span className="font-medium">Products</span>
              </button>
              <button
                onClick={() => { setActiveTab("registrations"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "registrations" 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Registrations</span>
              </button>
              <button
                onClick={() => { setActiveTab("team"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "team" 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Team</span>
              </button>
              <button
                onClick={() => { setActiveTab("orders"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "orders" 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Truck className="w-5 h-5" />
                <span className="font-medium">Orders</span>
              </button>
              <button
                onClick={() => { setActiveTab("calculator"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "calculator" 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Calculator className="w-5 h-5" />
                <span className="font-medium">Price Calculator</span>
              </button>
              <button
                onClick={() => { setActiveTab("feedback"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "feedback" 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">Feedback</span>
              </button>
              <button
                onClick={() => { setActiveTab("requests"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "requests" 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Requests</span>
              </button>
              <button
                onClick={() => { setActiveTab("summary"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "summary" 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Download className="w-5 h-5" />
                <span className="font-medium">Order Summary</span>
              </button>
            </nav>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* Desktop Tabs - Hidden on Mobile */}
          <TabsList className="hidden sm:grid w-full grid-cols-3 md:grid-cols-9 gap-1 sm:gap-2 bg-white rounded-lg sm:rounded-xl shadow-md p-1 sm:p-2 overflow-x-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-1 sm:px-4 min-w-0">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-center">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-1 sm:px-4 min-w-0">
              <Users2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-center">Users</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-1 sm:px-4 min-w-0">
              <Package className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-center">Products</span>
            </TabsTrigger>
            <TabsTrigger value="registrations" className="text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-1 sm:px-4 min-w-0">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-center">Registrations</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-1 sm:px-4 min-w-0">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-center">Team</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-1 sm:px-4 min-w-0">
              <Truck className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-center">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-1 sm:px-4 min-w-0">
              <Calculator className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-center">Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-1 sm:px-4 min-w-0">
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-center">Feedback</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-1 sm:px-4 min-w-0">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-center">Requests</span>
            </TabsTrigger>
            <TabsTrigger value="summary" className="text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-1 sm:px-4 min-w-0">
              <Download className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-center">Summary</span>
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
          <TabsContent value="users" className="space-y-4 sm:space-y-6">
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6">
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Registered Users & Board Members
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center">
                      <Users2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                      Service Registrations
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {registrations.slice(0, 5).map((reg, index) => (
                        <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{reg.name}</p>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">{reg.email}</p>
                          </div>
                          <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium shrink-0">
                            {reg.selectedServices?.length || 0} services
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" />
                      Board of Directors
                    </h3>
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 sm:p-5 rounded-xl border border-indigo-100">
                      <TeamManagement 
                        initialTeamMembers={teamMembers}
                        onUpdate={fetchData}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4 sm:space-y-6">
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6">
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Product Publications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className={`flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:shadow-lg transition-all duration-300 ${product.hidden ? 'border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-full sm:w-20">
                        {product.mainImage || (product.images && product.images.length > 0) ? (
                          <div className="w-full sm:w-20 h-16 sm:h-20 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-sm">
                            <img
                              src={product.mainImage || product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="w-full sm:w-20 h-16 sm:h-20 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 flex items-center justify-center shadow-sm">
                            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate flex-1">{product.title}</h4>
                          {product.hidden && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium shrink-0 border border-orange-200">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">{product.description}</p>
                        
                        {/* User Info */}
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                            <Users2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                            <span className="text-blue-700 font-medium">
                              {product.user?.name || 'Unknown User'}
                            </span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">
                            {product.price ? `RWF ${product.price.toLocaleString()}` : 'No price'}
                          </span>
                        </div>
                        
                        {/* Additional Info */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                          <span className="bg-gray-100 px-2 py-1 rounded">ID: {product.id.slice(0, 8)}...</span>
                          <span className="text-gray-400">•</span>
                          <span className="bg-gray-100 px-2 py-1 rounded">{new Date(product.createdAt).toLocaleDateString()}</span>
                          <span className="text-gray-400">•</span>
                          <span className={`px-2 py-1 rounded-full font-medium ${
                            product.available 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {product.available ? '✓ Available' : '✗ Not Available'}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-row sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                        <Button
                          onClick={() => handleApproveProduct(product.id)}
                          className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-initial shadow-md hover:shadow-lg transition-all duration-200"
                          size="sm"
                          title="Approve Product"
                        >
                          <Check className="w-4 h-4" />
                          <span className="hidden sm:inline ml-1">Approve</span>
                        </Button>
                        <Button
                          onClick={() => handleToggleProductVisibility(product.id, product.hidden)}
                          variant={product.hidden ? "default" : "outline"}
                          size="sm"
                          className={product.hidden 
                            ? "bg-orange-600 hover:bg-orange-700 text-white flex-1 sm:flex-initial shadow-md hover:shadow-lg transition-all duration-200" 
                            : "border-2 border-orange-200 text-orange-600 hover:bg-orange-50 flex-1 sm:flex-initial transition-all duration-200"
                          }
                          title={product.hidden ? "Unhide Product" : "Hide Product"}
                        >
                          {product.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          <span className="hidden sm:inline ml-1">{product.hidden ? 'Unhide' : 'Hide'}</span>
                        </Button>
                        <Button
                          onClick={() => handleDeleteProduct(product.id)}
                          variant="destructive"
                          size="sm"
                          disabled={isDeleting}
                          title="Delete Product"
                          className="flex-1 sm:flex-initial shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline ml-1">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery Tab */}
          <TabsContent value="delivery" className="space-y-4 sm:space-y-6">
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6">
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Delivery Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {deliveryRequests.map((request) => (
                    <div key={request.id} className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-lg transition-all duration-300">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base mb-1 flex items-center">
                          <Truck className="w-4 h-4 mr-2 text-blue-600" />
                          {request.customer}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center">
                          <Package className="w-3 h-3 mr-1 text-gray-400" />
                          {request.product}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                          {request.date}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                        <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-full sm:w-auto text-center border shadow-sm ${
                          request.status === 'delivered' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : request.status === 'in-transit' 
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {request.status === 'delivered' ? '✓ Delivered' : 
                           request.status === 'in-transit' ? '🚚 In Transit' : 
                           '⏳ Pending'}
                        </span>
                        <select
                          value={request.status}
                          onChange={(e) => handleUpdateDeliveryStatus(request.id.toString(), e.target.value)}
                          className="px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm w-full sm:w-auto bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="in-transit">🚚 In Transit</option>
                          <option value="delivered">✓ Delivered</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4 sm:space-y-6">
            <OrderManagement onUpdate={fetchData} />
          </TabsContent>

          {/* Price Calculator Tab */}
          <TabsContent value="calculator" className="space-y-4 sm:space-y-6">
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6">
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <Calculator className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Price Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <ProductPriceCalculator />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-4 sm:space-y-6">
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6">
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  User Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <UserFeedback userId="admin" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-4 sm:space-y-6">
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6">
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Product Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <RequestedProductsManager userId="admin" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Order Summary Tab */}
          <TabsContent value="summary" className="space-y-4 sm:space-y-6">
            <OrderSummary orders={deliveryRequests} onUpdate={fetchData} />
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4 sm:space-y-6">
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6">
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Manage Services
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {services.map((service, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 sm:p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-indigo-50 hover:shadow-md transition-all duration-300">
                      <span className="font-medium text-gray-800 text-sm sm:text-base flex items-center">
                        <Settings className="w-4 h-4 mr-2 text-indigo-600" />
                        {service}
                      </span>
                      <Button
                        onClick={() => handleDeleteService(index)}
                        variant="destructive"
                        size="sm"
                        className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline ml-1">Delete</span>
                      </Button>
                    </div>
                  ))}
                  <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <Button
                      onClick={() => {
                        const newService = prompt("Enter new service name:");
                        if (newService) handleAddService(newService);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Service
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
