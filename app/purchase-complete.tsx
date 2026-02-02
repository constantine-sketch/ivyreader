import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

/**
 * Deep link handler for post-purchase flow from marketing website
 * 
 * Expected URL format:
 * ivyreader://purchase-complete?tier=premium
 * ivyreader://purchase-complete?tier=elite
 * 
 * Marketing website should redirect here after successful payment
 */
export default function PurchaseCompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colors = useColors();
  
  const { data: user } = trpc.auth.me.useQuery();
  const updateTierMutation = trpc.user.updateSubscriptionTier.useMutation();

  useEffect(() => {
    handlePurchaseComplete();
  }, [params.tier, user]);

  const handlePurchaseComplete = async () => {
    const tier = params.tier as string;
    
    // Validate tier parameter
    if (!tier || !['premium', 'elite'].includes(tier.toLowerCase())) {
      console.error('[PurchaseComplete] Invalid tier:', tier);
      // Redirect to onboarding without tier update
      router.replace("/onboarding/welcome");
      return;
    }

    // Wait for user to be loaded
    if (!user) {
      return;
    }

    try {
      console.log('[PurchaseComplete] Setting user tier to:', tier);
      
      // Update user's subscription tier
      await updateTierMutation.mutateAsync({
        subscriptionTier: tier.toLowerCase() as 'premium' | 'elite',
      });

      console.log('[PurchaseComplete] Tier updated successfully');
      
      // Redirect to onboarding
      router.replace("/onboarding/welcome");
    } catch (error) {
      console.error('[PurchaseComplete] Failed to update tier:', error);
      // Still redirect to onboarding even if tier update fails
      router.replace("/onboarding/welcome");
    }
  };

  return (
    <ScreenContainer className="flex-1 items-center justify-center px-6">
      <ActivityIndicator size="large" color={colors.primary} />
      <Text className="text-lg text-foreground mt-4 text-center">
        Setting up your account...
      </Text>
      <Text className="text-sm text-muted mt-2 text-center">
        Welcome to IvyReader {params.tier === 'elite' ? 'Elite' : 'Premium'}!
      </Text>
    </ScreenContainer>
  );
}
