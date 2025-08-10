"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

type CrowdfundModalProps = {
  appId: string;
  appName: string;
  appDescription?: string;
  onSuccess?: () => void;
  children: React.ReactNode;
};

export function CrowdfundModal({ 
  appId, 
  appName, 
  appDescription = "",
  onSuccess,
  children 
}: CrowdfundModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: appName,
    description: appDescription,
    price: "",
    subscriptionDetails: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("/api/stripe/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appId,
          ...formData,
          price: parseFloat(formData.price) * 100, // Convert to cents
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const data = await response.json();
      
      toast.success("Product created successfully!");
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Setup Crowdfunding</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Monthly Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="1"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="9.99"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subscriptionDetails">Subscription Details</Label>
            <Textarea
              id="subscriptionDetails"
              name="subscriptionDetails"
              value={formData.subscriptionDetails}
              onChange={handleChange}
              placeholder="What's included in this subscription?"
              rows={3}
              required
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
