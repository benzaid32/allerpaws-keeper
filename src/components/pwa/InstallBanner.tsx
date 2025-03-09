
import React, { useState, useEffect } from 'react';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone, CloudOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallBanner = () => {
  const { isInstallable, isInstalled, promptToInstall } = usePwaInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

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

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Hide offline banner after coming back online
      setTimeout(() => {
        setShowOfflineBanner(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      // Only show offline banner if we're in a PWA
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setShowOfflineBanner(true);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
  };

  const handleInstall = () => {
    promptToInstall();
    setShowBanner(false);
  };

  const handleOfflineDismiss = () => {
    setShowOfflineBanner(false);
  };

  return (
    <>
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
                  Install AllerPaws for a better experience, offline access, and faster data sync
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

      <AnimatePresence>
        {showOfflineBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed top-0 left-0 right-0 z-50"
          >
            <div className={`p-2 text-center ${isOffline ? 'bg-amber-500' : 'bg-green-500'} text-white`}>
              <div className="flex items-center justify-center gap-2">
                {isOffline ? (
                  <>
                    <CloudOff size={16} />
                    <span>You're offline. Using cached data.</span>
                  </>
                ) : (
                  <>
                    <Wifi size={16} />
                    <span>Back online! Syncing latest data.</span>
                  </>
                )}
                <button 
                  onClick={handleOfflineDismiss}
                  className="ml-2 p-1 rounded-full hover:bg-black/10 transition-colors"
                  aria-label="Dismiss"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InstallBanner;
