
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { ChartPie, ChartLine, ChartBar } from "lucide-react";
import StressEnergyTrendChart from "./StressEnergyTrendChart";
import RagaDistributionChart from "./RagaDistributionChart";
import FeedbackChart from "./FeedbackChart";
import WellnessScoreCard from "./WellnessScoreCard";

const AnalyticsDashboard = () => {
  const { user } = useUser();
  
  if (!user || !user.history || user.history.length === 0) {
    return (
      <div className="container max-w-6xl px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Analytics</h1>
        <Card>
          <CardHeader>
            <CardTitle>No Data Available</CardTitle>
            <CardDescription>
              Complete a wellness assessment to see your personal analytics.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">
              Your analytics will appear here after you've received and given feedback on at least one recommendation.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl px-4 py-8 mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Wellness Analytics</h1>
          <p className="text-muted-foreground">Track your wellness journey and raga effectiveness</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <WellnessScoreCard user={user} />
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold">{user.history.length}</div>
              <div className="p-2 bg-primary/10 rounded-full">
                <ChartBar className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Completed wellness sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avg. Stress Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold">
                {(user.history.reduce((acc, item) => acc + item.stressLevel, 0) / user.history.length).toFixed(1)}
              </div>
              <div className="p-2 bg-red-500/10 rounded-full">
                <ChartLine className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Scale: 0-5
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avg. Energy Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold">
                {(user.history.reduce((acc, item) => acc + item.energyLevel, 0) / user.history.length).toFixed(1)}
              </div>
              <div className="p-2 bg-amber-500/10 rounded-full">
                <ChartLine className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Scale: 0-100
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="trends">Wellness Trends</TabsTrigger>
          <TabsTrigger value="ragas">Raga Distribution</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Stress & Energy Trends</CardTitle>
              <CardDescription>
                Track how your stress and energy levels have changed over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <StressEnergyTrendChart history={user.history} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ragas">
          <Card>
            <CardHeader>
              <CardTitle>Raga Distribution</CardTitle>
              <CardDescription>
                Breakdown of recommended ragas by cluster
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <RagaDistributionChart history={user.history} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Analysis</CardTitle>
              <CardDescription>
                Effectiveness of your recommended ragas based on your feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <FeedbackChart history={user.history} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
