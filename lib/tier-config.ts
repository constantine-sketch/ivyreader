/**
 * Tier Configuration System
 * 
 * Defines subscription tiers and maps features to required tier levels.
 * This is the single source of truth for feature access across the app.
 */

export type SubscriptionTier = "free" | "premium" | "elite";

export interface TierInfo {
  id: SubscriptionTier;
  name: string;
  displayName: string;
  color: string;
  darkColor: string;
  icon: string;
  monthlyPrice: number;
  yearlyPrice: number;
}

// Tier definitions with branding
export const TIERS: Record<SubscriptionTier, TierInfo> = {
  free: {
    id: "free",
    name: "Free",
    displayName: "Free Reader",
    color: "#6B7280",
    darkColor: "#9CA3AF",
    icon: "📖",
    monthlyPrice: 0,
    yearlyPrice: 0,
  },
  premium: {
    id: "premium",
    name: "Premium",
    displayName: "Premium Member",
    color: "#D4A574",
    darkColor: "#E5B885",
    icon: "⭐",
    monthlyPrice: 27,
    yearlyPrice: 270,
  },
  elite: {
    id: "elite",
    name: "Elite",
    displayName: "Elite Member",
    color: "#FFD700",
    darkColor: "#FFE44D",
    icon: "👑",
    monthlyPrice: 97,
    yearlyPrice: 970,
  },
};

// Tier hierarchy for comparison (higher index = higher tier)
export const TIER_HIERARCHY: SubscriptionTier[] = ["free", "premium", "elite"];

/**
 * Feature definitions with required tier and metadata
 */
export type FeatureId = 
  // Core Features (all tiers)
  | "book_tracking"
  | "reading_progress"
  | "basic_stats"
  
  // Premium Features
  | "curated_lists"
  | "reader_society"
  | "reading_insights"
  | "unlimited_books"
  | "export_data"
  
  // Elite Features
  | "ai_concierge"
  | "advanced_analytics"
  | "elite_badge"
  | "priority_support"
  | "exclusive_challenges"
  | "early_access";

export interface FeatureConfig {
  id: FeatureId;
  name: string;
  description: string;
  requiredTier: SubscriptionTier;
  icon: string;
}

export const FEATURES: Record<FeatureId, FeatureConfig> = {
  // Core Features (Free)
  book_tracking: {
    id: "book_tracking",
    name: "Book Tracking",
    description: "Track books you're reading, have read, and want to read",
    requiredTier: "free",
    icon: "📚",
  },
  reading_progress: {
    id: "reading_progress",
    name: "Reading Progress",
    description: "Log your daily reading progress",
    requiredTier: "free",
    icon: "📊",
  },
  basic_stats: {
    id: "basic_stats",
    name: "Basic Statistics",
    description: "View your reading stats and streaks",
    requiredTier: "free",
    icon: "📈",
  },

  // Premium Features
  curated_lists: {
    id: "curated_lists",
    name: "Curated Reading Lists",
    description: "Access expertly curated book collections by theme and genre",
    requiredTier: "premium",
    icon: "📋",
  },
  reader_society: {
    id: "reader_society",
    name: "Reader Society",
    description: "Join the community, share reviews, and connect with readers",
    requiredTier: "premium",
    icon: "👥",
  },
  reading_insights: {
    id: "reading_insights",
    name: "Reading Insights",
    description: "Get personalized insights about your reading habits",
    requiredTier: "premium",
    icon: "💡",
  },
  unlimited_books: {
    id: "unlimited_books",
    name: "Unlimited Library",
    description: "Add unlimited books to your library",
    requiredTier: "premium",
    icon: "∞",
  },
  export_data: {
    id: "export_data",
    name: "Export Data",
    description: "Export your reading data and history",
    requiredTier: "premium",
    icon: "📤",
  },

  // Elite Features
  ai_concierge: {
    id: "ai_concierge",
    name: "AI Reading Concierge",
    description: "Get personalized book recommendations powered by AI",
    requiredTier: "elite",
    icon: "🤖",
  },
  advanced_analytics: {
    id: "advanced_analytics",
    name: "Advanced Analytics",
    description: "Deep insights into your reading patterns and predictions",
    requiredTier: "elite",
    icon: "🔬",
  },
  elite_badge: {
    id: "elite_badge",
    name: "Elite Badge",
    description: "Stand out with your exclusive Elite member badge",
    requiredTier: "elite",
    icon: "👑",
  },
  priority_support: {
    id: "priority_support",
    name: "Priority Support",
    description: "Get faster responses from our support team",
    requiredTier: "elite",
    icon: "⚡",
  },
  exclusive_challenges: {
    id: "exclusive_challenges",
    name: "Exclusive Challenges",
    description: "Participate in Elite-only reading challenges",
    requiredTier: "elite",
    icon: "🏆",
  },
  early_access: {
    id: "early_access",
    name: "Early Access",
    description: "Be the first to try new features",
    requiredTier: "elite",
    icon: "🚀",
  },
};

/**
 * Check if a tier has access to a feature
 */
export function hasTierAccess(userTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  const userIndex = TIER_HIERARCHY.indexOf(userTier);
  const requiredIndex = TIER_HIERARCHY.indexOf(requiredTier);
  return userIndex >= requiredIndex;
}

/**
 * Check if a tier can access a specific feature
 */
export function canAccessFeature(userTier: SubscriptionTier, featureId: FeatureId): boolean {
  const feature = FEATURES[featureId];
  if (!feature) return false;
  return hasTierAccess(userTier, feature.requiredTier);
}

/**
 * Get all features available to a tier
 */
export function getFeaturesForTier(tier: SubscriptionTier): FeatureConfig[] {
  return Object.values(FEATURES).filter(feature => 
    hasTierAccess(tier, feature.requiredTier)
  );
}

/**
 * Get features that would be unlocked by upgrading to a tier
 */
export function getUpgradeFeatures(currentTier: SubscriptionTier, targetTier: SubscriptionTier): FeatureConfig[] {
  return Object.values(FEATURES).filter(feature => 
    !hasTierAccess(currentTier, feature.requiredTier) && 
    hasTierAccess(targetTier, feature.requiredTier)
  );
}

/**
 * Get the next tier upgrade option
 */
export function getNextTier(currentTier: SubscriptionTier): SubscriptionTier | null {
  const currentIndex = TIER_HIERARCHY.indexOf(currentTier);
  if (currentIndex < TIER_HIERARCHY.length - 1) {
    return TIER_HIERARCHY[currentIndex + 1];
  }
  return null;
}
