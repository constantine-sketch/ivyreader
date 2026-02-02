import { ReactNode, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { LoginScreen } from "./login-screen";
import { useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";

interface AuthWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper component that handles authentication state.
 * Shows login screen if not authenticated, otherwise shows the app.
 * Uses tRPC auth.me query for accurate onboarding status from database.
 */
export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading: authLoading } = useAuth();
  const colors = useColors();
  const router = useRouter();
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);
  
  // Use tRPC query to get fresh user data from database
  // This ensures we have the latest onboardingCompleted status
  const { data: dbUser, isLoading: dbLoading, refetch } = trpc.auth.me.useQuery(undefined, {
    enabled: !!user, // Only query when user is authenticated
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  
  // Check if user needs onboarding using fresh DB data
  useEffect(() => {
    if (user && !authLoading && !dbLoading && dbUser !== undefined) {
      const onboardingCompleted = dbUser?.onboardingCompleted;
      console.log("[AuthWrapper] Checking onboarding status:", {
        hasUser: !!user,
        dbUser: dbUser ? { id: dbUser.id, onboardingCompleted } : null,
        onboardingCompleted,
      });
      
      if (!onboardingCompleted) {
        console.log("[AuthWrapper] User needs onboarding, redirecting...");
        router.replace("/onboarding/welcome");
      } else {
        console.log("[AuthWrapper] User has completed onboarding");
        setHasCheckedOnboarding(true);
      }
    }
  }, [user, authLoading, dbLoading, dbUser, router]);

  // Show loading spinner while checking auth status or fetching user data
  if (authLoading || (user && dbLoading)) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return <LoginScreen />;
  }

  // Wait for onboarding check to complete before showing app
  // This prevents flash of main app before redirect to onboarding
  if (!hasCheckedOnboarding && dbUser && !dbUser.onboardingCompleted) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // User is authenticated and has completed onboarding, show the app
  return <>{children}</>;
}
