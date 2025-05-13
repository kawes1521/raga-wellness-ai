
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatDistanceToNow } from "date-fns";

type StressEnergyTrendChartProps = {
  history: {
    date: Date;
    stressLevel: number;
    energyLevel: number;
  }[];
};

const StressEnergyTrendChart = ({ history }: StressEnergyTrendChartProps) => {
  // Format data for the chart
  const data = history
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((entry) => ({
      date: new Date(entry.date),
      stressLevel: entry.stressLevel,
      energyLevel: entry.energyLevel / 20, // Scale down energy level to match stress level scale for visualization
      energyLevelRaw: entry.energyLevel,
      formattedDate: formatDistanceToNow(new Date(entry.date), { addSuffix: true }),
    }));

  // Configure chart colors
  const chartConfig = {
    stress: { color: "#ef4444" },
    energy: { color: "#f59e0b" },
  };

  return (
    <ChartContainer config={chartConfig} className="h-full">
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="formattedDate"
          tick={{ fontSize: 12 }}
          stroke="#94a3b8"
          tickLine={{ stroke: "#94a3b8" }}
          axisLine={{ stroke: "#94a3b8" }}
        />
        <YAxis
          yAxisId="left"
          domain={[0, 5]}
          tick={{ fontSize: 12 }}
          stroke="#94a3b8"
          tickLine={{ stroke: "#94a3b8" }}
          axisLine={{ stroke: "#94a3b8" }}
          label={{ value: "Stress Level (0-5)", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fill: "#94a3b8", fontSize: 12 } }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 100]}
          tick={{ fontSize: 12 }}
          stroke="#94a3b8"
          tickLine={{ stroke: "#94a3b8" }}
          axisLine={{ stroke: "#94a3b8" }}
          label={{ value: "Energy Level (0-100)", angle: 90, position: "insideRight", style: { textAnchor: "middle", fill: "#94a3b8", fontSize: 12 } }}
        />
        <ChartTooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} />
        <ReferenceLine y={2.5} yAxisId="left" stroke="#94a3b8" strokeDasharray="3 3" label="Avg Stress" />
        <ReferenceLine y={50} yAxisId="right" stroke="#94a3b8" strokeDasharray="3 3" label="Avg Energy" />
        <Line
          type="monotone"
          dataKey="stressLevel"
          stroke={chartConfig.stress.color}
          activeDot={{ r: 8 }}
          yAxisId="left"
          name="Stress Level"
          strokeWidth={2}
          dot={{ strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="energyLevelRaw"
          stroke={chartConfig.energy.color}
          yAxisId="right"
          name="Energy Level"
          strokeWidth={2}
          dot={{ strokeWidth: 2 }}
        />
      </LineChart>
    </ChartContainer>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-md p-3 shadow-lg">
        <p className="font-medium mb-2">{payload[0].payload.formattedDate}</p>
        <p className="flex items-center gap-2">
          <span className="w-3 h-3 inline-block rounded-full bg-red-500"></span>
          <span className="text-sm">Stress: {payload[0].value}</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="w-3 h-3 inline-block rounded-full bg-amber-500"></span>
          <span className="text-sm">Energy: {payload[1].value}</span>
        </p>
      </div>
    );
  }

  return null;
};

export default StressEnergyTrendChart;
