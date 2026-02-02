/**
 * Open Library API Integration
 * 
 * API Documentation: https://openlibrary.org/dev/docs/api/search
 * 
 * Free and open API with no rate limits or API key required
 * Maintained by Internet Archive
 */

export interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  number_of_pages_median?: number;
  subject?: string[];
  cover_i?: number;
  isbn?: string[];
  edition_count?: number;
}

export interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  docs: OpenLibraryDoc[];
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
 * Search for books using Open Library API
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
    const url = `https://openlibrary.org/search.json?q=${encodedQuery}&limit=${maxResults}`;

    console.log('[OpenLibrary] Searching:', url);
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[OpenLibrary] API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: OpenLibrarySearchResponse = await response.json();

    if (!data.docs || data.docs.length === 0) {
      console.log('[OpenLibrary] No results found');
      return [];
    }

    console.log(`[OpenLibrary] Found ${data.docs.length} results`);

    // Transform Open Library API response to our format
    return data.docs.map((item) => {
      // Get cover URL if available
      const coverUrl = item.cover_i 
        ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`
        : undefined;

      return {
        id: item.key,
        title: item.title || "Unknown Title",
        author: item.author_name?.join(", ") || "Unknown Author",
        pageCount: item.number_of_pages_median || 0,
        category: item.subject?.[0] || "Uncategorized",
        coverUrl,
        description: undefined, // Open Library search doesn't include descriptions
      };
    });
  } catch (error) {
    console.error("[OpenLibrary] Search failed:", error);
    return [];
  }
}

/**
 * Get detailed information about a specific book by Open Library key
 * @param workKey Open Library work key (e.g., "/works/OL27448W")
 */
export async function getBookDetails(workKey: string): Promise<BookSearchResult | null> {
  try {
    // Remove leading slash if present
    const key = workKey.startsWith('/') ? workKey.slice(1) : workKey;
    const url = `https://openlibrary.org/${key}.json`;

    console.log('[OpenLibrary] Fetching details:', url);
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[OpenLibrary] API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: any = await response.json();

    // Get cover from editions if available
    let coverUrl: string | undefined;
    if (data.covers && data.covers.length > 0) {
      coverUrl = `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`;
    }

    return {
      id: data.key,
      title: data.title || "Unknown Title",
      author: data.authors?.map((a: any) => a.name).join(", ") || "Unknown Author",
      pageCount: 0, // Work endpoint doesn't include page count
      category: data.subjects?.[0] || "Uncategorized",
      coverUrl,
      description: typeof data.description === 'string' 
        ? data.description 
        : data.description?.value,
    };
  } catch (error) {
    console.error("[OpenLibrary] Get details failed:", error);
    return null;
  }
}
