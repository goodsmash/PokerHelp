import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import type { ActionRecommendation as ActionRecommendationType } from "@shared/schema";

interface ActionRecommendationProps {
  recommendation: ActionRecommendationType | null;
}

export default function ActionRecommendation({ recommendation }: ActionRecommendationProps) {
  if (!recommendation) {
    return (
      <Card className="bg-green-800 border-green-600 p-6">
        <h2 className="text-xl font-bold mb-4 text-white flex items-center">
          <Lightbulb className="text-yellow-400 mr-2" />
          Recommended Action
        </h2>
        <div className="text-center text-gray-400 py-8">
          Select cards and position for recommendations
        </div>
      </Card>
    );
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'FOLD': return 'bg-red-600';
      case 'CALL': return 'bg-yellow-600';
      case 'RAISE': return 'bg-green-600';
      case 'ALL-IN': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Card className="bg-green-800 border-green-600 p-6">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center">
        <Lightbulb className="text-yellow-400 mr-2" />
        Recommended Action
      </h2>
      
      {/* Primary Recommendation */}
      <div className={`${getActionColor(recommendation.action)} rounded-lg p-4 mb-4 text-center text-white`}>
        <div className="text-2xl font-bold mb-2">{recommendation.action}</div>
        <div className="text-sm opacity-90">{recommendation.description}</div>
      </div>

      {/* Action Details */}
      <div className="space-y-3">
        {recommendation.sizing && (
          <div className="bg-green-700 rounded-lg p-3 text-white">
            <div className="font-bold mb-1">Sizing:</div>
            <div className="text-sm">{recommendation.sizing}</div>
          </div>
        )}
        <div className="bg-green-700 rounded-lg p-3 text-white">
          <div className="font-bold mb-1">Reasoning:</div>
          <div className="text-sm">{recommendation.reasoning}</div>
        </div>
        {recommendation.vs3bet && (
          <div className="bg-green-700 rounded-lg p-3 text-white">
            <div className="font-bold mb-1">If Facing 3-bet:</div>
            <div className="text-sm">{recommendation.vs3bet}</div>
          </div>
        )}
      </div>
    </Card>
  );
}
