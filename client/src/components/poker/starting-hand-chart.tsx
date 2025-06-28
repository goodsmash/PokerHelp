import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, Info, HelpCircle } from "lucide-react";
import { getStartingHandChart } from "@/lib/poker-data";

interface StartingHandChartProps {
  selectedPosition: string;
}

export default function StartingHandChart({ selectedPosition }: StartingHandChartProps) {
  const [activeChartPosition, setActiveChartPosition] = useState(selectedPosition);
  const [showGuide, setShowGuide] = useState(false);
  
  const positions = [
    { code: "UTG", name: "Under the Gun", color: "bg-red-600" },
    { code: "MP", name: "Middle Position", color: "bg-orange-600" },
    { code: "CO", name: "Cutoff", color: "bg-yellow-600" },
    { code: "BTN", name: "Button", color: "bg-green-600" },
    { code: "SB", name: "Small Blind", color: "bg-blue-600" },
    { code: "BB", name: "Big Blind", color: "bg-purple-600" }
  ];
  
  const chartData = getStartingHandChart(activeChartPosition);

  const getHandColor = (hand: string): string => {
    if (chartData.openHands.includes(hand)) return 'bg-green-500 hover:bg-green-400 text-white border-green-400';
    if (chartData.sometimesHands.includes(hand)) return 'bg-yellow-500 hover:bg-yellow-400 text-black border-yellow-400';
    return 'bg-gray-600 hover:bg-gray-500 text-gray-300 border-gray-500';
  };

  const getHandStrength = (hand: string): string => {
    if (chartData.openHands.includes(hand)) return 'RAISE';
    if (chartData.sometimesHands.includes(hand)) return 'CALL';
    return 'FOLD';
  };

  // Generate hand matrix - proper poker chart layout
  const ranks = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
  const handMatrix = ranks.map((rank1, i) =>
    ranks.map((rank2, j) => {
      if (i === j) return rank1 + rank1; // Pocket pairs on diagonal
      if (i < j) return rank1 + rank2 + "s"; // Suited above diagonal
      return rank2 + rank1 + "o"; // Offsuit below diagonal
    })
  );

  return (
    <Card className="bg-green-800 border-green-600 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
          <Table className="text-blue-400 mr-2 h-5 w-5 sm:h-6 sm:w-6" />
          Starting Hand Chart
        </h2>
        <Button
          onClick={() => setShowGuide(!showGuide)}
          variant="outline"
          size="sm"
          className="bg-blue-600 hover:bg-blue-500 text-white border-blue-500"
        >
          <HelpCircle className="h-4 w-4 mr-1" />
          Guide
        </Button>
      </div>

      {/* Guide Section */}
      {showGuide && (
        <div className="mb-4 p-4 bg-blue-900 rounded-lg border border-blue-600">
          <h3 className="font-bold text-blue-200 mb-2 flex items-center">
            <Info className="h-4 w-4 mr-1" />
            How to Read This Chart
          </h3>
          <div className="text-sm text-blue-100 space-y-2">
            <p><strong>Diagonal (AA, KK, etc.):</strong> Pocket pairs</p>
            <p><strong>Above diagonal (AKs, etc.):</strong> Suited cards</p>
            <p><strong>Below diagonal (AKo, etc.):</strong> Offsuit cards</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className="bg-green-500 text-white">RAISE - Open for value</Badge>
              <Badge className="bg-yellow-500 text-black">CALL - Situational</Badge>
              <Badge className="bg-gray-600 text-white">FOLD - Too weak</Badge>
            </div>
          </div>
        </div>
      )}
      
      {/* Position Selector */}
      <div className="mb-4">
        <div className="text-sm text-white mb-2 font-medium">Select Position:</div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {positions.map((position) => (
            <Button
              key={position.code}
              onClick={() => setActiveChartPosition(position.code)}
              className={`p-2 text-xs font-bold transition-all mobile-button mobile-touch-target ${
                activeChartPosition === position.code 
                  ? 'bg-white text-black border-2 border-yellow-400 shadow-lg' 
                  : `${position.color} hover:opacity-80 text-white`
              }`}
              size="sm"
            >
              <div className="text-center">
                <div>{position.code}</div>
                <div className="text-xs opacity-75 hidden sm:block">{position.name.split(' ')[0]}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Interactive Hand Matrix */}
      <div className="mb-4">
        <div className="text-sm text-white mb-2 font-medium">
          {activeChartPosition} Opening Range ({chartData.percentage}% - {chartData.combos} combos)
        </div>
        <div className="mobile-card-selector overflow-x-auto">
          <div className="grid grid-cols-13 gap-1 min-w-max">
            {handMatrix.map((row, i) =>
              row.map((hand, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`${getHandColor(hand)} rounded aspect-square flex flex-col items-center justify-center font-bold text-xs sm:text-sm border-2 transition-all cursor-pointer hover:scale-105 mobile-touch-target`}
                  title={`${hand} - ${getHandStrength(hand)}`}
                >
                  <div className="text-xs font-bold">{hand}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Enhanced Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className="bg-green-700 rounded-lg p-3 text-center">
          <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-1"></div>
          <div className="font-bold text-green-200">RAISE</div>
          <div className="text-xs text-green-100">{chartData.openHands.length} hands</div>
        </div>
        <div className="bg-yellow-700 rounded-lg p-3 text-center">
          <div className="w-4 h-4 bg-yellow-500 rounded mx-auto mb-1"></div>
          <div className="font-bold text-yellow-200">CALL</div>
          <div className="text-xs text-yellow-100">{chartData.sometimesHands.length} hands</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="w-4 h-4 bg-gray-600 rounded mx-auto mb-1"></div>
          <div className="font-bold text-gray-200">FOLD</div>
          <div className="text-xs text-gray-300">Rest</div>
        </div>
      </div>

      {/* Position Strategy Tips */}
      <div className="mt-4 p-3 bg-green-700 rounded-lg">
        <div className="font-bold text-green-200 mb-2">{activeChartPosition} Strategy:</div>
        <div className="text-sm text-green-100">
          {activeChartPosition === "UTG" && "Play very tight. Only premium hands that can handle action from 8 players behind you."}
          {activeChartPosition === "MP" && "Still relatively tight. Add some medium pairs and suited broadways."}
          {activeChartPosition === "CO" && "Start widening your range. Good position allows more speculative hands."}
          {activeChartPosition === "BTN" && "Widest opening range. Use position advantage to play many hands profitably."}
          {activeChartPosition === "SB" && "Wide but not as wide as button due to being out of position post-flop."}
          {activeChartPosition === "BB" && "Defend based on pot odds. Generally 60-80% vs late position opens."}
        </div>
      </div>
    </Card>
  );
}
