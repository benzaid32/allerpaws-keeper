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
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { SEO_CONTENT } from "@/lib/constants";

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
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Call the serverless function to send email
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });
      
      if (error) throw error;
      
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Something went wrong",
        description: "Unable to send your message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Contact Aller Paws | Pet Food Allergy Support</title>
        <meta name="description" content="Get in touch with the Aller Paws team. We're here to help with your pet's food allergies and diet management questions." />
        <meta name="keywords" content="pet allergy help, dog food allergy support, cat food sensitivity assistance, pet diet questions" />
      </Helmet>
      
      <div className="container py-10 px-4 max-w-6xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about how Aller Paws can help your pet? We're here to help!
            Our team of pet food allergy experts is ready to assist you.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-semibold mb-6">Get In Touch</h2>
            <p className="text-muted-foreground mb-4">
              Have questions about how Aller Paws can help your pet? We're here to help!
              Fill out the form and our team will get back to you as soon as possible.
            </p>
            
            <div className="space-y-6 mt-8">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-primary mt-1 mr-3" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">support@allerpaws.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-primary mt-1 mr-3" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-muted-foreground">(555) 123-4567</p>
                  <p className="text-xs text-muted-foreground">Monday-Friday, 9AM-5PM EST</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mt-1 mr-3" />
                <div>
                  <h3 className="font-medium">Office</h3>
                  <p className="text-muted-foreground">123 Pet Health Blvd, Suite 456</p>
                  <p className="text-muted-foreground">Boston, MA 02110</p>
                </div>
              </div>
            </div>
            
            <Card className="mt-8 bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Common Questions We Can Help With:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Identifying potential food allergens in your pet's diet</li>
                  <li>Setting up a proper elimination diet protocol</li>
                  <li>Understanding your pet's symptoms and tracking progress</li>
                  <li>Finding hypoallergenic and limited-ingredient foods</li>
                  <li>Account or subscription support</li>
                </ul>
              </CardContent>
            </Card>
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
              <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name*</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email*</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What's this regarding?"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message*</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="How can we help you and your pet?"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
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
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
        
        {/* SEO-optimized FAQ section */}
        <section className="mt-16 bg-muted/30 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions About Pet Food Allergies</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">What are the most common food allergies in dogs?</h3>
              <p className="text-muted-foreground">
                The most common food allergens for dogs include beef, dairy, chicken, wheat, egg, lamb, soy, pork, rabbit, and fish.
                Beef is typically the most problematic, followed by dairy products. Using Aller Paws can help you identify which
                specific ingredients are causing your dog's symptoms.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">How can I tell if my cat has a food allergy?</h3>
              <p className="text-muted-foreground">
                Common signs of food allergies in cats include skin irritation, excessive scratching, hair loss, ear infections,
                vomiting, and diarrhea. Food allergies often cause year-round symptoms, unlike seasonal allergies.
                Tracking these symptoms in Aller Paws can help identify patterns.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">What is an elimination diet and how does it work?</h3>
              <p className="text-muted-foreground">
                An elimination diet involves feeding your pet a diet with novel protein and carbohydrate sources they haven't
                been exposed to before, or a hydrolyzed diet, for 8-12 weeks. If symptoms improve, you can then reintroduce
                original foods one at a time to identify specific allergens.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">How long does it take to see results from an elimination diet?</h3>
              <p className="text-muted-foreground">
                While some pets may show improvement within a few weeks, it typically takes 8-12 weeks for a complete elimination
                diet trial. This allows time for previous allergens to clear the system and for healing to begin.
                Aller Paws helps you track this progress over time.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
