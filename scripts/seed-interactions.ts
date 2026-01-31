import mysql from 'mysql2/promise';

async function seedInteractions() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not found in environment');
    process.exit(1);
  }
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  console.log('Adding likes and comments to posts...');

  // Get all posts
  const [posts]: any = await connection.execute('SELECT id FROM social_posts');
  
  // Get all users
  const [users]: any = await connection.execute('SELECT id FROM users LIMIT 10');
  const userIds = users.map((u: any) => u.id);

  // Add likes to posts (random 2-8 likes per post)
  for (const post of posts) {
    const likeCount = Math.floor(Math.random() * 7) + 2; // 2-8 likes
    const likers = userIds.sort(() => 0.5 - Math.random()).slice(0, likeCount);
    
    for (const userId of likers) {
      await connection.execute(
        'INSERT IGNORE INTO post_likes (postId, userId, createdAt) VALUES (?, ?, NOW())',
        [post.id, userId]
      );
    }
    console.log(`Added ${likeCount} likes to post ${post.id}`);
  }

  // Add comments to posts (random 0-3 comments per post)
  const commentTemplates = [
    "Great insight! This really resonates with me.",
    "I'm reading this one too! Loving it so far.",
    "Added to my queue, thanks for the recommendation!",
    "This book changed my perspective completely.",
    "The author's writing style is incredible.",
    "Can't wait to finish this one.",
    "One of the best books I've read this year.",
    "The concepts in this are mind-blowing.",
    "Highly recommend to anyone interested in personal growth.",
    "This passage hit different.",
  ];

  for (const post of posts) {
    const commentCount = Math.floor(Math.random() * 4); // 0-3 comments
    
    for (let i = 0; i < commentCount; i++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const content = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
      
      await connection.execute(
        'INSERT INTO post_comments (postId, userId, content, createdAt) VALUES (?, ?, ?, NOW())',
        [post.id, userId, content]
      );
    }
    
    if (commentCount > 0) {
      console.log(`Added ${commentCount} comments to post ${post.id}`);
    }
  }

  await connection.end();
  console.log('✅ Interactions seeded successfully!');
}

seedInteractions().catch(console.error);
