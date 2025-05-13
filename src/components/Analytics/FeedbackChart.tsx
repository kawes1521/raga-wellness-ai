
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type FeedbackChartProps = {
  history: {
    ragaCluster: number;
    ragaName: string;
    feedback?: 'positive' | 'neutral' | 'negative';
  }[];
};

const FeedbackChart = ({ history }: FeedbackChartProps) => {
  // Create aggregated data for each raga
  const ragaFeedbacks = history.reduce((acc, entry) => {
    const ragaName = entry.ragaName;
    if (!acc[ragaName]) {
      acc[ragaName] = {
        name: ragaName,
        positive: 0,
        neutral: 0,
        negative: 0,
        cluster: entry.ragaCluster,
        total: 0
      };
    }
    
    if (entry.feedback) {
      acc[ragaName][entry.feedback]++;
    }
    acc[ragaName].total++;
    
    return acc;
  }, {} as Record<string, { name: string; positive: number; neutral: number; negative: number; cluster: number; total: number }>);
  
  // Convert to array and sort by total occurrences
  const data = Object.values(ragaFeedbacks)
    .sort((a, b) => b.total - a.total)
    .map(item => ({
      ...item,
      // Calculate satisfaction score
      satisfactionScore: item.total > 0 ? 
        ((item.positive * 100) + (item.neutral * 50)) / (item.total * 100) * 100 : 0
    }));
  
  // Chart configuration
  const chartConfig = {
    positive: { color: "#22c55e" },  // green
    neutral: { color: "#f59e0b" },   // amber
    negative: { color: "#ef4444" },  // red
  };

  // Get cluster color based on cluster number
  const getClusterColor = (cluster: number) => {
    const colors = ["#8B5CF6", "#3B82F6", "#14B8A6", "#F59E0B"];
    return colors[cluster] || colors[0];
  };

  if (data.length === 0) {
    return <div className="h-full flex items-center justify-center">No feedback data available</div>;
  }

  return (
    <ChartContainer config={chartConfig} className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          barGap={0}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={80} 
            tick={{ fontSize: 12 }}
            stroke="#94a3b8"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#94a3b8"
            label={{ value: 'Feedback Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: "#94a3b8" } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="positive" name="Helpful" stackId="a" fill={chartConfig.positive.color} />
          <Bar dataKey="neutral" name="Neutral" stackId="a" fill={chartConfig.neutral.color} />
          <Bar dataKey="negative" name="Not Helpful" stackId="a" fill={chartConfig.negative.color} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const totalFeedback = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
    const satisfactionScore = totalFeedback > 0 ? 
      ((payload[0].value * 100) + (payload[1].value * 50)) / (totalFeedback * 100) * 100 : 0;
    
    return (
      <div className="bg-background border border-border rounded-md p-3 shadow-lg">
        <p className="font-medium">{label}</p>
        <div className="mt-2 space-y-1">
          <p className="flex items-center gap-2">
            <span className="w-3 h-3 inline-block rounded-full bg-green-500"></span>
            <span className="text-sm">Helpful: {payload[0].value}</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="w-3 h-3 inline-block rounded-full bg-amber-500"></span>
            <span className="text-sm">Neutral: {payload[1].value}</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="w-3 h-3 inline-block rounded-full bg-red-500"></span>
            <span className="text-sm">Not Helpful: {payload[2].value}</span>
          </p>
          <p className="text-sm font-medium mt-1 pt-1 border-t">
            Satisfaction: {satisfactionScore.toFixed(1)}%
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default FeedbackChart;
