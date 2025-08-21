import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout"; // Import the new Layout component
import LandingPage from "./pages/LandingPage"; // Import the new LandingPage
import ContestsPage from "./pages/ContestsPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import UsersPage from "./pages/UsersPage";
import MyPage from "./pages/MyPage";
import RegistrationPage from "./pages/RegistrationPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout> {/* Wrap all routes with the Layout component */}
          <Routes>
            <Route path="/" element={<LandingPage />} /> {/* Set LandingPage as the default */}
            <Route path="/contests" element={<ContestsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;