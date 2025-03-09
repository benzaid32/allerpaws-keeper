import React, { useState } from "react";
import { motion } from "framer-motion";
import { PawPrint, Search, Calendar, User, Clock, ArrowRight, Tag, Filter, ArrowLeft, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { APP_NAME } from "@/lib/constants";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

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
    id: "1",
    title: "How to Identify Common Food Allergies in Dogs: A Complete Guide",
    slug: "identify-food-allergies-dogs",
    excerpt: "Learn how to spot the signs of food allergies in your dog and what ingredients are most likely to cause reactions.",
    content: `
      <h2>Understanding Food Allergies in Dogs</h2>
      <p>Food allergies affect approximately 10% of all dogs, with certain breeds being more susceptible than others. Unlike food intolerances, which are digestive problems, true food allergies trigger an immune response that can affect multiple systems in your dog's body.</p>
      
      <h3>Common Signs of Food Allergies in Dogs</h3>
      <p>Dogs with food allergies often show the following symptoms:</p>
      <ul>
        <li><strong>Skin issues:</strong> Itching, redness, hot spots, recurring ear infections</li>
        <li><strong>Gastrointestinal problems:</strong> Vomiting, diarrhea, excessive gas</li>
        <li><strong>Chronic infections:</strong> Especially ear infections and skin infections</li>
        <li><strong>Behavioral changes:</strong> Increased scratching, restlessness, irritability</li>
      </ul>
      
      <p>It's important to note that many of these symptoms can overlap with other conditions, making diagnosis challenging without systematic tracking.</p>
      
      <h3>Most Common Allergens for Dogs</h3>
      <p>The most frequent food allergens for dogs include:</p>
      <ol>
        <li><strong>Beef</strong> (the most common allergen)</li>
        <li><strong>Dairy products</strong></li>
        <li><strong>Chicken</strong></li>
        <li><strong>Wheat</strong></li>
        <li><strong>Egg</strong></li>
        <li><strong>Lamb</strong></li>
        <li><strong>Soy</strong></li>
        <li><strong>Pork</strong></li>
        <li><strong>Fish</strong></li>
        <li><strong>Rabbit</strong></li>
      </ol>
      
      <p>Interestingly, many pet owners are surprised to find proteins like beef and chicken at the top of the list, as these are commonly thought of as "good" ingredients.</p>
      
      <h2>How to Track Potential Food Allergies</h2>
      <p>The key to identifying food allergies in your dog is systematic tracking and an elimination diet. Using a tool like Aller Paws can help you track:</p>
      <ul>
        <li>All foods and treats your dog consumes</li>
        <li>Symptoms that appear and their severity</li>
        <li>Timing between eating certain foods and symptom appearance</li>
        <li>Environmental factors that might contribute to symptoms</li>
      </ul>
      
      <h3>The Elimination Diet Approach</h3>
      <p>An elimination diet is the gold standard for identifying food allergies. This process involves:</p>
      <ol>
        <li>Feeding your dog a diet with novel protein and carbohydrate sources they've never had before</li>
        <li>Maintaining this diet strictly for 8-12 weeks</li>
        <li>Monitoring for improvement in symptoms</li>
        <li>Gradually reintroducing original foods one at a time</li>
        <li>Watching for the return of symptoms</li>
      </ol>
      
      <p>This methodical approach can help pinpoint exactly which ingredients trigger your dog's allergies.</p>
      
      <h2>Working With Your Veterinarian</h2>
      <p>While tracking at home is important, always work with your veterinarian when you suspect food allergies. They may recommend:</p>
      <ul>
        <li>Blood tests to rule out other conditions</li>
        <li>Prescription elimination diet foods</li>
        <li>Medications to manage symptoms during diagnosis</li>
      </ul>
      
      <p>Bring your tracking data to your vet appointments. Detailed records of your dog's diet and symptoms can significantly help your veterinarian make an accurate diagnosis.</p>
      
      <h2>Conclusion</h2>
      <p>Identifying food allergies in dogs requires patience, consistent tracking, and often an elimination diet. With the right approach and tools, you can help your dog find relief and enjoy a better quality of life. Apps like Aller Paws make this process easier by providing structured tracking and analysis to identify patterns between foods and symptoms.</p>
    `,
    author: "Dr. Sarah Chen, DVM",
    date: "March 1, 2025",
    readTime: "8 min read",
    category: "Dog Health",
    tags: ["food allergies", "dog health", "elimination diet", "pet care"],
    imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&h=630"
  },
  {
    id: "2",
    title: "How We Identified Our Dog's Wheat Allergy Using Aller Paws",
    excerpt: "A real user story about how tracking symptoms and diet helped diagnose and manage their dog's wheat allergy.",
    slug: "dog-wheat-allergy-case-study",
    content: "",
    author: "Michael Rodriguez",
    date: "February 14, 2025",
    readTime: "6 min read",
    category: "Success Stories",
    tags: ["success story", "wheat allergy", "dog allergies"],
    imageUrl: "https://images.unsplash.com/photo-1546512565-39d4dc75e556?auto=format&fit=crop&w=600&h=400"
  },
  {
    id: "3",
    title: "The Ultimate Guide to Elimination Diets for Cats with Food Sensitivities",
    excerpt: "Learn how to safely conduct an elimination diet to identify your cat's food triggers and allergies.",
    slug: "cat-elimination-diet-guide",
    content: "",
    author: "Dr. Lisa Wang",
    date: "February 3, 2025",
    readTime: "10 min read",
    category: "Cat Health",
    tags: ["cats", "elimination diet", "food sensitivities"],
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&h=400"
  },
  {
    id: "4",
    title: "10 Hypoallergenic Treat Recipes for Dogs with Multiple Food Allergies",
    excerpt: "Homemade treat recipes that are safe for dogs with common food allergies to beef, chicken, and grains.",
    slug: "hypoallergenic-dog-treat-recipes",
    content: "",
    author: "Emma Johnson",
    date: "January 20, 2025",
    readTime: "7 min read",
    category: "Recipes",
    tags: ["recipes", "treats", "hypoallergenic", "homemade"],
    imageUrl: "https://images.unsplash.com/photo-1581125919695-e481e2c6cb5e?auto=format&fit=crop&w=600&h=400"
  }
];

const Blog = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = React.useState(blogPosts[0]);

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
      <Helmet>
        <title>How to Identify Common Food Allergies in Dogs | Aller Paws Blog</title>
        <meta name="description" content="Learn to identify food allergies in dogs with our complete guide. Discover common allergens, symptoms to watch for, and how to use elimination diets effectively." />
        <meta name="keywords" content="dog food allergies, identify pet allergies, elimination diet for dogs, common food allergens dogs, pet allergy tracking" />
        <link rel="canonical" href="https://allerpaws.com/blog/identify-food-allergies-dogs" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="How to Identify Common Food Allergies in Dogs | Aller Paws Blog" />
        <meta property="og:description" content="Learn to identify food allergies in dogs with our complete guide. Discover common allergens, symptoms to watch for, and how to use elimination diets effectively." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&h=630" />
        <meta property="og:url" content="https://allerpaws.com/blog/identify-food-allergies-dogs" />
        <meta property="og:type" content="article" />
        
        {/* Article Tags */}
        <meta property="article:published_time" content="2025-03-01T00:00:00Z" />
        <meta property="article:author" content="Dr. Sarah Chen, DVM" />
        <meta property="article:section" content="Pet Health" />
        <meta property="article:tag" content="dog food allergies" />
        <meta property="article:tag" content="pet health" />
        <meta property="article:tag" content="elimination diet" />
      </Helmet>

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
                        src={post.imageUrl} 
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
                        src={post.imageUrl} 
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

      <div className="container py-10 px-4 max-w-6xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <article className="bg-card rounded-lg shadow-sm border overflow-hidden">
              <img 
                src={selectedPost.imageUrl} 
                alt={selectedPost.title}
                className="w-full h-72 object-cover"
              />
              
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    {selectedPost.date}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {selectedPost.author}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedPost.readTime}
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10">
                    {selectedPost.category}
                  </Badge>
                </div>
                
                <h1 className="text-3xl font-bold mb-4">{selectedPost.title}</h1>
                
                <div className="prose prose-sm sm:prose lg:prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-medium mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer hover:bg-primary/5">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mt-10 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h3 className="font-medium mb-2">Track Your Pet's Symptoms with Aller Paws</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use Aller Paws to systematically track your pet's food intake and symptoms to identify potential
                    allergies and sensitivities. Our easy-to-use app helps you work with your veterinarian to find
                    the best diet for your pet.
                  </p>
                  <Button size="sm" className="bg-primary text-white" onClick={() => navigate("/")}>
                    Try Aller Paws Free
                  </Button>
                </div>
              </div>
            </article>
          </div>
          
          <div>
            <div className="sticky top-4">
              <h2 className="text-xl font-bold mb-4">More Articles</h2>
              <div className="space-y-4">
                {blogPosts.slice(1).map((post) => (
                  <Card key={post.id} className="overflow-hidden cursor-pointer hover:border-primary/30 transition-colors">
                    <div className="h-32 overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium line-clamp-2 mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarIcon className="h-3 w-3" />
                        {post.date}
                        <Clock className="h-3 w-3 ml-2" />
                        {post.readTime}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Subscribe to Our Newsletter</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest articles, tips, and resources for managing your pet's food allergies.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button size="sm">Subscribe</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Structured data for articles */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "${selectedPost.title}",
            "image": "${selectedPost.imageUrl}",
            "author": {
              "@type": "Person",
              "name": "${selectedPost.author}"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Aller Paws",
              "logo": {
                "@type": "ImageObject",
                "url": "https://allerpaws.com/icons/icon-512x512.png"
              }
            },
            "datePublished": "2025-03-01T00:00:00Z",
            "dateModified": "2025-03-01T00:00:00Z"
          }
        `}} />
      </div>
    </div>
  );
};

export default Blog; 