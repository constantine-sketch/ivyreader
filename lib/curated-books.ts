/**
 * Curated Books Database
 * 
 * Fallback book database for when Google Books API is unavailable.
 * Focuses on Huberman bro theme: biohacking, neuroscience, performance, 
 * stoicism, finance, entrepreneurship, and self-optimization.
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
  // Biohacking & Health Optimization
  {
    id: "why-we-sleep",
    title: "Why We Sleep",
    author: "Matthew Walker",
    category: "Neuroscience & Health",
    totalPages: 368,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1556604137i/34466963.jpg",
    description: "A New York Times bestseller and international sensation, this 'stimulating and important book' (Financial Times) is a fascinating dive into the purpose and power of slumber."
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
    id: "outlive",
    title: "Outlive: The Science and Art of Longevity",
    author: "Peter Attia",
    category: "Health & Longevity",
    totalPages: 496,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1672257022i/61153739.jpg",
    description: "A groundbreaking manifesto on living better longer, Outlive transforms our understanding of medicine and longevity."
  },
  {
    id: "huberman-toolkit",
    title: "Huberman Lab Essentials",
    author: "Andrew Huberman",
    category: "Neuroscience & Performance",
    totalPages: 320,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1649270943i/60784546.jpg",
    description: "Science-based tools for everyday life from the Huberman Lab podcast."
  },
  {
    id: "lifespan",
    title: "Lifespan: Why We Age—and Why We Don't Have To",
    author: "David A. Sinclair",
    category: "Longevity & Science",
    totalPages: 432,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1557905837i/43723901.jpg",
    description: "A paradigm-shifting book from an acclaimed Harvard Medical School scientist and one of Time's most influential people."
  },
  {
    id: "dopamine-nation",
    title: "Dopamine Nation",
    author: "Anna Lembke",
    category: "Neuroscience & Addiction",
    totalPages: 304,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1627673942i/55723020.jpg",
    description: "Finding Balance in the Age of Indulgence. This book is about pleasure. It's also about pain."
  },
  {
    id: "body-keeps-score",
    title: "The Body Keeps the Score",
    author: "Bessel van der Kolk",
    category: "Neuroscience & Trauma",
    totalPages: 464,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1594559067i/18693771.jpg",
    description: "Brain, Mind, and Body in the Healing of Trauma. A pioneering researcher transforms our understanding of trauma."
  },
  {
    id: "caffeine-blues",
    title: "Caffeine Blues",
    author: "Stephen Cherniske",
    category: "Health & Nutrition",
    totalPages: 352,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348079429i/240929.jpg",
    description: "Wake Up to the Hidden Dangers of America's #1 Drug."
  },
  {
    id: "genius-foods",
    title: "Genius Foods",
    author: "Max Lugavere",
    category: "Nutrition & Brain Health",
    totalPages: 384,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1516138891i/36204368.jpg",
    description: "Become Smarter, Happier, and More Productive While Protecting Your Brain for Life."
  },
  {
    id: "4-hour-body",
    title: "The 4-Hour Body",
    author: "Timothy Ferriss",
    category: "Biohacking & Fitness",
    totalPages: 592,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1442284431i/7148931.jpg",
    description: "An Uncommon Guide to Rapid Fat-Loss, Incredible Sex, and Becoming Superhuman."
  },

  // Performance & Productivity
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Productivity & Habits",
    totalPages: 320,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones."
  },
  {
    id: "deep-work",
    title: "Deep Work",
    author: "Cal Newport",
    category: "Productivity & Focus",
    totalPages: 296,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1447957962i/25744928.jpg",
    description: "Rules for Focused Success in a Distracted World."
  },
  {
    id: "peak-performance",
    title: "Peak Performance",
    author: "Brad Stulberg",
    category: "Performance & Science",
    totalPages: 256,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1478204855i/31450959.jpg",
    description: "Elevate Your Game, Avoid Burnout, and Thrive with the New Science of Success."
  },
  {
    id: "flow",
    title: "Flow: The Psychology of Optimal Experience",
    author: "Mihaly Csikszentmihalyi",
    category: "Psychology & Performance",
    totalPages: 303,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348932898i/66354.jpg",
    description: "The classic work on how to achieve happiness."
  },
  {
    id: "essentialism",
    title: "Essentialism: The Disciplined Pursuit of Less",
    author: "Greg McKeown",
    category: "Productivity & Focus",
    totalPages: 260,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1403165375i/18077875.jpg",
    description: "Only once you give yourself permission to stop trying to do it all can you make your highest contribution."
  },
  {
    id: "indistractable",
    title: "Indistractable",
    author: "Nir Eyal",
    category: "Focus & Productivity",
    totalPages: 304,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44595007.jpg",
    description: "How to Control Your Attention and Choose Your Life."
  },
  {
    id: "make-time",
    title: "Make Time",
    author: "Jake Knapp",
    category: "Productivity & Time Management",
    totalPages: 304,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1527506860i/37880811.jpg",
    description: "How to Focus on What Matters Every Day."
  },
  {
    id: "hyperfocus",
    title: "Hyperfocus",
    author: "Chris Bailey",
    category: "Focus & Productivity",
    totalPages: 288,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1528482213i/36959766.jpg",
    description: "How to Manage Your Attention in a World of Distraction."
  },

  // Philosophy & Stoicism
  {
    id: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    category: "Philosophy & Stoicism",
    totalPages: 254,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1421618636i/30659.jpg",
    description: "Written in Greek by the only Roman emperor who was also a philosopher."
  },
  {
    id: "letters-stoic",
    title: "Letters from a Stoic",
    author: "Seneca",
    category: "Philosophy & Stoicism",
    totalPages: 254,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328876141i/97411.jpg",
    description: "A philosophy that saw self-possession as the key to an existence lived 'in accordance with nature'."
  },
  {
    id: "obstacle-way",
    title: "The Obstacle Is the Way",
    author: "Ryan Holiday",
    category: "Philosophy & Stoicism",
    totalPages: 224,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1391440316i/18668059.jpg",
    description: "The Timeless Art of Turning Trials into Triumph."
  },
  {
    id: "ego-enemy",
    title: "Ego Is the Enemy",
    author: "Ryan Holiday",
    category: "Philosophy & Self-Improvement",
    totalPages: 256,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1458669193i/27036528.jpg",
    description: "The Fight to Master Our Greatest Opponent."
  },
  {
    id: "stillness-key",
    title: "Stillness Is the Key",
    author: "Ryan Holiday",
    category: "Philosophy & Mindfulness",
    totalPages: 288,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1560181005i/43582733.jpg",
    description: "An Ancient Strategy for Modern Life."
  },
  {
    id: "discourses-epictetus",
    title: "Discourses and Selected Writings",
    author: "Epictetus",
    category: "Philosophy & Stoicism",
    totalPages: 304,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320436091i/428901.jpg",
    description: "The teachings of Epictetus, the great Stoic philosopher."
  },
  {
    id: "man-search-meaning",
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    category: "Philosophy & Psychology",
    totalPages: 184,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1535419394i/4069.jpg",
    description: "Psychiatrist Viktor Frankl's memoir has riveted generations of readers."
  },

  // Finance & Investing
  {
    id: "principles",
    title: "Principles: Life and Work",
    author: "Ray Dalio",
    category: "Business & Finance",
    totalPages: 592,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1536184937i/34536488.jpg",
    description: "Ray Dalio shares the unconventional principles that he's developed, refined, and used."
  },
  {
    id: "intelligent-investor",
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    category: "Finance & Investing",
    totalPages: 640,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1391639419i/106835.jpg",
    description: "The greatest investment advisor of the twentieth century."
  },
  {
    id: "psychology-money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Finance & Psychology",
    totalPages: 256,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1581527774i/41881472.jpg",
    description: "Doing well with money isn't necessarily about what you know. It's about how you behave."
  },
  {
    id: "rich-dad-poor-dad",
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    category: "Finance & Personal Development",
    totalPages: 336,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388211242i/69571.jpg",
    description: "Robert's story of growing up with two dads and the ways in which both men shaped his thoughts about money."
  },
  {
    id: "millionaire-next-door",
    title: "The Millionaire Next Door",
    author: "Thomas J. Stanley",
    category: "Finance & Wealth",
    totalPages: 272,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388267967i/998.jpg",
    description: "The Surprising Secrets of America's Wealthy."
  },
  {
    id: "money-master-game",
    title: "Money: Master the Game",
    author: "Tony Robbins",
    category: "Finance & Investing",
    totalPages: 688,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1414416656i/23014006.jpg",
    description: "7 Simple Steps to Financial Freedom."
  },
  {
    id: "total-money-makeover",
    title: "The Total Money Makeover",
    author: "Dave Ramsey",
    category: "Finance & Budgeting",
    totalPages: 272,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388179999i/78427.jpg",
    description: "A Proven Plan for Financial Fitness."
  },
  {
    id: "simple-path-wealth",
    title: "The Simple Path to Wealth",
    author: "JL Collins",
    category: "Finance & Investing",
    totalPages: 286,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1462912420i/30646587.jpg",
    description: "Your road map to financial independence and a rich, free life."
  },

  // Entrepreneurship & Business
  {
    id: "zero-to-one",
    title: "Zero to One",
    author: "Peter Thiel",
    category: "Business & Entrepreneurship",
    totalPages: 224,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1414347376i/18050143.jpg",
    description: "Notes on Startups, or How to Build the Future."
  },
  {
    id: "lean-startup",
    title: "The Lean Startup",
    author: "Eric Ries",
    category: "Business & Startups",
    totalPages: 336,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1333576876i/10127019.jpg",
    description: "How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses."
  },
  {
    id: "hard-thing-hard-things",
    title: "The Hard Thing About Hard Things",
    author: "Ben Horowitz",
    category: "Business & Leadership",
    totalPages: 304,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1386609333i/18176747.jpg",
    description: "Building a Business When There Are No Easy Answers."
  },
  {
    id: "4-hour-workweek",
    title: "The 4-Hour Workweek",
    author: "Timothy Ferriss",
    category: "Business & Lifestyle",
    totalPages: 416,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1442278214i/368593.jpg",
    description: "Escape 9-5, Live Anywhere, and Join the New Rich."
  },
  {
    id: "almanack-naval",
    title: "The Almanack of Naval Ravikant",
    author: "Eric Jorgenson",
    category: "Business & Philosophy",
    totalPages: 242,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1598011736i/54898389.jpg",
    description: "A Guide to Wealth and Happiness."
  },
  {
    id: "rework",
    title: "Rework",
    author: "Jason Fried",
    category: "Business & Productivity",
    totalPages: 288,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1391275636i/6732019.jpg",
    description: "Change the Way You Work Forever."
  },
  {
    id: "traction",
    title: "Traction",
    author: "Gabriel Weinberg",
    category: "Business & Marketing",
    totalPages: 240,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1409940880i/22091581.jpg",
    description: "How Any Startup Can Achieve Explosive Customer Growth."
  },
  {
    id: "$100m-offers",
    title: "$100M Offers",
    author: "Alex Hormozi",
    category: "Business & Sales",
    totalPages: 224,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1625966570i/58612786.jpg",
    description: "How To Make Offers So Good People Feel Stupid Saying No."
  },
  {
    id: "$100m-leads",
    title: "$100M Leads",
    author: "Alex Hormozi",
    category: "Business & Marketing",
    totalPages: 464,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1690571676i/123951035.jpg",
    description: "How to Get Strangers To Want To Buy Your Stuff."
  },

  // Psychology & Mindset
  {
    id: "thinking-fast-slow",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    category: "Psychology & Economics",
    totalPages: 499,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1317793965i/11468377.jpg",
    description: "A groundbreaking tour of the mind."
  },
  {
    id: "mindset",
    title: "Mindset: The New Psychology of Success",
    author: "Carol S. Dweck",
    category: "Psychology & Growth",
    totalPages: 320,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436227012i/40745.jpg",
    description: "How We Can Learn to Fulfill Our Potential."
  },
  {
    id: "cant-hurt-me",
    title: "Can't Hurt Me",
    author: "David Goggins",
    category: "Biography & Mindset",
    totalPages: 364,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1536184191i/41721428.jpg",
    description: "Master Your Mind and Defy the Odds."
  },
  {
    id: "12-rules-life",
    title: "12 Rules for Life",
    author: "Jordan B. Peterson",
    category: "Self-Help & Philosophy",
    totalPages: 409,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1513104134i/30257963.jpg",
    description: "An Antidote to Chaos."
  },
  {
    id: "power-now",
    title: "The Power of Now",
    author: "Eckhart Tolle",
    category: "Spirituality & Mindfulness",
    totalPages: 236,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1386925535i/6708.jpg",
    description: "A Guide to Spiritual Enlightenment."
  },
  {
    id: "grit",
    title: "Grit: The Power of Passion and Perseverance",
    author: "Angela Duckworth",
    category: "Psychology & Success",
    totalPages: 352,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1457889762i/27213329.jpg",
    description: "The secret to outstanding achievement is not talent but a special blend of passion and persistence."
  },
  {
    id: "influence",
    title: "Influence: The Psychology of Persuasion",
    author: "Robert B. Cialdini",
    category: "Psychology & Persuasion",
    totalPages: 336,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1391026083i/28815.jpg",
    description: "The foundational and wildly popular go-to resource for influence and persuasion."
  },
  {
    id: "predictably-irrational",
    title: "Predictably Irrational",
    author: "Dan Ariely",
    category: "Psychology & Economics",
    totalPages: 384,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320525914i/1713426.jpg",
    description: "The Hidden Forces That Shape Our Decisions."
  },

  // History & Big Ideas
  {
    id: "sapiens",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "History & Philosophy",
    totalPages: 443,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1703329310i/23692271.jpg",
    description: "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution."
  },
  {
    id: "homo-deus",
    title: "Homo Deus: A Brief History of Tomorrow",
    author: "Yuval Noah Harari",
    category: "History & Future",
    totalPages: 464,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1468760805i/31138556.jpg",
    description: "What will happen to us when the myths sustaining our society collapse?"
  },
  {
    id: "21-lessons",
    title: "21 Lessons for the 21st Century",
    author: "Yuval Noah Harari",
    category: "Philosophy & Current Affairs",
    totalPages: 400,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1528879705i/38820046.jpg",
    description: "How do we live in an age of bewilderment?"
  },
  {
    id: "guns-germs-steel",
    title: "Guns, Germs, and Steel",
    author: "Jared Diamond",
    category: "History & Anthropology",
    totalPages: 528,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1453215833i/1842.jpg",
    description: "The Fates of Human Societies."
  },
  {
    id: "antifragile",
    title: "Antifragile",
    author: "Nassim Nicholas Taleb",
    category: "Philosophy & Risk",
    totalPages: 544,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1352422827i/13530973.jpg",
    description: "Things That Gain from Disorder."
  },
  {
    id: "black-swan",
    title: "The Black Swan",
    author: "Nassim Nicholas Taleb",
    category: "Philosophy & Risk",
    totalPages: 480,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1386925471i/242472.jpg",
    description: "The Impact of the Highly Improbable."
  },
  {
    id: "skin-game",
    title: "Skin in the Game",
    author: "Nassim Nicholas Taleb",
    category: "Philosophy & Risk",
    totalPages: 304,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1509737296i/36064445.jpg",
    description: "Hidden Asymmetries in Daily Life."
  },

  // Communication & Relationships
  {
    id: "how-win-friends",
    title: "How to Win Friends and Influence People",
    author: "Dale Carnegie",
    category: "Communication & Relationships",
    totalPages: 288,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1442726934i/4865.jpg",
    description: "The rock-solid, time-tested advice in this book has carried countless people up the ladder of success."
  },
  {
    id: "never-split-difference",
    title: "Never Split the Difference",
    author: "Chris Voss",
    category: "Negotiation & Communication",
    totalPages: 288,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1460910517i/26156469.jpg",
    description: "Negotiating As If Your Life Depended On It."
  },
  {
    id: "crucial-conversations",
    title: "Crucial Conversations",
    author: "Kerry Patterson",
    category: "Communication & Leadership",
    totalPages: 288,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348671415i/15014.jpg",
    description: "Tools for Talking When Stakes Are High."
  },
  {
    id: "difficult-conversations",
    title: "Difficult Conversations",
    author: "Douglas Stone",
    category: "Communication & Conflict",
    totalPages: 352,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1347655097i/774088.jpg",
    description: "How to Discuss What Matters Most."
  },
  {
    id: "5-love-languages",
    title: "The 5 Love Languages",
    author: "Gary Chapman",
    category: "Relationships & Communication",
    totalPages: 208,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1351011214i/23878688.jpg",
    description: "The Secret to Love that Lasts."
  },
  {
    id: "attached",
    title: "Attached",
    author: "Amir Levine",
    category: "Relationships & Psychology",
    totalPages: 304,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328309283i/9547888.jpg",
    description: "The New Science of Adult Attachment and How It Can Help You Find—and Keep—Love."
  },

  // Fitness & Training
  {
    id: "bigger-leaner-stronger",
    title: "Bigger Leaner Stronger",
    author: "Michael Matthews",
    category: "Fitness & Training",
    totalPages: 384,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1393803647i/18656937.jpg",
    description: "The Simple Science of Building the Ultimate Male Body."
  },
  {
    id: "starting-strength",
    title: "Starting Strength",
    author: "Mark Rippetoe",
    category: "Fitness & Strength Training",
    totalPages: 347,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348082898i/2098799.jpg",
    description: "Basic Barbell Training."
  },
  {
    id: "body-science",
    title: "Body by Science",
    author: "John Little",
    category: "Fitness & Exercise Science",
    totalPages: 272,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320447608i/6552779.jpg",
    description: "A Research Based Program for Strength Training, Body building, and Complete Fitness in 12 Minutes a Week."
  },
  {
    id: "born-run",
    title: "Born to Run",
    author: "Christopher McDougall",
    category: "Fitness & Running",
    totalPages: 304,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320531983i/6289283.jpg",
    description: "A Hidden Tribe, Superathletes, and the Greatest Race the World Has Never Seen."
  },
  {
    id: "endure",
    title: "Endure",
    author: "Alex Hutchinson",
    category: "Fitness & Performance",
    totalPages: 320,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1503424678i/34880286.jpg",
    description: "Mind, Body, and the Curiously Elastic Limits of Human Performance."
  },
  {
    id: "oxygen-advantage",
    title: "The Oxygen Advantage",
    author: "Patrick McKeown",
    category: "Fitness & Breathing",
    totalPages: 368,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1426688738i/24933387.jpg",
    description: "Simple, Scientifically Proven Breathing Techniques to Help You Become Healthier, Slimmer, Faster, and Fitter."
  },

  // Learning & Cognition
  {
    id: "make-it-stick",
    title: "Make It Stick",
    author: "Peter C. Brown",
    category: "Learning & Memory",
    totalPages: 313,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1391451471i/18770267.jpg",
    description: "The Science of Successful Learning."
  },
  {
    id: "peak-anders",
    title: "Peak: Secrets from the New Science of Expertise",
    author: "Anders Ericsson",
    category: "Learning & Mastery",
    totalPages: 336,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1455568338i/26312997.jpg",
    description: "The new science of expertise."
  },
  {
    id: "ultralearning",
    title: "Ultralearning",
    author: "Scott H. Young",
    category: "Learning & Skill Acquisition",
    totalPages: 304,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1549431606i/44770129.jpg",
    description: "Master Hard Skills, Outsmart the Competition, and Accelerate Your Career."
  },
  {
    id: "limitless",
    title: "Limitless",
    author: "Jim Kwik",
    category: "Learning & Memory",
    totalPages: 352,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1568985724i/49994260.jpg",
    description: "Upgrade Your Brain, Learn Anything Faster, and Unlock Your Exceptional Life."
  },
  {
    id: "talent-code",
    title: "The Talent Code",
    author: "Daniel Coyle",
    category: "Learning & Skill Development",
    totalPages: 256,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320552628i/5771014.jpg",
    description: "Greatness Isn't Born. It's Grown. Here's How."
  },
  {
    id: "brain-rules",
    title: "Brain Rules",
    author: "John Medina",
    category: "Neuroscience & Learning",
    totalPages: 301,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1347705938i/2251306.jpg",
    description: "12 Principles for Surviving and Thriving at Work, Home, and School."
  },

  // Creativity & Innovation
  {
    id: "creative-act",
    title: "The Creative Act",
    author: "Rick Rubin",
    category: "Creativity & Art",
    totalPages: 432,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1663858936i/60965426.jpg",
    description: "A Way of Being."
  },
  {
    id: "steal-like-artist",
    title: "Steal Like an Artist",
    author: "Austin Kleon",
    category: "Creativity & Inspiration",
    totalPages: 160,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1333669192i/13099738.jpg",
    description: "10 Things Nobody Told You About Being Creative."
  },
  {
    id: "war-art",
    title: "The War of Art",
    author: "Steven Pressfield",
    category: "Creativity & Resistance",
    totalPages: 190,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388344376i/1319.jpg",
    description: "Break Through the Blocks and Win Your Inner Creative Battles."
  },
  {
    id: "show-your-work",
    title: "Show Your Work!",
    author: "Austin Kleon",
    category: "Creativity & Sharing",
    totalPages: 224,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1404575422i/18290401.jpg",
    description: "10 Ways to Share Your Creativity and Get Discovered."
  },

  // Sleep & Recovery
  {
    id: "sleep-smarter",
    title: "Sleep Smarter",
    author: "Shawn Stevenson",
    category: "Health & Sleep",
    totalPages: 272,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1453997818i/25663961.jpg",
    description: "21 Essential Strategies to Sleep Your Way to A Better Body, Better Health, and Bigger Success."
  },
  {
    id: "rest",
    title: "Rest: Why You Get More Done When You Work Less",
    author: "Alex Soojung-Kim Pang",
    category: "Productivity & Recovery",
    totalPages: 304,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1468694993i/29502354.jpg",
    description: "Why You Get More Done When You Work Less."
  },

  // Nutrition & Diet
  {
    id: "food-rules",
    title: "Food Rules: An Eater's Manual",
    author: "Michael Pollan",
    category: "Nutrition & Health",
    totalPages: 112,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328013935i/7015635.jpg",
    description: "An Eater's Manual."
  },
  {
    id: "omnivores-dilemma",
    title: "The Omnivore's Dilemma",
    author: "Michael Pollan",
    category: "Nutrition & Food",
    totalPages: 450,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327882551i/3109.jpg",
    description: "A Natural History of Four Meals."
  },
  {
    id: "salt-sugar-fat",
    title: "Salt Sugar Fat",
    author: "Michael Moss",
    category: "Nutrition & Industry",
    totalPages: 480,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1355248710i/15797397.jpg",
    description: "How the Food Giants Hooked Us."
  },
  {
    id: "good-calories-bad",
    title: "Good Calories, Bad Calories",
    author: "Gary Taubes",
    category: "Nutrition & Science",
    totalPages: 640,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320549038i/146881.jpg",
    description: "Fats, Carbs, and the Controversial Science of Diet and Health."
  },

  // Miscellaneous High-Value
  {
    id: "checklist-manifesto",
    title: "The Checklist Manifesto",
    author: "Atul Gawande",
    category: "Productivity & Systems",
    totalPages: 224,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1352916878i/6667514.jpg",
    description: "How to Get Things Right."
  },
  {
    id: "courage-disliked",
    title: "The Courage to Be Disliked",
    author: "Ichiro Kishimi",
    category: "Philosophy & Self-Help",
    totalPages: 288,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1501715580i/34662042.jpg",
    description: "The Japanese Phenomenon That Shows You How to Change Your Life and Achieve Real Happiness."
  },
  {
    id: "subtle-art",
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    category: "Self-Help & Philosophy",
    totalPages: 224,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1465761302i/28257707.jpg",
    description: "A Counterintuitive Approach to Living a Good Life."
  },
  {
    id: "tribe-mentors",
    title: "Tribe of Mentors",
    author: "Timothy Ferriss",
    category: "Advice & Wisdom",
    totalPages: 624,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1503527067i/36200111.jpg",
    description: "Short Life Advice from the Best in the World."
  },
  {
    id: "tools-titans",
    title: "Tools of Titans",
    author: "Timothy Ferriss",
    category: "Advice & Success",
    totalPages: 707,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1476697874i/31823677.jpg",
    description: "The Tactics, Routines, and Habits of Billionaires, Icons, and World-Class Performers."
  },
  {
    id: "extreme-ownership",
    title: "Extreme Ownership",
    author: "Jocko Willink",
    category: "Leadership & Military",
    totalPages: 320,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1444755563i/23848190.jpg",
    description: "How U.S. Navy SEALs Lead and Win."
  },
  {
    id: "discipline-equals-freedom",
    title: "Discipline Equals Freedom",
    author: "Jocko Willink",
    category: "Self-Discipline & Leadership",
    totalPages: 208,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1494945851i/34431560.jpg",
    description: "Field Manual."
  },
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
