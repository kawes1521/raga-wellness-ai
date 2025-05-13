
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPie } from "lucide-react";

type WellnessScoreCardProps = {
  user: {
    history: {
      feedback?: 'positive' | 'neutral' | 'negative';
    }[];
  };
};

const WellnessScoreCard = ({ user }: WellnessScoreCardProps) => {
  // Only consider entries with feedback
  const entriesWithFeedback = user.history.filter(entry => entry.feedback);
  
  // Calculate wellness score based on feedback
  let wellnessScore = 0;
  if (entriesWithFeedback.length > 0) {
    const scoreSum = entriesWithFeedback.reduce((sum, entry) => {
      if (entry.feedback === 'positive') return sum + 100;
      if (entry.feedback === 'neutral') return sum + 50;
      if (entry.feedback === 'negative') return sum + 0;
      return sum;
    }, 0);
    wellnessScore = Math.round(scoreSum / entriesWithFeedback.length);
  }

  // Determine score color based on value
  let scoreColor = "text-gray-500";
  let bgColor = "bg-gray-500/10";
  if (wellnessScore >= 80) {
    scoreColor = "text-green-500";
    bgColor = "bg-green-500/10";
  } else if (wellnessScore >= 60) {
    scoreColor = "text-emerald-500";
    bgColor = "bg-emerald-500/10";
  } else if (wellnessScore >= 40) {
    scoreColor = "text-amber-500";
    bgColor = "bg-amber-500/10";
  } else if (wellnessScore > 0) {
    scoreColor = "text-orange-500";
    bgColor = "bg-orange-500/10";
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Wellness Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className={`text-4xl font-bold ${scoreColor}`}>
            {entriesWithFeedback.length === 0 ? 'N/A' : wellnessScore}
          </div>
          <div className={`p-2 ${bgColor} rounded-full`}>
            <ChartPie className={`w-6 h-6 ${scoreColor}`} />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {entriesWithFeedback.length === 0 
            ? 'Provide feedback to calculate' 
            : `Based on ${entriesWithFeedback.length} feedback entries`}
        </p>
      </CardContent>
    </Card>
  );
};

export default WellnessScoreCard;
