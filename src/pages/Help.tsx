import React, { useState } from "react";
import { motion } from "framer-motion";
import { PawPrint, Search, ChevronDown, ChevronRight, HelpCircle, BookOpen, MessageCircle, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_NAME } from "@/lib/constants";

const faqCategories = [
  {
    id: "account",
    label: "Account & Billing",
    icon: <FileText className="h-5 w-5" />,
    questions: [
      {
        question: "How do I create an account?",
        answer: "To create an account, click on the 'Sign Up' button on the top right of our homepage. You can sign up using your email address or through Google or Apple authentication."
      },
      {
        question: "How do I reset my password?",
        answer: "Click on the 'Forgot Password' link on the login page. Enter your email address, and we'll send you instructions to reset your password."
      },
      {
        question: "What are the benefits of a premium subscription?",
        answer: "Premium subscribers get access to advanced allergy tracking features, unlimited pet profiles, detailed reports, personalized recommendations, and priority customer support."
      },
      {
        question: "How do I cancel my subscription?",
        answer: "You can cancel your subscription at any time by going to Settings > Subscription > Cancel Subscription. Your premium features will remain active until the end of your billing period."
      },
      {
        question: "Is my payment information secure?",
        answer: "Yes, we use industry-standard encryption and secure payment processors. We never store your full credit card details on our servers."
      }
    ]
  },
  {
    id: "pets",
    label: "Pet Management",
    icon: <PawPrint className="h-5 w-5" />,
    questions: [
      {
        question: "How do I add a new pet to my account?",
        answer: "From your dashboard, click on the 'Add Pet' button. Fill in your pet's details including name, species, breed, age, and upload a photo if you'd like."
      },
      {
        question: "Can I manage multiple pets with one account?",
        answer: "Yes! You can add multiple pets to your account and easily switch between them from the dashboard or pet selector menu."
      },
      {
        question: "How do I update my pet's information?",
        answer: "Go to your pet's profile page by clicking on their name or image from the dashboard. Then click the 'Edit' button to update their information."
      },
      {
        question: "Can I share my pet's profile with my veterinarian?",
        answer: "Yes, premium users can generate a shareable link to their pet's allergy and symptom history that can be sent to veterinarians or other caregivers."
      },
      {
        question: "How do I delete a pet from my account?",
        answer: "Go to your pet's profile, click on 'Settings' or 'Edit', and scroll down to find the 'Delete Pet' option. This action cannot be undone."
      }
    ]
  },
  {
    id: "allergies",
    label: "Allergy Tracking",
    icon: <HelpCircle className="h-5 w-5" />,
    questions: [
      {
        question: "How do I record a new allergy for my pet?",
        answer: "From your pet's profile, go to the 'Allergies' tab and click 'Add Allergy'. Enter the allergen details and any notes about reactions or diagnosis."
      },
      {
        question: "What's the difference between a suspected and confirmed allergy?",
        answer: "A suspected allergy is one you believe your pet may have based on observed symptoms. A confirmed allergy has been diagnosed by a veterinarian through testing or elimination diet."
      },
      {
        question: "How do I track symptoms related to allergies?",
        answer: "Use the Symptom Diary feature to record when your pet experiences symptoms. You can note the severity, duration, and any potential triggers."
      },
      {
        question: "Can I upload veterinary documents related to allergies?",
        answer: "Yes, premium users can upload and store veterinary reports, test results, and other documents in their pet's medical records section."
      },
      {
        question: "How do I set up an elimination diet plan?",
        answer: "Go to your pet's profile and select 'Elimination Diet' from the menu. Our guided tool will help you create a structured plan to identify food allergies."
      }
    ]
  },
  {
    id: "technical",
    label: "Technical Support",
    icon: <MessageCircle className="h-5 w-5" />,
    questions: [
      {
        question: "Is my data backed up?",
        answer: "Yes, all your data is automatically backed up to our secure cloud servers. You don't need to worry about losing your pet's information."
      },
      {
        question: "Can I use AllerPaws on multiple devices?",
        answer: "Yes, AllerPaws is available on web, iOS, and Android. Your data will sync across all your devices when you sign in with the same account."
      },
      {
        question: "How do I export my pet's data?",
        answer: "Go to Settings > Data Management > Export Data. You can choose to export all data or select specific pets and date ranges."
      },
      {
        question: "The app is running slowly. What can I do?",
        answer: "Try clearing your browser cache or reinstalling the mobile app. Make sure you're using the latest version. If problems persist, contact our support team."
      },
      {
        question: "Is there an offline mode?",
        answer: "Premium users can access basic features offline. Your data will sync once you're back online."
      }
    ]
  }
];

const popularArticles = [
  {
    title: "Understanding Food Allergies in Dogs",
    category: "Education",
    readTime: "5 min read"
  },
  {
    title: "How to Conduct an Elimination Diet",
    category: "Guides",
    readTime: "8 min read"
  },
  {
    title: "Common Symptoms of Food Allergies in Cats",
    category: "Education",
    readTime: "4 min read"
  },
  {
    title: "Setting Up Reminders for Medication",
    category: "Tutorials",
    readTime: "3 min read"
  },
  {
    title: "Interpreting Your Pet's Allergy Test Results",
    category: "Guides",
    readTime: "6 min read"
  },
  {
    title: "Sharing Reports with Your Veterinarian",
    category: "Tutorials",
    readTime: "2 min read"
  }
];

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  const toggleQuestion = (categoryId: string, index: number) => {
    const key = `${categoryId}-${index}`;
    setExpandedQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10"></div>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <HelpCircle className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6">How can we help?</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find answers to common questions about {APP_NAME} and pet allergy management.
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for answers..."
                className="pl-10 h-12 rounded-full border-primary/20 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
              <TabsTrigger value="articles">Help Articles</TabsTrigger>
            </TabsList>
            
            <TabsContent value="faq" className="space-y-8">
              {faqCategories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      {category.icon}
                    </div>
                    <h2 className="text-2xl font-semibold">{category.label}</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {category.questions.map((faq, index) => (
                      <Card 
                        key={index} 
                        className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => toggleQuestion(category.id, index)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium text-lg">{faq.question}</h3>
                            {expandedQuestions[`${category.id}-${index}`] ? (
                              <ChevronDown className="h-5 w-5 text-primary" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          
                          {expandedQuestions[`${category.id}-${index}`] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ duration: 0.3 }}
                              className="mt-3 text-muted-foreground"
                            >
                              <p>{faq.answer}</p>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              ))}
            </TabsContent>
            
            <TabsContent value="articles">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold mb-2">Popular Help Articles</h2>
                  <p className="text-muted-foreground">
                    Browse our collection of detailed guides and tutorials
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {popularArticles.map((article, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                {article.category}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {article.readTime}
                              </span>
                            </div>
                            
                            <h3 className="font-medium text-lg mb-3">{article.title}</h3>
                            
                            <div className="mt-auto">
                              <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent">
                                Read article <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-center mt-12">
                  <Button className="bg-primary hover:bg-primary/90">
                    View All Articles
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl font-semibold mb-4">Still need help?</h2>
            <p className="text-muted-foreground mb-8">
              Our support team is ready to assist you with any questions or issues you may have.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-primary hover:bg-primary/90">
                <MessageCircle className="mr-2 h-5 w-5" />
                Contact Support
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Help; 