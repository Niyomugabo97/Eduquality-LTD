"use client";

import { getUserSession } from "@/app/actions/auth";
import { getUserProducts } from "@/app/actions/product";
import { redirect } from "next/navigation";
import SimpleEnhancedProductUploadForm from "@/components/SimpleEnhancedProductUploadForm";
import SimpleEnhancedProductCard from "@/components/SimpleEnhancedProductCard";
import SellerChatInbox from "./_components/seller-chat-inbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu, X, ShoppingBag, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userResponse = await getUserSession();
      if (!userResponse) {
        redirect("/login");
      }

      setUser(userResponse);

      const productsResponse = await getUserProducts();
      setProducts(productsResponse || []);

      setLoading(false);
    } catch (error) {
      console.error("Auth check failed:", error);
      redirect("/login");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-8 mb-6 sm:mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
            Welcome, {user.name}! 👋
          </h1>
          <p className="text-blue-100 text-sm sm:text-lg">
            Manage your products and track your orders
          </p>
          <div className="mt-3 sm:mt-4 flex items-center space-x-2">
            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-blue-100 text-xs sm:text-sm">Dashboard Active</span>
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
          <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
          <div className="w-10"></div>
        </div>

        {/* Mobile Sidebar */}
        <div className={`sm:hidden fixed inset-0 z-50 ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
          <div className="fixed left-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Navigation</h3>
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
                onClick={() => { setActiveTab("products"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "products" 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="font-medium">My Products</span>
              </button>
              <button
                onClick={() => { setActiveTab("messages"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "messages" 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">Messages</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* Desktop Tabs - Hidden on Mobile */}
          <TabsList className="hidden sm:grid w-full grid-cols-2 lg:grid-cols-2 gap-1 sm:gap-2 bg-white rounded-lg sm:rounded-xl shadow-md p-1 sm:p-2">
            <TabsTrigger value="products" className="text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-2 sm:px-4">
              My Products
            </TabsTrigger>
            <TabsTrigger value="messages" className="text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-2 sm:px-4">
              Messages
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Column - Upload Form */}
              <div className="xl:col-span-1">
                <SimpleEnhancedProductUploadForm />
              </div>

              {/* Right Column - Products */}
              <div className="xl:col-span-2">
                {products && products.length > 0 ? (
                  <div>
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                        Your Products
                      </h2>
                      <p className="text-gray-600 text-sm sm:text-base">Manage your uploaded products</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {products.map((product) => (
                        <div key={product.id}>
                          <SimpleEnhancedProductCard product={product} currentUser={user} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-12 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No Products Yet</h3>
                    <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Start by uploading your first product using form on the left!</p>
                    <div className="inline-flex items-center text-blue-600 bg-blue-50 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      Upload Your First Product
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <SellerChatInbox userId={user.id} userName={user.name} />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-8 sm:mt-12 text-center">
          <a
            href="/"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
