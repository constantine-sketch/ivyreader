import { getDb } from "../server/db";

// Demo users matching the seed data (80% male, finance bro demographic)
const demoUsers = [
  { id: 1, openId: "demo_marcus_chen", name: "Marcus Chen", email: "marcus@ivyreader.demo", loginMethod: "demo" },
  { id: 2, openId: "demo_alex_rivera", name: "Alex Rivera", email: "alex@ivyreader.demo", loginMethod: "demo" },
  { id: 3, openId: "demo_james_thompson", name: "James Thompson", email: "james@ivyreader.demo", loginMethod: "demo" },
  { id: 4, openId: "demo_ryan_park", name: "Ryan Park", email: "ryan@ivyreader.demo", loginMethod: "demo" },
  { id: 5, openId: "demo_david_kim", name: "David Kim", email: "david@ivyreader.demo", loginMethod: "demo" },
  { id: 6, openId: "demo_michael_zhang", name: "Michael Zhang", email: "michael@ivyreader.demo", loginMethod: "demo" },
  { id: 7, openId: "demo_chris_anderson", name: "Chris Anderson", email: "chris@ivyreader.demo", loginMethod: "demo" },
  { id: 8, openId: "demo_tyler_brooks", name: "Tyler Brooks", email: "tyler@ivyreader.demo", loginMethod: "demo" },
  { id: 9, openId: "demo_sarah_mitchell", name: "Sarah Mitchell", email: "sarah@ivyreader.demo", loginMethod: "demo" },
  { id: 10, openId: "demo_emma_zhang", name: "Emma Zhang", email: "emma@ivyreader.demo", loginMethod: "demo" },
];

async function createDemoUsers() {
  console.log("👥 Creating demo users...");
  
  const database = await getDb();
  if (!database) {
    console.error("❌ Database not available");
    return;
  }

  try {
    const { users } = await import("../drizzle/schema");
    
    for (const user of demoUsers) {
      await database.insert(users).values({
        id: user.id,
        openId: user.openId,
        name: user.name,
        email: user.email,
        loginMethod: user.loginMethod,
        lastSignedIn: new Date(),
      });
      console.log(`✅ Created user: ${user.name} (ID: ${user.id})`);
    }
    
    console.log("\n🎉 All demo users created successfully!");
    console.log(`   Total: ${demoUsers.length} users`);
    
  } catch (error) {
    console.error("❌ Failed to create demo users:", error);
    throw error;
  }
}

// Run the script
createDemoUsers()
  .then(() => {
    console.log("\n✨ Demo users script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Demo users script failed:", error);
    process.exit(1);
  });
