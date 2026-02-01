import { Text, View, ScrollView, Pressable, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { IconSymbol } from "@/components/ui/icon-symbol";

type SubscriptionTier = "free" | "premium" | "elite";

interface TierFeature {
  text: string;
  included: boolean;
}

interface TierInfo {
  name: string;
  price: string;
  description: string;
  features: TierFeature[];
  cta: string;
}

const TIERS: Record<SubscriptionTier, TierInfo> = {
  free: {
    name: "Free",
    price: "$0",
    description: "Get started with basic reading tracking",
    features: [
      { text: "Track up to 3 books", included: true },
      { text: "Basic reading timer", included: true },
      { text: "Personal notes", included: true },
      { text: "Reading statistics", included: false },
      { text: "Community access", included: false },
      { text: "Curated reading lists", included: false },
      { text: "Group coaching calls", included: false },
      { text: "1-on-1 coaching", included: false },
    ],
    cta: "Current Plan",
  },
  premium: {
    name: "Premium",
    price: "$29",
    description: "Unlock full app access and community",
    features: [
      { text: "Unlimited books", included: true },
      { text: "Advanced reading timer", included: true },
      { text: "Personal notes & highlights", included: true },
      { text: "Detailed reading statistics", included: true },
      { text: "Community access", included: true },
      { text: "Monthly curated reading lists", included: true },
      { text: "Group coaching calls", included: false },
      { text: "1-on-1 coaching", included: false },
    ],
    cta: "Upgrade to Premium",
  },
  elite: {
    name: "Elite",
    price: "$99",
    description: "Premium + accountability and coaching",
    features: [
      { text: "Everything in Premium", included: true },
      { text: "AI reading buddy", included: true },
      { text: "Accountability partner matching", included: true },
      { text: "Weekly group coaching calls", included: true },
      { text: "Personalized reading plans", included: true },
      { text: "Priority support", included: true },
      { text: "Monthly 1-on-1 coaching call", included: true },
      { text: "Exclusive community access", included: true },
    ],
    cta: "Upgrade to Elite",
  },
};

export default function SubscriptionScreen() {
  const colors = useColors();
  const { data: user } = trpc.auth.me.useQuery();
  const currentTier = user?.subscriptionTier || "free";

  const handleSelectTier = (tier: SubscriptionTier) => {
    if (tier === currentTier) {
      Alert.alert("Current Plan", "You're already on this plan");
      return;
    }

    if (tier === "free") {
      Alert.alert("Downgrade", "Contact support to downgrade your plan");
      return;
    }

    // TODO: Navigate to Stripe checkout
    Alert.alert(
      "Coming Soon",
      `Stripe integration will be added once your Stripe Atlas account is approved. You'll be able to upgrade to ${TIERS[tier].name} for ${TIERS[tier].price}/month.`
    );
  };

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 p-6">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-4 flex-row items-center"
          style={{ opacity: 0.8 }}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
          <Text className="text-base ml-1" style={{ color: colors.foreground }}>
            Back
          </Text>
        </TouchableOpacity>

        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Choose Your Plan
          </Text>
          <Text className="text-base text-muted">
            Select the plan that best fits your reading goals
          </Text>
        </View>

        <View className="gap-4">
          {(Object.keys(TIERS) as SubscriptionTier[]).map((tier) => {
            const tierInfo = TIERS[tier];
            const isCurrentTier = tier === currentTier;

            return (
              <View
                key={tier}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: isCurrentTier ? colors.primary : colors.border,
                  borderWidth: isCurrentTier ? 2 : 1,
                }}
                className="rounded-2xl p-6"
              >
                {isCurrentTier && (
                  <View
                    style={{ backgroundColor: colors.primary }}
                    className="absolute top-4 right-4 px-3 py-1 rounded-full"
                  >
                    <Text className="text-xs font-semibold text-background">
                      CURRENT
                    </Text>
                  </View>
                )}

                <Text className="text-2xl font-bold text-foreground mb-1">
                  {tierInfo.name}
                </Text>
                <View className="flex-row items-baseline mb-2">
                  <Text className="text-4xl font-bold text-foreground">
                    {tierInfo.price}
                  </Text>
                  {tier !== "free" && (
                    <Text className="text-lg text-muted ml-1">/month</Text>
                  )}
                </View>
                <Text className="text-sm text-muted mb-4">
                  {tierInfo.description}
                </Text>

                <View className="mb-4 gap-2">
                  {tierInfo.features.map((feature, index) => (
                    <View key={index} className="flex-row items-center gap-2">
                      <Text
                        style={{
                          color: feature.included ? colors.success : colors.muted,
                        }}
                        className="text-lg"
                      >
                        {feature.included ? "✓" : "○"}
                      </Text>
                      <Text
                        style={{
                          color: feature.included ? colors.foreground : colors.muted,
                        }}
                        className="text-sm flex-1"
                      >
                        {feature.text}
                      </Text>
                    </View>
                  ))}
                </View>

                <Pressable
                  onPress={() => handleSelectTier(tier)}
                  disabled={isCurrentTier}
                  style={({ pressed }) => [
                    {
                      backgroundColor: isCurrentTier
                        ? colors.border
                        : colors.primary,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  className="py-4 rounded-xl items-center"
                >
                  <Text
                    style={{
                      color: isCurrentTier ? colors.muted : colors.background,
                    }}
                    className="text-base font-semibold"
                  >
                    {isCurrentTier ? "Current Plan" : tierInfo.cta}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        <View className="mt-6 p-4 bg-surface rounded-xl">
          <Text className="text-sm text-muted text-center">
            All plans include a 7-day free trial. Cancel anytime.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
