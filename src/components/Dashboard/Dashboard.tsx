
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import AssessmentForm from "@/components/Assessment/AssessmentForm";
import { User } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useUser();

  return (
    <div className="container max-w-6xl px-4 py-8 mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">Your personalized raga wellness journey</p>
        </div>
        <Button onClick={logout} variant="outline" size="sm" className="whitespace-nowrap">
          Sign Out
        </Button>
      </header>

      <div className="grid gap-6 md:grid-cols-6">
        <div className="md:col-span-4">
          <AssessmentForm />
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">History</CardTitle>
              <CardDescription>Your previous recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              {user?.history && user.history.length > 0 ? (
                <div className="space-y-4">
                  {user.history.slice().reverse().slice(0, 3).map((item, index) => (
                    <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                      <p className="font-medium">{item.ragaName}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                        <span className={`
                          ${item.feedback === 'positive' ? 'text-green-500' : ''}
                          ${item.feedback === 'neutral' ? 'text-amber-500' : ''}
                          ${item.feedback === 'negative' ? 'text-red-500' : ''}
                          font-medium
                        `}>
                          {item.feedback === 'positive' ? 'Helpful' : ''}
                          {item.feedback === 'neutral' ? 'Neutral' : ''}
                          {item.feedback === 'negative' ? 'Not helpful' : ''}
                          {!item.feedback ? 'No feedback' : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No history yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
