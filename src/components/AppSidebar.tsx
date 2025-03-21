
import { Link, useLocation } from "react-router-dom";
import { 
  FileText, 
  LayoutDashboard, 
  Database, 
  BarChart2, 
  Settings, 
  ClipboardList,
  MessageSquare,
  Home,
  Activity 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useProposals } from "@/context/ProposalContext";
import { useState } from "react";
import { Button } from "./ui/button";

const AppSidebar = () => {
  const location = useLocation();
  const { schemes } = useProposals();
  const [schemeMenuExpanded, setSchemeMenuExpanded] = useState(true);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar>
      <SidebarHeader className="py-4">
        <Link to="/" className="flex items-center px-2">
          <div className="relative h-9 w-9 bg-blue-500 rounded-xl flex items-center justify-center mr-3">
            <span className="text-white font-bold text-lg">P</span>
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full"></div>
          </div>
          <span className="font-bold text-xl bg-clip-text">
            ProposalGenius
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/")}>
                  <Link to="/">
                    <LayoutDashboard />
                    <span>Modern Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/classic-dashboard")}>
                  <Link to="/classic-dashboard">
                    <Home />
                    <span>Classic Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/proposals")}>
                  <Link to="/proposals">
                    <ClipboardList />
                    <span>Proposal Master</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/schemes")}>
                  <Link to="/schemes">
                    <Database />
                    <span>Scheme Master</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/statistics")}>
                  <Link to="/statistics">
                    <BarChart2 />
                    <span>Statistics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <div className="flex items-center justify-between px-3 py-2">
            <SidebarGroupLabel className="mb-0">Indigenisation Schemes</SidebarGroupLabel>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              onClick={() => setSchemeMenuExpanded(!schemeMenuExpanded)}
            >
              {schemeMenuExpanded ? (
                <Activity className="h-4 w-4" />
              ) : (
                <Activity className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {schemeMenuExpanded && (
            <SidebarGroupContent>
              <SidebarMenu>
                {schemes.map((scheme) => (
                  <SidebarMenuItem key={scheme.id}>
                    <SidebarMenuButton asChild isActive={location.pathname === `/schemes/${scheme.id}`}>
                      <Link to={`/schemes/${scheme.id}`}>
                        <div className={`w-2 h-2 rounded-full bg-${scheme.color}-500`}></div>
                        <span>{scheme.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
