import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spade, Calculator, BarChart3, Settings } from "lucide-react";
import CardSelector from "@/components/poker/card-selector";
import PositionSelector from "@/components/poker/position-selector";
import HandAnalysis from "@/components/poker/hand-analysis";
import StartingHandChart from "@/components/poker/starting-hand-chart";
import ActionRecommendation from "@/components/poker/action-recommendation";
import HandRangeAnalyzer from "@/components/poker/hand-range-analyzer";
import { analyzeHand, getRecommendation } from "@/lib/poker-engine";
import type { Card as PokerCard } from "@shared/schema";

export default function PokerHelper() {
  const [selectedCards, setSelectedCards] = useState<PokerCard[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>("UTG");
  
  const analysis = selectedCards.length === 2 ? analyzeHand(selectedCards) : null;
  const recommendation = analysis ? getRecommendation(selectedCards, selectedPosition) : null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-green-800 border-b border-green-600 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full p-2 poker-chip">
              <Spade className="text-green-800 h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-white">PokerHelper</h1>
            <span className="text-sm text-green-100 hidden sm:inline">Texas Hold'em Strategy</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="secondary" size="sm" className="bg-green-600 hover:bg-green-500">
              <BarChart3 className="h-4 w-4 mr-1" />
              Charts
            </Button>
            <Button variant="secondary" size="sm" className="bg-green-600 hover:bg-green-500">
              <Calculator className="h-4 w-4 mr-1" />
              Odds
            </Button>
            <Button variant="secondary" size="sm" className="bg-green-600 hover:bg-green-500">
              <Settings className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Card Selection & Position */}
          <div className="lg:col-span-1 space-y-6">
            <CardSelector 
              selectedCards={selectedCards}
              onCardsChange={setSelectedCards}
            />
            <PositionSelector 
              selectedPosition={selectedPosition}
              onPositionChange={setSelectedPosition}
            />
          </div>

          {/* Middle Column: Analysis & Recommendations */}
          <div className="lg:col-span-1 space-y-6">
            <HandAnalysis analysis={analysis} />
            <ActionRecommendation recommendation={recommendation} />
          </div>

          {/* Right Column: Charts & Reference */}
          <div className="lg:col-span-1 space-y-6">
            <StartingHandChart selectedPosition={selectedPosition} />
            <HandRangeAnalyzer selectedPosition={selectedPosition} />
            
            {/* Quick Stats */}
            <Card className="bg-green-800 border-green-600 p-6">
              <h2 className="text-xl font-bold mb-4 text-white flex items-center">
                <BarChart3 className="text-green-400 mr-2" />
                Quick Stats
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-green-700 rounded text-white">
                  <span className="text-sm">VPIP Recommended:</span>
                  <span className="font-bold">18-22%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-700 rounded text-white">
                  <span className="text-sm">PFR Recommended:</span>
                  <span className="font-bold">15-19%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-700 rounded text-white">
                  <span className="text-sm">3-bet Range:</span>
                  <span className="font-bold">4-6%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-700 rounded text-white">
                  <span className="text-sm">Fold to 3-bet:</span>
                  <span className="font-bold">65-75%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 bg-green-800 rounded-xl p-6 border border-green-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
            <div>
              <h3 className="font-bold mb-3 text-yellow-400">Strategy Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">BSS Starting Hand Charts</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Position Play Guide</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Pre-flop Strategy</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Hand Range Analysis</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 text-yellow-400">Tools</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Odds Calculator</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Equity Calculator</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Range vs Range</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Hand History Analyzer</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 text-yellow-400">About</h3>
              <p className="text-sm mb-4">PokerHelper implements BSS (Big Stack Strategy) recommendations based on established poker strategy principles from PokerStrategy.com.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
