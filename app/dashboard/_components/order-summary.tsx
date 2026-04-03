"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Download, 
  FileText, 
  User, 
  Building, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Package,
  Truck,
  Signature,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCity?: string;
  customerProvince?: string;
  customerIdNumber?: string;
  serviceType: string;
  description: string;
  quantity?: number;
  price?: number;
  status: string;
  priority: string;
  deliveryAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderSummaryProps {
  orders: Order[];
  onUpdate?: () => void;
}

export default function OrderSummary({ orders, onUpdate }: OrderSummaryProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [companyInfo, setCompanyInfo] = useState({
    name: "EDUQUALITY LTD",
    address: "Kigali, Rwanda",
    phone: "+250 788 123 456",
    email: "info@eduquality.rw",
    registrationNumber: "RCC/2022/123456"
  });

  const generateOrderSummaryHTML = (order: Order) => {
    const currentDate = new Date().toLocaleDateString();
    const orderDate = new Date(order.createdAt).toLocaleDateString();
    
    return `
    <div id="order-summary-${order.id}" style="font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; color: #333; max-width: 800px; background: white;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px;">
            <h1 style="margin: 0; color: #1e40af; font-size: 28px;">ORDER SUMMARY</h1>
            <div style="text-align: center; margin-bottom: 20px; font-weight: bold;">
                <strong style="font-size: 18px;">${companyInfo.name}</strong><br>
                <span>${companyInfo.address}</span><br>
                <span>Phone: ${companyInfo.phone} | Email: ${companyInfo.email}</span><br>
                <span>Registration No: ${companyInfo.registrationNumber}</span>
            </div>
        </div>

        <div style="margin-bottom: 30px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <div style="font-weight: bold; margin-bottom: 15px; color: #2563eb; font-size: 18px;">📋 Order Information</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                <div><strong>Order Number:</strong> ${order.orderNumber}</div>
                <div><strong>Order Date:</strong> ${orderDate}</div>
                <div><strong>Generated Date:</strong> ${currentDate}</div>
                <div><strong>Status:</strong> <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; background-color: ${getStatusColor(order.status)}; color: white;">${order.status}</span></div>
                <div><strong>Priority:</strong> ${order.priority}</div>
                <div><strong>Service Type:</strong> ${order.serviceType}</div>
            </div>
            <div style="margin-top: 10px;">
                <strong>Description:</strong><br>
                <span>${order.description}</span>
            </div>
            ${order.quantity ? `<div style="margin-top: 10px;"><strong>Quantity:</strong> ${order.quantity}</div>` : ''}
            ${order.price ? `<div style="margin-top: 10px;"><strong>Price:</strong> RWF ${order.price?.toLocaleString()}</div>` : ''}
            ${order.notes ? `<div style="margin-top: 10px;"><strong>Notes:</strong> ${order.notes}</div>` : ''}
        </div>

        <div style="margin-bottom: 30px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <div style="font-weight: bold; margin-bottom: 15px; color: #2563eb; font-size: 18px;">👤 Customer Information</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div><strong>Full Name:</strong> ${order.customerName}</div>
                <div><strong>Email:</strong> ${order.customerEmail}</div>
                <div><strong>Phone:</strong> ${order.customerPhone || 'N/A'}</div>
                <div><strong>ID Number:</strong> ${order.customerIdNumber || 'N/A'}</div>
                <div><strong>Address:</strong> ${order.customerAddress || 'N/A'}</div>
                <div><strong>City:</strong> ${order.customerCity || 'N/A'}</div>
                <div><strong>Province:</strong> ${order.customerProvince || 'N/A'}</div>
                <div><strong>Delivery Address:</strong> ${order.deliveryAddress || 'N/A'}</div>
            </div>
        </div>

        <div style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <div style="font-weight: bold; margin-bottom: 20px; color: #2563eb; font-size: 18px;">✍️ Signatures</div>
            
            <div style="margin-bottom: 30px;">
                <h4 style="margin-bottom: 10px;">Customer Signature</h4>
                <p style="font-size: 12px; color: #6b7280; margin-bottom: 10px;">I confirm that I have received the order as described above.</p>
                <div style="border: 2px dashed #9ca3af; height: 80px; margin: 10px 0; display: flex; align-items: center; justify-content: center; color: #6b7280; font-style: italic;">
                    Customer Signature
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div><strong>Name:</strong> _______________________</div>
                    <div><strong>Date:</strong> _______________________</div>
                    <div><strong>Phone:</strong> _______________________</div>
                    <div><strong>ID Number:</strong> _______________________</div>
                </div>
            </div>

            <div>
                <h4 style="margin-bottom: 10px;">Company Representative Signature</h4>
                <p style="font-size: 12px; color: #6b7280; margin-bottom: 10px;">I confirm that the order has been processed and delivered according to specifications.</p>
                <div style="border: 2px dashed #9ca3af; height: 80px; margin: 10px 0; display: flex; align-items: center; justify-content: center; color: #6b7280; font-style: italic;">
                    Company Signature
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div><strong>Name:</strong> _______________________</div>
                    <div><strong>Position:</strong> _______________________</div>
                    <div><strong>Date:</strong> _______________________</div>
                    <div><strong>Company Stamp:</strong> _______________________</div>
                </div>
            </div>
        </div>

        <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p>This document is electronically generated and serves as official order confirmation.</p>
            <p>For any inquiries, please contact ${companyInfo.phone} or ${companyInfo.email}</p>
        </div>
    </div>`;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': '#f59e0b',
      'approved': '#3b82f6',
      'in_progress': '#8b5cf6',
      'delivered': '#10b981',
      'cancelled': '#ef4444'
    };
    return colors[status.toLowerCase()] || '#6b7280';
  };

  const downloadOrderSummary = async (order: Order) => {
    try {
      // Create a temporary container for the HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = generateOrderSummaryHTML(order);
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '20px';
      tempDiv.style.boxSizing = 'border-box';
      document.body.appendChild(tempDiv);

      // Wait a bit for the content to render
      await new Promise(resolve => setTimeout(resolve, 100));

      // Convert HTML to canvas with better options
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempDiv.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 800,
        windowHeight: tempDiv.scrollHeight
      });

      // Remove temporary container
      document.body.removeChild(tempDiv);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save PDF
      pdf.save(`order-summary-${order.orderNumber}.pdf`);
      
      alert('Order summary PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const downloadAllSummaries = async () => {
    for (let index = 0; index < orders.length; index++) {
      const order = orders[index];
      try {
        await downloadOrderSummary(order);
        // Add delay between downloads to avoid browser blocking
        if (index < orders.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error downloading order ${order.orderNumber}:`, error);
      }
    }
    alert(`Downloaded ${orders.length} order summaries as PDF files!`);
  };

  return (
    <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6">
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
          Order Summary Downloads
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Company Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Building className="w-4 h-4 mr-2 text-blue-600" />
              Company Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={companyInfo.name}
                  onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="companyPhone">Phone</Label>
                <Input
                  id="companyPhone"
                  value={companyInfo.phone}
                  onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="companyEmail">Email</Label>
                <Input
                  id="companyEmail"
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="companyReg">Registration Number</Label>
                <Input
                  id="companyReg"
                  value={companyInfo.registrationNumber}
                  onChange={(e) => setCompanyInfo({...companyInfo, registrationNumber: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="companyAddress">Address</Label>
                <Input
                  id="companyAddress"
                  value={companyInfo.address}
                  onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Order List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <Package className="w-4 h-4 mr-2 text-blue-600" />
                Orders ({orders.length})
              </h3>
              <Button
                onClick={downloadAllSummaries}
                disabled={orders.length === 0}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download All PDFs
              </Button>
            </div>

            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-800 truncate">{order.orderNumber}</h4>
                      <Badge className={`status-${order.status}`}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="truncate">{order.customerName}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        <span className="truncate">{order.serviceType}</span>
                      </div>
                    </div>
                    {order.price && (
                      <div className="mt-1 text-sm font-medium text-green-600">
                        RWF {order.price.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          className="flex-1 sm:flex-initial"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Order Summary Preview - {order.orderNumber}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <div 
                            dangerouslySetInnerHTML={{ 
                              __html: generateOrderSummaryHTML(order) 
                            }} 
                            className="border border-gray-200 rounded-lg p-4"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      onClick={() => downloadOrderSummary(order)}
                      className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-initial"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {orders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No orders available for download</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
