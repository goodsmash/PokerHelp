import type { Card, HandAnalysis, ActionRecommendation } from "@shared/schema";

export function analyzeHand(cards: Card[]): HandAnalysis | null {
  if (cards.length !== 2) return null;

  const [card1, card2] = cards;
  const isPair = card1.rank === card2.rank;
  const isSuited = card1.suit === card2.suit;
  const highCard = Math.max(card1.value, card2.value);
  const lowCard = Math.min(card1.value, card2.value);
  const gap = highCard - lowCard;

  // Determine hand type
  let handType = "Weak";
  let bssRank = "Group 5";
  let handStrength = 30;

  if (isPair) {
    if (highCard >= 10) {
      handType = "Premium Pair";
      bssRank = "Group 1";
      handStrength = 85 + (highCard - 10) * 3;
    } else if (highCard >= 7) {
      handType = "Medium Pair";
      bssRank = "Group 2";
      handStrength = 65 + (highCard - 7) * 5;
    } else {
      handType = "Small Pair";
      bssRank = "Group 3";
      handStrength = 50 + (highCard - 2) * 3;
    }
  } else {
    // Non-pair hands
    if (highCard === 14) { // Ace high
      if (lowCard >= 10) {
        handType = isSuited ? "Premium Suited" : "Premium Offsuit";
        bssRank = "Group 1";
        handStrength = isSuited ? 80 + (lowCard - 10) * 2 : 70 + (lowCard - 10) * 2;
      } else if (lowCard >= 7) {
        handType = isSuited ? "Strong Suited Ace" : "Weak Ace";
        bssRank = isSuited ? "Group 2" : "Group 4";
        handStrength = isSuited ? 60 + (lowCard - 7) * 3 : 35 + (lowCard - 7) * 2;
      } else {
        handType = isSuited ? "Suited Ace" : "Weak Ace";
        bssRank = isSuited ? "Group 3" : "Group 5";
        handStrength = isSuited ? 45 + (lowCard - 2) * 2 : 25 + (lowCard - 2);
      }
    } else if (highCard >= 11) { // King or Queen high
      if (lowCard >= 9 && gap <= 3) {
        handType = isSuited ? "Strong Suited" : "Strong Offsuit";
        bssRank = isSuited ? "Group 2" : "Group 3";
        handStrength = isSuited ? 65 + (14 - gap) * 2 : 55 + (14 - gap);
      } else {
        handType = isSuited ? "Suited Connector" : "Weak";
        bssRank = isSuited ? "Group 3" : "Group 5";
        handStrength = isSuited ? 45 + (lowCard - 2) : 30;
      }
    } else {
      // Lower cards
      if (isSuited && gap <= 2) {
        handType = "Suited Connector";
        bssRank = "Group 4";
        handStrength = 40 + (14 - gap) + (highCard - 2);
      } else {
        handType = "Weak";
        bssRank = "Group 5";
        handStrength = 20 + (highCard - 2);
      }
    }
  }

  // Calculate odds (simplified)
  const vsRandom = Math.min(85, handStrength + 15);
  const vsPremium = Math.max(15, handStrength - 30);
  const expectedValue = (handStrength - 50) * 0.1;

  return {
    handType,
    handStrength,
    bssRank,
    odds: {
      vsRandom,
      vsPremium,
    },
    expectedValue,
  };
}

export function getRecommendation(cards: Card[], position: string): ActionRecommendation | null {
  if (cards.length !== 2) return null;

  const analysis = analyzeHand(cards);
  if (!analysis) return null;

  const handNotation = getHandNotation(cards);
  const positionTightness = getPositionTightness(position);
  
  // Decision logic based on BSS strategy
  if (analysis.handStrength >= 75) {
    return {
      action: "RAISE",
      sizing: "3-4x BB",
      description: `Strong ${analysis.handType} from ${position}`,
      reasoning: `${handNotation} is a premium hand suitable for opening from any position. Build the pot with strong equity.`,
      vs3bet: "4-bet for value or call depending on opponent range",
    };
  } else if (analysis.handStrength >= 60) {
    if (["CO", "BTN", "SB"].includes(position)) {
      return {
        action: "RAISE",
        sizing: "2.5-3x BB",
        description: `Good hand from late position`,
        reasoning: `${handNotation} plays well from ${position}. Take advantage of positional equity.`,
        vs3bet: "Call most 3-bets, fold to very tight opponents",
      };
    } else {
      return {
        action: "CALL",
        description: `Decent hand from early position`,
        reasoning: `${handNotation} has playability but not strong enough to open from ${position} in tight ranges.`,
      };
    }
  } else if (analysis.handStrength >= 45) {
    if (["BTN", "SB", "BB"].includes(position)) {
      return {
        action: "RAISE",
        sizing: "2.5x BB",
        description: `Playable from late position/blinds`,
        reasoning: `${handNotation} has enough equity to open from ${position}. Steal blinds or defend.`,
        vs3bet: "Fold to 3-bets unless getting good odds",
      };
    } else {
      return {
        action: "FOLD",
        description: `Too weak for early/middle position`,
        reasoning: `${handNotation} doesn't meet opening requirements for ${position}. Wait for better spots.`,
      };
    }
  } else {
    if (position === "BB") {
      return {
        action: "CALL",
        description: `Defend big blind with correct odds`,
        reasoning: `${handNotation} can defend BB against reasonable sizing with pot odds.`,
      };
    } else {
      return {
        action: "FOLD",
        description: `Weak hand - fold`,
        reasoning: `${handNotation} is too weak to play profitably from ${position}.`,
      };
    }
  }
}

function getHandNotation(cards: Card[]): string {
  const [card1, card2] = cards;
  if (card1.rank === card2.rank) {
    return card1.rank + card1.rank;
  }
  
  const highRank = card1.value > card2.value ? card1.rank : card2.rank;
  const lowRank = card1.value < card2.value ? card1.rank : card2.rank;
  const suited = card1.suit === card2.suit ? "s" : "o";
  
  return highRank + lowRank + suited;
}

function getPositionTightness(position: string): number {
  const tightness = {
    "UTG": 0.85,
    "UTG+1": 0.80,
    "MP": 0.75,
    "MP+1": 0.70,
    "CO": 0.60,
    "BTN": 0.50,
    "SB": 0.65,
    "BB": 0.70,
  };
  return tightness[position as keyof typeof tightness] || 0.75;
}
