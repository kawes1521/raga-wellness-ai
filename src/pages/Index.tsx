
import { UserProvider } from "@/contexts/UserContext";
import Layout from "@/components/Layout/Layout";
import AppIcon from "@/components/AppIcon";

const Index = () => {
  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto p-4 flex items-center">
            <div className="flex items-center gap-3">
              <AppIcon />
              <div>
                <h1 className="font-bold text-lg">Raga Wellness</h1>
                <p className="text-xs text-muted-foreground">Personalized raga therapy</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          <Layout />
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

export default Index;
