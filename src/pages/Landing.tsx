
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Landing = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  // If user is authenticated, redirect to dashboard
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
