
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to send message');
      }
      
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (err: any) {
      console.error('Contact form error:', err);
      setError(err.message || 'Something went wrong. Please try again later.');
      toast({
        title: "Error",
        description: err.message || 'Failed to send message',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 px-4 max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <h1 className="text-3xl font-bold mb-10">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-semibold mb-6">Get In Touch</h2>
            <p className="text-muted-foreground mb-8">
              Have questions about how AllerPaws can help your pet? We're here to help!
              Fill out the form and our team will get back to you as soon as possible.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">support@allerpaws.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-muted-foreground">(555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-muted-foreground">
                    123 Pet Care Lane<br />
                    San Francisco, CA 94107
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            {success ? (
              <div className="bg-card p-6 rounded-lg border border-border space-y-4">
                <Alert variant="success">
                  <AlertTitle>Message Sent Successfully!</AlertTitle>
                  <AlertDescription>
                    Thank you for contacting us. We've received your message and will get back to you as soon as possible.
                  </AlertDescription>
                </Alert>
                <Button 
                  onClick={() => setSuccess(false)} 
                  className="w-full"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg border border-border">
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
