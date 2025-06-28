import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Layers } from "lucide-react";
import { getPositionRange } from "@/lib/poker-data";

interface HandRangeAnalyzerProps {
  selectedPosition: string;
}

export default function HandRangeAnalyzer({ selectedPosition }: HandRangeAnalyzerProps) {
  const rangeData = getPositionRange(selectedPosition);

  return (
    <Card className="bg-green-800 border-green-600 p-6">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center">
        <Layers className="text-purple-400 mr-2" />
        Hand Range Analysis
      </h2>
      
      {/* Range Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-green-700 rounded-lg p-3 text-center text-white">
          <div className="text-sm opacity-75">Range %</div>
          <div className="font-bold text-lg">{rangeData.percentage}%</div>
        </div>
        <div className="bg-green-700 rounded-lg p-3 text-center text-white">
          <div className="text-sm opacity-75">Combos</div>
          <div className="font-bold text-lg">{rangeData.combos}</div>
        </div>
      </div>

      {/* Range Breakdown */}
      <div className="space-y-3">
        <div className="bg-green-700 rounded-lg p-3 text-white">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">Pocket Pairs</span>
            <span className="text-sm">{rangeData.breakdown.pairs}</span>
          </div>
          <Progress value={35} className="h-2" />
        </div>
        <div className="bg-green-700 rounded-lg p-3 text-white">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">Suited Cards</span>
            <span className="text-sm">{rangeData.breakdown.suited}</span>
          </div>
          <Progress value={45} className="h-2" />
        </div>
        <div className="bg-green-700 rounded-lg p-3 text-white">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">Offsuit</span>
            <span className="text-sm">{rangeData.breakdown.offsuit}</span>
          </div>
          <Progress value={20} className="h-2" />
        </div>
      </div>

      {/* Position Strategy Notes */}
      <div className="mt-4 p-3 bg-green-700 rounded-lg text-white">
        <div className="text-sm">
          <strong>{selectedPosition} Strategy:</strong>
          <br />
          {rangeData.strategy}
        </div>
      </div>
    </Card>
  );
}
