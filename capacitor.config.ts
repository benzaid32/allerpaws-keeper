
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.fb8831dc533d4f5482d78e47c867bc5a',
  appName: 'allerpaws-keeper',
  webDir: 'dist',
  server: {
    url: 'https://fb8831dc-533d-4f54-82d7-8e47c867bc5a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
      vibrate: true,
      importance: "high",
      visibility: "public",
      foreground: true
    }
  },
  android: {
    allowMixedContent: true
  },
  ios: {
    contentInset: "always"
  }
};

export default config;
