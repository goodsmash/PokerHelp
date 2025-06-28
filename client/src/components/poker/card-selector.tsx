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

      {/* Quick Card Selection */}
      {!showFullGrid && (
        <div className="space-y-4">
          <div className="text-center">
            <Button 
              onClick={() => setShowFullGrid(true)}
              variant="outline"
              className="mb-4"
            >
              Show All Cards
            </Button>
          </div>
          
          {/* Premium hands quick select */}
          <div className="grid grid-cols-4 gap-2">
            {["AA", "KK", "QQ", "JJ", "AKs", "AQs", "AJs", "ATs"].map((hand) => (
              <Button
                key={hand}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  // Handle premium hand selection
                  const rank1 = hand[0];
                  const rank2 = hand[1];
                  const suited = hand.includes('s');
                  
                  if (rank1 === rank2) {
                    // Pocket pair
                    handleCardSelect(rank1, "♠", getRankValue(rank1));
                    handleCardSelect(rank2, "♥", getRankValue(rank2));
                  } else {
                    // Different ranks
                    const suit1 = "♠";
                    const suit2 = suited ? "♠" : "♥";
                    handleCardSelect(rank1, suit1, getRankValue(rank1));
                    handleCardSelect(rank2, suit2, getRankValue(rank2));
                  }
                }}
              >
                {hand}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Full Card Grid */}
      {showFullGrid && (
        <>
          <div className="grid grid-cols-13 gap-1 text-xs mb-4">
            {suits.map((suit) => 
              ranks.map((rank) => (
                <button
                  key={`${rank}${suit.symbol}`}
                  className={`poker-card aspect-square flex flex-col items-center justify-center transition-colors text-xs ${
                    isCardSelected(rank, suit.symbol) 
                      ? 'poker-card-selected' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleCardSelect(rank, suit.symbol, getRankValue(rank))}
                >
                  <span className="font-bold text-black">{rank}</span>
                  <span className={suit.color}>{suit.symbol}</span>
                </button>
              ))
            )}
          </div>
          
          <Button 
            onClick={() => setShowFullGrid(false)}
            variant="outline"
            size="sm"
            className="w-full mb-2"
          >
            Hide Grid
          </Button>
        </>
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
