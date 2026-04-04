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

interface DashboardClientProps {
  initialData: {
    registrations: any[];
    products: any[];
    stats: any;
    teamMembers: any[];
    deliveryRequests: any[];
  };
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const [registrations, setRegistrations] = useState<any[]>(initialData.registrations);
  const [products, setProducts] = useState<any[]>(initialData.products);
  const [teamMembers, setTeamMembers] = useState<any[]>(initialData.teamMembers);
  const [stats, setStats] = useState<any>(initialData.stats);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [deliveryRequests, setDeliveryRequests] = useState<any[]>(initialData.deliveryRequests);
  const [services, setServices] = useState(allServices);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

      // Orders are now passed as initial data and updated via server actions
      // setDeliveryRequests will be updated through props or server actions
      console.log("Orders loaded from initial data:", initialData.deliveryRequests);
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

  // Rest of the component remains the same...
  // (I'll need to continue with the rest of the original component code)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Main content */}
        <div className="flex-1 lg:ml-64">
          <div className="p-4 lg:p-8">
            <div className="mb-6 lg:mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your EDUQUALITY LTD operations</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <Card className="shadow-sm">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl lg:text-3xl font-bold text-blue-600">{stats?.totalOrders || 0}</p>
                    </div>
                    <Package className="w-8 h-8 text-blue-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl lg:text-3xl font-bold text-green-600">{stats?.totalUsers || 0}</p>
                    </div>
                    <Users className="w-8 h-8 text-green-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-2xl lg:text-3xl font-bold text-purple-600">{stats?.totalProducts || 0}</p>
                    </div>
                    <ShoppingBag className="w-8 h-8 text-purple-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl lg:text-3xl font-bold text-orange-600">RWF {stats?.totalRevenue?.toLocaleString() || 0}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-600 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 lg:space-y-6">
              {/* Desktop Tabs - Hidden on Mobile */}
              <TabsList className="hidden sm:grid w-full grid-cols-2 lg:grid-cols-5 gap-1 sm:gap-2 bg-white rounded-lg sm:rounded-xl shadow-md p-1 sm:p-2">
                <TabsTrigger value="overview" className="text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-2 sm:px-4">
                  <BarChart3 className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="users" className="text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-2 sm:px-4">
                  <Users className="w-4 h-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="products" className="text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-2 sm:px-4">
                  <Package className="w-4 h-4" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="registrations" className="text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-2 sm:px-4">
                  <FileText className="w-4 h-4" />
                  Registrations
                </TabsTrigger>
                <TabsTrigger value="orders" className="text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-2 sm:px-4">
                  <Truck className="w-4 h-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="team" className="text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-2 sm:px-4">
                  <Users2 className="w-4 h-4" />
                  Team
                </TabsTrigger>
                <TabsTrigger value="calculator" className="text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-2 sm:px-4">
                  <Calculator className="w-4 h-4" />
                  Calculator
                </TabsTrigger>
                <TabsTrigger value="feedback" className="text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-2 sm:px-4">
                  <MessageSquare className="w-4 h-4" />
                  Feedback
                </TabsTrigger>
                <TabsTrigger value="requests" className="text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-2 sm:px-4">
                  <ShoppingBag className="w-4 h-4" />
                  Requests
                </TabsTrigger>
                <TabsTrigger value="summary" className="text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-2 sm:px-4">
                  <Download className="w-4 h-4" />
                  Summary
                </TabsTrigger>
              </TabsList>

              {/* Tab Contents */}
              <TabsContent value="overview">
                <AdminStats 
                  totalUsers={stats?.totalUsers || 0}
                  totalProducts={stats?.totalProducts || 0}
                  recentUsers={registrations.slice(0, 5).map(reg => ({
                    id: reg.id,
                    name: reg.name || reg.email,
                    email: reg.email,
                    createdAt: reg.createdAt
                  }))}
                  recentProducts={products.slice(0, 5).map(product => ({
                    id: product.id,
                    title: product.title,
                    createdAt: product.createdAt,
                    user: {
                      name: product.user?.name || 'Unknown'
                    }
                  }))}
                />
              </TabsContent>
              
              <TabsContent value="users">
                <RecordsTable />
              </TabsContent>
              
              <TabsContent value="products">
                <RecordsTable />
              </TabsContent>
              
              <TabsContent value="registrations">
                <RecordsTable />
              </TabsContent>
              
              <TabsContent value="orders">
                <OrderManagement onUpdate={fetchData} />
              </TabsContent>
              
              <TabsContent value="team">
                <TeamManagement initialTeamMembers={teamMembers} onUpdate={fetchData} />
              </TabsContent>
              
              <TabsContent value="calculator">
                <ProductPriceCalculator />
              </TabsContent>
              
              <TabsContent value="feedback">
                <UserFeedback userId="admin" />
              </TabsContent>
              
              <TabsContent value="requests">
                <RequestedProductsManager userId="admin" />
              </TabsContent>
              
              <TabsContent value="summary">
                <OrderSummary orders={deliveryRequests} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
