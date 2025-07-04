import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { ProjectProvider } from "./contexts/ProjectContext";
import { ProjectDetail } from "./pages/ProjectDetail";
import { searchCache } from './services/searchCache';


// Clear cache on page refresh
window.addEventListener('beforeunload', () => {
  searchCache.clear();
});

function App() {
  return (
    <ProjectProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ProjectProvider>
  );
}

export default App;
