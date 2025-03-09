
import { 
  Home, 
  ClipboardList, 
  BookOpen, 
  Database, 
  Settings,
  Bell,
  Activity
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { path: "/", label: "Home", icon: Home },
  { path: "/symptom-diary", label: "Symptoms", icon: ClipboardList },
  { path: "/symptoms-management", label: "Manage Symptoms", icon: Activity },
  { path: "/elimination-diet", label: "Diet", icon: BookOpen },
  { path: "/food-database", label: "Foods", icon: Database },
  { path: "/reminders", label: "Reminders", icon: Bell },
  { path: "/settings", label: "Settings", icon: Settings },
];
