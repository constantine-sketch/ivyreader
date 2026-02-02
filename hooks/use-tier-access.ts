/**
 * useTierAccess Hook
 * 
 * Provides easy access to tier-based feature gating throughout the app.
 */

import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import {
  SubscriptionTier,
  FeatureId,
  TIERS,
  FEATURES,
  canAccessFeature,
  getFeaturesForTier,
  getUpgradeFeatures,
  getNextTier,
  hasTierAccess,
  TierInfo,
  FeatureConfig,
} from "@/lib/tier-config";

export interface TierAccessResult {
  // Current user tier
  tier: SubscriptionTier;
  tierInfo: TierInfo;
  
  // Loading state
  isLoading: boolean;
  
  // Feature access checks
  canAccess: (featureId: FeatureId) => boolean;
  hasMinimumTier: (requiredTier: SubscriptionTier) => boolean;
  
  // Feature lists
  availableFeatures: FeatureConfig[];
  lockedFeatures: FeatureConfig[];
  
  // Upgrade info
  nextTier: SubscriptionTier | null;
  nextTierInfo: TierInfo | null;
  upgradeFeatures: FeatureConfig[];
  
  // Tier checks
  isPremium: boolean;
  isElite: boolean;
  isPremiumOrHigher: boolean;
  isEliteOnly: boolean;
  
  // Styling helpers
  accentColor: string;
  isDarkTheme: boolean;
}

export function useTierAccess(): TierAccessResult {
  const { data: user, isLoading } = trpc.auth.me.useQuery();
  
  const tier: SubscriptionTier = (user?.subscriptionTier as SubscriptionTier) || "premium";
  const tierInfo = TIERS[tier];
  
  const result = useMemo<TierAccessResult>(() => {
    const nextTier = getNextTier(tier);
    const availableFeatures = getFeaturesForTier(tier);
    const allFeatures = Object.values(FEATURES);
    const lockedFeatures = allFeatures.filter(f => !canAccessFeature(tier, f.id));
    const upgradeFeatures = nextTier ? getUpgradeFeatures(tier, nextTier) : [];
    
    return {
      tier,
      tierInfo,
      isLoading,
      
      canAccess: (featureId: FeatureId) => canAccessFeature(tier, featureId),
      hasMinimumTier: (requiredTier: SubscriptionTier) => hasTierAccess(tier, requiredTier),
      
      availableFeatures,
      lockedFeatures,
      
      nextTier,
      nextTierInfo: nextTier ? TIERS[nextTier] : null,
      upgradeFeatures,
      
      isPremium: tier === "premium",
      isElite: tier === "elite",
      isPremiumOrHigher: hasTierAccess(tier, "premium"),
      isEliteOnly: tier === "elite",
      
      accentColor: tier === "elite" ? "#FFD700" : "#D4A574",
      isDarkTheme: tier === "elite",
    };
  }, [tier, tierInfo, isLoading]);
  
  return result;
}

/**
 * Hook to check access to a specific feature
 */
export function useFeatureAccess(featureId: FeatureId) {
  const { canAccess, tier, isLoading } = useTierAccess();
  const feature = FEATURES[featureId];
  
  return {
    hasAccess: canAccess(featureId),
    feature,
    requiredTier: feature?.requiredTier,
    currentTier: tier,
    isLoading,
  };
}
