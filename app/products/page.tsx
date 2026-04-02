"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star, MapPin, Phone, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price?: number;
  latitude?: number;
  longitude?: number;
  province?: string;
  district?: string;
  sector?: string;
  village?: string;
  available: boolean;
  contactNumber?: string;
  whatsappNumber?: string;
  media: {
    images: string[]; // Array of image URLs (MongoDB)
    mainImage?: string; // Primary image URL
  };
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
}

const categoryLabels = {
  BEAUTY_PERSONAL_CARE: "Beauty and Personal Care Services",
  WHOLESALE_SCHOOL_MATERIALS: "Wholesale School Materials",
  SNACK_PRODUCTION: "Snack Production",
  MANUFACTURING_TOOLS: "Manufacturing Tools"
};

const categoryIcons = {
  BEAUTY_PERSONAL_CARE: "💄",
  WHOLESALE_SCHOOL_MATERIALS: "📚",
  SNACK_PRODUCTION: "🍪",
  MANUFACTURING_TOOLS: "🔧"
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const getProductsByCategory = (category: string) => {
    if (category === "ALL") return products;
    return products.filter(product => product.category === category);
  };

  const getCategoryStats = () => {
    const stats: any = {};
    Object.keys(categoryLabels).forEach(category => {
      stats[category] = products.filter(p => p.category === category).length;
    });
    return stats;
  };

  const stats = getCategoryStats();

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 max-w-7xl py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div
        className="relative min-h-[60vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(rgba(37, 99, 235, 0.7), rgba(99, 102, 241, 0.7)), url('/images/footer-bg.jpg')",
        }}
      >
        <Header />

        <div className="absolute inset-0 flex items-center justify-start">
          <div className="container mx-auto px-[3rem] sm:px-[3rem] md:px-[3rem] lg:px-[4rem] max-w-7xl">
            <div className="text-white max-w-2xl pt-32">
              <nav className="mb-6">
                <div className="flex items-center space-x-2 text-sm">
                  <Link
                    href="/"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                  <span className="text-gray-300">{" > "}</span>
                  <span className="text-white font-medium">Products</span>
                </div>
              </nav>

              <h1 className="text-5xl md:text-5xl font-bold mb-6 leading-tight text-white">
                OUR PRODUCTS
              </h1>

              <p className="text-xl md:text-[14px] text-gray-200 font-light">
                Quality Products from MY EDUQUALITY PARTNER LTD!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-16">
        {/* Category Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl mb-2">💄</div>
              <div className="font-semibold text-sm">Beauty & Care</div>
              <div className="text-2xl font-bold text-blue-600">{stats.BEAUTY_PERSONAL_CARE || 0}</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl mb-2">📚</div>
              <div className="font-semibold text-sm">School Materials</div>
              <div className="text-2xl font-bold text-blue-600">{stats.WHOLESALE_SCHOOL_MATERIALS || 0}</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl mb-2">🍪</div>
              <div className="font-semibold text-sm">Snack Production</div>
              <div className="text-2xl font-bold text-blue-600">{stats.SNACK_PRODUCTION || 0}</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl mb-2">🔧</div>
              <div className="font-semibold text-sm">Manufacturing Tools</div>
              <div className="text-2xl font-bold text-blue-600">{stats.MANUFACTURING_TOOLS || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-12">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="ALL">All Products</TabsTrigger>
            <TabsTrigger value="BEAUTY_PERSONAL_CARE">Beauty & Care</TabsTrigger>
            <TabsTrigger value="WHOLESALE_SCHOOL_MATERIALS">School Materials</TabsTrigger>
            <TabsTrigger value="SNACK_PRODUCTION">Snack Production</TabsTrigger>
            <TabsTrigger value="MANUFACTURING_TOOLS">Manufacturing Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="ALL" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          {Object.keys(categoryLabels).map((category) => (
            <TabsContent key={category} value={category} className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                  <span className="text-3xl mr-3">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h2>
                <p className="text-gray-600">
                  {getProductsByCategory(category).length} products in this category
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getProductsByCategory(category).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Yet</h3>
              <p className="text-gray-600 mb-6">
                Products will appear here once users start uploading them.
              </p>
              <Link
                href="/user/dashboard"
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300"
              >
                Start Selling Products
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  
  // Handle both old Cloudinary URLs and new MongoDB URLs
  const mainImage = product.media?.mainImage || 
    (product.media?.images && product.media.images.length > 0 ? product.media.images[0] : null) || 
    '/images/profile.jpg';
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(mainImage);

  const handleAddToCart = () => {
    if (product.price) {
      addToCart(product);
    }
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc('/images/profile.jpg');
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={imageSrc}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
          onLoad={() => setImageError(false)}
        />
        {product.available && (
          <Badge className="absolute top-2 right-2 bg-green-500 text-white">
            Available
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">
          {product.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          {product.price && (
            <span className="text-xl font-bold text-blue-600">
              FRW {product.price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          )}
          <Badge variant="outline" className="text-xs">
            {product.category.replace('_', ' ')}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-gray-500">
          {product.province && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {product.province}, {product.district}
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs">By {product.user.name}</span>
            <div className="flex space-x-6">
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 bg-white/90 hover:bg-white text-blue-600 border border-blue-200 hover:border-blue-300 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
                <Link href={`/product-details?id=${product.id}`} className="flex items-center justify-center">
                  <span className="font-medium">View Details</span>
                </Link>
              </Button>
              {product.price && (
                <Button 
                  onClick={handleAddToCart}
                  size="sm" 
                  className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ShoppingBag className="w-3 h-3 mr-1" />
                  Add
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
