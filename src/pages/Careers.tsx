import React from "react";
import { motion } from "framer-motion";
import { PawPrint, Briefcase, Heart, Globe, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

const jobOpenings = [
  {
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "We're looking for a Senior Frontend Developer to help build and improve our React-based web application."
  },
  {
    title: "Mobile Developer (React Native)",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Join our team to develop and enhance our mobile application for iOS and Android platforms."
  },
  {
    title: "UX/UI Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Help us create beautiful, intuitive interfaces that pet parents love to use."
  },
  {
    title: "Veterinary Consultant",
    department: "Medical",
    location: "Remote",
    type: "Part-time",
    description: "Provide expert guidance on pet health matters and help shape our product roadmap."
  },
  {
    title: "Content Marketing Specialist",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description: "Create engaging content about pet health, allergies, and nutrition to educate and attract pet parents."
  }
];

const values = [
  {
    icon: <Heart className="h-6 w-6 text-red-500" />,
    title: "Pet-First Mindset",
    description: "We put the health and wellbeing of pets at the center of everything we do."
  },
  {
    icon: <Users className="h-6 w-6 text-blue-500" />,
    title: "Inclusive Community",
    description: "We foster a diverse, equitable, and inclusive environment for all team members."
  },
  {
    icon: <Sparkles className="h-6 w-6 text-amber-500" />,
    title: "Innovation",
    description: "We constantly seek new ways to improve pet healthcare through technology."
  },
  {
    icon: <Globe className="h-6 w-6 text-green-500" />,
    title: "Remote-First",
    description: "We embrace flexible work arrangements and hire the best talent regardless of location."
  }
];

const Careers = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Pack</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Help us build the future of pet healthcare technology and make a difference in the lives of pets and their families.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              View Open Positions
            </Button>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Work With Us</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                At {APP_NAME}, we're passionate about improving the lives of pets with allergies and their families. 
                Join our mission to make pet healthcare more accessible and effective.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <Card className="h-full border-none shadow-md bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-muted/50 p-3 rounded-full mb-4">
                          {value.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Benefits & Perks</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We believe in taking care of our team so they can focus on taking care of our customers and their pets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Health & Wellness</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Comprehensive health insurance</li>
                  <li>Mental health support</li>
                  <li>Wellness stipend</li>
                  <li>Pet insurance discount</li>
                </ul>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Work-Life Balance</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Flexible working hours</li>
                  <li>Remote-first environment</li>
                  <li>Unlimited PTO policy</li>
                  <li>Paid parental leave</li>
                </ul>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Growth & Development</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Learning & development budget</li>
                  <li>Conference attendance</li>
                  <li>Career progression framework</li>
                  <li>Mentorship opportunities</li>
                </ul>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Equipment & Setup</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Home office stipend</li>
                  <li>Latest technology</li>
                  <li>Ergonomic furniture</li>
                  <li>Software subscriptions</li>
                </ul>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Team Building</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Annual company retreats</li>
                  <li>Virtual social events</li>
                  <li>Team building activities</li>
                  <li>Pet show & tell sessions</li>
                </ul>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Financial Benefits</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Competitive salary</li>
                  <li>Equity options</li>
                  <li>401(k) matching</li>
                  <li>Performance bonuses</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join our growing team and help us make a difference in pet healthcare.
              </p>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              {jobOpenings.map((job, index) => (
                <motion.div
                  key={job.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Briefcase className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium text-primary">{job.department}</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                            <p className="text-muted-foreground mb-4">{job.description}</p>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs bg-muted px-2 py-1 rounded-full">{job.location}</span>
                              <span className="text-xs bg-muted px-2 py-1 rounded-full">{job.type}</span>
                            </div>
                          </div>
                          <Button className="shrink-0 bg-primary/10 text-primary hover:bg-primary/20">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-lg mb-4">Don't see a position that fits your skills?</p>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Send Us Your Resume
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Careers; 