"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Globe, ExternalLink, ShoppingBag, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import ProductChat from "@/components/ProductChat";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  latitude: number;
  longitude: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  media?: {
    images: string[];
    mainImage?: string;
  };
  // Legacy fields for backward compatibility
  imageUrl?: string;
  image?: string;
  mainImage?: string;
  images?: string[];
}

export default function ProductDetailPage() {
  const { addToCart } = useCart();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>("");

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  // Haversine distance formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => setError("Unable to get your location")
      );
    }
  }, []);

  // Fetch product and current user
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();

        if (data.success) {
          setProduct(data.product);

          if (userLocation) {
            const dist = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              data.product.latitude,
              data.product.longitude
            );
            setDistance(Math.round(dist * 10) / 10);
          }
        } else {
          setError("Failed to load product");
        }
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    // Fetch current user
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/user/me");
        const data = await response.json();
        if (data.success) {
          setCurrentUserId(data.data.id);
          setCurrentUserName(data.data.name);
        }
      } catch (err) {
        console.log("User not logged in");
      }
    };

    fetchProduct();
    fetchCurrentUser();
  }, [productId, userLocation]);

  const formatPrice = (price: number) => {
    return `FRW ${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: 'UTC'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Product Not Found</h1>
          <p className="text-gray-600 mt-2">{error}</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
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
          <Button variant="ghost" onClick={() => window.history.back()}>
            ← Back to Products
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-8">

        {/* Product info */}
        <Card>
          <CardHeader>
            <CardTitle>{product.title}</CardTitle>
            <CardDescription>
              Listed by {product.user.name} on {formatDate(product.createdAt)}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* Image */}
            <div className="space-y-4">
              {/* Main Image - Full Size */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 shadow-lg">
                {(() => {
                  // Handle Cloudinary URLs (new schema)
                  if (product.media?.mainImage) {
                    return (
                      <Image
                        src={product.media.mainImage}
                        alt={product.title}
                        fill
                        className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                        priority
                        onClick={() => window.open(product.media?.mainImage || '', '_blank')}
                      />
                    );
                  }
                  // Handle Cloudinary images array
                  if (product.media?.images && product.media.images.length > 0) {
                    const firstImage = product.media.images[0];
                    return (
                      <Image
                        src={firstImage}
                        alt={product.title}
                        fill
                        className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                        priority
                        onClick={() => window.open(firstImage, '_blank')}
                      />
                    );
                  }
                  // Handle legacy fields
                  if (product.imageUrl) {
                    return (
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                        priority
                        onClick={() => window.open(product.imageUrl, '_blank')}
                      />
                    );
                  }
                  if (product.image) {
                    return (
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                        priority
                        onClick={() => window.open(product.image, '_blank')}
                      />
                    );
                  }
                  if (product.mainImage) {
                    return (
                      <Image
                        src={product.mainImage}
                        alt={product.title}
                        fill
                        className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                        priority
                        onClick={() => window.open(product.mainImage, '_blank')}
                      />
                    );
                  }
                  if (product.images && product.images.length > 0) {
                    const firstImage = product.images[0];
                    return (
                      <Image
                        src={firstImage}
                        alt={product.title}
                        fill
                        className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                        priority
                        onClick={() => window.open(firstImage, '_blank')}
                      />
                    );
                  }
                  // Fallback
                  return (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">No Image Available</span>
                    </div>
                  );
                })()}
              </div>

              {/* Additional Images Gallery */}
              {(product.media && product.media.images && product.media.images.length > 1) && (
                <div>
                  <h3 className="font-semibold mb-3">More Images</h3>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {product.media.images.slice(1).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all hover:scale-105"
                        style={{ borderColor: selectedImage === image ? '#F17105' : '#e5e7eb' }}
                      >
                        <Image
                          src={image}
                          alt={`${product.title} ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Price and Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <Badge className="text-xl">{formatPrice(product.price)}</Badge>
              <Button 
                onClick={handleAddToCart}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              
              {/* Chat with Seller Button */}
              {currentUserId && currentUserId !== product.user.id && (
                <Button 
                  onClick={() => {
                    // Trigger chat window open via custom event or direct DOM manipulation
                    const chatButton = document.querySelector('[data-chat-toggle]') as HTMLElement;
                    if (chatButton) chatButton.click();
                  }}
                  className="bg-[#F17105] hover:bg-[#d96504] text-white"
                  size="lg"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with Seller
                </Button>
              )}
            </div>

            {/* Distance */}
            {distance && (
              <p className="text-blue-600">
                Distance: {distance} km
              </p>
            )}

            {/* Contact */}
            <div className="flex items-center gap-2">
              <Mail size={16} />
              {product.user.email}
            </div>

          </CardContent>
        </Card>

        {/* Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <MapPin size={18} /> Product Location
            </CardTitle>
          </CardHeader>

          <CardContent>

            <iframe
              width="100%"
              height="400"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${product.longitude - 0.01},${product.latitude - 0.01},${product.longitude + 0.01},${product.latitude + 0.01}&layer=mapnik&marker=${product.latitude},${product.longitude}`}
            />

            <div className="mt-4 space-y-2">

              <Button
                className="w-full"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${product.latitude},${product.longitude}`
                  )
                }
              >
                <ExternalLink className="mr-2" size={16} />
                Get Directions
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps?q=${product.latitude},${product.longitude}`
                  )
                }
              >
                <Globe className="mr-2" size={16} />
                Open in Google Maps
              </Button>

            </div>

          </CardContent>
        </Card>

      </div>

      {/* Chat Component - only show if user is logged in and not the seller */}
      {currentUserId && product && currentUserId !== product.user.id && (
        <ProductChat
          productId={product.id}
          productTitle={product.title}
          sellerId={product.user.id}
          sellerName={product.user.name}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
        />
      )}
    </div>
  );
}