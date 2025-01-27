// protected/layout.tsx
import { headers } from "next/headers";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/app-sidebar";
import { getUserFromToken } from "../actions";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const headersList = await headers();
  // console.log("headersList: ", headersList);
  // const domain = headersList.get("host") || "";
  // const fullUrl = headersList.get("referer") || "";
  // const pathname = new URL(fullUrl).pathname;
  // console.log("pathname: ", pathname);
  // console.log("domain: ", domain);
  // // Skip authentication for reset-password route
  // if (pathname.includes("/reset-password")) {
  //   console.log("Navigating to reset password");
  //   return <div>{children}</div>;
  // }

  // Proceed with normal authentication for other routes
  const mongouser = await getUserFromToken();

  return (
    <SidebarProvider>
      <AppSidebar user={mongouser!} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
