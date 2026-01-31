/**
 * Google Books API Integration
 * 
 * API Documentation: https://developers.google.com/books/docs/v1/using
 * 
 * Free tier: 1,000 requests per day
 * No API key required for basic usage (but recommended for higher limits)
 */

export interface GoogleBookVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    publishedDate?: string;
    publisher?: string;
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
}

export interface GoogleBooksSearchResponse {
  items?: GoogleBookVolume[];
  totalItems: number;
}

export interface BookSearchResult {
  id: string;
  title: string;
  author: string;
  pageCount: number;
  category: string;
  coverUrl?: string;
  description?: string;
}

/**
 * Search for books using Google Books API
 * @param query Search query (title, author, ISBN, etc.)
 * @param maxResults Maximum number of results to return (default: 10)
 */
export async function searchBooks(
  query: string,
  maxResults: number = 10
): Promise<BookSearchResult[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&maxResults=${maxResults}&printType=books`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[GoogleBooks] API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: GoogleBooksSearchResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    // Transform Google Books API response to our format
    return data.items.map((item) => {
      const info = item.volumeInfo;
      return {
        id: item.id,
        title: info.title || "Unknown Title",
        author: info.authors?.join(", ") || "Unknown Author",
        pageCount: info.pageCount || 0,
        category: info.categories?.[0] || "Uncategorized",
        coverUrl: info.imageLinks?.thumbnail?.replace("http://", "https://") || undefined,
        description: info.description,
      };
    });
  } catch (error) {
    console.error("[GoogleBooks] Search failed:", error);
    return [];
  }
}

/**
 * Get detailed information about a specific book by Google Books ID
 * @param bookId Google Books volume ID
 */
export async function getBookDetails(bookId: string): Promise<BookSearchResult | null> {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[GoogleBooks] API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const item: GoogleBookVolume = await response.json();
    const info = item.volumeInfo;

    return {
      id: item.id,
      title: info.title || "Unknown Title",
      author: info.authors?.join(", ") || "Unknown Author",
      pageCount: info.pageCount || 0,
      category: info.categories?.[0] || "Uncategorized",
      coverUrl: info.imageLinks?.thumbnail?.replace("http://", "https://") || undefined,
      description: info.description,
    };
  } catch (error) {
    console.error("[GoogleBooks] Get details failed:", error);
    return null;
  }
}
