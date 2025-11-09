import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  dataManagementGroup,
  insightsGroup,
  interactionGroup,
} from "@/data/sidebarItems";
import { sidebarGroup, sidebarItem } from "@/interfaces/sidebarInterface";

interface SidebarGroupItemProps {
  group: sidebarGroup;
}

const SidebarGroupItem: React.FC<SidebarGroupItemProps> = ({ group }) => (
  <SidebarGroup>
    <SidebarGroupLabel className="font-bold">{group.label}</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        {group.items.map((item) => (
          <SidebarMenuItem key={item.title} className="font-medium">
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
);

const groups: sidebarGroup[] = [
  insightsGroup,
  interactionGroup,
  dataManagementGroup,
];

const user = {
  name: "Shaan D",
  email: "shaanduss@gmail.com",
  avatar: "/avatars/shadcn.jpg",
};

export function AppSidebar() {
  return (
    <Sidebar collapsible="none" className="min-h-screen">
      <SidebarContent>
        {groups.map((group, index) => (
          <SidebarGroupItem key={`sidebar-${index}`} group={group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
