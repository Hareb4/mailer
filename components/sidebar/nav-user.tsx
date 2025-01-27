"use client";

import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeSwitcher } from "./theme-switcher";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export function NavUser({ user }: { user: any }) {
  const router = useRouter();

  const handleLogout = async () => {
    const response = await axios.get("/api/sign-out");

    if (response.status === 200) {
      router.push("/sign-in");
    }
  };

  const { isMobile } = useSidebar();

  return (
    <SidebarMenu className="flex flex-col gap-4">
      <Link
        href={"/newemail"}
        className="flex items-center justify-center px-4 py-2 bg-foreground text-background rounded-lg text-center group-data-[collapsible=icon]:hidden"
      >
        + New Email
      </Link>
      <Link
        href={"/newemail"}
        className="bg-foreground text-background py-1 rounded-lg text-center group-data-[collapsible=icon]:block hidden"
      >
        +
      </Link>
      <SidebarMenuItem className="flex items-center justify-center group-data-[collapsible=icon]:flex-col gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user?.profile_image_url || ""}
                  alt={user?.name}
                />
                <AvatarFallback className="rounded-lg">
                  {user?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.name.toUpperCase()}
                </span>

                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.profile_image_url || ""}
                    alt={user?.name || user?.email}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeSwitcher />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
