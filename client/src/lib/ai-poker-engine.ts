import type { Card as PokerCard } from '@shared/schema';

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

export const AI_PERSONALITIES: Record<AIType, { name: string; description: string; style: string }> = {
  tight: {
    name: 'Tight Tim',
    description: 'Only plays premium hands',
    style: 'Folds often preflop, pushes edges hard with strong ranges'
  },
  loose: {
    name: 'Loose Larry',
    description: 'Plays many hands',
    style: 'Wider ranges, more curiosity calls, less discipline'
  },
  aggressive: {
    name: 'Aggressive Amy',
    description: 'Applies pressure constantly',
    style: 'Higher raise frequency, more semi-bluffs'
  },
  passive: {
    name: 'Passive Pete',
    description: 'Avoids big pots',
    style: 'Check/call heavy, rarely 3-bets'
  },
  balanced: {
    name: 'Pro Player',
    description: 'Mixes value and bluffs',
    style: 'Range-aware, pot-odds aware, hard to exploit'
  }
};

const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;

const RANK_VALUE: Record<string, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
  '9': 9, '10': 10, J: 11, Q: 12, K: 13, A: 14,
};

function normalizeSuit(suit: string): string {
  if (suit === '♥') return 'hearts';
  if (suit === '♦') return 'diamonds';
  if (suit === '♣') return 'clubs';
  if (suit === '♠') return 'spades';
  return suit;
}

function normalizeCard(c: PokerCard): PokerCard {
  return {
    rank: c.rank,
    suit: normalizeSuit(c.suit),
    value: c.value || RANK_VALUE[c.rank] || 0,
  };
}

function cardKey(c: PokerCard) {
  const n = normalizeCard(c);
  return `${n.rank}-${n.suit}`;
}

export function createDeck(excluded: PokerCard[] = []): PokerCard[] {
  const excludedSet = new Set(excluded.map(cardKey));
  const deck: PokerCard[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      const c: PokerCard = { rank, suit, value: RANK_VALUE[rank] };
      if (!excludedSet.has(cardKey(c))) deck.push(c);
    }
  }
  return deck;
}

export function drawRandomCards(deck: PokerCard[], count: number): { drawn: PokerCard[]; deck: PokerCard[] } {
  const copy = [...deck];
  const drawn: PokerCard[] = [];
  for (let i = 0; i < count && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    drawn.push(copy.splice(idx, 1)[0]);
  }
  return { drawn, deck: copy };
}

function evaluateFive(cards: PokerCard[]): number {
  const ranks = cards.map(c => normalizeCard(c).value).sort((a, b) => b - a);
  const suits = cards.map(c => normalizeCard(c).suit);

  const rankCounts = new Map<number, number>();
  for (const r of ranks) rankCounts.set(r, (rankCounts.get(r) || 0) + 1);

  const byCount = [...rankCounts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);

  const isFlush = suits.every(s => s === suits[0]);

  const uniqueRanks = [...new Set(ranks)].sort((a, b) => b - a);
  let isStraight = false;
  let straightHigh = 0;

  if (uniqueRanks.length >= 5) {
    for (let i = 0; i <= uniqueRanks.length - 5; i++) {
      const slice = uniqueRanks.slice(i, i + 5);
      if (slice[0] - slice[4] === 4) {
        isStraight = true;
        straightHigh = slice[0];
        break;
      }
    }
    // Wheel straight A-5
    if (!isStraight && uniqueRanks.includes(14) && uniqueRanks.includes(5) && uniqueRanks.includes(4) && uniqueRanks.includes(3) && uniqueRanks.includes(2)) {
      isStraight = true;
      straightHigh = 5;
    }
  }

  const kickers = (arr: number[]) => arr.reduce((acc, v, i) => acc + v * Math.pow(15, 4 - i), 0);

  // Hand category weight ladder
  if (isStraight && isFlush) return 8_000_000 + straightHigh; // straight flush
  if (byCount[0][1] === 4) {
    const four = byCount[0][0];
    const k = byCount.find(x => x[0] !== four)?.[0] || 0;
    return 7_000_000 + four * 100 + k;
  }
  if (byCount[0][1] === 3 && byCount[1]?.[1] === 2) return 6_000_000 + byCount[0][0] * 100 + byCount[1][0];
  if (isFlush) return 5_000_000 + kickers(ranks);
  if (isStraight) return 4_000_000 + straightHigh;
  if (byCount[0][1] === 3) {
    const trips = byCount[0][0];
    const rest = byCount.filter(x => x[0] !== trips).map(x => x[0]).sort((a, b) => b - a);
    return 3_000_000 + trips * 10_000 + kickers(rest.slice(0, 2));
  }
  if (byCount[0][1] === 2 && byCount[1]?.[1] === 2) {
    const p1 = Math.max(byCount[0][0], byCount[1][0]);
    const p2 = Math.min(byCount[0][0], byCount[1][0]);
    const k = byCount.find(x => x[1] === 1)?.[0] || 0;
    return 2_000_000 + p1 * 10_000 + p2 * 100 + k;
  }
  if (byCount[0][1] === 2) {
    const pair = byCount[0][0];
    const rest = byCount.filter(x => x[0] !== pair).map(x => x[0]).sort((a, b) => b - a);
    return 1_000_000 + pair * 10_000 + kickers(rest.slice(0, 3));
  }
  return kickers(ranks);
}

function evaluateSeven(cards: PokerCard[]): number {
  if (cards.length < 5) return 0;
  let best = 0;
  for (let a = 0; a < cards.length - 4; a++) {
    for (let b = a + 1; b < cards.length - 3; b++) {
      for (let c = b + 1; c < cards.length - 2; c++) {
        for (let d = c + 1; d < cards.length - 1; d++) {
          for (let e = d + 1; e < cards.length; e++) {
            const score = evaluateFive([cards[a], cards[b], cards[c], cards[d], cards[e]]);
            if (score > best) best = score;
          }
        }
      }
    }
  }
  return best;
}

export function estimateEquity(
  heroCards: PokerCard[],
  communityCards: PokerCard[],
  simulations = 250,
): number {
  const known = [...heroCards, ...communityCards].map(normalizeCard);
  if (heroCards.length !== 2) return 0;

  let wins = 0;
  let ties = 0;

  for (let i = 0; i < simulations; i++) {
    let deck = createDeck(known);

    const oppDraw = drawRandomCards(deck, 2);
    const oppCards = oppDraw.drawn;
    deck = oppDraw.deck;

    const needBoard = 5 - communityCards.length;
    const boardDraw = drawRandomCards(deck, needBoard);
    const fullBoard = [...known.slice(2), ...boardDraw.drawn];

    const heroScore = evaluateSeven([...known.slice(0, 2), ...fullBoard]);
    const oppScore = evaluateSeven([...oppCards, ...fullBoard]);

    if (heroScore > oppScore) wins++;
    else if (heroScore === oppScore) ties++;
  }

  return ((wins + ties * 0.5) / simulations) * 100;
}

export function calculateHandStrength(cards: PokerCard[], communityCards: PokerCard[]): number {
  if (cards.length !== 2) return 0;

  const equity = estimateEquity(cards, communityCards, communityCards.length ? 300 : 180);
  return Math.max(0, Math.min(100, equity));
}

export function getAIDecision(
  aiType: AIType,
  handStrength: number,
  position: string,
  potOdds: number,
  toCall: number,
  aiChips: number,
  communityCards: PokerCard[]
): { action: 'fold' | 'call' | 'raise'; amount?: number; reasoning: string } {
  const aggressionByType: Record<AIType, number> = {
    tight: 0.35,
    loose: 0.55,
    aggressive: 0.8,
    passive: 0.2,
    balanced: 0.5,
  };

  const baseThresholdByType: Record<AIType, number> = {
    tight: 58,
    loose: 36,
    aggressive: 42,
    passive: 50,
    balanced: 46,
  };

  const streetFactor = communityCards.length >= 3 ? 1.05 : 1.0;
  const callThreshold = baseThresholdByType[aiType] * streetFactor;
  const canCall = toCall <= aiChips;

  if (!canCall) return { action: 'fold', reasoning: 'Insufficient chips to continue.' };

  const oddsFloor = potOdds * 100;
  const shouldContinue = handStrength >= Math.max(callThreshold, oddsFloor - 5);

  if (!shouldContinue) {
    return {
      action: 'fold',
      reasoning: `Equity ${handStrength.toFixed(1)}% is below threshold (${Math.max(callThreshold, oddsFloor - 5).toFixed(1)}%).`
    };
  }

  const raiseEdge = handStrength - callThreshold;
  const aggression = aggressionByType[aiType];
  const wantsRaise = raiseEdge > 12 || (raiseEdge > 4 && Math.random() < aggression);

  if (wantsRaise) {
    const base = Math.max(toCall * (2 + aggression), 12);
    const amount = Math.min(aiChips, Math.round(base));
    return {
      action: 'raise',
      amount,
      reasoning: `Equity ${handStrength.toFixed(1)}% with ${AI_PERSONALITIES[aiType].name} profile: apply pressure.`
    };
  }

  return {
    action: 'call',
    reasoning: `Equity ${handStrength.toFixed(1)}% supports a call with current pot odds.`
  };
}
