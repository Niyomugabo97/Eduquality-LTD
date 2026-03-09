"use client";

import { deleteProduct } from "@/app/actions/product";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  createdAt: Date;
}

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const [productList, setProductList] = useState(products);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setDeleting(productId);
    const result = await deleteProduct(productId);

    if (result.success) {
      setProductList(productList.filter((p) => p.id !== productId));
    } else {
      alert(result.message);
    }
    setDeleting(null);
  };

  if (productList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-lg">No products uploaded yet.</p>
        <p className="text-gray-400">Upload your first product to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productList.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition"
          >
            {/* Product Image */}
            <div className="relative w-full h-48 bg-gray-100">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {product.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {product.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {new Date(product.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </span>
                <Button
                  onClick={() => handleDelete(product.id)}
                  disabled={deleting === product.id}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
