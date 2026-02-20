import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Users, 
  Play, 
  Pause,
  RotateCcw,
  TrendingUp,
  Target,
  Award,
  Clock,
  ChevronRight
} from 'lucide-react';
import CardSelector from '@/components/poker/card-selector';
import { 
  AIPlayer, 
  AI_PERSONALITIES, 
  getAIDecision,
  calculateHandStrength 
} from '@/lib/ai-poker-engine';
import type { Card as PokerCard } from '@shared/schema';

interface AIPracticeModeProps {
  onClose: () => void;
}

export default function AIPracticeMode({ onClose }: AIPracticeModeProps) {
  // Game State
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'hand-complete'>('setup');
  const [selectedAI, setSelectedAI] = useState<AIType>('balanced');
  const [playerCards, setPlayerCards] = useState<PokerCard[]>([]);
  const [aiCards, setAiCards] = useState<PokerCard[]>([]);
  const [communityCards, setCommunityCards] = useState<PokerCard[]>([]);
  const [pot, setPot] = useState(100);
  const [playerChips, setPlayerChips] = useState(1000);
  const [aiChips, setAiChips] = useState(1000);
  const [currentBet, setCurrentBet] = useState(10);
  const [street, setStreet] = useState<'preflop' | 'flop' | 'turn' | 'river'>('preflop');
  const [handHistory, setHandHistory] = useState<string[]>([]);
  const [stats, setStats] = useState({ handsPlayed: 0, handsWon: 0, profit: 0 });

  // Generate random cards
  const generateRandomCard = useCallback((): PokerCard => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const values: Record<string, number> = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
      '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };
    
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    
    return { suit, rank, value: values[rank] };
  }, []);

  const dealCards = useCallback(() => {
    const player = [generateRandomCard(), generateRandomCard()];
    const ai = [generateRandomCard(), generateRandomCard()];
    setPlayerCards(player);
    setAiCards(ai);
    setCommunityCards([]);
    setStreet('preflop');
    setCurrentBet(10);
    setPot(20); // Blinds
    
    // AI makes decision
    const aiStrength = calculateHandStrength(ai, []);
    const aiDecision = getAIDecision(
      selectedAI,
      aiStrength,
      'BTN', // Button position
      20, // Pot odds
      10, // To call
      aiChips,
      []
    );
    
    setHandHistory(prev => [
      ...prev,
      `AI (${AI_PERSONALITIES[selectedAI].name}): ${aiDecision.action.toUpperCase()}${aiDecision.amount ? ` $${aiDecision.amount}` : ''}`,
      `AI Reasoning: ${aiDecision.reasoning}`
    ]);
  }, [generateRandomCard, selectedAI, aiChips]);

  const startGame = () => {
    setGameState('playing');
    dealCards();
  };

  const handlePlayerAction = (action: 'fold' | 'call' | 'raise', amount?: number) => {
    const actionStr = action.toUpperCase();
    setHandHistory(prev => [...prev, `You: ${actionStr}${amount ? ` $${amount}` : ''}`]);
    
    if (action === 'fold') {
      setAiChips(prev => prev + pot);
      setStats(prev => ({ ...prev, handsPlayed: prev.handsPlayed + 1 }));
      setGameState('hand-complete');
    } else if (action === 'call') {
      setPlayerChips(prev => prev - currentBet);
      setPot(prev => prev + currentBet);
      // Move to next street
      advanceStreet();
    } else if (action === 'raise' && amount) {
      setPlayerChips(prev => prev - amount);
      setPot(prev => prev + amount);
      setCurrentBet(amount);
    }
  };

  const advanceStreet = () => {
    if (street === 'preflop') {
      setStreet('flop');
      setCommunityCards([generateRandomCard(), generateRandomCard(), generateRandomCard()]);
    } else if (street === 'flop') {
      setStreet('turn');
      setCommunityCards(prev => [...prev, generateRandomCard()]);
    } else if (street === 'turn') {
      setStreet('river');
      setCommunityCards(prev => [...prev, generateRandomCard()]);
    } else {
      // Showdown
      showdown();
    }
  };

  const showdown = () => {
    const playerStrength = calculateHandStrength(playerCards, communityCards);
    const aiStrength = calculateHandStrength(aiCards, communityCards);
    
    let winner: 'player' | 'ai';
    let result: string;
    
    if (playerStrength > aiStrength) {
      winner = 'player';
      setPlayerChips(prev => prev + pot);
      result = `You win! ${playerStrength.toFixed(0)} vs ${aiStrength.toFixed(0)}`;
      setStats(prev => ({ 
        ...prev, 
        handsPlayed: prev.handsPlayed + 1,
        handsWon: prev.handsWon + 1,
        profit: prev.profit + pot
      }));
    } else if (aiStrength > playerStrength) {
      winner = 'ai';
      setAiChips(prev => prev + pot);
      result = `AI wins! ${aiStrength.toFixed(0)} vs ${playerStrength.toFixed(0)}`;
      setStats(prev => ({ 
        ...prev, 
        handsPlayed: prev.handsPlayed + 1,
        profit: prev.profit - pot
      }));
    } else {
      result = "Split pot!";
      setPlayerChips(prev => prev + pot / 2);
      setAiChips(prev => prev + pot / 2);
      setStats(prev => ({ ...prev, handsPlayed: prev.handsPlayed + 1 }));
    }
    
    setHandHistory(prev => [...prev, `Showdown: ${result}`]);
    setGameState('hand-complete');
  };

  const nextHand = () => {
    setGameState('playing');
    dealCards();
  };

  if (gameState === 'setup') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl p-6 m-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-purple-600" />
              <div>
                <h2 className="text-2xl font-bold">AI Practice Mode</h2>
                <p className="text-gray-500">Play against AI opponents</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Select AI Opponent</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(Object.keys(AI_PERSONALITIES) as AIType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedAI(type)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedAI === type 
                        ? 'border-purple-600 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="font-semibold">{AI_PERSONALITIES[type].name}</div>
                    <div className="text-sm text-gray-600">{AI_PERSONALITIES[type].description}</div>
                    <div className="text-xs text-gray-500 mt-1">{AI_PERSONALITIES[type].style}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Starting Chips</h4>
              <div className="flex justify-between text-sm">
                <span>You: 1,000 chips</span>
                <span>AI: 1,000 chips</span>
              </div>
            </div>

            <Button 
              onClick={startGame}
              className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-700"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Playing
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl p-6 m-4 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-bold">AI Practice</h2>
              <p className="text-sm text-gray-500">vs {AI_PERSONALITIES[selectedAI].name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-lg">
              Pot: ${pot}
            </Badge>
            <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">{stats.handsPlayed}</div>
            <div className="text-xs text-gray-600">Hands</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">{stats.handsWon}</div>
            <div className="text-xs text-gray-600">Won</div>
          </div>
          <div className={`p-3 rounded-lg text-center ${stats.profit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-2xl font-bold">{stats.profit >= 0 ? '+' : ''}{stats.profit}</div>
            <div className="text-xs text-gray-600">Profit</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">${playerChips}</div>
            <div className="text-xs text-gray-600">Your Chips</div>
          </div>
        </div>

        {/* Game Area */}
        <div className="space-y-6">
          {/* AI Cards (hidden) */}
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <div className="w-16 h-24 bg-red-600 rounded-lg flex items-center justify-center text-white text-2xl">
                ?
              </div>
              <div className="w-16 h-24 bg-red-600 rounded-lg flex items-center justify-center text-white text-2xl">
                ?
              </div>
            </div>
          </div>

          {/* Community Cards */}
          <div className="flex justify-center space-x-2">
            {communityCards.length === 0 ? (
              <div className="text-gray-400">Community cards coming...</div>
            ) : (
              communityCards.map((card, i) => (
                <div key={i} className="w-16 h-24 bg-white border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-2xl">{card.rank}</span>
                  <span className="text-xl">{card.suit === 'hearts' ? '♥' : card.suit === 'diamonds' ? '♦' : card.suit === 'clubs' ? '♣' : '♠'}</span>
                </div>
              ))
            )}
          </div>

          {/* Your Cards */}
          <div className="flex justify-center">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">Your Hand</div>
              <div className="flex space-x-2">
                {playerCards.map((card, i) => (
                  <div key={i} className="w-20 h-28 bg-white border-2 border-blue-500 rounded-lg flex flex-col items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold">{card.rank}</span>
                    <span className="text-2xl">{card.suit === 'hearts' ? '♥' : card.suit === 'diamonds' ? '♦' : card.suit === 'clubs' ? '♣' : '♠'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Street Indicator */}
          <div className="text-center">
            <Badge className="text-lg capitalize">{street}</Badge>
          </div>

          {/* Actions */}
          {gameState === 'playing' && (
            <div className="flex justify-center space-x-4">
              <Button 
                variant="destructive" 
                onClick={() => handlePlayerAction('fold')}
                className="px-8 py-4 text-lg"
              >
                Fold
              </Button>
              <Button 
                variant="secondary"
                onClick={() => handlePlayerAction('call')}
                className="px-8 py-4 text-lg"
              >
                Call ${currentBet}
              </Button>
              <Button 
                onClick={() => handlePlayerAction('raise', currentBet * 3)}
                className="px-8 py-4 text-lg bg-green-600"
              >
                Raise to ${currentBet * 3}
              </Button>
            </div>
          )}

          {gameState === 'hand-complete' && (
            <div className="text-center">
              <Button 
                onClick={nextHand}
                className="px-8 py-4 text-lg bg-purple-600"
              >
                <RotateCcw className="mr-2" />
                Next Hand
              </Button>
            </div>
          )}

          {/* Hand History */}
          <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-auto">
            <h4 className="font-semibold mb-2">Hand History</h4>
            {handHistory.map((entry, i) => (
              <div key={i} className="text-sm py-1 border-b border-gray-200 last:border-0">
                {entry}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export type AIType = 'tight' | 'loose' | 'aggressive' | 'passive' | 'balanced';
