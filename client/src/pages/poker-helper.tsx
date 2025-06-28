import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spade, Calculator, BarChart3, Settings, BookOpen, X } from "lucide-react";
import CardSelector from "@/components/poker/card-selector";
import PositionSelector from "@/components/poker/position-selector";
import HandAnalysis from "@/components/poker/hand-analysis";
import StartingHandChart from "@/components/poker/starting-hand-chart";
import ActionRecommendation from "@/components/poker/action-recommendation";
import HandRangeAnalyzer from "@/components/poker/hand-range-analyzer";
import PokerGuide from "@/components/poker/poker-guide";
import { analyzeHand, getRecommendation } from "@/lib/poker-engine";
import type { Card as PokerCard } from "@shared/schema";

export default function PokerHelper() {
  const [selectedCards, setSelectedCards] = useState<PokerCard[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>("UTG");
  const [showGuide, setShowGuide] = useState(false);
  
  const analysis = selectedCards.length === 2 ? analyzeHand(selectedCards) : null;
  const recommendation = analysis ? getRecommendation(selectedCards, selectedPosition) : null;

  return (
    <div className="min-h-screen no-zoom">
      {/* Header */}
      <header className="bg-green-800 border-b border-green-600 px-3 py-2 sm:px-4 sm:py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full p-1.5 sm:p-2 poker-chip">
              <Spade className="text-green-800 h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">PokerHelper</h1>
              <span className="text-xs text-green-100 sm:hidden">Texas Hold'em Strategy</span>
            </div>
            <span className="text-sm text-green-100 hidden sm:inline">Texas Hold'em Strategy</span>
          </div>
          <nav className="flex items-center space-x-1 sm:space-x-4">
            <Button 
              onClick={() => setShowGuide(!showGuide)}
              variant="secondary" 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-500 mobile-button mobile-touch-target text-white border-blue-500"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Guide</span>
            </Button>
            <Button variant="secondary" size="sm" className="bg-green-600 hover:bg-green-500 mobile-button mobile-touch-target hidden sm:flex">
              <BarChart3 className="h-4 w-4 mr-1" />
              Charts
            </Button>
            <Button variant="secondary" size="sm" className="bg-green-600 hover:bg-green-500 mobile-button mobile-touch-target hidden sm:flex">
              <Calculator className="h-4 w-4 mr-1" />
              Odds
            </Button>
            <Button variant="secondary" size="sm" className="bg-green-600 hover:bg-green-500 mobile-button mobile-touch-target">
              <Settings className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 py-4 sm:px-4 sm:py-6 mobile-scrollable">
        {/* Welcome & Tutorial Section */}
        <div className="mb-6 space-y-4">
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-4 sm:p-6 border border-blue-600">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Welcome to PokerHelper!</h2>
            <p className="text-blue-100 text-sm sm:text-base mb-4">
              Master Texas Hold'em with our comprehensive strategy guide, hand analysis, and position-based recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => setShowGuide(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all mobile-button mobile-touch-target flex-1"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Open Strategy Guide
              </Button>
              <div className="flex-1 text-xs sm:text-sm text-blue-200 self-center">
                📚 Learn basics, positions, hand rankings, betting strategy & pro tips
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Card Selection & Position */}
          <div className="md:col-span-2 lg:col-span-1 space-y-4 sm:space-y-6">
            <CardSelector 
              selectedCards={selectedCards}
              onCardsChange={setSelectedCards}
            />
            <PositionSelector 
              selectedPosition={selectedPosition}
              onPositionChange={setSelectedPosition}
            />
          </div>

          {/* Analysis & Recommendations */}
          <div className="md:col-span-2 lg:col-span-1 space-y-4 sm:space-y-6">
            <HandAnalysis analysis={analysis} />
            <ActionRecommendation recommendation={recommendation} />
          </div>

          {/* Charts & Reference */}
          <div className="md:col-span-2 lg:col-span-1 space-y-4 sm:space-y-6">
            <StartingHandChart selectedPosition={selectedPosition} />
            <HandRangeAnalyzer selectedPosition={selectedPosition} />
            
            {/* Quick Stats - Hidden on mobile for better UX */}
            <Card className="bg-green-800 border-green-600 p-4 sm:p-6 hidden sm:block">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white flex items-center">
                <BarChart3 className="text-green-400 mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                Quick Stats
              </h2>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center p-2 bg-green-700 rounded text-white text-sm">
                  <span>VPIP Recommended:</span>
                  <span className="font-bold">18-22%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-700 rounded text-white text-sm">
                  <span>PFR Recommended:</span>
                  <span className="font-bold">15-19%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-700 rounded text-white text-sm">
                  <span>3-bet Range:</span>
                  <span className="font-bold">4-6%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-700 rounded text-white text-sm">
                  <span>Fold to 3-bet:</span>
                  <span className="font-bold">65-75%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Guide Modal Overlay */}
        {showGuide && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-start justify-center p-4 mobile-scrollable overflow-y-auto">
            <div className="relative w-full max-w-4xl mt-4 mb-8">
              <Button
                onClick={() => setShowGuide(false)}
                className="absolute -top-2 -right-2 z-10 bg-red-600 hover:bg-red-500 text-white rounded-full p-2 mobile-touch-target"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
              <PokerGuide />
            </div>
          </div>
        )}

        {/* Footer - Hidden on mobile for better UX */}
        <footer className="hidden sm:block mt-8 sm:mt-12 bg-green-800 rounded-xl p-4 sm:p-6 border border-green-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-white">
            <div>
              <h3 className="font-bold mb-3 text-yellow-400 text-sm sm:text-base">Strategy Resources</h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><button onClick={() => setShowGuide(true)} className="hover:text-yellow-400 transition-colors text-left">BSS Starting Hand Charts</button></li>
                <li><button onClick={() => setShowGuide(true)} className="hover:text-yellow-400 transition-colors text-left">Position Play Guide</button></li>
                <li><button onClick={() => setShowGuide(true)} className="hover:text-yellow-400 transition-colors text-left">Pre-flop Strategy</button></li>
                <li><button onClick={() => setShowGuide(true)} className="hover:text-yellow-400 transition-colors text-left">Hand Range Analysis</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 text-yellow-400 text-sm sm:text-base">Features</h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><span className="text-green-200">✓ Hand Analysis</span></li>
                <li><span className="text-green-200">✓ Position Strategy</span></li>
                <li><span className="text-green-200">✓ Starting Hand Charts</span></li>
                <li><span className="text-green-200">✓ Action Recommendations</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 text-yellow-400 text-sm sm:text-base">About</h3>
              <p className="text-xs sm:text-sm mb-4">PokerHelper implements BSS (Big Stack Strategy) recommendations based on established poker strategy principles. Perfect for beginners and intermediate players.</p>
              <Button 
                onClick={() => setShowGuide(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white border-blue-500 text-xs"
                size="sm"
              >
                <BookOpen className="h-3 w-3 mr-1" />
                Learn More
              </Button>
            </div>
          </div>
        </footer>

        {/* Mobile-specific call-to-action */}
        <div className="sm:hidden mt-6 text-center">
          <Button 
            onClick={() => setShowGuide(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white border-blue-500 mobile-button mobile-touch-target"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Open Strategy Guide
          </Button>
        </div>
      </main>
    </div>
  );
}
