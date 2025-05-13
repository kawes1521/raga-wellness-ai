
import { UserProvider } from "@/contexts/UserContext";
import AnalyticsLayout from "@/components/Analytics/AnalyticsLayout";
import AppIcon from "@/components/AppIcon";
import { Link } from "react-router-dom";

const Analytics = () => {
  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AppIcon />
              <div>
                <h1 className="font-bold text-lg">Raga Wellness</h1>
                <p className="text-xs text-muted-foreground">Personalized raga therapy</p>
              </div>
            </div>
            <nav className="hidden md:flex gap-6">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/analytics" className="text-sm text-foreground font-medium">
                Analytics
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-grow">
          <AnalyticsLayout />
        </main>

        <footer className="border-t py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <AppIcon />
                <span className="text-sm font-medium">Raga Wellness</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Wellness through the science of Indian classical ragas
              </div>
            </div>
          </div>
        </footer>
      </div>
    </UserProvider>
  );
};

export default Analytics;
