import { sidebarGroup } from "@/interfaces/sidebarInterface";
import {
  ArrowRightFromLine,
  Bot,
  Brain,
  History,
  Home,
  ListMusic,
  MessageCircleQuestion,
  Settings,
  TrendingUpDown,
} from "lucide-react";

export const insightsGroup: sidebarGroup = {
  label: "Listening & Insights",
  items: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Listening History",
      url: "#",
      icon: History,
    },
    {
      title: "Mood Trends",
      url: "#",
      icon: TrendingUpDown,
    },
    {
      title: "Genre Insights",
      url: "#",
      icon: Brain,
    },
    {
      title: "Playlists",
      url: "#",
      icon: ListMusic,
    },
  ],
};

export const interactionGroup: sidebarGroup = {
  label: "Interaction",
  items: [
    {
      title: "Chat & Queries",
      url: "#",
      icon: MessageCircleQuestion,
    },
    {
      title: "Recommendations",
      url: "#",
      icon: Bot,
    },
  ],
};

export const dataManagementGroup: sidebarGroup = {
  label: "Data Management",
  items: [
    {
      title: "Export Data",
      url: "#",
      icon: ArrowRightFromLine,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ],
};
