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

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await fetch('/api/products');
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
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Product Price Calculator</h2>
              <p className="text-gray-600">Calculate total prices including transport costs</p>
            </div>
          </div>
          <Button 
            onClick={calculateTotal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
            size="lg"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Calculate Total Price
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">i</span>
            </div>
            <div>
              <p className="text-sm text-blue-800 font-medium">How it works:</p>
              <p className="text-sm text-blue-600">Enter the price per KM for each product. The total price will be calculated as: Product Price + (Price per KM × Distance)</p>
            </div>
          </div>
        </div>

        {grandTotal > 0 && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Grand Total of All Products</p>
                <p className="text-3xl font-bold">{formatPrice(grandTotal)}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {productsWithPrices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Available</h3>
              <p className="text-gray-600">There are no products to calculate prices for.</p>
            </div>
          ) : (
            productsWithPrices.map((product) => (
              <Card key={product.id} className="border border-gray-200 hover:border-blue-300 transition-colors">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Product Info */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Product</Label>
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{product.title}</h3>
                        <Badge variant="outline" className="text-xs mt-1">
                          {product.province && `${product.province}, ${product.district}` || "Location not specified"}
                        </Badge>
                      </div>
                    </div>

                    {/* Base Price */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Base Price</Label>
                      <div className="text-lg font-bold text-blue-600">
                        {formatPrice(product.price || 0)}
                      </div>
                    </div>

                    {/* Price per KM Input */}
                    <div className="space-y-2">
                      <Label htmlFor={`price-per-km-${product.id}`} className="text-sm font-medium text-gray-700">
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
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-500">FRW/KM</span>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Total Price</Label>
                      <div className="text-lg font-bold text-green-600">
                        {formatPrice(product.totalPrice)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Base: {formatPrice(product.price || 0)} + Transport: {formatPrice(product.pricePerKm)}
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
