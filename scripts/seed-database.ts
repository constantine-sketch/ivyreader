import { getDb } from "../server/db";
import * as db from "../server/db";

// Demo users (80% male, finance bro demographic)
const demoUsers = [
  { id: 1, name: "Marcus Chen", email: "marcus@example.com" },
  { id: 2, name: "Alex Rivera", email: "alex@example.com" },
  { id: 3, name: "James Thompson", email: "james@example.com" },
  { id: 4, name: "Ryan Park", email: "ryan@example.com" },
  { id: 5, name: "David Kim", email: "david@example.com" },
  { id: 6, name: "Michael Zhang", email: "michael@example.com" },
  { id: 7, name: "Chris Anderson", email: "chris@example.com" },
  { id: 8, name: "Tyler Brooks", email: "tyler@example.com" },
  { id: 9, name: "Sarah Mitchell", email: "sarah@example.com" },
  { id: 10, name: "Emma Zhang", email: "emma@example.com" },
];

// Curated books for finance bro / self-improvement crowd
const seedBooks = [
  // Finance & Business
  { title: "Principles: Life and Work", author: "Ray Dalio", category: "Finance", totalPages: 592, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/71am9KoMJIL.jpg" },
  { title: "The Intelligent Investor", author: "Benjamin Graham", category: "Finance", totalPages: 640, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/91+T8uX3vUL.jpg" },
  { title: "Zero to One", author: "Peter Thiel", category: "Business", totalPages: 224, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/71Xygz7e-qL.jpg" },
  { title: "The Almanack of Naval Ravikant", author: "Eric Jorgenson", category: "Business", totalPages: 242, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/71-zRbFNzYL.jpg" },
  { title: "Poor Charlie's Almanack", author: "Charlie Munger", category: "Finance", totalPages: 548, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/81Uf1dKCJdL.jpg" },
  
  // Philosophy & Stoicism
  { title: "Meditations", author: "Marcus Aurelius", category: "Philosophy", totalPages: 304, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/71aG+xDKSYL.jpg" },
  { title: "Letters from a Stoic", author: "Seneca", category: "Philosophy", totalPages: 254, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/71OkH+yYGfL.jpg" },
  { title: "The Daily Stoic", author: "Ryan Holiday", category: "Philosophy", totalPages: 416, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/71F2ZeT0+lL.jpg" },
  { title: "Beyond Good and Evil", author: "Friedrich Nietzsche", category: "Philosophy", totalPages: 240, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/71yR7YDxJBL.jpg" },
  
  // Performance & Biohacking
  { title: "Why We Sleep", author: "Matthew Walker", category: "Science", totalPages: 368, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/81Vb+UDYhoL.jpg" },
  { title: "Breath: The New Science of a Lost Art", author: "James Nestor", category: "Health", totalPages: 304, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/81RMjFoNMxL.jpg" },
  { title: "Atomic Habits", author: "James Clear", category: "Self-Help", totalPages: 320, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg" },
  { title: "Deep Work", author: "Cal Newport", category: "Productivity", totalPages: 296, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/71VNBhZoYzL.jpg" },
  { title: "Outlive", author: "Peter Attia", category: "Health", totalPages: 496, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/81cpDaCJJCL.jpg" },
  
  // Classic Literature (for sophistication)
  { title: "Crime and Punishment", author: "Fyodor Dostoevsky", category: "Literature", totalPages: 671, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/71O2XIytdqL.jpg" },
  { title: "The Stranger", author: "Albert Camus", category: "Literature", totalPages: 123, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/71b2qIyQ6JL.jpg" },
  { title: "Man's Search for Meaning", author: "Viktor Frankl", category: "Psychology", totalPages: 200, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/81YkqyaFVEL.jpg" },
  
  // Modern Business/Tech
  { title: "The Lean Startup", author: "Eric Ries", category: "Business", totalPages: 336, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/81vvgZqCskL.jpg" },
  { title: "Sapiens", author: "Yuval Noah Harari", category: "History", totalPages: 443, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/71f5Yqd9DDL.jpg" },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Psychology", totalPages: 499, coverUrl: "https://images-na.ssl-images-amazon.com/images/I/71+BeYRlh2L.jpg" },
];

// Sample social posts (insights and takeaways)
const samplePosts = [
  { userId: 1, content: "Ray Dalio's principle of 'radical transparency' is game-changing for team dynamics. Implementing this at work next week.", bookTitle: "Principles: Life and Work" },
  { userId: 3, content: "Just finished Meditations. Marcus Aurelius was dealing with the same mental battles 2000 years ago. Nothing new under the sun.", bookTitle: "Meditations" },
  { userId: 2, content: "Walker's research on sleep is eye-opening. Prioritizing 8 hours non-negotiable now. REM sleep = competitive advantage.", bookTitle: "Why We Sleep" },
  { userId: 4, content: "Naval's concept of 'specific knowledge' clarified my career path. Stop competing, start creating.", bookTitle: "The Almanack of Naval Ravikant" },
  { userId: 5, content: "Thiel: 'Competition is for losers.' Building in a blue ocean from now on.", bookTitle: "Zero to One" },
  { userId: 7, content: "Atomic Habits: 1% better every day = 37x better in a year. Compounding applies to everything.", bookTitle: "Atomic Habits" },
  { userId: 9, content: "Finished Crime and Punishment. Dostoevsky understood human psychology better than any modern psychologist.", bookTitle: "Crime and Punishment" },
  { userId: 6, content: "Deep Work sessions in the morning changed my productivity. 4 hours of focused work > 8 hours of shallow work.", bookTitle: "Deep Work" },
];

async function seedDatabase() {
  console.log("🌱 Starting database seed...");
  
  const database = await getDb();
  if (!database) {
    console.error("❌ Database not available");
    return;
  }

  try {
    // Note: In production, users would be created via OAuth
    // This seed data assumes demo user IDs 1-10 exist or will be created
    
    console.log("📚 Seeding books...");
    const bookIds: number[] = [];
    
    // Create books for first 3 users (most active)
    for (let i = 0; i < 3; i++) {
      const userId = demoUsers[i].id;
      
      // Each user gets 5-8 books in different statuses
      const userBookCount = 5 + Math.floor(Math.random() * 4);
      const userBooks = seedBooks.slice(i * 6, i * 6 + userBookCount);
      
      for (let j = 0; j < userBooks.length; j++) {
        const book = userBooks[j];
        let status: "reading" | "queue" | "completed";
        let currentPage = 0;
        let startedAt = null;
        let completedAt = null;
        
        if (j === 0) {
          // Currently reading
          status = "reading";
          currentPage = Math.floor(book.totalPages * (0.3 + Math.random() * 0.5));
          startedAt = new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000);
        } else if (j < 3) {
          // Completed
          status = "completed";
          currentPage = book.totalPages;
          startedAt = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000);
          completedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        } else {
          // Queue
          status = "queue";
        }
        
        const bookId = await db.createBook({
          userId,
          title: book.title,
          author: book.author,
          category: book.category,
          totalPages: book.totalPages,
          currentPage,
          coverUrl: book.coverUrl,
          status,
          startedAt,
          completedAt,
        });
        
        console.log(`Created book: ${book.title} with ID: ${bookId}`);
        bookIds.push(bookId);
        
        // Create reading sessions for completed and in-progress books
        if (status === "reading" || status === "completed") {
          const sessionCount = 3 + Math.floor(Math.random() * 7);
          let sessionPage = 0;
          
          for (let k = 0; k < sessionCount; k++) {
            const pagesRead = 15 + Math.floor(Math.random() * 35);
            const endPage = Math.min(sessionPage + pagesRead, currentPage);
            const duration = 20 + Math.floor(Math.random() * 40);
            
            const daysAgo = sessionCount - k;
            const sessionDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
            
            const { readingSessions } = await import("../drizzle/schema");
            await database.insert(readingSessions).values({
              userId,
              bookId: bookId,
              startPage: sessionPage,
              endPage,
              durationMinutes: duration,
              createdAt: sessionDate,
            });
            
            sessionPage = endPage;
          }
        }
      }
    }
    
    console.log(`✅ Created ${bookIds.length} books with reading sessions`);
    
    // Calculate stats for active users
    console.log("📊 Calculating user stats...");
    for (let i = 0; i < 3; i++) {
      await db.calculateUserStats(demoUsers[i].id);
    }
    console.log("✅ User stats calculated");
    
    // Create social posts
    console.log("💬 Creating social posts...");
    for (const post of samplePosts) {
      // Find the book ID for this post
      const userBooks = await db.getUserBooks(post.userId);
      const book = userBooks.find(b => b.title === post.bookTitle);
      
      await db.createSocialPost({
        userId: post.userId,
        content: post.content,
        bookId: book?.id,
      });
    }
    console.log(`✅ Created ${samplePosts.length} social posts`);
    
    console.log("🎉 Database seeding complete!");
    console.log("\n📈 Summary:");
    console.log(`   - ${bookIds.length} books created`);
    console.log(`   - ~${bookIds.length * 5} reading sessions`);
    console.log(`   - ${samplePosts.length} social posts`);
    console.log(`   - 3 active users with stats`);
    
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

// Run the seed
seedDatabase()
  .then(() => {
    console.log("\n✨ Seed script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seed script failed:", error);
    process.exit(1);
  });
