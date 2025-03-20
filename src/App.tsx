
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProposalDetails from "./pages/ProposalDetails";
import NotFound from "./pages/NotFound";
import { ProposalProvider } from "./context/ProposalContext";
import AppLayout from "./components/AppLayout";
import SchemesPage from "./pages/SchemesPage";
import StatisticsPage from "./pages/StatisticsPage";
import ProposalMasterPage from "./pages/ProposalMasterPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ProposalProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout><Index /></AppLayout>} />
            <Route path="/proposals" element={<AppLayout><ProposalMasterPage /></AppLayout>} />
            <Route path="/proposals/:proposalId" element={<AppLayout><ProposalDetails /></AppLayout>} />
            <Route path="/schemes" element={<AppLayout><SchemesPage /></AppLayout>} />
            <Route path="/schemes/:schemeId" element={<AppLayout><SchemesPage /></AppLayout>} />
            <Route path="/statistics" element={<AppLayout><StatisticsPage /></AppLayout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ProposalProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
