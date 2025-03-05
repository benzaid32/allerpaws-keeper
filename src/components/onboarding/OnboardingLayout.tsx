
import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OnboardingLayoutProps {
  children: ReactNode;
  animating: boolean;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children, animating }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <div className="w-full max-w-md mx-auto space-y-8">
        {children}
      </div>
    </div>
  );
};

export default OnboardingLayout;
