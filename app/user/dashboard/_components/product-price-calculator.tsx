"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, DollarSign, MapPin } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number | null;
  latitude?: number | null;
  longitude?: number | null;
  province?: string | null;
  district?: string | null;
  sector?: string | null;
  village?: string | null;
}

interface ProductWithPrice extends Product {
  pricePerKm: number;
  totalPrice: number;
}

export default function ProductPriceCalculator() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsWithPrices, setProductsWitPrices] = useState<ProductWithPrice[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data || []);
        // Initialize with default values
        const initializedProducts = (data.data || []).map((product: Product) => ({
          ...product,
          pricePerKm: 0,
          totalPrice: product.price || 0
        }));
        setProductsWitPrices(initializedProducts);
      } else {
        console.error("API returned error:", data.message);
        setError(data.message || "Failed to load products");
        setProducts([]);
        setProductsWitPrices([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again.");
      setProducts([]);
      setProductsWitPrices([]);
      
      // Retry once if it's a network error
      if (retryCount === 0 && error instanceof Error) {
        console.log("Retrying fetch...");
        setTimeout(() => fetchAllProducts(1), 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  const updatePricePerKm = (productId: string, pricePerKm: number) => {
    setProductsWitPrices(prev => 
      prev.map(product => {
        if (product.id === productId) {
          const totalPrice = (product.price || 0) + (pricePerKm * 1); // Assuming 1km for calculation
          return { ...product, pricePerKm, totalPrice };
        }
        return product;
      })
    );
  };

  const calculateTotal = () => {
    const total = productsWithPrices.reduce((sum, product) => sum + product.totalPrice, 0);
    setGrandTotal(total);
  };

  const formatPrice = (price: number) => {
    return `FRW ${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Products</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button 
                onClick={() => fetchAllProducts()} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Product Price Calculator</h2>
              <p className="text-sm sm:text-base text-gray-600">Calculate total prices including transport costs</p>
            </div>
          </div>
          <Button 
            onClick={calculateTotal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto"
            size="sm"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            <span className="text-sm sm:text-base">Calculate Total</span>
          </Button>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-start sm:items-center space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs sm:text-sm font-bold">i</span>
            </div>
            <div>
              <p className="text-sm sm:text-base text-blue-800 font-medium">How it works:</p>
              <p className="text-xs sm:text-sm text-blue-600">Enter the price per KM for each product. The total price will be calculated as: Product Price + (Price per KM × Distance)</p>
            </div>
          </div>
        </div>

        {/* Grand Total */}
        {grandTotal > 0 && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm mb-1">Grand Total of All Products</p>
                <p className="text-2xl sm:text-3xl font-bold">{formatPrice(grandTotal)}</p>
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="space-y-3 sm:space-y-4">
          {productsWithPrices.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Calculator className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">No Products Available</h3>
              <p className="text-sm sm:text-base text-gray-600">There are no products to calculate prices for.</p>
            </div>
          ) : (
            productsWithPrices.map((product) => (
              <Card key={product.id} className="border border-gray-200 hover:border-blue-300 transition-colors">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4 sm:space-y-6">
                    {/* Product Info */}
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700">Product</Label>
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm sm:text-base">{product.title}</h3>
                        <Badge variant="outline" className="text-xs mt-1">
                          {product.province && `${product.province}, ${product.district}` || "Location not specified"}
                        </Badge>
                      </div>
                    </div>

                    {/* Grid Layout for larger screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                      {/* Base Price */}
                      <div className="space-y-2">
                        <Label className="text-xs sm:text-sm font-medium text-gray-700">Base Price</Label>
                        <div className="text-base sm:text-lg font-bold text-blue-600">
                          {formatPrice(product.price || 0)}
                        </div>
                      </div>

                      {/* Price per KM Input */}
                      <div className="space-y-2">
                        <Label htmlFor={`price-per-km-${product.id}`} className="text-xs sm:text-sm font-medium text-gray-700">
                          Price per KM
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id={`price-per-km-${product.id}`}
                            type="number"
                            min="0"
                            step="100"
                            placeholder="Enter price per KM"
                            value={product.pricePerKm || ''}
                            onChange={(e) => updatePricePerKm(product.id, parseFloat(e.target.value) || 0)}
                            className="flex-1 text-sm"
                          />
                          <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">FRW/KM</span>
                        </div>
                      </div>

                      {/* Total Price */}
                      <div className="space-y-2">
                        <Label className="text-xs sm:text-sm font-medium text-gray-700">Total Price</Label>
                        <div className="text-base sm:text-lg font-bold text-green-600">
                          {formatPrice(product.totalPrice)}
                        </div>
                        <div className="text-xs text-gray-500 hidden sm:block">
                          Base: {formatPrice(product.price || 0)} + Transport: {formatPrice(product.pricePerKm)}
                        </div>
                        <div className="text-xs text-gray-500 sm:hidden">
                          + {formatPrice(product.pricePerKm)} transport
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
