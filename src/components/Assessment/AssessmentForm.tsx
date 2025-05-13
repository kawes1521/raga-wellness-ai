
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useUser } from "@/contexts/UserContext";
import { recommendRaga, RAGA_CLUSTERS } from "@/utils/ragaRecommendation";
import RagaRecommendation from "./RagaRecommendation";

const AssessmentForm = () => {
  const { saveAssessment } = useUser();
  const [stressLevel, setStressLevel] = useState(3);
  const [energyLevel, setEnergyLevel] = useState(50);
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [showResults, setShowResults] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save the assessment data
    saveAssessment({ stressLevel, energyLevel, gender });
    
    // Get raga recommendation
    const result = recommendRaga(stressLevel, energyLevel, gender);
    setRecommendation(result);
    
    // Show results
    setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
    setRecommendation(null);
  };

  return showResults ? (
    <RagaRecommendation 
      recommendation={recommendation} 
      assessmentData={{ stressLevel, energyLevel, gender }}
      onReset={handleReset}
    />
  ) : (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">How are you feeling today?</CardTitle>
        <CardDescription>
          Answer these simple questions to get your personalized raga recommendation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div className="space-y-4">
              <Label>What is your current stress level? ({stressLevel}/5)</Label>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground px-1">
                  <span>Very Low</span>
                  <span>Very High</span>
                </div>
                <Slider 
                  value={[stressLevel]} 
                  min={0} 
                  max={5} 
                  step={1}
                  onValueChange={(value) => setStressLevel(value[0])}
                  className="my-4"
                />
                <div className="flex justify-between">
                  {Array.from({length: 6}, (_, i) => (
                    <div 
                      key={i} 
                      className={`h-2 w-2 rounded-full ${stressLevel >= i ? 'bg-primary' : 'bg-muted'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>What is your current energy level? ({energyLevel}%)</Label>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground px-1">
                  <span>Low Energy</span>
                  <span>High Energy</span>
                </div>
                <Slider 
                  value={[energyLevel]} 
                  min={0} 
                  max={100} 
                  step={5}
                  onValueChange={(value) => setEnergyLevel(value[0])}
                  className="my-4"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Gender</Label>
              <RadioGroup 
                value={gender} 
                onValueChange={(value: 'M' | 'F') => setGender(value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="M" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="F" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full">
              Get Recommendation
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AssessmentForm;
