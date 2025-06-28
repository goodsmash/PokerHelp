import type { PositionRange } from "@shared/schema";

// BSS Starting Hand Charts based on position
export function getStartingHandChart(position: string) {
  const charts = {
    "UTG": {
      openHands: ["AA", "KK", "QQ", "JJ", "TT", "99", "88", "AKs", "AQs", "AJs", "ATs", "AKo", "AQo"],
      sometimesHands: ["77", "66", "A9s", "A8s", "KQs", "KJs", "QJs", "JTs", "AJo"],
      percentage: 11.5,
      combos: 152,
    },
    "MP": {
      openHands: ["AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "AKs", "AQs", "AJs", "ATs", "A9s", "AKo", "AQo", "AJo", "KQs", "KJs", "QJs", "JTs"],
      sometimesHands: ["66", "55", "A8s", "A7s", "KTs", "QTs", "J9s", "T9s", "98s", "KQo"],
      percentage: 15.2,
      combos: 201,
    },
    "CO": {
      openHands: ["AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "66", "55", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "AKo", "AQo", "AJo", "ATo", "KQs", "KJs", "KTs", "QJs", "QTs", "JTs", "J9s", "T9s", "98s", "87s", "KQo", "KJo"],
      sometimesHands: ["44", "33", "22", "A4s", "A3s", "A2s", "K9s", "Q9s", "J8s", "T8s", "97s", "86s", "76s", "65s", "QJo", "JTo"],
      percentage: 25.8,
      combos: 341,
    },
    "BTN": {
      openHands: ["AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "66", "55", "44", "33", "22", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "AKo", "AQo", "AJo", "ATo", "A9o", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "QJs", "QTs", "Q9s", "Q8s", "JTs", "J9s", "J8s", "T9s", "T8s", "98s", "97s", "87s", "86s", "76s", "65s", "54s", "KQo", "KJo", "KTo", "QJo", "QTo", "JTo"],
      sometimesHands: ["A8o", "A7o", "K4s", "K3s", "K2s", "Q7s", "Q6s", "J7s", "T7s", "96s", "85s", "75s", "64s", "53s", "43s", "Q9o", "J9o", "T9o", "98o"],
      percentage: 45.7,
      combos: 604,
    },
    "SB": {
      openHands: ["AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "66", "55", "44", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "AKo", "AQo", "AJo", "ATo", "A9o", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "QJs", "QTs", "Q9s", "JTs", "J9s", "T9s", "98s", "87s", "76s", "65s", "54s", "KQo", "KJo", "QJo"],
      sometimesHands: ["33", "22", "A8o", "A7o", "A6o", "K6s", "K5s", "Q8s", "J8s", "T8s", "97s", "86s", "75s", "64s", "53s", "KTo", "QTo", "JTo"],
      percentage: 35.2,
      combos: 465,
    },
    "BB": {
      openHands: [], // BB doesn't open, only defends
      sometimesHands: [], 
      percentage: 0,
      combos: 0,
    },
  };

  return charts[position as keyof typeof charts] || charts.UTG;
}

export function getPositionRange(position: string): PositionRange & {
  breakdown: {
    pairs: string;
    suited: string;
    offsuit: string;
  };
  strategy: string;
} {
  const ranges = {
    "UTG": {
      position: "UTG",
      range: ["AA", "KK", "QQ", "JJ", "TT", "99", "88", "AKs", "AQs", "AJs", "ATs", "AKo", "AQo"],
      percentage: 11.5,
      combos: 152,
      breakdown: {
        pairs: "88+",
        suited: "ATs+",
        offsuit: "AQo+",
      },
      strategy: "Very tight range. Only premium hands that can profitably open from the earliest position.",
    },
    "MP": {
      position: "MP",
      range: ["AA-77", "AKs-A9s", "AKo-AJo", "KQs-KJs", "QJs", "JTs"],
      percentage: 15.2,
      combos: 201,
      breakdown: {
        pairs: "77+",
        suited: "A9s+, KJs+, QJs, JTs",
        offsuit: "AJo+",
      },
      strategy: "Still relatively tight. Add medium pairs and some suited broadways.",
    },
    "CO": {
      position: "CO",
      range: ["AA-55", "AKs-A5s", "AKo-ATo", "KQs-KTs", "QJs-QTs", "JTs-J9s", "T9s-98s", "87s", "KQo-KJo"],
      percentage: 25.8,
      combos: 341,
      breakdown: {
        pairs: "55+",
        suited: "A5s+, K9s+, Q9s+, J8s+, T8s+, 97s+, 87s",
        offsuit: "ATo+, KJo+",
      },
      strategy: "Significantly wider range. Add suited connectors and more broadways.",
    },
    "BTN": {
      position: "BTN",
      range: ["AA-22", "AKs-A2s", "AKo-A9o", "KQs-K5s", "QJs-Q8s", "JTs-J8s", "T9s-T8s", "98s-54s", "KQo-KTo", "QJo-QTo", "JTo"],
      percentage: 45.7,
      combos: 604,
      breakdown: {
        pairs: "22+",
        suited: "A2s+, K5s+, Q8s+, J8s+, T8s+, 98s-54s",
        offsuit: "A9o+, KTo+, QTo+, JTo",
      },
      strategy: "Very wide range due to position advantage. Can play many speculative hands profitably.",
    },
    "SB": {
      position: "SB",
      range: ["AA-44", "AKs-A2s", "AKo-A9o", "KQs-K7s", "QJs-Q9s", "JTs-J9s", "T9s-98s", "87s-54s", "KQo-KJo", "QJo"],
      percentage: 35.2,
      combos: 465,
      breakdown: {
        pairs: "44+",
        suited: "A2s+, K7s+, Q9s+, J9s+, T9s-54s",
        offsuit: "A9o+, KJo+, QJo",
      },
      strategy: "Wide but not as wide as button due to being out of position post-flop.",
    },
    "BB": {
      position: "BB",
      range: ["Defending range varies by opponent"],
      percentage: 0,
      combos: 0,
      breakdown: {
        pairs: "Varies by opponent action",
        suited: "Varies by opponent action", 
        offsuit: "Varies by opponent action",
      },
      strategy: "Defend based on pot odds and opponent's opening range. Generally 60-80% of hands against late position opens.",
    },
  };

  return ranges[position as keyof typeof ranges] || ranges.UTG;
}

// Hand strength tiers for quick reference
export const handTiers = {
  premium: ["AA", "KK", "QQ", "JJ", "AKs", "AKo"],
  strong: ["TT", "99", "88", "AQs", "AJs", "AQo", "KQs"],
  playable: ["77", "66", "55", "ATs", "A9s", "AJo", "KJs", "KQo", "QJs"],
  speculative: ["44", "33", "22", "A8s", "A7s", "A6s", "A5s", "KTs", "QTs", "JTs", "T9s", "98s", "87s"],
  weak: ["A4s", "A3s", "A2s", "K9s", "K8s", "Q9s", "J9s", "T8s", "97s", "86s", "76s", "65s", "54s"]
};
