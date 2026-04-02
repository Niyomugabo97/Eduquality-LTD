"use client";

import { useState, useEffect } from "react";
import { getAllProductsForAdmin, deleteProductByAdmin, toggleProductVisibility } from "../../actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  AlertTriangle,
  Calendar,
  User,
  Image as ImageIcon
} from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string;
  price?: number | null;
  image?: string | null;
  category?: string | null;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
  available?: boolean | null;
  hidden?: boolean | null;
  province?: string | null;
  district?: string | null;
  sector?: string | null;
  village?: string | null;
  contactNumber?: string | null;
  whatsappNumber?: string | null;
  mainImageIndex?: number | null;
}

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewProductDialogOpen, setViewProductDialogOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await getAllProductsForAdmin(100);
      if (result.success) {
        setProducts(result.data || []);
      } else {
        console.error("Failed to fetch products:", result.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteProductByAdmin(selectedProduct.id);
      if (result.success) {
        setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
        setDeleteDialogOpen(false);
        setSelectedProduct(null);
      } else {
        alert(result.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setViewProductDialogOpen(true);
  };

  const handleToggleVisibility = async (productId: string, currentHiddenStatus: boolean) => {
    try {
      const result = await toggleProductVisibility(productId, !currentHiddenStatus);
      if (result.success) {
        await fetchProducts();
        alert(result.message);
      } else {
        alert(result.message || "Failed to update product visibility");
      }
    } catch (error) {
      console.error("Error toggling product visibility:", error);
      alert("An error occurred while updating product visibility");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Products Management</h2>
            <Badge variant="secondary">{products.length} Products</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          {/* Mobile Cards View */}
          <div className="block sm:hidden space-y-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  {product.image ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{product.title}</div>
                    <div className="text-sm text-gray-500">ID: {product.id.slice(0, 8)}...</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{product.user.name}</span>
                    </div>
                    <Badge variant={product.available ? "default" : "secondary"}>
                      {product.available ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {product.description.substring(0, 80)}...
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-orange-600">
                      {product.price ? `FRW ${product.price.toLocaleString()}` : "Price not set"}
                    </span>
                    <Badge variant={product.hidden ? "destructive" : "default"}>
                      {product.hidden ? "Hidden" : "Visible"}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewProduct(product)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(product)}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
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
                        <User className="w-4 h-4 text-gray-400" />
                        <div className="min-w-0">
                          <div className="font-medium text-sm">{product.user.name}</div>
                          <div className="text-xs text-gray-500 truncate">{product.user.email}</div>
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
                    <TableCell className="text-right font-medium">
                      {product.price ? `FRW ${product.price.toLocaleString()}` : "Not set"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.available ? "default" : "secondary"}>
                        {product.available ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={product.hidden ? "destructive" : "default"}>
                          {product.hidden ? "Hidden" : "Visible"}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleVisibility(product.id, product.hidden || false)}
                          className="ml-2"
                        >
                          {product.hidden ? "Show" : "Hide"}
                        </Button>
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
        </CardContent>
      </Card>

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
                    {selectedProduct.image ? (
                      <img
                        src={selectedProduct.image || ''}
                        alt={selectedProduct.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
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
                <p className="text-gray-700">
                  {selectedProduct.description.substring(0, 100)}...
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Price</label>
                  <p className="font-semibold text-lg text-orange-600">
                    {selectedProduct.price ? `FRW ${selectedProduct.price.toLocaleString()}` : "Not set"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Availability</label>
                  <Badge variant={selectedProduct.available ? "default" : "secondary"}>
                    {selectedProduct.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Visibility</label>
                  <Badge variant={selectedProduct.hidden ? "destructive" : "default"}>
                    {selectedProduct.hidden ? "Hidden" : "Visible"}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <p className="font-medium">{selectedProduct.category || "Not specified"}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">
                  Seller Information
                </label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="w-8 h-8 text-gray-600" />
                    <div>
                      <p className="font-semibold">{selectedProduct.user.name}</p>
                      <p className="text-sm text-gray-600">{selectedProduct.user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewProductDialogOpen(false)}>
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
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Delete Product
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProduct?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
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
    </div>
  );
}
