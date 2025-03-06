import React, { useState } from "react";
import { motion } from "framer-motion";
import { PawPrint, Search, Calendar, User, Clock, ArrowRight, Tag, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { APP_NAME } from "@/lib/constants";

const blogCategories = [
  "All",
  "Pet Health",
  "Allergies",
  "Nutrition",
  "Symptoms",
  "Treatments",
  "Pet Care",
  "Success Stories"
];

const blogPosts = [
  {
    id: 1,
    title: "Understanding Food Allergies in Dogs: Symptoms and Causes",
    excerpt: "Food allergies affect up to 10% of dogs and can cause a variety of symptoms. Learn how to identify the signs and understand the common causes.",
    category: "Allergies",
    author: "Dr. Sarah Johnson",
    date: "June 15, 2023",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: 2,
    title: "The Complete Guide to Elimination Diets for Cats",
    excerpt: "An elimination diet is one of the most effective ways to identify food allergies in cats. This step-by-step guide will help you implement one safely.",
    category: "Nutrition",
    author: "Dr. Michael Chen",
    date: "May 28, 2023",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: 3,
    title: "Common Allergens in Pet Food: What to Watch For",
    excerpt: "Many commercial pet foods contain ingredients that commonly trigger allergic reactions. Learn which ingredients to avoid and how to read pet food labels.",
    category: "Nutrition",
    author: "Emma Rodriguez, Veterinary Nutritionist",
    date: "May 10, 2023",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Skin Symptoms of Food Allergies in Pets",
    excerpt: "Skin issues are among the most common manifestations of food allergies in pets. Learn to recognize these symptoms and how to provide relief.",
    category: "Symptoms",
    author: "Dr. James Wilson",
    date: "April 22, 2023",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "How We Identified Our Dog's Wheat Allergy Using AllerPaws",
    excerpt: "A pet parent shares their journey of discovering and managing their dog's wheat allergy with the help of systematic tracking and elimination diet.",
    category: "Success Stories",
    author: "Jennifer Taylor",
    date: "April 15, 2023",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1551717743-49959800b1f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "Natural Remedies to Soothe Allergy Symptoms in Pets",
    excerpt: "While identifying and eliminating allergens is crucial, these natural remedies can help provide relief for your pet's allergy symptoms.",
    category: "Treatments",
    author: "Dr. Lisa Patel",
    date: "March 30, 2023",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    title: "The Link Between Seasonal and Food Allergies in Pets",
    excerpt: "Did you know that pets with seasonal allergies are more likely to develop food allergies? Learn about this connection and what it means for your pet.",
    category: "Allergies",
    author: "Dr. Robert Kim",
    date: "March 18, 2023",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    title: "Creating a Safe Home Environment for Pets with Allergies",
    excerpt: "Beyond diet management, there are several ways to create a home environment that minimizes allergen exposure for sensitive pets.",
    category: "Pet Care",
    author: "Amanda Johnson",
    date: "February 25, 2023",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1604848698030-c434ba08ece1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  }
];

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter blog posts based on search query and selected category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get featured posts
  const featuredPosts = blogPosts.filter(post => post.featured);

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
                <PawPrint className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6">Pet Allergy Insights</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Expert advice, tips, and stories about managing pet allergies and improving your pet's health.
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10 h-12 rounded-full border-primary/20 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && searchQuery === "" && selectedCategory === "All" && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow h-full">
                    <div className="aspect-w-16 aspect-h-9 w-full h-64 relative">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary hover:bg-primary/90">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 line-clamp-2">{post.title}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <User className="h-4 w-4 mr-1" />
                        <span className="mr-4">{post.author}</span>
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="mr-4">{post.date}</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                      
                      <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent">
                        Read article <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-primary mr-2" />
            <h2 className="text-lg font-medium">Filter by Category</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {blogCategories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedCategory === category 
                    ? "bg-primary hover:bg-primary/90" 
                    : "hover:bg-primary/10"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {searchQuery !== "" || selectedCategory !== "All" ? (
            <h2 className="text-2xl font-semibold mb-8">
              {filteredPosts.length} {filteredPosts.length === 1 ? "Result" : "Results"} 
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
              {searchQuery !== "" && ` for "${searchQuery}"`}
            </h2>
          ) : (
            <h2 className="text-2xl font-semibold mb-8">All Articles</h2>
          )}

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">No articles found matching your criteria</p>
              <Button 
                variant="outline" 
                className="mr-2"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </Button>
              <Button 
                variant="outline"
                onClick={() => setSelectedCategory("All")}
              >
                Show all categories
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow h-full">
                    <div className="aspect-w-16 aspect-h-9 w-full h-48 relative">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary hover:bg-primary/90">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-3 line-clamp-2">{post.title}</h3>
                      <p className="text-muted-foreground mb-4 text-sm line-clamp-3">{post.excerpt}</p>
                      
                      <div className="flex items-center text-xs text-muted-foreground mb-4">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span className="mr-3">{post.date}</span>
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                      
                      <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent text-sm">
                        Read more <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {filteredPosts.length > 0 && (
            <div className="text-center mt-12">
              <Button className="bg-primary hover:bg-primary/90">
                Load More Articles
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl font-semibold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground mb-8">
              Get the latest articles, tips, and resources for managing your pet's allergies delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                className="h-12"
              />
              <Button className="bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Blog; 