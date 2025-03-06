import React, { useState, useEffect } from 'react';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallBanner = () => {
  const { isInstallable, isInstalled, promptToInstall } = usePwaInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Check if the banner was previously dismissed
  useEffect(() => {
    const bannerDismissed = localStorage.getItem('pwa-banner-dismissed');
    const dismissedTime = bannerDismissed ? parseInt(bannerDismissed, 10) : 0;
    const now = Date.now();
    
    // If dismissed more than 3 days ago, show again
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    if (!bannerDismissed || (now - dismissedTime > threeDaysInMs)) {
      setDismissed(false);
    } else {
      setDismissed(true);
    }
  }, []);

  // Show banner after a delay if conditions are met
  useEffect(() => {
    if (isInstallable && !isInstalled && !dismissed) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3000); // Show after 3 seconds
      
      return () => clearTimeout(timer);
    } else {
      setShowBanner(false);
    }
  }, [isInstallable, isInstalled, dismissed]);

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
  };

  const handleInstall = () => {
    promptToInstall();
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4 flex items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Add to Home Screen</h3>
              <p className="text-sm opacity-90 mb-3">
                Install AllerPaws for a better experience and offline access
              </p>
              <Button 
                onClick={handleInstall} 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white"
                size="sm"
              >
                <Smartphone className="mr-2 h-4 w-4" />
                Install App
              </Button>
            </div>
            <button 
              onClick={handleDismiss} 
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallBanner; 