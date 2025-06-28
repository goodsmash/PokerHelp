import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Target, Users, TrendingUp, Lightbulb, Award } from "lucide-react";

export default function PokerGuide() {
  const [activeGuide, setActiveGuide] = useState("basics");

  return (
    <Card className="bg-green-800 border-green-600 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
          <BookOpen className="text-yellow-400 mr-2 h-5 w-5 sm:h-6 sm:w-6" />
          Poker Strategy Guide
        </h2>
      </div>

      <Tabs value={activeGuide} onValueChange={setActiveGuide} className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-4 bg-green-700">
          <TabsTrigger value="basics" className="text-xs">Basics</TabsTrigger>
          <TabsTrigger value="positions" className="text-xs">Positions</TabsTrigger>
          <TabsTrigger value="hands" className="text-xs">Hands</TabsTrigger>
          <TabsTrigger value="betting" className="text-xs">Betting</TabsTrigger>
          <TabsTrigger value="strategy" className="text-xs">Strategy</TabsTrigger>
          <TabsTrigger value="tips" className="text-xs">Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-4">
          <div className="bg-blue-900 rounded-lg p-4 border border-blue-600">
            <h3 className="font-bold text-blue-200 mb-3 flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Texas Hold'em Basics
            </h3>
            <div className="text-sm text-blue-100 space-y-3">
              <div>
                <strong className="text-blue-200">Goal:</strong> Make the best 5-card hand using 2 hole cards + 5 community cards
              </div>
              <div>
                <strong className="text-blue-200">Betting Rounds:</strong>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Pre-flop (2 hole cards)</li>
                  <li>Flop (3 community cards)</li>
                  <li>Turn (1 more card)</li>
                  <li>River (final card)</li>
                </ol>
              </div>
              <div>
                <strong className="text-blue-200">Actions:</strong> Fold, Check, Call, Bet, Raise
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <div className="bg-purple-900 rounded-lg p-4 border border-purple-600">
            <h3 className="font-bold text-purple-200 mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Table Positions (9-handed)
            </h3>
            <div className="space-y-3">
              {[
                { pos: "UTG", name: "Under the Gun", desc: "First to act. Play very tight - only premium hands.", range: "11-13%", color: "bg-red-600" },
                { pos: "MP", name: "Middle Position", desc: "Still early. Add some medium pairs and suited cards.", range: "15-18%", color: "bg-orange-600" },
                { pos: "CO", name: "Cutoff", desc: "Late position. Start stealing blinds with wider range.", range: "25-30%", color: "bg-yellow-600" },
                { pos: "BTN", name: "Button", desc: "Best position. Act last on all streets except pre-flop.", range: "40-50%", color: "bg-green-600" },
                { pos: "SB", name: "Small Blind", desc: "Out of position but getting pot odds.", range: "30-40%", color: "bg-blue-600" },
                { pos: "BB", name: "Big Blind", desc: "Defend based on pot odds and opponent's range.", range: "Varies", color: "bg-purple-600" }
              ].map((position) => (
                <div key={position.pos} className="bg-purple-800 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Badge className={`${position.color} text-white mr-2`}>{position.pos}</Badge>
                      <span className="font-medium text-purple-100">{position.name}</span>
                    </div>
                    <span className="text-xs text-purple-300">{position.range}</span>
                  </div>
                  <p className="text-sm text-purple-200">{position.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hands" className="space-y-4">
          <div className="bg-orange-900 rounded-lg p-4 border border-orange-600">
            <h3 className="font-bold text-orange-200 mb-3 flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Hand Rankings & Starting Hands
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-orange-200 mb-2">Hand Rankings (High to Low):</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {[
                    "Royal Flush (A♠ K♠ Q♠ J♠ T♠)",
                    "Straight Flush (5♥ 6♥ 7♥ 8♥ 9♥)",
                    "Four of a Kind (A♠ A♥ A♦ A♣ K♠)",
                    "Full House (K♠ K♥ K♦ Q♠ Q♥)",
                    "Flush (A♠ J♠ 9♠ 6♠ 3♠)",
                    "Straight (5♠ 6♥ 7♦ 8♠ 9♥)",
                    "Three of a Kind (Q♠ Q♥ Q♦ A♠ 5♥)",
                    "Two Pair (K♠ K♥ 7♦ 7♠ A♥)",
                    "One Pair (A♠ A♥ K♦ Q♠ J♥)",
                    "High Card (A♠ K♥ Q♦ J♠ 9♥)"
                  ].map((hand, index) => (
                    <div key={index} className="bg-orange-800 rounded p-2 text-orange-100">
                      <span className="font-medium">{index + 1}.</span> {hand}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-orange-200 mb-2">Starting Hand Groups:</h4>
                <div className="space-y-2">
                  <div className="bg-green-700 rounded p-2">
                    <strong className="text-green-200">Premium (Group 1):</strong>
                    <span className="text-green-100 ml-2">AA, KK, QQ, JJ, AKs, AKo</span>
                  </div>
                  <div className="bg-yellow-700 rounded p-2">
                    <strong className="text-yellow-200">Strong (Group 2):</strong>
                    <span className="text-yellow-100 ml-2">TT, 99, AQs, AJs, AQo, KQs</span>
                  </div>
                  <div className="bg-blue-700 rounded p-2">
                    <strong className="text-blue-200">Playable (Group 3):</strong>
                    <span className="text-blue-100 ml-2">88, 77, ATs, A9s, AJo, KJs, QJs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="betting" className="space-y-4">
          <div className="bg-red-900 rounded-lg p-4 border border-red-600">
            <h3 className="font-bold text-red-200 mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Betting Strategy
            </h3>
            <div className="space-y-3">
              <div className="bg-red-800 rounded p-3">
                <h4 className="font-medium text-red-200 mb-2">Pre-flop Sizing:</h4>
                <ul className="text-sm text-red-100 space-y-1">
                  <li><strong>Standard Open:</strong> 2.5-3x BB</li>
                  <li><strong>3-bet:</strong> 3x the original raise</li>
                  <li><strong>4-bet:</strong> 2.2-2.5x the 3-bet</li>
                </ul>
              </div>
              
              <div className="bg-red-800 rounded p-3">
                <h4 className="font-medium text-red-200 mb-2">Post-flop Sizing:</h4>
                <ul className="text-sm text-red-100 space-y-1">
                  <li><strong>C-bet:</strong> 1/2 to 3/4 pot</li>
                  <li><strong>Value bet:</strong> 1/2 to full pot</li>
                  <li><strong>Bluff:</strong> 1/2 to 3/4 pot</li>
                </ul>
              </div>

              <div className="bg-red-800 rounded p-3">
                <h4 className="font-medium text-red-200 mb-2">Key Concepts:</h4>
                <ul className="text-sm text-red-100 space-y-1">
                  <li><strong>Pot Odds:</strong> Risk vs. Reward ratio</li>
                  <li><strong>Implied Odds:</strong> Future betting potential</li>
                  <li><strong>Fold Equity:</strong> Chance opponent folds</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <div className="bg-green-900 rounded-lg p-4 border border-green-600">
            <h3 className="font-bold text-green-200 mb-3 flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Core Strategy Principles
            </h3>
            <div className="space-y-3">
              {[
                {
                  title: "Tight-Aggressive (TAG)",
                  desc: "Play few hands but play them aggressively. Recommended for beginners.",
                  stats: "VPIP: 18-22%, PFR: 15-19%"
                },
                {
                  title: "Position Awareness",
                  desc: "Play tighter in early position, wider in late position. Position is power.",
                  stats: "BTN: 45% range, UTG: 12% range"
                },
                {
                  title: "Hand Selection",
                  desc: "Focus on premium hands early, speculative hands in position.",
                  stats: "Premium: AA-TT, AK-AQ"
                },
                {
                  title: "Aggression",
                  desc: "Betting and raising puts pressure on opponents and builds pots.",
                  stats: "Aggression Factor: 2.5-4.0"
                }
              ].map((concept, index) => (
                <div key={index} className="bg-green-800 rounded p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-green-200">{concept.title}</h4>
                    <Badge variant="outline" className="text-xs border-green-400 text-green-300">
                      {concept.stats}
                    </Badge>
                  </div>
                  <p className="text-sm text-green-100">{concept.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tips" className="space-y-4">
          <div className="bg-yellow-900 rounded-lg p-4 border border-yellow-600">
            <h3 className="font-bold text-yellow-200 mb-3 flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              Pro Tips & Common Mistakes
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-yellow-200 mb-2">✅ Do:</h4>
                <ul className="text-sm text-yellow-100 space-y-1 list-disc list-inside">
                  <li>Study position-based starting hand charts</li>
                  <li>Bet for value with strong hands</li>
                  <li>Use position to your advantage</li>
                  <li>Pay attention to opponent tendencies</li>
                  <li>Manage your bankroll properly</li>
                  <li>Stay patient and disciplined</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-yellow-200 mb-2">❌ Don't:</h4>
                <ul className="text-sm text-yellow-100 space-y-1 list-disc list-inside">
                  <li>Play too many hands (loose play)</li>
                  <li>Call with weak hands out of position</li>
                  <li>Chase draws without proper odds</li>
                  <li>Play emotionally (tilt)</li>
                  <li>Ignore position when making decisions</li>
                  <li>Bet without a clear reason</li>
                </ul>
              </div>

              <div className="bg-yellow-800 rounded p-3">
                <h4 className="font-medium text-yellow-200 mb-2">Quick Stats to Remember:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-yellow-100">
                  <div>VPIP: 18-22%</div>
                  <div>PFR: 15-19%</div>
                  <div>3-bet: 4-6%</div>
                  <div>Fold to 3-bet: 65-75%</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}