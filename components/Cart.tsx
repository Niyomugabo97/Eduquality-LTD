"use client";

import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Minus, ShoppingBag, X, Download } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const formatPrice = (price: number) => {
    return `FRW ${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const handleCheckout = () => {
    // Close cart sidebar and navigate to checkout
    setIsOpen(false);
  };

  return (
    <>
      {/* Cart Toggle Button - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 shadow-lg flex items-center gap-2"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-sm font-medium">Cart</span>
          {getCartCount() > 0 && (
            <Badge className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {getCartCount()}
            </Badge>
          )}
        </Button>
      </div>

      {/* Cart Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Cart Content */}
          <div className="relative ml-auto bg-white w-full max-w-md h-full shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold">Shopping Cart</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            {/* Product Image */}
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            
                            {/* Product Details */}
                            <div className="flex-1">
                              <h3 className="font-medium text-sm line-clamp-1">{item.title}</h3>
                              <p className="text-blue-600 font-semibold">{formatPrice(item.price)}</p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="border-t p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-xl font-bold text-blue-600">{formatPrice(getCartTotal())}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Link href="/checkout" onClick={handleCheckout}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Proceed to Checkout
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={clearCart}
                      className="w-full"
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
