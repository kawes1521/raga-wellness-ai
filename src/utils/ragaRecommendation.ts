// This is a simplified implementation of a contextual bandit algorithm
// with epsilon-greedy exploration strategy

// Define raga clusters
export const RAGA_CLUSTERS = [
  {
    id: 0,
    name: "Tension Relief",
    ragas: ["Bageshree", "Marwa", "Shankara"],
    description: "These ragas help alleviate tension and mental stress through their soothing melodic structures."
  },
  {
    id: 1,
    name: "Energy & Focus",
    ragas: ["Darbari Kanada", "Yaman", "Bhairav"],
    description: "Ragas that enhance concentration and provide steady, balanced energy."
  },
  {
    id: 2,
    name: "Uplift & Energize",
    ragas: ["Hamsadhwani", "Kedar", "Bihag"],
    description: "Bright, uplifting ragas that help counteract low energy states."
  },
  {
    id: 3,
    name: "Balanced Calming",
    ragas: ["Kafi", "Madhuvanti", "Desh"],
    description: "These ragas provide a harmonizing effect, balancing both energy and calm."
  }
];

// Logistic regression coefficients for each arm (cluster)
// These would be derived from real-world data in a production app
const MODEL_COEFFICIENTS = [
  // Cluster 0: Tension Relief
  { 
    intercept: 0.2,
    stressLevel: 0.3,     // Works well for high stress
    energyLevel: -0.005,  // Works better for lower energy 
    genderM: 0.1,         // Slight preference for males
  },
  // Cluster 1: Energy & Focus
  {
    intercept: -0.1,
    stressLevel: -0.15,   // Works better for lower stress
    energyLevel: 0.01,    // Works well across energy levels, slight preference for higher
    genderM: 0.05,        // Slight preference for males
  },
  // Cluster 2: Uplift & Energize
  {
    intercept: -0.3,
    stressLevel: -0.1,    // Works better for lower stress
    energyLevel: -0.02,   // Works best for low energy
    genderM: -0.1,        // Preference for females
  },
  // Cluster 3: Balanced Calming
  {
    intercept: 0.1,
    stressLevel: 0.1,     // Moderate preference for higher stress
    energyLevel: 0.005,   // Slight preference for higher energy
    genderM: -0.05,       // Slight preference for females
  }
];

// Function to get probability from logistic regression
const sigmoid = (z: number): number => 1 / (1 + Math.exp(-z));

// Function to predict reward probability for each arm
const predictArmRewards = (features: { stressLevel: number; energyLevel: number; gender: 'M' | 'F' }): number[] => {
  return MODEL_COEFFICIENTS.map(coef => {
    const z = coef.intercept +
              coef.stressLevel * features.stressLevel +
              coef.energyLevel * features.energyLevel +
              (features.gender === 'M' ? coef.genderM : 0);
    return sigmoid(z);
  });
};

// Function to select arm using epsilon-greedy strategy
const epsilonGreedySelection = (probabilities: number[], epsilon: number = 0.1): number => {
  // With probability epsilon, explore randomly
  if (Math.random() < epsilon) {
    return Math.floor(Math.random() * probabilities.length);
  }
  
  // Otherwise, exploit the best arm
  return probabilities.reduce((maxIndex, prob, currIndex, arr) => 
    prob > arr[maxIndex] ? currIndex : maxIndex, 0);
};

// Select a random raga from the cluster
const selectRandomRaga = (cluster: number): string => {
  const ragas = RAGA_CLUSTERS[cluster].ragas;
  return ragas[Math.floor(Math.random() * ragas.length)];
};

// Get human-readable explanation for the recommendation
const getExplanation = (
  cluster: number, 
  confidence: number, 
  features: { stressLevel: number; energyLevel: number; gender: 'M' | 'F' }
): string => {
  const clusterInfo = RAGA_CLUSTERS[cluster];
  let explanation = "";
  
  switch(cluster) {
    case 0: // Tension Relief
      explanation = features.stressLevel > 3 
        ? `Based on your high stress level (${features.stressLevel}/5), this raga is designed to provide relief and calm.`
        : `This raga can help provide balance and relaxation for your current state.`;
      break;
    case 1: // Energy & Focus
      explanation = features.stressLevel < 3 
        ? `Your moderate stress level (${features.stressLevel}/5) indicates you might benefit from increased focus and mental clarity.`
        : `This raga can help channel your energy into productive focus.`;
      break;
    case 2: // Uplift & Energize
      explanation = features.energyLevel < 40 
        ? `Your energy level (${features.energyLevel}%) indicates you could benefit from an uplifting melody.`
        : `This raga can help maintain and enhance your positive energy state.`;
      break;
    case 3: // Balanced Calming
      explanation = `Based on your combined stress (${features.stressLevel}/5) and energy (${features.energyLevel}%) levels, this raga offers a harmonizing effect.`;
      break;
  }
  
  return explanation;
};

// Main function to recommend a raga
export const recommendRaga = (stressLevel: number, energyLevel: number, gender: 'M' | 'F') => {
  // Normalize stress level to 0-1 range
  const normalizedStress = stressLevel / 5;
  
  // Normalize energy level to 0-1 range
  const normalizedEnergy = energyLevel / 100;
  
  // Get feature object
  const features = {
    stressLevel: normalizedStress,
    energyLevel: normalizedEnergy,
    gender
  };
  
  // Get predicted rewards for each arm
  const predictedRewards = predictArmRewards(features);
  
  // Select cluster using epsilon-greedy strategy
  const selectedCluster = epsilonGreedySelection(predictedRewards);
  
  // Select a random raga from the selected cluster
  const selectedRaga = selectRandomRaga(selectedCluster);
  
  // Get explanation for the recommendation
  const explanation = getExplanation(
    selectedCluster, 
    predictedRewards[selectedCluster],
    { stressLevel, energyLevel, gender }
  );
  
  return {
    cluster: selectedCluster,
    clusterName: RAGA_CLUSTERS[selectedCluster].name,
    clusterDescription: RAGA_CLUSTERS[selectedCluster].description,
    raga: selectedRaga,
    confidence: predictedRewards[selectedCluster],
    allProbabilities: predictedRewards,
    explanation
  };
};
