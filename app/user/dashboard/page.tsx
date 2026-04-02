"use client";

import { getUserSession } from "@/app/actions/auth";
import { getUserProducts } from "@/app/actions/product";
import { redirect } from "next/navigation";
import SimpleEnhancedProductUploadForm from "@/components/SimpleEnhancedProductUploadForm";
import SimpleEnhancedProductCard from "@/components/SimpleEnhancedProductCard";
import RequestedProductsManager from "./_components/requested-products-manager";
import SellerChatInbox from "./_components/seller-chat-inbox";
import UserFeedback from "./_components/user-feedback";
import ProductPriceCalculator from "./_components/product-price-calculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h1 className="text-4xl font-bold mb-3">
            Welcome, {user.name}! 👋
          </h1>
          <p className="text-blue-100 text-lg">
            Manage your products and track your orders
          </p>
          <div className="mt-4 flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-blue-100">Dashboard Active</span>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="requested">Requested Products</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="price-calculator">Price Calculator</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Upload Form */}
              <div className="lg:col-span-1">
                <SimpleEnhancedProductUploadForm />
              </div>

              {/* Right Column - Products */}
              <div className="lg:col-span-2">
                {products && products.length > 0 ? (
                  <div>
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                        Your Products
                      </h2>
                      <p className="text-gray-600">Manage your uploaded products</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {products.map((product) => (
                        <div key={product.id}>
                          <SimpleEnhancedProductCard product={product} currentUser={user} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Yet</h3>
                    <p className="text-gray-600 mb-6">Start by uploading your first product using form on the left!</p>
                    <div className="inline-flex items-center text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
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

          {/* Requested Products Tab */}
          <TabsContent value="requested">
            <RequestedProductsManager userId={user.id} />
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <SellerChatInbox userId={user.id} userName={user.name} />
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            <UserFeedback userId={user.id} />
          </TabsContent>

          {/* Price Calculator Tab */}
          <TabsContent value="price-calculator">
            <ProductPriceCalculator />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center">
          <a
            href="/"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
