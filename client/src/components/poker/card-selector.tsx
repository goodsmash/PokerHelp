import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Diamond, Club, Spade, RotateCcw, Shuffle, Star, Grid3X3 } from "lucide-react";
import type { Card as PokerCard } from "@shared/schema";

const suits = [
  { symbol: "♠", icon: Spade, name: "spades", color: "text-black" },
  { symbol: "♥", icon: Heart, name: "hearts", color: "text-red-600" },
  { symbol: "♦", icon: Diamond, name: "diamonds", color: "text-red-600" },
  { symbol: "♣", icon: Club, name: "clubs", color: "text-black" },
];

const ranks = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

// Quick select premium hands
const premiumHands = [
  { name: "Pocket Aces", cards: [{ rank: "A", suit: "♠" }, { rank: "A", suit: "♥" }], tier: "premium" },
  { name: "Pocket Kings", cards: [{ rank: "K", suit: "♠" }, { rank: "K", suit: "♥" }], tier: "premium" },
  { name: "Pocket Queens", cards: [{ rank: "Q", suit: "♠" }, { rank: "Q", suit: "♥" }], tier: "premium" },
  { name: "Ace King Suited", cards: [{ rank: "A", suit: "♠" }, { rank: "K", suit: "♠" }], tier: "strong" },
  { name: "Ace King Off", cards: [{ rank: "A", suit: "♠" }, { rank: "K", suit: "♥" }], tier: "strong" },
  { name: "Pocket Jacks", cards: [{ rank: "J", suit: "♠" }, { rank: "J", suit: "♥" }], tier: "strong" },
  { name: "Ace Queen Suited", cards: [{ rank: "A", suit: "♠" }, { rank: "Q", suit: "♠" }], tier: "good" },
  { name: "Pocket Tens", cards: [{ rank: "T", suit: "♠" }, { rank: "T", suit: "♥" }], tier: "good" },
];

interface CardSelectorProps {
  selectedCards: PokerCard[];
  onCardsChange: (cards: PokerCard[]) => void;
}

export default function CardSelector({ selectedCards, onCardsChange }: CardSelectorProps) {
  const [selectionMode, setSelectionMode] = useState<'quick' | 'manual'>('quick');

  const handleQuickSelect = (hand: typeof premiumHands[0]) => {
    const cards = hand.cards.map(card => ({
      rank: card.rank,
      suit: card.suit,
      value: getRankValue(card.rank)
    }));
    onCardsChange(cards);
  };

  const handleRandomHand = () => {
    const randomHands = [
      [{ rank: "7", suit: "♠" }, { rank: "2", suit: "♥" }], // Worst hand
      [{ rank: "9", suit: "♠" }, { rank: "5", suit: "♦" }], // Bad hand
      [{ rank: "J", suit: "♠" }, { rank: "T", suit: "♦" }], // Decent hand
      [{ rank: "8", suit: "♠" }, { rank: "8", suit: "♥" }], // Pocket pair
      [{ rank: "A", suit: "♠" }, { rank: "9", suit: "♦" }], // Ace high
    ];
    
    const randomHand = randomHands[Math.floor(Math.random() * randomHands.length)];
    const cards = randomHand.map(card => ({
      rank: card.rank,
      suit: card.suit,
      value: getRankValue(card.rank)
    }));
    onCardsChange(cards);
  };

  const handleCardSelect = (rank: string, suit: string, value: number) => {
    const newCard: PokerCard = { rank, suit, value };
    
    const isSelected = selectedCards.some(card => 
      card.rank === rank && card.suit === suit
    );
    
    if (isSelected) {
      onCardsChange(selectedCards.filter(card => 
        !(card.rank === rank && card.suit === suit)
      ));
    } else if (selectedCards.length < 2) {
      onCardsChange([...selectedCards, newCard]);
    }
  };

  const clearCards = () => {
    onCardsChange([]);
  };

  const isCardSelected = (rank: string, suit: string) => {
    return selectedCards.some(card => 
      card.rank === rank && card.suit === suit
    );
  };

  const getRankValue = (rank: string): number => {
    if (rank === "A") return 14;
    if (rank === "K") return 13;
    if (rank === "Q") return 12;
    if (rank === "J") return 11;
    if (rank === "T") return 10;
    return parseInt(rank);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black';
      case 'strong': return 'bg-gradient-to-r from-green-500 to-green-700 text-white';
      case 'good': return 'bg-gradient-to-r from-blue-500 to-blue-700 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <Card className="bg-green-800 border-green-600 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white flex items-center">
        <Heart className="text-red-500 mr-2 h-5 w-5 sm:h-6 sm:w-6" />
        Your Hole Cards
      </h2>
      
      {/* Selected Cards Display */}
      <div className="flex justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
        {[0, 1].map((index) => (
          <div 
            key={index}
            className={`poker-card w-16 h-24 sm:w-20 sm:h-28 flex flex-col items-center justify-center no-zoom mobile-touch-target ${
              selectedCards[index] ? 'poker-card-selected' : ''
            }`}
          >
            {selectedCards[index] ? (
              <>
                <span className="text-2xl sm:text-3xl font-bold text-black">
                  {selectedCards[index].rank}
                </span>
                <span className={`text-xl sm:text-2xl ${
                  selectedCards[index].suit === "♥" || selectedCards[index].suit === "♦" 
                    ? "card-suit-red" : "card-suit-black"
                }`}>
                  {selectedCards[index].suit}
                </span>
              </>
            ) : (
              <span className="text-gray-400 text-2xl">?</span>
            )}
          </div>
        ))}
      </div>

      {/* Selection Mode Toggle */}
      <div className="flex mb-4 bg-gray-700 rounded-lg p-1">
        <Button
          onClick={() => setSelectionMode('quick')}
          className={`flex-1 py-2 px-3 text-sm ${
            selectionMode === 'quick'
              ? 'bg-blue-600 text-white'
              : 'bg-transparent text-gray-300'
          }`}
          variant="ghost"
        >
          <Star className="h-4 w-4 mr-1" />
          Quick Select
        </Button>
        <Button
          onClick={() => setSelectionMode('manual')}
          className={`flex-1 py-2 px-3 text-sm ${
            selectionMode === 'manual'
              ? 'bg-blue-600 text-white'
              : 'bg-transparent text-gray-300'
          }`}
          variant="ghost"
        >
          <Grid3X3 className="h-4 w-4 mr-1" />
          Manual Select
        </Button>
      </div>

      {/* Quick Select Mode */}
      {selectionMode === 'quick' && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-green-200 text-sm mb-3">
              Tap any hand to select instantly:
            </p>
            
            {/* Premium Hands Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
              {premiumHands.map((hand, i) => (
                <Button
                  key={i}
                  onClick={() => handleQuickSelect(hand)}
                  className={`${getTierColor(hand.tier)} mobile-button mobile-touch-target h-auto py-3 px-2 flex flex-col items-center text-center hover:scale-105 transition-transform`}
                  variant="outline"
                >
                  <div className="font-bold text-sm">{hand.name.split(' ')[0]} {hand.name.split(' ')[1]}</div>
                  <div className="text-xs opacity-90 mt-1">{hand.name}</div>
                  <div className="flex space-x-1 mt-1">
                    {hand.cards.map((card, j) => (
                      <span key={j} className="text-xs bg-white text-black px-1 rounded">
                        {card.rank}{card.suit}
                      </span>
                    ))}
                  </div>
                </Button>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-center space-x-2">
              <Button
                onClick={handleRandomHand}
                className="bg-purple-600 hover:bg-purple-500 text-white mobile-button mobile-touch-target"
                variant="outline"
                size="sm"
              >
                <Shuffle className="h-4 w-4 mr-1" />
                Random Hand
              </Button>
              <Button
                onClick={clearCards}
                className="mobile-button mobile-touch-target"
                variant="outline"
                size="sm"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Select Mode */}
      {selectionMode === 'manual' && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-green-200 text-sm mb-3">
              Select your two hole cards manually:
            </p>
          </div>
          
          {/* Rank-based selection */}
          <div className="space-y-2">
            {ranks.map(rank => (
              <div key={rank} className="flex items-center space-x-2">
                <div className="text-white font-bold w-6 text-center text-sm">{rank}</div>
                <div className="flex space-x-1 flex-1">
                  {suits.map(suit => (
                    <Button
                      key={`${rank}-${suit.symbol}`}
                      onClick={() => handleCardSelect(rank, suit.symbol, getRankValue(rank))}
                      className={`flex-1 h-8 text-xs mobile-touch-target ${
                        isCardSelected(rank, suit.symbol) 
                          ? 'bg-yellow-500 text-black border-yellow-400' 
                          : 'bg-gray-700 text-white border-gray-600'
                      }`}
                      variant="outline"
                    >
                      <span className={`${suit.color} font-bold`}>
                        {rank}{suit.symbol}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button
              onClick={clearCards}
              className="mobile-button mobile-touch-target"
              variant="outline"
              size="sm"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear Cards
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}