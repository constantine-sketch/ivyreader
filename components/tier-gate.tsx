/**
 * TierGate Component
 * 
 * Wraps content that requires a specific tier to access.
 * Shows upgrade prompt when user doesn't have access.
 */

import { ReactNode, useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { useTierAccess, useFeatureAccess } from "@/hooks/use-tier-access";
import { FeatureId, TIERS, FEATURES, getUpgradeFeatures } from "@/lib/tier-config";

interface TierGateProps {
  /** The feature ID to check access for */
  feature: FeatureId;
  /** Content to show when user has access */
  children: ReactNode;
  /** Optional custom locked content */
  lockedContent?: ReactNode;
  /** Show inline upgrade prompt instead of modal */
  inline?: boolean;
  /** Hide completely when locked (no prompt) */
  hideWhenLocked?: boolean;
}

export function TierGate({ 
  feature, 
  children, 
  lockedContent,
  inline = false,
  hideWhenLocked = false,
}: TierGateProps) {
  const { hasAccess, feature: featureConfig, requiredTier } = useFeatureAccess(feature);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  if (hideWhenLocked) {
    return null;
  }
  
  if (lockedContent) {
    return <>{lockedContent}</>;
  }
  
  if (inline) {
    return (
      <InlineUpgradePrompt 
        feature={feature} 
        onUpgrade={() => setShowUpgradeModal(true)} 
      />
    );
  }
  
  return (
    <>
      <LockedFeatureCard 
        feature={feature} 
        onUpgrade={() => setShowUpgradeModal(true)} 
      />
      <UpgradeModal 
        visible={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        targetTier={(requiredTier === "elite" ? "elite" : "premium")}
      />
    </>
  );
}

/**
 * Locked feature card shown when user doesn't have access
 */
function LockedFeatureCard({ 
  feature, 
  onUpgrade 
}: { 
  feature: FeatureId; 
  onUpgrade: () => void;
}) {
  const colors = useColors();
  const { tier, accentColor, isDarkTheme } = useTierAccess();
  const featureConfig = FEATURES[feature];
  const requiredTierInfo = TIERS[featureConfig.requiredTier];
  
  return (
    <View 
      className="p-6 rounded-2xl items-center"
      style={{ 
        backgroundColor: isDarkTheme ? "#151515" : colors.surface,
        borderWidth: 1,
        borderColor: isDarkTheme ? "#333" : colors.border,
      }}
    >
      <View 
        className="w-16 h-16 rounded-full items-center justify-center mb-4"
        style={{ backgroundColor: `${requiredTierInfo.color}20` }}
      >
        <Text style={{ fontSize: 32 }}>🔒</Text>
      </View>
      
      <Text 
        className="text-lg font-bold text-center mb-2"
        style={{ color: isDarkTheme ? "#fff" : colors.foreground }}
      >
        {featureConfig.name}
      </Text>
      
      <Text 
        className="text-sm text-center mb-4"
        style={{ color: isDarkTheme ? "#888" : colors.muted }}
      >
        {featureConfig.description}
      </Text>
      
      <View className="flex-row items-center mb-4">
        <Text style={{ fontSize: 16 }}>{requiredTierInfo.icon}</Text>
        <Text 
          className="text-sm font-semibold ml-2"
          style={{ color: requiredTierInfo.color }}
        >
          {requiredTierInfo.name} Feature
        </Text>
      </View>
      
      <TouchableOpacity
        onPress={onUpgrade}
        className="px-6 py-3 rounded-xl"
        style={{ backgroundColor: requiredTierInfo.color }}
      >
        <Text 
          className="font-bold"
          style={{ color: featureConfig.requiredTier === "elite" ? "#000" : "#fff" }}
        >
          Upgrade to {requiredTierInfo.name}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Inline upgrade prompt for smaller spaces
 */
function InlineUpgradePrompt({ 
  feature, 
  onUpgrade 
}: { 
  feature: FeatureId; 
  onUpgrade: () => void;
}) {
  const colors = useColors();
  const { isDarkTheme } = useTierAccess();
  const featureConfig = FEATURES[feature];
  const requiredTierInfo = TIERS[featureConfig.requiredTier];
  
  return (
    <TouchableOpacity
      onPress={onUpgrade}
      className="flex-row items-center p-3 rounded-xl"
      style={{ 
        backgroundColor: `${requiredTierInfo.color}15`,
        borderWidth: 1,
        borderColor: `${requiredTierInfo.color}30`,
      }}
    >
      <Text style={{ fontSize: 20, marginRight: 8 }}>🔒</Text>
      <View className="flex-1">
        <Text 
          className="text-sm font-semibold"
          style={{ color: isDarkTheme ? "#fff" : colors.foreground }}
        >
          {featureConfig.name}
        </Text>
        <Text 
          className="text-xs"
          style={{ color: requiredTierInfo.color }}
        >
          Upgrade to {requiredTierInfo.name} to unlock
        </Text>
      </View>
      <Text style={{ color: requiredTierInfo.color }}>→</Text>
    </TouchableOpacity>
  );
}

/**
 * Full upgrade modal with feature comparison
 */
export function UpgradeModal({ 
  visible, 
  onClose,
  targetTier = "premium",
}: { 
  visible: boolean; 
  onClose: () => void;
  targetTier?: "premium" | "elite";
}) {
  const colors = useColors();
  const router = useRouter();
  const { tier, isDarkTheme } = useTierAccess();
  const targetTierInfo = TIERS[targetTier];
  const upgradeFeatures = getUpgradeFeatures(tier, targetTier);
  
  const handleUpgrade = () => {
    onClose();
    // Navigate to upgrade/payment screen or open external link
    // For now, we'll just close the modal
    // router.push("/upgrade");
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View 
        className="flex-1"
        style={{ backgroundColor: targetTier === "elite" ? "#0a0a0a" : colors.background }}
      >
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
          {/* Header */}
          <View className="items-center mb-8 pt-4">
            <View 
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ 
                backgroundColor: `${targetTierInfo.color}20`,
                borderWidth: 2,
                borderColor: targetTierInfo.color,
              }}
            >
              <Text style={{ fontSize: 40 }}>{targetTierInfo.icon}</Text>
            </View>
            
            <Text 
              className="text-3xl font-bold text-center mb-2"
              style={{ color: targetTier === "elite" ? "#fff" : colors.foreground }}
            >
              Upgrade to {targetTierInfo.name}
            </Text>
            
            <Text 
              className="text-base text-center"
              style={{ color: targetTier === "elite" ? "#888" : colors.muted }}
            >
              Unlock powerful features to enhance your reading journey
            </Text>
          </View>
          
          {/* Features List */}
          <View className="mb-8">
            <Text 
              className="text-xs font-bold tracking-widest mb-4"
              style={{ color: targetTierInfo.color }}
            >
              WHAT YOU'LL GET
            </Text>
            
            {upgradeFeatures.map((feature) => (
              <View 
                key={feature.id}
                className="flex-row items-center p-4 rounded-xl mb-3"
                style={{ 
                  backgroundColor: targetTier === "elite" ? "#151515" : colors.surface,
                  borderWidth: 1,
                  borderColor: targetTier === "elite" ? "#333" : colors.border,
                }}
              >
                <View 
                  className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                  style={{ backgroundColor: `${targetTierInfo.color}20` }}
                >
                  <Text style={{ fontSize: 20 }}>{feature.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text 
                    className="text-base font-semibold"
                    style={{ color: targetTier === "elite" ? "#fff" : colors.foreground }}
                  >
                    {feature.name}
                  </Text>
                  <Text 
                    className="text-sm"
                    style={{ color: targetTier === "elite" ? "#888" : colors.muted }}
                  >
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          
          {/* Pricing */}
          <View 
            className="p-6 rounded-2xl mb-6"
            style={{ 
              backgroundColor: `${targetTierInfo.color}15`,
              borderWidth: 2,
              borderColor: targetTierInfo.color,
            }}
          >
            <View className="flex-row items-baseline justify-center mb-2">
              <Text 
                className="text-4xl font-bold"
                style={{ color: targetTier === "elite" ? "#fff" : colors.foreground }}
              >
                ${targetTierInfo.monthlyPrice}
              </Text>
              <Text 
                className="text-base ml-1"
                style={{ color: targetTier === "elite" ? "#888" : colors.muted }}
              >
                /month
              </Text>
            </View>
            <Text 
              className="text-center text-sm"
              style={{ color: targetTier === "elite" ? "#888" : colors.muted }}
            >
              or ${targetTierInfo.yearlyPrice}/year (save 17%)
            </Text>
          </View>
          
          {/* CTA Button */}
          <TouchableOpacity
            onPress={handleUpgrade}
            className="w-full rounded-2xl py-4 mb-4"
            style={{ 
              backgroundColor: targetTierInfo.color,
              shadowColor: targetTierInfo.color,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text 
              className="text-center font-bold text-lg"
              style={{ color: targetTier === "elite" ? "#000" : "#fff" }}
            >
              Upgrade Now
            </Text>
          </TouchableOpacity>
          
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            className="w-full py-3"
          >
            <Text 
              className="text-center"
              style={{ color: targetTier === "elite" ? "#555" : colors.muted }}
            >
              Maybe Later
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

/**
 * Badge component to show user's current tier
 */
export function TierBadge({ size = "medium" }: { size?: "small" | "medium" | "large" }) {
  const { tierInfo, isDarkTheme } = useTierAccess();
  const colors = useColors();
  
  const sizeStyles = {
    small: { padding: 4, fontSize: 10, iconSize: 12 },
    medium: { padding: 8, fontSize: 12, iconSize: 16 },
    large: { padding: 12, fontSize: 14, iconSize: 20 },
  };
  
  const style = sizeStyles[size];
  
  return (
    <View 
      className="flex-row items-center rounded-full"
      style={{ 
        backgroundColor: `${tierInfo.color}20`,
        paddingHorizontal: style.padding * 1.5,
        paddingVertical: style.padding,
      }}
    >
      <Text style={{ fontSize: style.iconSize, marginRight: 4 }}>{tierInfo.icon}</Text>
      <Text 
        className="font-semibold"
        style={{ 
          color: tierInfo.color,
          fontSize: style.fontSize,
        }}
      >
        {tierInfo.name}
      </Text>
    </View>
  );
}
