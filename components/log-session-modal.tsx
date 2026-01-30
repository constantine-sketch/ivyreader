import { useState } from "react";
import { View, Text, TextInput, Pressable, Modal, ActivityIndicator } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface LogSessionModalProps {
  visible: boolean;
  onClose: () => void;
  bookId: number;
  bookTitle: string;
  currentPage: number;
  totalPages: number;
  onSessionLogged: (startPage: number, endPage: number, duration: number) => Promise<void>;
}

export function LogSessionModal({
  visible,
  onClose,
  bookId,
  bookTitle,
  currentPage,
  totalPages,
  onSessionLogged,
}: LogSessionModalProps) {
  const colors = useColors();
  const [startPage, setStartPage] = useState(currentPage.toString());
  const [endPage, setEndPage] = useState("");
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    // Validate inputs
    const start = parseInt(startPage);
    const end = parseInt(endPage);
    const mins = parseInt(duration);

    if (isNaN(start) || isNaN(end) || isNaN(mins)) {
      setError("Please enter valid numbers");
      return;
    }

    if (start >= end) {
      setError("End page must be greater than start page");
      return;
    }

    if (end > totalPages) {
      setError(`End page cannot exceed ${totalPages}`);
      return;
    }

    if (mins <= 0) {
      setError("Duration must be greater than 0");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // Call the mutation with session data
      await onSessionLogged(start, end, mins);
      
      // Reset form and close
      setStartPage(end.toString());
      setEndPage("");
      setDuration("");
      onClose();
    } catch (err) {
      setError("Failed to log session. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onPress={onClose}
      >
        <Pressable 
          className="w-11/12 max-w-md rounded-2xl p-6"
          style={{ backgroundColor: colors.background }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="mb-4">
            <Text className="text-2xl font-bold text-foreground mb-1">
              Log Reading Session
            </Text>
            <Text className="text-sm text-muted">
              {bookTitle}
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4 mb-4">
            {/* Start Page */}
            <View>
              <Text className="text-sm text-muted mb-2">Start Page</Text>
              <TextInput
                value={startPage}
                onChangeText={setStartPage}
                keyboardType="number-pad"
                className="rounded-lg px-4 py-3 text-foreground"
                style={{ 
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                placeholder="e.g., 1"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* End Page */}
            <View>
              <Text className="text-sm text-muted mb-2">End Page</Text>
              <TextInput
                value={endPage}
                onChangeText={setEndPage}
                keyboardType="number-pad"
                className="rounded-lg px-4 py-3 text-foreground"
                style={{ 
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                placeholder="e.g., 25"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Duration */}
            <View>
              <Text className="text-sm text-muted mb-2">Duration (minutes)</Text>
              <TextInput
                value={duration}
                onChangeText={setDuration}
                keyboardType="number-pad"
                className="rounded-lg px-4 py-3 text-foreground"
                style={{ 
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                placeholder="e.g., 30"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Pages Read Preview */}
            {endPage && startPage && !isNaN(parseInt(endPage)) && !isNaN(parseInt(startPage)) && (
              <View className="rounded-lg p-3" style={{ backgroundColor: colors.surface }}>
                <Text className="text-sm text-muted">
                  Pages to log: <Text className="font-bold" style={{ color: colors.primary }}>
                    {parseInt(endPage) - parseInt(startPage)}
                  </Text>
                </Text>
              </View>
            )}
          </View>

          {/* Error Message */}
          {error && (
            <View className="mb-4 p-3 rounded-lg" style={{ backgroundColor: colors.error + '20' }}>
              <Text className="text-sm" style={{ color: colors.error }}>
                {error}
              </Text>
            </View>
          )}

          {/* Actions */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={onClose}
              className="flex-1 py-3 rounded-lg items-center"
              style={({ pressed }) => [{ 
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.7 : 1
              }]}
              disabled={isSubmitting}
            >
              <Text className="font-bold text-foreground">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleSubmit}
              className="flex-1 py-3 rounded-lg items-center"
              style={({ pressed }) => [{ 
                backgroundColor: colors.primary,
                opacity: pressed ? 0.8 : 1
              }]}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <Text className="font-bold" style={{ color: colors.background }}>
                  Log Session
                </Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
