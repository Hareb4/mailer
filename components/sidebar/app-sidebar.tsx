"use client";
import * as React from "react";

import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";

import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map,
  MoreHorizontal,
  PieChart,
  Plus,
  Settings2,
  Sparkles,
  SquareTerminal,
  TableProperties,
  Trash2,
  Mail,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { MongoUser } from "@/types/user";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/profile.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "/config",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "/config",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    // {
    //   name: "Indox",
    //   url: "/emails", // Use relative path
    //   icon: Mail,
    // },
    {
      name: "Configurations",
      url: "/config",
      icon: Mail,
    },
    // {
    //   name: "Lists",
    //   url: "/lists",
    //   icon: TableProperties,
    // },
  ],
};

export default function AppSidebar({
  user,
  ...props
}: {
  user: MongoUser; // Adjust type based on data structure
}) {
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     const supabase = createClient();
  //     const { data: profile } = await supabase
  //       .from("profiles")
  //       .select("*")
  //       .eq("id", user.id)
  //       .single();
  //     setProfile(profile);
  //   };
  //   fetchProfile();
  // }, [user.id]);

  // const [profile, setProfile] = useState<Profile | null>(null);
  // const profile: Profile = {
  //   created_at: "12",
  //   id: "12",
  //   name: "12",
  //   profile_image_url: "12",
  // };

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <h1 className="ml-2 text-2xl font-semibold group-data-[collapsible=icon]:hidden">
                Sobha Mailer
              </h1>
              <h1 className="text-2xl text-center font-semibold group-data-[collapsible=icon]:block hidden">
                S
              </h1>
            </SidebarMenuItem>
          </SidebarMenu>
          {/* <TeamSwitcher teams={data.teams} /> */}
        </SidebarHeader>
        <SidebarContent>
          <NavProjects projects={data.projects} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
