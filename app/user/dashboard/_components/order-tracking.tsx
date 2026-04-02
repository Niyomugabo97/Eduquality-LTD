"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageCircle, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck,
  Star,
  Send,
  Plus
} from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceType: string;
  description: string;
  quantity?: number;
  price?: number;
  status: string;
  priority: string;
  deliveryAddress?: string;
  notes?: string;
  assignedTo?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
  feedback?: Feedback;
}

interface Message {
  id: string;
  orderId: string;
  senderId: string;
  senderType: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface Feedback {
  id: string;
  orderId: string;
  rating: number;
  comment?: string;
  serviceQuality?: number;
  deliverySpeed?: number;
  staffProfessionalism?: number;
  wouldRecommend?: boolean;
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  READY_FOR_DELIVERY: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800"
};

const statusIcons = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  IN_PROGRESS: Package,
  READY_FOR_DELIVERY: Truck,
  DELIVERED: CheckCircle,
  CANCELLED: XCircle,
  REFUNDED: XCircle
};

export default function OrderTracking({ customerId }: { customerId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState({
    rating: 5,
    comment: "",
    serviceQuality: 5,
    deliverySpeed: 5,
    staffProfessionalism: 5,
    wouldRecommend: true
  });

  useEffect(() => {
    fetchOrders();
  }, [customerId]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?customerId=${customerId}`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!selectedOrder || !newMessage.trim()) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          senderId: customerId,
          senderType: 'CUSTOMER',
          content: newMessage
        })
      });

      if (response.ok) {
        setNewMessage("");
        setShowMessageForm(false);
        // Refresh order messages
        fetchOrders();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const submitFeedback = async () => {
    if (!selectedOrder) return;

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          customerId,
          ...feedback
        })
      });

      if (response.ok) {
        setShowFeedbackForm(false);
        // Refresh orders to show feedback
        fetchOrders();
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Orders</h2>
        <Button onClick={() => window.location.href = '/services'}>
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-4">
              You haven't placed any orders yet. Start by exploring our services!
            </p>
            <Button onClick={() => window.location.href = '/services'}>
              Browse Services
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
            return (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <p className="text-sm text-gray-600">{order.serviceType}</p>
                    </div>
                    <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">Description</p>
                      <p className="text-sm text-gray-600">{order.description}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total</p>
                      <p className="text-lg font-bold text-blue-600">
                        ${order.price || 'Quote'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Package className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    
                    {['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(order.status) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMessageForm(true)}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    )}

                    {order.status === 'DELIVERED' && !order.feedback && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFeedbackForm(true)}
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Rate Order
                      </Button>
                    )}
                  </div>

                  {order.messages && order.messages.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-2">Recent Messages</p>
                      {order.messages.slice(0, 2).map((message) => (
                        <div key={message.id} className="text-sm mb-1">
                          <span className="font-medium">
                            {message.senderType === 'CUSTOMER' ? 'You' : 'Support'}:
                          </span>{" "}
                          {message.content}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedOrder.orderNumber}</CardTitle>
                  <Badge className={statusColors[selectedOrder.status as keyof typeof statusColors]}>
                    {selectedOrder.status.replace('_', ' ')}
                  </Badge>
                </div>
                <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Service Type</Label>
                  <p className="font-medium">{selectedOrder.serviceType}</p>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Badge variant={selectedOrder.priority === 'URGENT' ? 'destructive' : 'secondary'}>
                    {selectedOrder.priority}
                  </Badge>
                </div>
                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-gray-600">{selectedOrder.description}</p>
                </div>
                {selectedOrder.price && (
                  <div>
                    <Label>Total Price</Label>
                    <p className="font-bold text-lg">${selectedOrder.price}</p>
                  </div>
                )}
                {selectedOrder.deliveryAddress && (
                  <div className="md:col-span-2">
                    <Label>Delivery Address</Label>
                    <p className="text-sm text-gray-600">{selectedOrder.deliveryAddress}</p>
                  </div>
                )}
                {selectedOrder.estimatedDelivery && (
                  <div>
                    <Label>Estimated Delivery</Label>
                    <p className="text-sm">{formatDate(selectedOrder.estimatedDelivery)}</p>
                  </div>
                )}
                {selectedOrder.actualDelivery && (
                  <div>
                    <Label>Actual Delivery</Label>
                    <p className="text-sm">{formatDate(selectedOrder.actualDelivery)}</p>
                  </div>
                )}
                {selectedOrder.assignedTo && (
                  <div>
                    <Label>Assigned To</Label>
                    <p className="text-sm">{selectedOrder.assignedTo}</p>
                  </div>
                )}
              </div>

              {selectedOrder.feedback && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    Your Feedback
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div>Overall Rating: {selectedOrder.feedback.rating}/5</div>
                    {selectedOrder.feedback.serviceQuality && (
                      <div>Service Quality: {selectedOrder.feedback.serviceQuality}/5</div>
                    )}
                    {selectedOrder.feedback.deliverySpeed && (
                      <div>Delivery Speed: {selectedOrder.feedback.deliverySpeed}/5</div>
                    )}
                    {selectedOrder.feedback.staffProfessionalism && (
                      <div>Staff Professionalism: {selectedOrder.feedback.staffProfessionalism}/5</div>
                    )}
                    {selectedOrder.feedback.comment && (
                      <div className="md:col-span-2 mt-2">
                        <p className="font-medium">Comment:</p>
                        <p className="text-gray-600">{selectedOrder.feedback.comment}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Message Form Modal */}
      {showMessageForm && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Send Message</CardTitle>
              <p className="text-sm text-gray-600">
                Order: {selectedOrder.orderNumber}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4 mr-1" />
                  Send Message
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowMessageForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feedback Form Modal */}
      {showFeedbackForm && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Rate Your Order</CardTitle>
              <p className="text-sm text-gray-600">
                Order: {selectedOrder.orderNumber}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="rating">Overall Rating</Label>
                <select
                  id="rating"
                  className="w-full p-2 border rounded"
                  value={feedback.rating}
                  onChange={(e) => setFeedback({...feedback, rating: parseInt(e.target.value)})}
                >
                  {[5, 4, 3, 2, 1].map(rating => (
                    <option key={rating} value={rating}>
                      {rating} {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Terrible'}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="serviceQuality">Service Quality</Label>
                  <select
                    id="serviceQuality"
                    className="w-full p-1 border rounded text-sm"
                    value={feedback.serviceQuality}
                    onChange={(e) => setFeedback({...feedback, serviceQuality: parseInt(e.target.value)})}
                  >
                    {[5, 4, 3, 2, 1].map(rating => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="deliverySpeed">Delivery Speed</Label>
                  <select
                    id="deliverySpeed"
                    className="w-full p-1 border rounded text-sm"
                    value={feedback.deliverySpeed}
                    onChange={(e) => setFeedback({...feedback, deliverySpeed: parseInt(e.target.value)})}
                  >
                    {[5, 4, 3, 2, 1].map(rating => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="staffProfessionalism">Staff Professionalism</Label>
                  <select
                    id="staffProfessionalism"
                    className="w-full p-1 border rounded text-sm"
                    value={feedback.staffProfessionalism}
                    onChange={(e) => setFeedback({...feedback, staffProfessionalism: parseInt(e.target.value)})}
                  >
                    {[5, 4, 3, 2, 1].map(rating => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience..."
                  value={feedback.comment}
                  onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="wouldRecommend"
                  checked={feedback.wouldRecommend}
                  onChange={(e) => setFeedback({...feedback, wouldRecommend: e.target.checked})}
                  className="mr-2"
                />
                <Label htmlFor="wouldRecommend">I would recommend this service</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={submitFeedback}>
                  <Star className="w-4 h-4 mr-1" />
                  Submit Feedback
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFeedbackForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
