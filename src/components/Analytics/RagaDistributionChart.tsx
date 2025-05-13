
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type RagaDistributionChartProps = {
  history: {
    ragaCluster: number;
    ragaName: string;
  }[];
};

const RagaDistributionChart = ({ history }: RagaDistributionChartProps) => {
  // Calculate counts for each cluster
  const clusterCounts = history.reduce((acc, entry) => {
    const cluster = entry.ragaCluster;
    acc[cluster] = (acc[cluster] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Create data for the chart
  const data = [
    {
      name: "Tension Relief (0)",
      value: clusterCounts[0] || 0,
      color: "#8B5CF6", // Purple
      ragas: "Bageshree, Marwa, Shankara"
    },
    {
      name: "Energy/Focus (1)",
      value: clusterCounts[1] || 0,
      color: "#3B82F6", // Blue
      ragas: "Darbari Kanada, Yaman, Bhairav"
    },
    {
      name: "Uplifting (2)",
      value: clusterCounts[2] || 0,
      color: "#14B8A6", // Teal
      ragas: "Hamsadhwani, Kedar, Bihag"
    },
    {
      name: "Calming (3)",
      value: clusterCounts[3] || 0,
      color: "#F59E0B", // Amber
      ragas: "Kafi, Madhuvanti, Desh"
    }
  ];

  // Define colors for the chart
  const COLORS = ["#8B5CF6", "#3B82F6", "#14B8A6", "#F59E0B"];

  // Filter out clusters with 0 count
  const filteredData = data.filter((item) => item.value > 0);

  const chartConfig = {
    cluster0: { color: "#8B5CF6", label: "Tension Relief" },
    cluster1: { color: "#3B82F6", label: "Energy/Focus" },
    cluster2: { color: "#14B8A6", label: "Uplifting" },
    cluster3: { color: "#F59E0B", label: "Calming" },
  };

  if (filteredData.length === 0) {
    return <div className="h-full flex items-center justify-center">No data available</div>;
  }

  return (
    <ChartContainer config={chartConfig} className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            fill="#8884d8"
            paddingAngle={4}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={true}
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255,255,255,0.2)" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border rounded-md p-3 shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">{data.ragas}</p>
        <p className="mt-1 font-medium">{data.value} sessions ({((data.value / payload[0].value) * 100).toFixed(1)}%)</p>
      </div>
    );
  }
  return null;
};

export default RagaDistributionChart;
