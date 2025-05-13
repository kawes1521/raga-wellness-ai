
import { useUser } from "@/contexts/UserContext";
import AuthForm from "@/components/Auth/AuthForm";
import Dashboard from "@/components/Dashboard/Dashboard";

const Layout = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 py-8">
        {user ? <Dashboard /> : <AuthForm />}
      </div>
    </div>
  );
};

export default Layout;
