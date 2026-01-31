import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

export default function EditBookScreen() {
  const colors = useColors();
  const router = useRouter();
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [category, setCategory] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: books, isLoading } = trpc.books.list.useQuery();
  const updateBook = trpc.books.update.useMutation();
  const utils = trpc.useUtils();

  const book = books?.find(b => b.id === parseInt(bookId));

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setTotalPages(book.totalPages.toString());
      setCategory(book.category || "");
      setCoverUrl(book.coverUrl || "");
    }
  }, [book]);

  const handleUpdate = async () => {
    if (!title || !author) {
      alert("Please provide at least a title and author");
      return;
    }

    try {
      setIsUpdating(true);
      await updateBook.mutateAsync({
        id: parseInt(bookId),
        title,
        author,
        totalPages: parseInt(totalPages) || 100,
        category: category || "Uncategorized",
        coverUrl: coverUrl || null,
      });

      // Invalidate cache to trigger refresh
      await utils.books.list.invalidate();

      alert(`"${title}" updated successfully!`);
      router.back();
    } catch (error) {
      console.error("Failed to update book:", error);
      alert("Failed to update book. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !book) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1">
            {/* Header */}
            <View className="mb-6">
              <Text className="text-3xl font-bold text-foreground mb-2">Edit Book</Text>
              <Text className="text-base text-muted">
                Update book information
              </Text>
            </View>

            {/* Current Cover Preview */}
            {coverUrl && (
              <View className="mb-6 items-center">
                <Image
                  source={{ uri: coverUrl }}
                  style={{
                    width: 120,
                    height: 180,
                    borderRadius: 12,
                    backgroundColor: colors.border,
                  }}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Form Fields */}
            <View className="gap-4">
              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Title *
                </Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter book title"
                  placeholderTextColor={colors.muted}
                  returnKeyType="next"
                  className="p-4 rounded-lg text-foreground"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    color: colors.foreground,
                  }}
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Author *
                </Text>
                <TextInput
                  value={author}
                  onChangeText={setAuthor}
                  placeholder="Enter author name"
                  placeholderTextColor={colors.muted}
                  returnKeyType="next"
                  className="p-4 rounded-lg text-foreground"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    color: colors.foreground,
                  }}
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Total Pages
                </Text>
                <TextInput
                  value={totalPages}
                  onChangeText={setTotalPages}
                  placeholder="Enter total pages"
                  placeholderTextColor={colors.muted}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  className="p-4 rounded-lg text-foreground"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    color: colors.foreground,
                  }}
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Category
                </Text>
                <TextInput
                  value={category}
                  onChangeText={setCategory}
                  placeholder="e.g., Fiction, Business, Self-Help"
                  placeholderTextColor={colors.muted}
                  returnKeyType="next"
                  className="p-4 rounded-lg text-foreground"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    color: colors.foreground,
                  }}
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Cover URL
                </Text>
                <TextInput
                  value={coverUrl}
                  onChangeText={setCoverUrl}
                  placeholder="Enter image URL (optional)"
                  placeholderTextColor={colors.muted}
                  returnKeyType="done"
                  autoCapitalize="none"
                  className="p-4 rounded-lg text-foreground"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    color: colors.foreground,
                  }}
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3 mt-8">
              <Pressable
                onPress={() => router.back()}
                className="flex-1 py-4 rounded-lg items-center"
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text className="text-sm font-bold text-foreground">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleUpdate}
                disabled={isUpdating || !title || !author}
                className="flex-1 py-4 rounded-lg items-center"
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed || isUpdating || !title || !author ? 0.7 : 1,
                  },
                ]}
              >
                {isUpdating ? (
                  <ActivityIndicator color={colors.background} size="small" />
                ) : (
                  <Text
                    className="text-sm font-bold"
                    style={{ color: colors.background }}
                  >
                    Update Book
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
