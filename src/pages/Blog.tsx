import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, ArrowRight, User, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  imageUrl: string;
  isFeatured?: boolean; // Make isFeatured optional to avoid TypeScript error
}

// Sample blog data - In a real app, this would come from an API
const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Understanding Food Allergies in Dogs",
    slug: "understanding-food-allergies-in-dogs",
    excerpt: "Learn about the common causes of food allergies in dogs and how to identify symptoms early.",
    content: "Full content would go here...",
    author: "Dr. Sarah Veterinarian",
    date: "June 15, 2023",
    readTime: "5 min read",
    category: "Dog Health",
    tags: ["food allergies", "dogs", "symptoms"],
    imageUrl: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/blog/dog-allergy-blog.jpg",
    isFeatured: true
  },
  {
    id: "2",
    title: "Best Hypoallergenic Foods for Cats",
    slug: "best-hypoallergenic-foods-for-cats",
    excerpt: "Discover the top hypoallergenic food options that can help reduce allergic reactions in sensitive cats.",
    content: "Full content would go here...",
    author: "Dr. Mark Feline Specialist",
    date: "May 28, 2023",
    readTime: "7 min read",
    category: "Cat Health",
    tags: ["hypoallergenic", "cats", "food"],
    imageUrl: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/blog/cat-food-blog.jpg",
    isFeatured: false
  },
  {
    id: "3",
    title: "How to Conduct an Elimination Diet",
    slug: "how-to-conduct-elimination-diet",
    excerpt: "A step-by-step guide to implementing an effective elimination diet for your pet.",
    content: "Full content would go here...",
    author: "Dr. James Nutritionist",
    date: "April 12, 2023",
    readTime: "10 min read",
    category: "Nutrition",
    tags: ["elimination diet", "pet health", "food allergies"],
    imageUrl: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/blog/elimination-diet-blog.jpg",
    isFeatured: false
  }
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter blog posts based on search term
  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get featured posts
  const featuredPosts = blogPosts.filter(post => post.isFeatured);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate search loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Pet Allergy Insights</h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8 max-w-lg mx-auto">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search articles..."
              className="pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              className="absolute right-0 top-0 h-full" 
              variant="ghost" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </form>
        
        {/* Blog Categories */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="dogs">Dogs</TabsTrigger>
            <TabsTrigger value="cats">Cats</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          </TabsList>
          
          {/* All Posts Tab */}
          <TabsContent value="all">
            {/* Featured Posts Section */}
            {featuredPosts.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Featured Articles</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {featuredPosts.map(post => (
                    <FeaturedPostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}
            
            {/* All Posts Section */}
            <h2 className="text-xl font-semibold mb-4">Latest Articles</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No articles found matching your search.</p>
              </div>
            )}
          </TabsContent>
          
          {/* Other tabs would have similar content but filtered by category */}
          <TabsContent value="dogs">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.filter(post => post.category === "Dog Health").map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="cats">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.filter(post => post.category === "Cat Health").map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="nutrition">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.filter(post => post.category === "Nutrition").map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Component for regular post cards
const PostCard = ({ post }: { post: BlogPost }) => {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-all">
      <div className="aspect-video relative">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {post.category}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {post.readTime}
          </span>
        </div>
        <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex-grow">
          {post.excerpt}
        </p>
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
          <div className="flex items-center text-xs text-muted-foreground">
            <User className="h-3 w-3 mr-1" />
            {post.author}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {post.date}
          </div>
        </div>
        <Button variant="ghost" className="mt-4 w-full justify-between" asChild>
          <Link to={`/blog/${post.slug}`}>
            Read more <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
};

// Component for featured post cards
const FeaturedPostCard = ({ post }: { post: BlogPost }) => {
  return (
    <Card className="overflow-hidden flex flex-col h-full bg-primary/5 hover:shadow-md transition-all">
      <div className="aspect-video relative">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge className="bg-primary text-white">Featured</Badge>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex-grow">
          {post.excerpt}
        </p>
        <Button variant="default" className="mt-auto justify-between" asChild>
          <Link to={`/blog/${post.slug}`}>
            Read article <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default Blog;
