import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";
import type { HandAnalysis as HandAnalysisType } from "@shared/schema";

interface HandAnalysisProps {
  analysis: HandAnalysisType | null;
}

export default function HandAnalysis({ analysis }: HandAnalysisProps) {
  if (!analysis) {
    return (
      <Card className="bg-green-800 border-green-600 p-6">
        <h2 className="text-xl font-bold mb-4 text-white flex items-center">
          <BarChart3 className="text-green-400 mr-2" />
          Hand Analysis
        </h2>
        <div className="text-center text-gray-400 py-8">
          Select two cards to see analysis
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-green-800 border-green-600 p-6">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center">
        <BarChart3 className="text-green-400 mr-2" />
        Hand Analysis
      </h2>
      
      {/* Hand Strength Meter */}
      <div className="mb-6">
        <div className="flex justify-between mb-2 text-white">
          <span className="text-sm">Hand Strength</span>
          <span className="text-sm font-bold">{Math.round(analysis.handStrength)}%</span>
        </div>
        <Progress 
          value={analysis.handStrength} 
          className="h-3"
        />
      </div>

      {/* Hand Classification */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-green-700 rounded-lg p-3 text-center text-white">
          <div className="text-sm opacity-75">Hand Type</div>
          <div className="font-bold text-lg">{analysis.handType}</div>
        </div>
        <div className="bg-green-700 rounded-lg p-3 text-center text-white">
          <div className="text-sm opacity-75">BSS Rank</div>
          <div className="font-bold text-lg">{analysis.bssRank}</div>
        </div>
      </div>

      {/* Odds Display */}
      <div className="bg-green-700 rounded-lg p-4">
        <h3 className="font-bold mb-3 text-white">Pre-flop Odds</h3>
        <div className="space-y-2 text-sm text-white">
          <div className="flex justify-between">
            <span>vs Random Hand:</span>
            <span className="font-bold">{analysis.odds.vsRandom.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span>vs Premium Range:</span>
            <span className="font-bold">{analysis.odds.vsPremium.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Expected Value:</span>
            <span className={`font-bold ${analysis.expectedValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {analysis.expectedValue >= 0 ? '+' : ''}{analysis.expectedValue.toFixed(1)} BB
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
