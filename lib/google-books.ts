/**
 * Google Books API Integration
 * 
 * Provides book search functionality using Google Books API.
 * Falls back to curated books database when API is unavailable.
 */

import { searchCuratedBooks, type CuratedBook } from './curated-books';

export interface GoogleBook {
  id: string;
  title: string;
  authors: string[];
  description?: string;
  pageCount?: number;
  categories?: string[];
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  publishedDate?: string;
  publisher?: string;
}

export interface GoogleBooksResponse {
  items?: Array<{
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
    };
  }>;
  totalItems: number;
}

const GOOGLE_BOOKS_API_BASE = "https://www.googleapis.com/books/v1/volumes";

/**
 * Search for books using Google Books API
 * @param query Search query (book title, author, ISBN, etc.)
 * @param maxResults Maximum number of results to return (default: 10)
 * @returns Array of book results
 */
export async function searchBooks(
  query: string,
  maxResults: number = 10
): Promise<GoogleBook[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const url = `${GOOGLE_BOOKS_API_BASE}?q=${encodedQuery}&maxResults=${maxResults}&printType=books&orderBy=relevance`;

    const response = await fetch(url);
    
    // If API fails or quota exceeded, use curated books
    if (!response.ok) {
      console.log("Google Books API unavailable, using curated books");
      return convertCuratedToGoogleBooks(searchCuratedBooks(query));
    }

    const data: GoogleBooksResponse = await response.json();

    // Check if response has error (quota exceeded)
    if ('error' in data) {
      console.log("Google Books API quota exceeded, using curated books");
      return convertCuratedToGoogleBooks(searchCuratedBooks(query));
    }

    if (!data.items || data.items.length === 0) {
      // No results from API, try curated books
      return convertCuratedToGoogleBooks(searchCuratedBooks(query));
    }

    // Transform Google Books API response to our format
    return data.items.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title || "Unknown Title",
      authors: item.volumeInfo.authors || ["Unknown Author"],
      description: item.volumeInfo.description,
      pageCount: item.volumeInfo.pageCount,
      categories: item.volumeInfo.categories,
      imageLinks: item.volumeInfo.imageLinks,
      publishedDate: item.volumeInfo.publishedDate,
      publisher: item.volumeInfo.publisher,
    }));
  } catch (error) {
    console.log("Error searching books, using curated books:", error);
    return convertCuratedToGoogleBooks(searchCuratedBooks(query));
  }
}

/**
 * Convert curated books to Google Books format
 */
function convertCuratedToGoogleBooks(curatedBooks: CuratedBook[]): GoogleBook[] {
  return curatedBooks.map(book => ({
    id: book.id,
    title: book.title,
    authors: [book.author],
    description: book.description,
    pageCount: book.totalPages,
    categories: [book.category],
    imageLinks: {
      thumbnail: book.coverUrl,
      smallThumbnail: book.coverUrl
    },
    publishedDate: undefined,
    publisher: undefined
  }));
}

/**
 * Get a single book by ID
 * @param bookId Google Books volume ID
 * @returns Book details or null if not found
 */
export async function getBookById(bookId: string): Promise<GoogleBook | null> {
  try {
    const url = `${GOOGLE_BOOKS_API_BASE}/${bookId}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Google Books API error:", response.status, response.statusText);
      return null;
    }

    const data = await response.json();

    return {
      id: data.id,
      title: data.volumeInfo.title || "Unknown Title",
      authors: data.volumeInfo.authors || ["Unknown Author"],
      description: data.volumeInfo.description,
      pageCount: data.volumeInfo.pageCount,
      categories: data.volumeInfo.categories,
      imageLinks: data.volumeInfo.imageLinks,
      publishedDate: data.volumeInfo.publishedDate,
      publisher: data.volumeInfo.publisher,
    };
  } catch (error) {
    console.error("Error fetching book:", error);
    return null;
  }
}

/**
 * Get the best quality cover image URL for a book
 * @param book Google Book object
 * @returns Cover image URL or undefined
 */
export function getBookCoverUrl(book: GoogleBook): string | undefined {
  if (!book.imageLinks) {
    return undefined;
  }

  // Prefer thumbnail over smallThumbnail
  const url = book.imageLinks.thumbnail || book.imageLinks.smallThumbnail;
  
  // Google Books returns http URLs, upgrade to https
  return url?.replace("http://", "https://");
}

/**
 * Get the primary author of a book
 * @param book Google Book object
 * @returns Primary author name
 */
export function getPrimaryAuthor(book: GoogleBook): string {
  if (!book.authors || book.authors.length === 0) {
    return "Unknown Author";
  }
  return book.authors[0];
}

/**
 * Get the primary category of a book
 * @param book Google Book object
 * @returns Primary category or "General"
 */
export function getPrimaryCategory(book: GoogleBook): string {
  if (!book.categories || book.categories.length === 0) {
    return "General";
  }
  return book.categories[0];
}
