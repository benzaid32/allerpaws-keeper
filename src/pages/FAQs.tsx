import React, { useState } from "react";
import { motion } from "framer-motion";
import { PawPrint, Search, ChevronDown, ChevronRight, HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/lib/constants";

const faqCategories = [
  {
    title: "General Questions",
    faqs: [
      {
        question: "What is AllerPaws?",
        answer: "AllerPaws is a comprehensive pet allergy management platform designed to help pet parents track, manage, and prevent food allergies and sensitivities in their pets. Our tools include symptom tracking, food diary, elimination diet planning, and veterinary report sharing."
      },
      {
        question: "Is AllerPaws available on mobile devices?",
        answer: "Yes, AllerPaws is available as a web application and as native apps for iOS and Android devices. Your data syncs across all platforms when you're signed in with the same account."
      },
      {
        question: "How much does AllerPaws cost?",
        answer: "AllerPaws offers both free and premium subscription options. The free plan includes basic allergy tracking for up to 2 pets. Our premium plan starts at $7.99/month or $79.99/year and includes unlimited pets, advanced reporting, veterinary sharing, and priority support."
      },
      {
        question: "Can I cancel my subscription at any time?",
        answer: "Yes, you can cancel your premium subscription at any time. Your premium features will remain active until the end of your current billing period."
      }
    ]
  },
  {
    title: "Pet Management",
    faqs: [
      {
        question: "How many pets can I add to my account?",
        answer: "Free accounts can add up to 2 pets. Premium subscribers can add unlimited pets to their account."
      },
      {
        question: "Can I track different types of pets?",
        answer: "Yes, AllerPaws supports dogs, cats, and other common household pets. Each pet type has customized tracking options relevant to their specific needs."
      },
      {
        question: "How do I add a new pet to my account?",
        answer: "From your dashboard, click on the 'Add Pet' button. You'll be prompted to enter your pet's name, species, breed, age, and upload a photo if you'd like."
      },
      {
        question: "Can I share my pet's profile with my veterinarian?",
        answer: "Yes, premium subscribers can generate a shareable link to their pet's allergy and symptom history that can be sent to veterinarians or other caregivers."
      }
    ]
  },
  {
    title: "Allergy Tracking",
    faqs: [
      {
        question: "How does AllerPaws help identify pet allergies?",
        answer: "AllerPaws provides tools to track symptoms, record food intake, and correlate potential allergens with reactions. Our guided elimination diet feature helps systematically identify food allergies by removing and reintroducing potential allergens."
      },
      {
        question: "Can AllerPaws replace veterinary care?",
        answer: "No, AllerPaws is designed to complement veterinary care, not replace it. Our tools help you collect detailed information about your pet's symptoms and potential triggers, which can be valuable for your veterinarian's diagnosis and treatment plan."
      },
      {
        question: "What's the difference between food allergies and food sensitivities?",
        answer: "Food allergies involve an immune system response and can cause severe reactions. Food sensitivities or intolerances typically cause digestive issues and don't involve the immune system. AllerPaws helps track both types of adverse food reactions."
      },
      {
        question: "How accurate is the allergy identification?",
        answer: "AllerPaws provides tools to help identify patterns between foods and symptoms, but definitive allergy diagnosis should be confirmed by a veterinarian through appropriate testing or controlled elimination diets."
      }
    ]
  },
  {
    title: "Data & Privacy",
    faqs: [
      {
        question: "Is my pet's health information secure?",
        answer: "Yes, we take data security seriously. All your pet's health information is encrypted and stored securely. We never share your personal or pet data with third parties without your explicit consent."
      },
      {
        question: "Can I export my pet's data?",
        answer: "Yes, you can export your pet's health records, symptom history, and food diary as PDF reports or CSV files for your personal records or to share with your veterinarian."
      },
      {
        question: "What happens to my data if I cancel my subscription?",
        answer: "If you cancel your premium subscription, you'll revert to the free plan limitations but your data remains intact. If you delete your account, all your data will be permanently removed from our systems after a 30-day grace period."
      },
      {
        question: "Does AllerPaws comply with data protection regulations?",
        answer: "Yes, AllerPaws complies with GDPR, CCPA, and other applicable data protection regulations. You can review our detailed Privacy Policy for more information."
      }
    ]
  },
  {
    title: "Technical Support",
    faqs: [
      {
        question: "How do I get help if I'm having issues with the app?",
        answer: "You can contact our support team through the Help section in the app, or by emailing support@allerpaws.app. Premium subscribers receive priority support."
      },
      {
        question: "Is there a community forum for AllerPaws users?",
        answer: "Yes, we have a community forum where users can share experiences, tips, and support each other. You can access it through the Community tab in the app or on our website."
      },
      {
        question: "How often is AllerPaws updated?",
        answer: "We release updates regularly with new features, improvements, and bug fixes. You can enable automatic updates in your app settings to always have the latest version."
      },
      {
        question: "Can I suggest new features for AllerPaws?",
        answer: "Absolutely! We welcome user feedback and feature suggestions. You can submit your ideas through the Feedback section in the app or by emailing feedback@allerpaws.app."
      }
    ]
  }
];

const FAQs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setExpandedQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Filter FAQs based on search query
  const filteredFAQs = searchQuery.trim() === "" 
    ? faqCategories 
    : faqCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.faqs.length > 0);

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
            <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
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

      {/* FAQs Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No results found for "{searchQuery}"</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredFAQs.map((category, categoryIndex) => (
                category.faqs.length > 0 && (
                  <motion.div
                    key={categoryIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                  >
                    <h2 className="text-2xl font-semibold mb-6">{category.title}</h2>
                    <div className="space-y-4">
                      {category.faqs.map((faq, questionIndex) => (
                        <Card 
                          key={questionIndex} 
                          className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        >
                          <CardContent className="p-6">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium text-lg">{faq.question}</h3>
                              {expandedQuestions[`${categoryIndex}-${questionIndex}`] ? (
                                <ChevronDown className="h-5 w-5 text-primary flex-shrink-0 ml-4" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 ml-4" />
                              )}
                            </div>
                            
                            {expandedQuestions[`${categoryIndex}-${questionIndex}`] && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 text-muted-foreground"
                              >
                                <p>{faq.answer}</p>
                              </motion.div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                )
              ))}
            </div>
          )}
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
            <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-8">
              If you couldn't find the answer to your question, our support team is here to help.
            </p>
            
            <Button className="bg-primary hover:bg-primary/90">
              <MessageCircle className="mr-2 h-5 w-5" />
              Contact Support
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQs; 