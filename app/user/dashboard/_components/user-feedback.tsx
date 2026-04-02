"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Star, 
  MessageSquare, 
  Plus,
  Calendar
} from "lucide-react";

interface Feedback {
  id: string;
  orderId: string;
  orderNumber: string;
  serviceType: string;
  rating: number;
  comment?: string;
  serviceQuality?: number;
  deliverySpeed?: number;
  staffProfessionalism?: number;
  wouldRecommend?: boolean;
  createdAt: string;
}

interface UserFeedbackProps {
  userId: string;
}

export default function UserFeedback({ userId }: UserFeedbackProps) {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchFeedback();
    fetchUserOrders();
  }, [userId]);

  const fetchFeedback = async () => {
    try {
      const response = await fetch(`/api/feedback?customerId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setFeedback(data.data);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const response = await fetch(`/api/orders?customerId=${userId}`);
      const data = await response.json();
      if (data.success) {
        // Filter only delivered orders that don't have feedback yet
        const deliveredOrders = data.data.filter((order: any) => 
          order.status === 'DELIVERED' && !feedback.some(f => f.orderId === order.id)
        );
        setUserOrders(deliveredOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const feedbackData = {
      orderId: formData.get('orderId'),
      customerId: userId,
      rating: parseInt(formData.get('rating') as string),
      comment: formData.get('comment'),
      serviceQuality: parseInt(formData.get('serviceQuality') as string) || undefined,
      deliverySpeed: parseInt(formData.get('deliverySpeed') as string) || undefined,
      staffProfessionalism: parseInt(formData.get('staffProfessionalism') as string) || undefined,
      wouldRecommend: formData.get('wouldRecommend') === 'on',
    };

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      const result = await response.json();
      if (result.success) {
        alert("Feedback submitted successfully!");
        setIsDialogOpen(false);
        fetchFeedback();
        fetchUserOrders();
        (e.target as HTMLFormElement).reset();
      } else {
        alert(result.message || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred while submitting feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 cursor-pointer transition-colors ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            } ${interactive ? 'hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onChange && onChange(i + 1)}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <MessageSquare className="w-6 h-6 mr-2" />
            My Feedback
          </h2>
          <p className="text-gray-600 mt-1">View your feedback history and submit new feedback</p>
        </div>
        {userOrders.length > 0 && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Submit Feedback
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Submit Feedback</DialogTitle>
                <DialogDescription>
                  Share your experience with our services
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitFeedback}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="orderId">Select Order</Label>
                    <select
                      id="orderId"
                      name="orderId"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Choose an order...</option>
                      {userOrders.map((order) => (
                        <option key={order.id} value={order.id}>
                          {order.orderNumber} - {order.serviceType}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label>Overall Rating *</Label>
                    <div className="mt-1">
                      <input type="hidden" name="rating" id="rating" value="5" required />
                      {renderStars(5, true, (rating) => {
                        document.getElementById('rating')!.setAttribute('value', rating.toString());
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="serviceQuality">Service Quality</Label>
                      <select
                        id="serviceQuality"
                        name="serviceQuality"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Not rated</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="deliverySpeed">Delivery Speed</Label>
                      <select
                        id="deliverySpeed"
                        name="deliverySpeed"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Not rated</option>
                        <option value="1">1 - Very Slow</option>
                        <option value="2">2 - Slow</option>
                        <option value="3">3 - Average</option>
                        <option value="4">4 - Fast</option>
                        <option value="5">5 - Very Fast</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="staffProfessionalism">Staff Professionalism</Label>
                      <select
                        id="staffProfessionalism"
                        name="staffProfessionalism"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Not rated</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="comment">Comments</Label>
                    <Textarea
                      id="comment"
                      name="comment"
                      placeholder="Share your experience with us..."
                      className="mt-1"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="wouldRecommend"
                      name="wouldRecommend"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="wouldRecommend">I would recommend this service to others</Label>
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Feedback List */}
      {feedback.length > 0 ? (
        <div className="space-y-4">
          {feedback.map((item) => (
            <Card key={item.id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.orderNumber}</h3>
                    <p className="text-sm text-gray-600">{item.serviceType}</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Overall Rating:</span>
                    {renderStars(item.rating)}
                  </div>

                  {(item.serviceQuality || item.deliverySpeed || item.staffProfessionalism) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                      {item.serviceQuality && (
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">Service Quality</div>
                          {renderStars(item.serviceQuality)}
                        </div>
                      )}
                      {item.deliverySpeed && (
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">Delivery Speed</div>
                          {renderStars(item.deliverySpeed)}
                        </div>
                      )}
                      {item.staffProfessionalism && (
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">Staff Professionalism</div>
                          {renderStars(item.staffProfessionalism)}
                        </div>
                      )}
                    </div>
                  )}

                  {item.comment && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{item.comment}</p>
                    </div>
                  )}

                  {item.wouldRecommend !== undefined && (
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-sm text-gray-600">
                        Would recommend: 
                        <span className={`ml-2 font-medium ${item.wouldRecommend ? 'text-green-600' : 'text-red-600'}`}>
                          {item.wouldRecommend ? 'Yes' : 'No'}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Feedback Yet</h3>
            <p className="text-gray-600 mb-6">
              {userOrders.length > 0 
                ? "You have delivered orders. Share your experience by submitting feedback!"
                : "Submit feedback once your orders are delivered to help us improve our services."
              }
            </p>
            {userOrders.length === 0 && (
              <div className="inline-flex items-center text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                <Calendar className="w-4 h-4 mr-2" />
                Feedback available after order delivery
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
