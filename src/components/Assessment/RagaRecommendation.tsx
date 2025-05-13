
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/UserContext";
import { RAGA_CLUSTERS } from "@/utils/ragaRecommendation";
import RagaPlayer from "@/components/Audio/RagaPlayer";

interface RagaRecommendationProps {
  recommendation: {
    cluster: number;
    clusterName: string;
    clusterDescription: string;
    raga: string;
    confidence: number;
    allProbabilities: number[];
    explanation?: string;
  };
  assessmentData: {
    stressLevel: number;
    energyLevel: number;
    gender: 'M' | 'F';
  };
  onReset: () => void;
}

const RagaRecommendation = ({ recommendation, assessmentData, onReset }: RagaRecommendationProps) => {
  const { saveFeedback } = useUser();
  
  useEffect(() => {
    // Update the document title
    document.title = `Raga Wellness - ${recommendation.raga}`;
  }, [recommendation]);

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg overflow-hidden">
      <div 
        className="h-28 bg-gradient-to-r from-raga-purple to-raga-blue flex items-end p-6"
      >
        <div className="relative w-16 h-16 -mb-12 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse-subtle"></div>
          <span className="text-2xl font-bold text-primary">
            {recommendation.cluster + 1}
          </span>
        </div>
      </div>
      
      <CardHeader className="pt-16">
        <div className="flex items-baseline justify-between">
          <CardTitle className="text-2xl font-bold">{recommendation.raga}</CardTitle>
          <Badge variant="outline" className="ml-2">
            {Math.round(recommendation.confidence * 100)}% match
          </Badge>
        </div>
        <CardDescription className="text-lg font-medium">
          {recommendation.clusterName} Cluster
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <p>{recommendation.clusterDescription}</p>
          
          {recommendation.explanation && (
            <div className="bg-primary/5 border border-primary/10 rounded-md p-4 text-sm">
              <h4 className="font-medium mb-2">Why this raga was recommended:</h4>
              <p>{recommendation.explanation}</p>
            </div>
          )}
          
          <RagaPlayer title={recommendation.raga} />
          
          <div className="space-y-3 bg-secondary/50 rounded-lg p-4">
            <h4 className="font-medium">Based on your assessment</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Stress Level:</div>
              <div className="font-medium">{assessmentData.stressLevel}/5</div>
              <div>Energy Level:</div>
              <div className="font-medium">{assessmentData.energyLevel}%</div>
              <div>Gender:</div>
              <div className="font-medium">{assessmentData.gender === 'M' ? 'Male' : 'Female'}</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Other ragas in this cluster</h4>
            <div className="flex flex-wrap gap-2">
              {RAGA_CLUSTERS[recommendation.cluster].ragas
                .filter(raga => raga !== recommendation.raga)
                .map(raga => (
                  <Badge key={raga} variant="secondary">{raga}</Badge>
                ))
              }
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4">
        <p className="text-sm text-center">
          How did this recommendation make you feel?
        </p>
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => saveFeedback('negative')}
          >
            Not Helpful
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => saveFeedback('neutral')}
          >
            Neutral
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => saveFeedback('positive')}
          >
            Helpful
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReset} 
          className="mt-4"
        >
          New Assessment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RagaRecommendation;
