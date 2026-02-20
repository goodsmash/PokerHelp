import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Play, 
  Pause, 
  RotateCcw, 
  Users,
  Trophy,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import type { Card as PokerCard } from '@shared/schema';

// AI Player Types
export type AIType = 'tight' | 'loose' | 'aggressive' | 'passive' | 'balanced';

export interface AIPlayer {
  id: string;
  name: string;
  type: AIType;
  chips: number;
  cards: PokerCard[];
  avatar: string;
  description: string;
}

// AI Personalities
export const AI_PERSONALITIES: Record<AIType, { name: string; description: string; style: string }> = {
  tight: { 
    name: 'Tight Tim', 
    description: 'Only plays premium hands',
    style: 'Folds 80% of hands, aggressive when plays'
  },
  loose: { 
    name: 'Loose Larry', 
    description: 'Plays many hands, sees lots of flops',
    style: 'Calls frequently, hard to bluff'
  },
  aggressive: { 
    name: 'Aggressive Amy', 
    description: 'Always betting and raising',
    style: 'Lots of pressure, frequent bluffs'
  },
  passive: { 
    name: 'Passive Pete', 
    description: 'Checks and calls, rarely raises',
    style: 'Easy to read, rarely bluffs'
  },
  balanced: { 
    name: 'Pro Player', 
    description: 'Mix of all styles, hard to read',
    style: 'GTO-style play, unpredictable'
  }
};

// AI Decision Making
export function getAIDecision(
  aiType: AIType,
  handStrength: number, // 0-100
  position: string,
  potOdds: number,
  toCall: number,
  aiChips: number,
  communityCards: PokerCard[]
): { action: 'fold' | 'call' | 'raise'; amount?: number; reasoning: string } {
  
  const randomFactor = Math.random();
  
  switch (aiType) {
    case 'tight':
      if (handStrength < 60) {
        return { action: 'fold', reasoning: 'Hand too weak for my tight range' };
      }
      if (handStrength > 80 && randomFactor > 0.3) {
        return { action: 'raise', amount: Math.min(aiChips, toCall * 3), reasoning: 'Premium hand, building pot' };
      }
      return { action: 'call', reasoning: 'Decent hand, seeing flop' };
      
    case 'loose':
      if (handStrength < 30 && randomFactor > 0.7) {
        return { action: 'fold', reasoning: 'Even I can\'t play this' };
      }
      if (handStrength > 50 || randomFactor > 0.5) {
        return { action: 'call', reasoning: 'Why not? Let\'s see a flop' };
      }
      return { action: 'fold', reasoning: 'Maybe next time' };
      
    case 'aggressive':
      if (handStrength < 20) {
        return { action: 'fold', reasoning: 'Can\'t bluff with nothing' };
      }
      if (randomFactor > 0.4 || handStrength > 40) {
        return { action: 'raise', amount: Math.min(aiChips, toCall * 2.5 || 10), reasoning: 'Applying pressure' };
      }
      return { action: 'call', reasoning: 'Pot odds are there' };
      
    case 'passive':
      if (handStrength < 40) {
        return { action: 'fold', reasoning: 'Not strong enough' };
      }
      if (handStrength > 75) {
        return { action: 'raise', amount: Math.min(aiChips, toCall * 2), reasoning: 'Strong hand, but cautious' };
      }
      return { action: 'call', reasoning: 'Let\'s see what happens' };
      
    case 'balanced':
    default:
      // GTO-ish decisions
      if (handStrength < 25) {
        return { action: 'fold', reasoning: 'Below calling threshold' };
      }
      if (handStrength > 70 && randomFactor > 0.3) {
        return { action: 'raise', amount: Math.min(aiChips, toCall * 2.5 || 15), reasoning: 'Value betting strong hand' };
      }
      if (potOdds > 0.3 && handStrength > 35) {
        return { action: 'call', reasoning: 'Correct pot odds' };
      }
      return { action: 'call', reasoning: 'Mixing in some calls' };
  }
}

// Hand Strength Calculator (simplified)
export function calculateHandStrength(cards: PokerCard[], communityCards: PokerCard[]): number {
  if (cards.length !== 2) return 0;
  
  // Premium pairs
  if (cards[0].rank === cards[1].rank) {
    const pairStrength: Record<string, number> = {
      'A': 95, 'K': 85, 'Q': 80, 'J': 75, '10': 70,
      '9': 60, '8': 55, '7': 50, '6': 45, '5': 40,
      '4': 35, '3': 30, '2': 25
    };
    return pairStrength[cards[0].rank] || 30;
  }
  
  // Suited connectors
  const isSuited = cards[0].suit === cards[1].suit;
  const highCard = Math.max(
    getRankValue(cards[0].rank),
    getRankValue(cards[1].rank)
  );
  const gap = Math.abs(getRankValue(cards[0].rank) - getRankValue(cards[1].rank));
  
  let strength = highCard * 5;
  if (isSuited) strength += 10;
  if (gap === 1) strength += 15; // Connected
  if (gap === 0) strength += 10; // Pair handled above
  
  // Check if cards are both high (broadway)
  if (highCard >= 10) strength += 10;
  
  return Math.min(90, strength);
}

function getRankValue(rank: string): number {
  const values: Record<string, number> = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
    '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
  };
  return values[rank] || 0;
}
