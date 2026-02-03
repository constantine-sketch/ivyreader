import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLoginUrl } from "@/constants/oauth";

/**
 * Deep link handler for post-purchase flow from marketing website
 * 
 * Expected URL format:
 * ivyreader://purchase-complete?tier=premium
 * ivyreader://purchase-complete?tier=elite
 * 
 * Marketing website should redirect here after successful payment
 * 
 * Flow:
 * 1. If not logged in -> Store tier in AsyncStorage, redirect to login
 * 2. If logged in -> Update tier, redirect to onboarding or main app
 */

const PENDING_TIER_KEY = "ivyreader_pending_tier";

export default function PurchaseCompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colors = useColors();
  const [status, setStatus] = useState<"loading" | "needs_login" | "processing">("loading");
  
  const { data: user, isLoading: userLoading, error: userError } = trpc.auth.me.useQuery();
  const updateTierMutation = trpc.user.updateSubscriptionTier.useMutation();

  const tier = (params.tier as string)?.toLowerCase();
  const isValidTier = tier && ['premium', 'elite'].includes(tier);
  const tierDisplay = tier === 'elite' ? 'Elite' : 'Premium';
  const accentColor = tier === 'elite' ? '#FFD700' : '#D4A574';

  useEffect(() => {
    handlePurchaseFlow();
  }, [user, userLoading, userError]);

  const handlePurchaseFlow = async () => {
    // Still loading user data
    if (userLoading) {
      return;
    }

    // Store the tier for later (after login)
    if (isValidTier) {
      await AsyncStorage.setItem(PENDING_TIER_KEY, tier);
    }

    // User is not logged in - show login prompt
    if (userError || !user) {
      console.log('[PurchaseComplete] User not authenticated, showing login prompt');
      setStatus("needs_login");
      return;
    }

    // User is logged in - process the tier update
    setStatus("processing");
    await processTierUpdate();
  };

  const processTierUpdate = async () => {
    if (!user) return;

    // Get tier from params or stored pending tier
    let tierToSet = tier;
    if (!isValidTier) {
      const storedTier = await AsyncStorage.getItem(PENDING_TIER_KEY);
      if (storedTier && ['premium', 'elite'].includes(storedTier)) {
        tierToSet = storedTier;
      }
    }

    if (!tierToSet) {
      console.log('[PurchaseComplete] No valid tier, redirecting based on onboarding status');
      redirectBasedOnOnboarding();
      return;
    }

    try {
      console.log('[PurchaseComplete] Setting user tier to:', tierToSet);
      
      // Update user's subscription tier
      await updateTierMutation.mutateAsync({
        subscriptionTier: tierToSet as 'premium' | 'elite',
      });

      console.log('[PurchaseComplete] Tier updated successfully');
      
      // Clear the pending tier
      await AsyncStorage.removeItem(PENDING_TIER_KEY);
      
      redirectBasedOnOnboarding();
    } catch (error) {
      console.error('[PurchaseComplete] Failed to update tier:', error);
      redirectBasedOnOnboarding();
    }
  };

  const redirectBasedOnOnboarding = () => {
    if (user?.onboardingCompleted) {
      console.log('[PurchaseComplete] User has completed onboarding, redirecting to main app');
      router.replace("/(tabs)");
    } else {
      console.log('[PurchaseComplete] User needs onboarding, redirecting to welcome');
      router.replace("/onboarding/welcome");
    }
  };

  const handleSignIn = () => {
    // Navigate to the login/auth flow
    // The tier is already stored in AsyncStorage, so after login
    // the user will be redirected back here to complete the flow
    if (Platform.OS === 'web') {
      // On web, redirect to OAuth portal
      window.location.href = getLoginUrl();
    } else {
      // On native, use the auth flow
      router.push("/");
    }
  };

  // Show login prompt for unauthenticated users
  if (status === "needs_login") {
    return (
      <ScreenContainer className="flex-1 items-center justify-center px-6">
        <View className="items-center">
          <Text style={{ fontSize: 64, marginBottom: 16 }}>
            {tier === 'elite' ? '👑' : '⭐'}
          </Text>
          <Text className="text-2xl font-bold text-foreground text-center mb-2">
            Welcome to {tierDisplay}!
          </Text>
          <Text className="text-base text-muted text-center mb-8 max-w-xs">
            Sign in to activate your {tierDisplay} membership and start your reading journey.
          </Text>
          
          <TouchableOpacity
            onPress={handleSignIn}
            className="px-8 py-4 rounded-xl mb-4"
            style={{ backgroundColor: accentColor }}
          >
            <Text className="text-base font-bold" style={{ color: tier === 'elite' ? '#000' : '#fff' }}>
              Sign In to Continue
            </Text>
          </TouchableOpacity>
          
          <Text className="text-sm text-muted text-center">
            Your {tierDisplay} subscription will be activated after sign in
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  // Loading/processing state
  return (
    <ScreenContainer className="flex-1 items-center justify-center px-6">
      <ActivityIndicator size="large" color={accentColor} />
      <Text className="text-lg text-foreground mt-4 text-center">
        {status === "processing" ? "Activating your membership..." : "Setting up your account..."}
      </Text>
      <Text className="text-sm text-muted mt-2 text-center">
        Welcome to IvyReader {tierDisplay}!
      </Text>
    </ScreenContainer>
  );
}
