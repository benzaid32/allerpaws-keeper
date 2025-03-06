
import React from 'react';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

interface PwaInstallPromptProps {
  className?: string;
}

const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({ className }) => {
  const { isInstallable, promptToInstall } = usePwaInstall();

  if (!isInstallable) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-20 left-0 right-0 z-40 mx-auto w-[90%] max-w-md rounded-xl bg-card p-4 shadow-lg ${className}`}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 rounded-full bg-primary/10 p-2">
          <Download size={20} className="text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium">Add AllerPaws to Home Screen</h3>
          <p className="text-xs text-muted-foreground">
            Install this app on your device for quick access
          </p>
        </div>
        <Button size="sm" onClick={promptToInstall} className="flex-shrink-0">
          Install
        </Button>
      </div>
    </motion.div>
  );
};

export default PwaInstallPrompt;
