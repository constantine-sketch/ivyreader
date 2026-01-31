/**
 * Curated Books Database
 * 
 * Fallback book database for when Google Books API is unavailable.
 * Focuses on finance, philosophy, and self-improvement books.
 */

export interface CuratedBook {
  id: string;
  title: string;
  author: string;
  category: string;
  totalPages: number;
  coverUrl: string;
  description: string;
}

export const CURATED_BOOKS: CuratedBook[] = [
  {
    id: "principles",
    title: "Principles: Life and Work",
    author: "Ray Dalio",
    category: "Business & Finance",
    totalPages: 592,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1536184937i/34536488.jpg",
    description: "Ray Dalio, one of the world's most successful investors and entrepreneurs, shares the unconventional principles that he's developed, refined, and used over the past forty years to create unique results in both life and business."
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    totalPages: 320,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones. No matter your goals, Atomic Habits offers a proven framework for improving--every day."
  },
  {
    id: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    category: "Philosophy",
    totalPages: 254,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1421618636i/30659.jpg",
    description: "Written in Greek by the only Roman emperor who was also a philosopher, without any intention of publication, the Meditations of Marcus Aurelius offer a remarkable series of challenging spiritual reflections."
  },
  {
    id: "zero-to-one",
    title: "Zero to One",
    author: "Peter Thiel",
    category: "Business & Entrepreneurship",
    totalPages: 224,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1414347376i/18050143.jpg",
    description: "The great secret of our time is that there are still uncharted frontiers to explore and new inventions to create. In Zero to One, legendary entrepreneur and investor Peter Thiel shows how we can find singular ways to create those new things."
  },
  {
    id: "intelligent-investor",
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    category: "Finance & Investing",
    totalPages: 640,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1391639419i/106835.jpg",
    description: "This classic text is annotated to update Graham's timeless wisdom for today's market conditions. The greatest investment advisor of the twentieth century, Benjamin Graham, taught and inspired people worldwide."
  },
  {
    id: "why-we-sleep",
    title: "Why We Sleep",
    author: "Matthew Walker",
    category: "Science & Health",
    totalPages: 368,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1556604137i/34466963.jpg",
    description: "A New York Times bestseller and international sensation, this 'stimulating and important book' (Financial Times) is a fascinating dive into the purpose and power of slumber."
  },
  {
    id: "almanack-naval",
    title: "The Almanack of Naval Ravikant",
    author: "Eric Jorgenson",
    category: "Business & Philosophy",
    totalPages: 242,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1598011736i/54898389.jpg",
    description: "Getting rich is not just about luck; happiness is not just a trait we are born with. These aspirations may seem out of reach, but building wealth and being happy are skills we can learn."
  },
  {
    id: "thinking-fast-slow",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    category: "Psychology & Economics",
    totalPages: 499,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1317793965i/11468377.jpg",
    description: "Daniel Kahneman, the renowned psychologist and winner of the Nobel Prize in Economics, takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think."
  },
  {
    id: "sapiens",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "History & Philosophy",
    totalPages: 443,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1703329310i/23692271.jpg",
    description: "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution—a #1 international bestseller—that explores the ways in which biology and history have defined us."
  },
  {
    id: "deep-work",
    title: "Deep Work",
    author: "Cal Newport",
    category: "Productivity & Success",
    totalPages: 296,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1447957962i/25744928.jpg",
    description: "Deep work is the ability to focus without distraction on a cognitively demanding task. It's a skill that allows you to quickly master complicated information and produce better results in less time."
  },
  {
    id: "breath",
    title: "Breath: The New Science of a Lost Art",
    author: "James Nestor",
    category: "Health & Science",
    totalPages: 304,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1577639045i/48890486.jpg",
    description: "No matter what you eat, how much you exercise, how skinny or young or wise you are, none of it matters if you're not breathing properly."
  },
  {
    id: "man-search-meaning",
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    category: "Philosophy & Psychology",
    totalPages: 184,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1535419394i/4069.jpg",
    description: "Psychiatrist Viktor Frankl's memoir has riveted generations of readers with its descriptions of life in Nazi death camps and its lessons for spiritual survival."
  },
  {
    id: "four-hour-workweek",
    title: "The 4-Hour Workweek",
    author: "Timothy Ferriss",
    category: "Business & Lifestyle",
    totalPages: 416,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1442278214i/368593.jpg",
    description: "Forget the old concept of retirement and the rest of the deferred-life plan–there is no need to wait and every reason not to, especially in unpredictable economic times."
  },
  {
    id: "letters-stoic",
    title: "Letters from a Stoic",
    author: "Seneca",
    category: "Philosophy",
    totalPages: 254,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328876141i/97411.jpg",
    description: "A philosophy that saw self-possession as the key to an existence lived 'in accordance with nature', Stoicism called for the restraint of animal instincts and the severing of emotional ties."
  },
  {
    id: "cant-hurt-me",
    title: "Can't Hurt Me",
    author: "David Goggins",
    category: "Biography & Self-Help",
    totalPages: 364,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1536184191i/41721428.jpg",
    description: "For David Goggins, childhood was a nightmare - poverty, prejudice, and physical abuse colored his days and haunted his nights. But through self-discipline, mental toughness, and hard work, Goggins transformed himself."
  },
  {
    id: "psychology-money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Finance & Psychology",
    totalPages: 256,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1581527774i/41881472.jpg",
    description: "Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people."
  },
  {
    id: "12-rules-life",
    title: "12 Rules for Life",
    author: "Jordan B. Peterson",
    category: "Self-Help & Philosophy",
    totalPages: 409,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1513104134i/30257963.jpg",
    description: "What does everyone in the modern world need to know? Renowned psychologist Jordan B. Peterson's answer to this most difficult of questions uniquely combines the hard-won truths of ancient tradition with the stunning revelations of cutting-edge scientific research."
  },
  {
    id: "power-now",
    title: "The Power of Now",
    author: "Eckhart Tolle",
    category: "Spirituality & Self-Help",
    totalPages: 236,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1386925535i/6708.jpg",
    description: "To make the journey into the Now we will need to leave our analytical mind and its false created self, the ego, behind. From the very first page of Eckhart Tolle's extraordinary book, we move rapidly into a significantly higher altitude."
  },
  {
    id: "obstacle-way",
    title: "The Obstacle Is the Way",
    author: "Ryan Holiday",
    category: "Philosophy & Self-Help",
    totalPages: 224,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1391440316i/18668059.jpg",
    description: "The Obstacle Is the Way reveals how great individuals throughout history—from John D. Rockefeller to Amelia Earhart to Ulysses S. Grant to Steve Jobs—have applied stoicism to overcome difficult or even impossible situations."
  },
  {
    id: "rich-dad-poor-dad",
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    category: "Finance & Personal Development",
    totalPages: 336,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388211242i/69571.jpg",
    description: "Rich Dad Poor Dad is Robert's story of growing up with two dads — his real father and the father of his best friend, his rich dad — and the ways in which both men shaped his thoughts about money and investing."
  }
];

/**
 * Search curated books by title or author
 */
export function searchCuratedBooks(query: string): CuratedBook[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase().trim();
  
  return CURATED_BOOKS.filter(book => 
    book.title.toLowerCase().includes(lowerQuery) ||
    book.author.toLowerCase().includes(lowerQuery) ||
    book.category.toLowerCase().includes(lowerQuery)
  ).slice(0, 10); // Return max 10 results
}
