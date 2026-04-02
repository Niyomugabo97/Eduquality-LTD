"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ShoppingBag, User, MapPin, Phone, Mail, CreditCard, Truck, Download } from "lucide-react";
import Link from "next/link";

interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  city: string;
  province: string;
  paymentMethod: string;
  notes: string;
}

export default function CheckoutPage() {
  const { cart, getCartTotal, getCartCount, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    phone: "",
    deliveryAddress: "",
    city: "",
    province: "",
    paymentMethod: "cash",
    notes: ""
  });

  const formatPrice = (price: number) => {
    return `FRW ${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDownloadOrder = () => {
    // Create order summary with current form data and cart items
    const orderDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const customerInfo = `Name: ${formData.fullName || 'Not provided'}
Email: ${formData.email || 'Not provided'}
Phone: ${formData.phone || 'Not provided'}
Delivery Address: ${formData.deliveryAddress || 'Not provided'}
${formData.city}, ${formData.province}
Payment Method: ${formData.paymentMethod.toUpperCase()}`;
    
    const itemsList = cart.map((item, index) => 
      `${index + 1}. ${item.title}
   Quantity: ${item.quantity}
   Unit Price: FRW ${item.price.toLocaleString()}
   Subtotal: FRW ${(item.price * item.quantity).toLocaleString()}`
    ).join('\n\n');
    
    const summary = `Total Items: ${cart.reduce((sum, item) => sum + item.quantity, 0)}
Total Amount: FRW ${getCartTotal().toLocaleString()}`;
    
    const deliveryInfo = `- Delivery will be made to provided address
- You will be contacted via phone for delivery confirmation
- Payment will be collected upon delivery (${formData.paymentMethod})`;

    // Create HTML content for PDF printing
    const orderHTML = `
      <html>
        <head>
          <title>Order Summary - MY EDUQUALITY PARTNER LTD</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #1e40af; }
            .item { margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; }
            .total { font-size: 16px; font-weight: bold; color: #1e40af; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ORDER SUMMARY</h1>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Status:</strong> PENDING</p>
          </div>
          
          <div class="section">
            <h2 class="section-title">CUSTOMER INFORMATION</h2>
            <p><strong>Name:</strong> ${formData.fullName || 'Not provided'}</p>
            <p><strong>Email:</strong> ${formData.email || 'Not provided'}</p>
            <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
            <p><strong>Delivery Address:</strong> ${formData.deliveryAddress || 'Not provided'}</p>
            <p><strong>Location:</strong> ${formData.city}, ${formData.province}</p>
            <p><strong>Payment Method:</strong> ${formData.paymentMethod.toUpperCase()}</p>
          </div>
          
          <div class="section">
            <h2 class="section-title">ORDER ITEMS</h2>
            ${itemsList}
          </div>
          
          <div class="section">
            <h2 class="section-title">ORDER SUMMARY</h2>
            <p class="total">${summary}</p>
          </div>
          
          <div class="section">
            <h2 class="section-title">DELIVERY INFORMATION</h2>
            <p>${deliveryInfo}</p>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing MY EDUQUALITY PARTNER LTD!</p>
            <p>For any inquiries, contact us at:</p>
            <p>Email: contact@eduquality.rw</p>
            <p>Phone: +250788676421</p>
            <p>Address: Kigali, Nyarugenge, Rwanda</p>
          </div>
        </body>
      </html>
    `;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(orderHTML);
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for the content to load, then trigger print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate total items and create description
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      const itemsDescription = cart.map(item => `${item.title} (x${item.quantity})`).join(', ');

      // Save order to database using existing API structure
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: 'customer-' + Date.now(), // Temporary customer ID
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          serviceType: 'PRODUCT_ORDER',
          description: itemsDescription,
          quantity: totalItems,
          price: getCartTotal(),
          deliveryAddress: formData.deliveryAddress,
          notes: formData.notes,
          paymentMethod: formData.paymentMethod
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to place order');
      }

      const orderResult = await orderResponse.json();
      const orderData = orderResult.data;
      
      console.log("Order placed:", orderData);
      
      // Store order data for download
      setOrderData({
        orderNumber: orderData.orderNumber,
        items: cart,
        customer: formData,
        total: getCartTotal(),
        status: orderData.status,
        createdAt: orderData.createdAt
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOrderPlaced(true);
      clearCart();
      
      // Automatically download order after placement
      setTimeout(() => {
        handleDownloadOrder();
      }, 1000);
      
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an error placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add some products to your cart before checkout</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-green-600">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-6">Thank you for your order. We'll contact you soon for delivery details.</p>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <p className="text-sm text-gray-600">Order #{orderData.orderNumber}</p>
              <p className="text-sm text-gray-600">Total: {formatPrice(orderData.total)}</p>
              <p className="text-sm text-gray-600">Items: {getCartCount()}</p>
            </div>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shopping
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-gray-600">Complete your order details</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 pb-4 border-b">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-1">{item.title}</h3>
                        <p className="text-blue-600 font-semibold">{formatPrice(item.price)}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">{formatPrice(getCartTotal())}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="font-semibold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Delivery Address
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="deliveryAddress">Street Address *</Label>
                        <Textarea
                          id="deliveryAddress"
                          value={formData.deliveryAddress}
                          onChange={(e) => handleInputChange("deliveryAddress", e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="province">Province *</Label>
                          <Select value={formData.province} onValueChange={(value) => handleInputChange("province", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Kigali">Kigali</SelectItem>
                              <SelectItem value="Northern">Northern Province</SelectItem>
                              <SelectItem value="Southern">Southern Province</SelectItem>
                              <SelectItem value="Eastern">Eastern Province</SelectItem>
                              <SelectItem value="Western">Western Province</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Payment Method
                    </h3>
                    <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange("paymentMethod", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash on Delivery</SelectItem>
                        <SelectItem value="mobile">Mobile Money</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Any special instructions for delivery..."
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Placing Order..." : `Place Order - ${formatPrice(getCartTotal())}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
