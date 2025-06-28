import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Diamond, Club, Spade, RotateCcw } from "lucide-react";
import type { Card as PokerCard } from "@shared/schema";

const suits = [
  { symbol: "♠", icon: Spade, name: "spades", color: "text-black" },
  { symbol: "♥", icon: Heart, name: "hearts", color: "text-red-600" },
  { symbol: "♦", icon: Diamond, name: "diamonds", color: "text-red-600" },
  { symbol: "♣", icon: Club, name: "clubs", color: "text-black" },
];

const ranks = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

interface CardSelectorProps {
  selectedCards: PokerCard[];
  onCardsChange: (cards: PokerCard[]) => void;
}

export default function CardSelector({ selectedCards, onCardsChange }: CardSelectorProps) {
  const [showFullGrid, setShowFullGrid] = useState(false);

  const handleCardSelect = (rank: string, suit: string, value: number) => {
    const newCard: PokerCard = { rank, suit, value };
    
    // Check if card is already selected
    const isSelected = selectedCards.some(card => 
      card.rank === rank && card.suit === suit
    );
    
    if (isSelected) {
      // Remove card
      onCardsChange(selectedCards.filter(card => 
        !(card.rank === rank && card.suit === suit)
      ));
    } else if (selectedCards.length < 2) {
      // Add card if less than 2 selected
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
            className={`poker-card w-14 h-20 sm:w-16 sm:h-24 flex flex-col items-center justify-center no-zoom mobile-touch-target ${
              selectedCards[index] ? 'poker-card-selected' : ''
            }`}
          >
            {selectedCards[index] ? (
              <>
                <span className="text-xl sm:text-2xl font-bold text-black">
                  {selectedCards[index].rank}
                </span>
                <span className={`text-base sm:text-lg ${
                  selectedCards[index].suit === "♥" || selectedCards[index].suit === "♦" 
                    ? "card-suit-red" : "card-suit-black"
                }`}>
                  {selectedCards[index].suit}
                </span>
              </>
            ) : (
              <span className="text-gray-400 text-xl">?</span>
            )}
          </div>
        ))}
      </div>

      {/* Quick Premium Hands Selection */}
      {!showFullGrid && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-sm font-medium text-white mb-3">Quick Select Premium Hands</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {[
                { hand: "AA", label: "Pocket Aces", color: "bg-red-600 hover:bg-red-500" },
                { hand: "KK", label: "Pocket Kings", color: "bg-red-600 hover:bg-red-500" },
                { hand: "QQ", label: "Pocket Queens", color: "bg-orange-600 hover:bg-orange-500" },
                { hand: "JJ", label: "Pocket Jacks", color: "bg-orange-600 hover:bg-orange-500" },
                { hand: "AKs", label: "Ace King Suited", color: "bg-green-600 hover:bg-green-500" },
                { hand: "AQs", label: "Ace Queen Suited", color: "bg-green-600 hover:bg-green-500" },
                { hand: "AKo", label: "Ace King Offsuit", color: "bg-yellow-600 hover:bg-yellow-500" },
                { hand: "AQo", label: "Ace Queen Offsuit", color: "bg-yellow-600 hover:bg-yellow-500" }
              ].map((item) => (
                <Button
                  key={item.hand}
                  className={`${item.color} text-white font-bold text-sm p-3 mobile-button mobile-touch-target`}
                  onClick={() => {
                    clearCards(); // Clear existing selection first
                    setTimeout(() => {
                      const rank1 = item.hand[0];
                      const rank2 = item.hand[1];
                      const suited = item.hand.includes('s');
                      
                      if (rank1 === rank2) {
                        // Pocket pair - different suits
                        handleCardSelect(rank1, "♠", getRankValue(rank1));
                        setTimeout(() => handleCardSelect(rank2, "♥", getRankValue(rank2)), 100);
                      } else {
                        // Different ranks
                        const suit1 = "♠";
                        const suit2 = suited ? "♣" : "♥"; // Use clubs for suited, hearts for offsuit
                        handleCardSelect(rank1, suit1, getRankValue(rank1));
                        setTimeout(() => handleCardSelect(rank2, suit2, getRankValue(rank2)), 100);
                      }
                    }, 50);
                  }}
                  title={item.label}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">{item.hand}</div>
                    <div className="text-xs opacity-75 hidden sm:block">{item.label.split(' ')[1]}</div>
                  </div>
                </Button>
              ))}
            </div>
            
            <Button 
              onClick={() => setShowFullGrid(true)}
              variant="outline"
              className="bg-blue-600 hover:bg-blue-500 text-white border-blue-500 mobile-button"
            >
              <span className="mr-2">🃏</span>
              Show All Cards
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced Full Card Grid */}
      {showFullGrid && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-sm font-medium text-white mb-3">Select Individual Cards</h3>
            <p className="text-xs text-green-200 mb-3">Tap cards to select your hole cards (max 2)</p>
          </div>
          
          {/* Suit-organized card selection */}
          <div className="space-y-3">
            {suits.map((suit) => (
              <div key={suit.name} className="bg-green-700 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <suit.icon className={`h-4 w-4 mr-2 ${suit.color}`} />
                  <span className="text-sm font-medium text-white capitalize">{suit.name}</span>
                </div>
                <div className="grid grid-cols-13 gap-1">
                  {ranks.map((rank) => (
                    <button
                      key={`${rank}${suit.symbol}`}
                      className={`poker-card aspect-square flex flex-col items-center justify-center transition-all text-xs mobile-touch-target no-zoom ${
                        isCardSelected(rank, suit.symbol) 
                          ? 'poker-card-selected border-2 border-yellow-400 transform scale-110' 
                          : 'hover:bg-gray-100 hover:scale-105'
                      }`}
                      onClick={() => handleCardSelect(rank, suit.symbol, getRankValue(rank))}
                      disabled={selectedCards.length >= 2 && !isCardSelected(rank, suit.symbol)}
                    >
                      <span className="font-bold text-black text-xs">{rank}</span>
                      <span className={`${suit.color} text-xs`}>{suit.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowFullGrid(false)}
              variant="outline"
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-500 text-white border-green-500"
            >
              ← Back to Quick Select
            </Button>
            <Button 
              onClick={clearCards}
              variant="outline"
              size="sm"
              className="bg-red-600 hover:bg-red-500 text-white border-red-500"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}
      
      <Button 
        onClick={clearCards}
        variant="default"
        className="w-full bg-yellow-600 hover:bg-yellow-500 text-green-900 font-bold"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Clear Selection
      </Button>
    </Card>
  );
}
