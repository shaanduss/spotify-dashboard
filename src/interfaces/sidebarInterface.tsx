import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent } from "react";

export interface sidebarItem {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
}

export interface sidebarGroup {
  label: string;
  items: sidebarItem[];
}
