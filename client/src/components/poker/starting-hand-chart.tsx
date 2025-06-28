import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table } from "lucide-react";
import { getStartingHandChart } from "@/lib/poker-data";

interface StartingHandChartProps {
  selectedPosition: string;
}

export default function StartingHandChart({ selectedPosition }: StartingHandChartProps) {
  const [activeChartPosition, setActiveChartPosition] = useState(selectedPosition);
  
  const positions = ["UTG", "MP", "CO", "BTN", "SB", "BB"];
  const chartData = getStartingHandChart(activeChartPosition);

  const getHandColor = (hand: string): string => {
    if (chartData.openHands.includes(hand)) return 'bg-green-500 text-white';
    if (chartData.sometimesHands.includes(hand)) return 'bg-yellow-500 text-black';
    return 'bg-red-500 text-white';
  };

  // Generate hand matrix
  const ranks = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
  const handMatrix = ranks.map((rank1, i) =>
    ranks.map((rank2, j) => {
      if (i === j) return rank1 + rank1; // Pocket pairs
      if (i < j) return rank1 + rank2 + "s"; // Suited
      return rank2 + rank1 + "o"; // Offsuit
    })
  );

  return (
    <Card className="bg-green-800 border-green-600 p-6">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center">
        <Table className="text-blue-400 mr-2" />
        Starting Hand Chart
      </h2>
      
      {/* Position Tabs */}
      <div className="flex flex-wrap gap-1 mb-4">
        {positions.map((position) => (
          <Button
            key={position}
            onClick={() => setActiveChartPosition(position)}
            className={`px-3 py-1 text-xs font-bold transition-colors ${
              activeChartPosition === position 
                ? 'bg-red-600 text-white' 
                : 'bg-green-600 hover:bg-green-500 text-white'
            }`}
            size="sm"
          >
            {position}
          </Button>
        ))}
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-13 gap-1 text-xs mb-4">
        {handMatrix.map((row, i) =>
          row.map((hand, j) => (
            <div
              key={`${i}-${j}`}
              className={`${getHandColor(hand)} rounded aspect-square flex items-center justify-center font-bold text-xs`}
            >
              {hand}
            </div>
          ))
        )}
      </div>
      
      {/* Chart Legend */}
      <div className="grid grid-cols-3 gap-2 text-xs text-white">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
          <span>Always Open</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
          <span>Sometimes</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
          <span>Fold</span>
        </div>
      </div>

      {/* Range Info */}
      <div className="mt-4 p-3 bg-green-700 rounded-lg text-white">
        <div className="text-sm">
          <strong>{activeChartPosition} Range:</strong> {chartData.percentage}% ({chartData.combos} combos)
        </div>
      </div>
    </Card>
  );
}
