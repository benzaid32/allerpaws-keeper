
import React from "react";
import { APP_NAME } from "@/lib/constants";
import { Quote, Star } from "lucide-react";

const TestimonialsSection: React.FC = () => {
  return (
    <div className="mb-28">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-sm">
        What Pet Owners Say
      </h2>
      <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
        Hear from pet owners who've successfully identified and managed their pet's allergies with our app.
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <TestimonialCard
          quote={`"${APP_NAME} helped identify my dog's chicken allergy in just two weeks. My vet was impressed with the detailed logs I could show!"`}
          author="Sarah T., Dog Owner"
          imgSrc="https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=150&q=80"
          rating={5}
        />
        
        <TestimonialCard
          quote={`"After months of digestive issues, we found out our cat was allergic to grain fillers. ${APP_NAME} made the process so much easier."`}
          author="Michael R., Cat Owner"
          imgSrc="https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=150&q=80"
          rating={5}
        />
        
        <TestimonialCard
          quote={`"I was skeptical at first, but ${APP_NAME} helped me track my German Shepherd's symptoms and pinpoint the exact allergen. The diet guides are so helpful!"`}
          author="Jessica L., Dog Owner"
          imgSrc="https://images.unsplash.com/photo-1577207949997-0cf3b95cd38a?auto=format&fit=crop&w=150&q=80"
          rating={5}
        />
      </div>
    </div>
  );
};

interface TestimonialCardProps {
  quote: string;
  author: string;
  imgSrc?: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, imgSrc, rating }) => {
  return (
    <div className="bg-card/90 p-8 rounded-xl border border-border/70 shadow-sm hover:shadow-elegant transition-all duration-300 flex flex-col relative group hover:border-primary/30 hover:translate-y-[-5px]">
      <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/20 group-hover:text-primary/30 transition-colors" />
      <p className="italic mb-8 pt-2 text-lg">{quote}</p>
      
      <div className="flex mb-4">
        {Array(5).fill(0).map((_, i) => (
          <Star 
            key={i} 
            className={`h-5 w-5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
      
      <div className="mt-auto flex items-center gap-3">
        {imgSrc && (
          <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20">
            <img src={imgSrc} alt={author} className="h-full w-full object-cover" />
          </div>
        )}
        <p className="font-semibold text-base">{author}</p>
      </div>
    </div>
  );
};

export default TestimonialsSection;
