import { ReactNode } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "@/hooks/use-auth";
import { useColors } from "@/hooks/use-colors";
import { LoginScreen } from "./login-screen";

interface AuthWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper component that handles authentication state.
 * Shows login screen if not authenticated, otherwise shows the app.
 */
export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading } = useAuth();
  const colors = useColors();

  // Show loading spinner while checking auth status
  if (loading) {
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

  // User is authenticated, show the app
  return <>{children}</>;
}
