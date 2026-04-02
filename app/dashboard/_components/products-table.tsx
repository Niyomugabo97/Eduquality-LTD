"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertTriangle, 
  Trash2, 
  Package, 
  Calendar, 
  User,
  Eye,
  Image
} from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ProductsTableProps {
  products: Product[];
  onDeleteProduct: (productId: string) => void;
  isDeleting: boolean;
}

export default function ProductsTable({ products, onDeleteProduct, isDeleting }: ProductsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewProductDialogOpen, setViewProductDialogOpen] = useState(false);

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setViewProductDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      onDeleteProduct(selectedProduct.id);
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Product Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{product.title}</div>
                        <div className="text-sm text-gray-500 truncate">
                          {product.description.substring(0, 50)}...
                        </div>
                        <div className="text-xs text-gray-400">ID: {product.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-orange-600 font-semibold text-xs">
                          {product.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm">{product.user.name}</div>
                        <div className="text-xs text-gray-500 truncate">{product.user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProduct(product)}
                        className="w-full sm:w-auto"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(product)}
                        disabled={isDeleting}
                        className="w-full sm:w-auto"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* View Product Dialog */}
        <Dialog open={viewProductDialogOpen} onOpenChange={setViewProductDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Product Details</DialogTitle>
              <DialogDescription>
                Complete information about "{selectedProduct?.title}"
              </DialogDescription>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">
                      Product Image
                    </label>
                    <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Product Title</label>
                      <p className="font-semibold">{selectedProduct.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Product ID</label>
                      <p className="font-mono text-sm">{selectedProduct.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created Date</label>
                      <p className="font-semibold">
                        {new Date(selectedProduct.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">
                    Description
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedProduct.description}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">
                    Uploaded By
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-semibold">
                          {selectedProduct.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{selectedProduct.user.name}</p>
                        <p className="text-sm text-gray-500">{selectedProduct.user.email}</p>
                        <p className="text-xs text-gray-400">User ID: {selectedProduct.user.id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setViewProductDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Delete Product
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedProduct && (
              <div className="py-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{selectedProduct.title}</h4>
                      <p className="text-sm text-gray-500">by {selectedProduct.user.name}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>Description:</strong> {selectedProduct.description.substring(0, 100)}...
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
