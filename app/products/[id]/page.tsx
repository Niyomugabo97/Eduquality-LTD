"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Globe, ExternalLink } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to get your location");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, []);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        
        if (data.success) {
          setProduct(data.product);
          
          // Calculate distance if user location is available
          if (userLocation) {
            const dist = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              data.product.latitude,
              data.product.longitude
            );
            setDistance(Math.round(dist * 10) / 10); // Round to 1 decimal place
          }
        } else {
          setError("Failed to load product");
        }
      } catch (error) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, userLocation]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist or couldn't be loaded."}
          </p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Products
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{product.title}</CardTitle>
                <CardDescription>
                  Listed by {product.user.name} on {formatDate(product.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <div className="text-gray-400 text-center p-4">
                        <div className="text-6xl mb-2">📦</div>
                        <div className="text-sm">No Image Available</div>
                      </div>
                    </div>
                  </div>

                {/* Product Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Price</h3>
                      <Badge variant="secondary" className="text-2xl font-bold">
                        {formatPrice(product.price)}
                      </Badge>
                    </div>
                  </div>

                  {/* Distance */}
                  {distance !== null && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-blue-600 font-medium">
                            Distance from your location
                          </p>
                          <p className="text-2xl font-bold text-blue-900">
                            {distance} km
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact */}
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Seller</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{product.user.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Map */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  Product Location
                </CardTitle>
                <CardDescription>
                  {product.latitude.toFixed(6)}, {product.longitude.toFixed(6)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* OpenStreetMap Integration */}
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${product.longitude - 0.01},${product.latitude - 0.01},${product.longitude + 0.01},${product.latitude + 0.01}&layer=mapnik&marker=${product.latitude},${product.longitude}`}
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                
                {/* Location Details */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Latitude:</span>
                    <span className="font-mono font-medium">{product.latitude.toFixed(6)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Longitude:</span>
                    <span className="font-mono font-medium">{product.longitude.toFixed(6)}</span>
                  </div>
                  {userLocation && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Your Location:</span>
                      <span className="font-mono font-medium">
                        {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <Button className="w-full" size="lg">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${product.latitude},${product.longitude}`;
                      window.open(mapsUrl, '_blank');
                    }}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Open in Google Maps
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
