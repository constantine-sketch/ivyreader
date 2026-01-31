import { Modal, View, Text, Pressable, ScrollView, Image } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface Book {
  id: number;
  title: string;
  author: string;
  currentPage: number;
  totalPages: number;
  category?: string;
  coverUrl?: string | null;
}

interface BookPickerModalProps {
  visible: boolean;
  books: Book[];
  onClose: () => void;
  onSelectBook: (book: Book) => void;
}

export function BookPickerModal({ visible, books, onClose, onSelectBook }: BookPickerModalProps) {
  const colors = useColors();
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onPress={onClose}
      >
        <Pressable
          className="w-11/12 max-w-md rounded-2xl p-6"
          style={{ backgroundColor: colors.background }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="mb-4">
            <Text className="text-xl font-bold text-foreground mb-2">
              Select a Book
            </Text>
            <Text className="text-sm text-muted">
              Choose which book you'd like to read
            </Text>
          </View>
          
          {/* Book List */}
          <ScrollView 
            className="max-h-96"
            showsVerticalScrollIndicator={false}
          >
            {books.length === 0 ? (
              <View className="py-8 items-center">
                <Text className="text-sm text-muted text-center">
                  No books in your library yet. Add a book to get started!
                </Text>
              </View>
            ) : (
              <View className="gap-2">
                {books.map((book) => {
                  const progressPercentage = Math.round((book.currentPage / book.totalPages) * 100);
                  
                  return (
                    <Pressable
                      key={book.id}
                      onPress={() => {
                        onSelectBook(book);
                        onClose();
                      }}
                      className="p-4 rounded-xl"
                      style={({ pressed }) => [
                        {
                          backgroundColor: colors.surface,
                          opacity: pressed ? 0.7 : 1,
                        },
                      ]}
                    >
                      <View className="flex-row items-start mb-2">
                        {/* Book Cover */}
                        {book.coverUrl ? (
                          <Image
                            source={{ uri: book.coverUrl }}
                            className="w-16 h-24 rounded-lg mr-3"
                            style={{ backgroundColor: colors.border }}
                            resizeMode="cover"
                          />
                        ) : (
                          <View 
                            className="w-16 h-24 rounded-lg mr-3 items-center justify-center"
                            style={{ backgroundColor: colors.border }}
                          >
                            <Text className="text-2xl">📚</Text>
                          </View>
                        )}
                        
                        <View className="flex-1">
                          <Text className="text-sm font-bold text-foreground mb-1" numberOfLines={2}>
                            {book.title}
                          </Text>
                          <Text className="text-xs text-muted mb-1">
                            {book.author}
                          </Text>
                          {book.category && (
                            <Text className="text-xs" style={{ color: colors.primary }}>
                              {book.category}
                            </Text>
                          )}
                        </View>
                      </View>
                      
                      {/* Progress */}
                      <View>
                        <View className="flex-row justify-between mb-1">
                          <Text className="text-xs text-muted">
                            Page {book.currentPage} of {book.totalPages}
                          </Text>
                          <Text className="text-xs font-bold" style={{ color: colors.primary }}>
                            {progressPercentage}%
                          </Text>
                        </View>
                        <View className="h-1.5 rounded-full" style={{ backgroundColor: colors.border }}>
                          <View
                            className="h-1.5 rounded-full"
                            style={{
                              backgroundColor: colors.primary,
                              width: `${progressPercentage}%`,
                            }}
                          />
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </ScrollView>
          
          {/* Cancel Button */}
          <Pressable
            onPress={onClose}
            className="mt-4 py-3 rounded-lg items-center"
            style={({ pressed }) => [
              {
                backgroundColor: colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text className="text-sm font-bold text-foreground">
              Cancel
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
