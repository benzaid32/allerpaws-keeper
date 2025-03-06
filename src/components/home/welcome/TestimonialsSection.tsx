
import React from "react";
import { APP_NAME } from "@/lib/constants";

const TestimonialsSection: React.FC = () => {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-center mb-8">What Pet Owners Say</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <TestimonialCard
          quote={`"${APP_NAME} helped identify my dog's chicken allergy in just two weeks. My vet was impressed with the detailed logs I could show!"`}
          author="Sarah T., Dog Owner"
        />
        
        <TestimonialCard
          quote={`"After months of digestive issues, we found out our cat was allergic to grain fillers. ${APP_NAME} made the process so much easier."`}
          author="Michael R., Cat Owner"
        />
      </div>
    </div>
  );
};

interface TestimonialCardProps {
  quote: string;
  author: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author }) => {
  return (
    <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
      <p className="italic mb-4">{quote}</p>
      <p className="font-semibold">- {author}</p>
    </div>
  );
};

export default TestimonialsSection;
