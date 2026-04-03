"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft, CreditCard } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    setIsUpdating(true);
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setIsUpdating(true);
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const cartTotal = getCartTotal();
  const cartItemCount = getCartCount();

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/products">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Continue Shopping</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-gray-600">
                  {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white p-12 rounded-2xl shadow-lg border border-gray-200 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Link href="/products">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold">
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/images/profile.jpg';
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Seller: {item.userEmail}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-xl font-bold text-blue-600">
                              FRW {(item.price * item.quantity).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              FRW {item.price.toLocaleString()} each
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">Quantity:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-r-none"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={isUpdating || item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-l-none"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={isUpdating}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isUpdating}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal ({cartItemCount} items)</span>
                    <span className="font-semibold">
                      FRW {cartTotal.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold">FRW 2,000</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">FRW {Math.round(cartTotal * 0.18).toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-xl font-bold text-blue-600">
                        FRW {(cartTotal + 2000 + Math.round(cartTotal * 0.18)).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Link href="/checkout">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Proceed to Checkout
                      </Button>
                    </Link>
                    
                    <Link href="/products">
                      <Button variant="outline" className="w-full py-3 rounded-lg font-semibold">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>

                  <div className="text-center text-sm text-gray-500 pt-4">
                    <p>Secure checkout powered by</p>
                    <p className="font-semibold text-blue-600">MY EDUQUALITY PARTNER</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
