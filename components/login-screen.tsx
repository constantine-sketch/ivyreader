import { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, ScrollView, Dimensions, Animated, Platform, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useColors } from "@/hooks/use-colors";
import { startOAuthLogin } from "@/constants/oauth";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Testimonial data with influencer images as visual backing
const TESTIMONIALS = [
  {
    quote: "I went from reading 3 books a year to 47. IvyReader's accountability system changed everything.",
    name: "Marcus T.",
    role: "Investment Banking Analyst",
    image: require("@/assets/landing/optimized/testimonial-1.jpg"),
  },
  {
    quote: "The Elite coaching pushed me to finish books I'd been putting off for years. Worth every penny.",
    name: "Sarah K.",
    role: "Management Consultant, McKinsey",
    image: require("@/assets/landing/optimized/testimonial-3.jpg"),
  },
  {
    quote: "Having someone hold me accountable for my reading goals was the missing piece. 23 books in 6 months.",
    name: "James L.",
    role: "2L, Harvard Law School",
    image: require("@/assets/landing/optimized/testimonial-4.jpg"),
  },
  {
    quote: "I replaced doomscrolling with deep reading. My focus, vocabulary, and career conversations all improved.",
    name: "Priya M.",
    role: "Product Manager, Google",
    image: require("@/assets/landing/optimized/testimonial-5.jpg"),
  },
  {
    quote: "The curated reading lists alone saved me hours of research. The accountability made me actually finish them.",
    name: "David R.",
    role: "Founder & CEO",
    image: require("@/assets/landing/optimized/testimonial-6.jpg"),
  },
];

// Stats for social proof
const STATS = [
  { value: "47+", label: "Avg Books/Year" },
  { value: "12K+", label: "Active Readers" },
  { value: "4.9★", label: "App Rating" },
];

export function LoginScreen() {
  const colors = useColors();
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    try {
      const callbackUrl = await startOAuthLogin();
      if (callbackUrl) {
        const url = new URL(callbackUrl);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        if (code && state) {
          router.push({ pathname: "/oauth/callback", params: { code, state } });
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "#0a0a0a" }]}>  
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* ===== HERO SECTION ===== */}
        <View style={styles.heroSection}>
          <Image
            source={require("@/assets/landing/optimized/founder-campus.jpg")}
            style={styles.heroImage}
            contentFit="cover"
          />
          {/* Gradient overlay */}
          <LinearGradient
            colors={["transparent", "rgba(10,10,10,0.6)", "rgba(10,10,10,0.95)", "#0a0a0a"]}
            locations={[0, 0.4, 0.7, 1]}
            style={styles.heroGradient}
          />
          {/* Hero text overlay */}
          <Animated.View style={[styles.heroTextContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.heroEyebrow}>BUILT AT COLUMBIA LAW SCHOOL</Text>
            <Text style={styles.heroTitle}>
              Stop Buying Books{"\n"}You Never Finish.
            </Text>
            <Text style={styles.heroSubtitle}>
              IvyReader pairs you with an accountability system that turns ambitious reading goals into completed shelves.
            </Text>
          </Animated.View>
        </View>

        {/* ===== SOCIAL PROOF STRIP ===== */}
        <View style={styles.statsStrip}>
          {STATS.map((stat, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ===== PRIMARY CTA ===== */}
        <View style={styles.ctaSection}>
          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.primaryButton,
              { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
            ]}
          >
            <Text style={styles.primaryButtonText}>Start Reading Smarter</Text>
          </Pressable>
          <Text style={styles.ctaSubtext}>Free to start. No credit card required.</Text>
        </View>

        {/* ===== PROBLEM / AGITATION ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>THE PROBLEM</Text>
          <Text style={styles.sectionTitle}>
            You Know What to Read.{"\n"}You Just Don't Finish.
          </Text>
          <Text style={styles.sectionBody}>
            The average professional buys 12 books a year and finishes 4. Not because they lack ambition — but because no one holds them accountable. Reading alone is easy to start and easier to quit.
          </Text>
        </View>

        {/* ===== PRODUCT SHOWCASE ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>THE SOLUTION</Text>
          <Text style={styles.sectionTitle}>
            Your Personal{"\n"}Reading Accountability System
          </Text>
          <View style={styles.productImageContainer}>
            <Image
              source={require("@/assets/landing/optimized/product-phone.jpg")}
              style={styles.productImage}
              contentFit="contain"
            />
          </View>
          <View style={styles.featureList}>
            <FeatureItem
              emoji="📊"
              title="Track Every Session"
              description="Log pages, time, and notes. See your reading velocity improve week over week."
            />
            <FeatureItem
              emoji="🔥"
              title="Streak-Based Accountability"
              description="Daily reading streaks with smart reminders. Miss a day? Your streak resets."
            />
            <FeatureItem
              emoji="📚"
              title="Curated Reading Lists"
              description="Ivy League-caliber book lists curated by topic, career stage, and reading level."
            />
            <FeatureItem
              emoji="👥"
              title="Reading Society"
              description="Connect with ambitious readers. Share progress, notes, and recommendations."
            />
          </View>
        </View>

        {/* ===== LIFESTYLE / ASPIRATION ===== */}
        <View style={styles.lifestyleSection}>
          <View style={styles.lifestyleGrid}>
            <View style={styles.lifestyleCol}>
              <Image
                source={require("@/assets/landing/optimized/library-1.jpg")}
                style={[styles.lifestyleImage, { height: 200 }]}
                contentFit="cover"
              />
              <Image
                source={require("@/assets/landing/optimized/studying-cozy.jpg")}
                style={[styles.lifestyleImage, { height: 140 }]}
                contentFit="cover"
              />
            </View>
            <View style={styles.lifestyleCol}>
              <Image
                source={require("@/assets/landing/optimized/mentoring.jpg")}
                style={[styles.lifestyleImage, { height: 140 }]}
                contentFit="cover"
              />
              <Image
                source={require("@/assets/landing/optimized/library-2.jpg")}
                style={[styles.lifestyleImage, { height: 200 }]}
                contentFit="cover"
              />
            </View>
          </View>
        </View>

        {/* ===== TESTIMONIALS ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>WHAT READERS SAY</Text>
          <Text style={styles.sectionTitle}>
            Real Results From{"\n"}Real Readers
          </Text>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={SCREEN_WIDTH - 48}
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {TESTIMONIALS.map((t, i) => (
              <View key={i} style={styles.testimonialCard}>
                <View style={styles.testimonialHeader}>
                  <Image source={t.image} style={styles.testimonialAvatar} contentFit="cover" />
                  <View style={styles.testimonialMeta}>
                    <Text style={styles.testimonialName}>{t.name}</Text>
                    <Text style={styles.testimonialRole}>{t.role}</Text>
                  </View>
                </View>
                <Text style={styles.testimonialQuote}>"{t.quote}"</Text>
                <View style={styles.testimonialStars}>
                  <Text style={{ fontSize: 14 }}>★★★★★</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          {/* Dot indicators */}
          <View style={styles.dotContainer}>
            {TESTIMONIALS.map((_, i) => {
              const inputRange = [(i - 1) * (SCREEN_WIDTH - 48), i * (SCREEN_WIDTH - 48), (i + 1) * (SCREEN_WIDTH - 48)];
              const dotOpacity = scrollX.interpolate({ inputRange, outputRange: [0.3, 1, 0.3], extrapolate: "clamp" });
              const dotScale = scrollX.interpolate({ inputRange, outputRange: [1, 1.3, 1], extrapolate: "clamp" });
              return (
                <Animated.View
                  key={i}
                  style={[styles.dot, { opacity: dotOpacity, transform: [{ scale: dotScale }], backgroundColor: "#C9A84C" }]}
                />
              );
            })}
          </View>
        </View>

        {/* ===== ELITE TIER UPSELL ===== */}
        <View style={styles.eliteSection}>
          <View style={styles.eliteCard}>
            <Text style={styles.eliteEyebrow}>ELITE MEMBERSHIP</Text>
            <Text style={styles.eliteTitle}>
              1-on-1 Reading{"\n"}Accountability Coaching
            </Text>
            <Image
              source={require("@/assets/landing/optimized/mentoring.jpg")}
              style={styles.eliteImage}
              contentFit="cover"
            />
            <Text style={styles.eliteBody}>
              For readers who want a personal coach to set goals, review progress, and keep them on track. Your dedicated accountability partner checks in weekly and adjusts your reading plan based on your schedule and ambitions.
            </Text>
            <View style={styles.eliteFeatures}>
              <EliteFeature text="Weekly 1-on-1 accountability check-ins" />
              <EliteFeature text="Personalized reading plans & book recommendations" />
              <EliteFeature text="AI-powered reading concierge" />
              <EliteFeature text="Priority support & community access" />
            </View>
          </View>
        </View>

        {/* ===== FOUNDER SECTION ===== */}
        <View style={styles.section}>
          <View style={styles.founderCard}>
            <Image
              source={require("@/assets/landing/optimized/founder-library.jpg")}
              style={styles.founderImage}
              contentFit="cover"
            />
            <Text style={styles.founderQuote}>
              "I built IvyReader because I was tired of buying books I never finished. At Columbia Law, the reading load is relentless — but I realized the accountability of assignments is what made me finish. I wanted that same system for personal reading."
            </Text>
            <Text style={styles.founderName}>Constantine Trubitski</Text>
            <Text style={styles.founderRole}>Founder, IvyReader{"\n"}2L, Columbia Law School</Text>
          </View>
        </View>

        {/* ===== COMPARISON TABLE ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>WHY IVYREADER</Text>
          <Text style={styles.sectionTitle}>
            Reading Alone{"\n"}vs. Reading Accountably
          </Text>
          <View style={styles.comparisonTable}>
            <ComparisonRow label="Books finished per year" without="4" withIvy="47+" />
            <ComparisonRow label="Reading consistency" without="Sporadic" withIvy="Daily habit" />
            <ComparisonRow label="Accountability" without="None" withIvy="Built-in" />
            <ComparisonRow label="Book recommendations" without="Random" withIvy="Curated" />
            <ComparisonRow label="Progress tracking" without="None" withIvy="Detailed analytics" />
            <ComparisonRow label="Community" without="Alone" withIvy="12K+ readers" />
          </View>
        </View>

        {/* ===== GUARANTEE ===== */}
        <View style={styles.section}>
          <View style={styles.guaranteeCard}>
            <Text style={{ fontSize: 40, textAlign: "center", marginBottom: 12 }}>🛡️</Text>
            <Text style={styles.guaranteeTitle}>30-Day Money-Back Guarantee</Text>
            <Text style={styles.guaranteeBody}>
              Try IvyReader risk-free. If you don't read more books in your first 30 days, we'll refund every penny. No questions asked.
            </Text>
          </View>
        </View>

        {/* ===== FINAL CTA ===== */}
        <View style={styles.finalCta}>
          <Text style={styles.finalCtaTitle}>
            Your Next Chapter{"\n"}Starts Now.
          </Text>
          <Text style={styles.finalCtaSubtitle}>
            Join thousands of ambitious readers who stopped making excuses and started finishing books.
          </Text>
          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.primaryButton,
              { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
            ]}
          >
            <Text style={styles.primaryButtonText}>Get Started Free</Text>
          </Pressable>
          <Text style={styles.ctaSubtext}>Free tier available. Upgrade anytime.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// Sub-components
function FeatureItem({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <View style={styles.featureItem}>
      <Text style={{ fontSize: 28, marginBottom: 8 }}>{emoji}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );
}

function EliteFeature({ text }: { text: string }) {
  return (
    <View style={styles.eliteFeatureRow}>
      <Text style={{ color: "#C9A84C", fontSize: 16, marginRight: 10 }}>✓</Text>
      <Text style={styles.eliteFeatureText}>{text}</Text>
    </View>
  );
}

function ComparisonRow({ label, without, withIvy }: { label: string; without: string; withIvy: string }) {
  return (
    <View style={styles.comparisonRow}>
      <Text style={styles.comparisonLabel}>{label}</Text>
      <View style={styles.comparisonValues}>
        <Text style={styles.comparisonWithout}>{without}</Text>
        <Text style={styles.comparisonWithIvy}>{withIvy}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Hero
  heroSection: {
    height: 520,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70%",
  },
  heroTextContainer: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
  },
  heroEyebrow: {
    color: "#C9A84C",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 10,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40,
    marginBottom: 12,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 15,
    lineHeight: 22,
  },
  // Stats strip
  statsStrip: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    color: "#C9A84C",
    fontSize: 22,
    fontWeight: "800",
  },
  statLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  // CTA
  ctaSection: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#C9A84C",
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#0a0a0a",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  ctaSubtext: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    marginTop: 10,
  },
  // Sections
  section: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  sectionEyebrow: {
    color: "#C9A84C",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
    marginBottom: 16,
  },
  sectionBody: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 15,
    lineHeight: 24,
  },
  // Product
  productImageContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  productImage: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.9,
    borderRadius: 20,
  },
  // Features
  featureList: {
    gap: 20,
  },
  featureItem: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  featureTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  featureDescription: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 14,
    lineHeight: 20,
  },
  // Lifestyle grid
  lifestyleSection: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  lifestyleGrid: {
    flexDirection: "row",
    gap: 8,
  },
  lifestyleCol: {
    flex: 1,
    gap: 8,
  },
  lifestyleImage: {
    width: "100%",
    borderRadius: 12,
  },
  // Testimonials
  testimonialCard: {
    width: SCREEN_WIDTH - 72,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    padding: 20,
    marginLeft: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  testimonialHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  testimonialAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  testimonialMeta: {
    marginLeft: 12,
  },
  testimonialName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  testimonialRole: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    marginTop: 2,
  },
  testimonialQuote: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 15,
    lineHeight: 23,
    fontStyle: "italic",
  },
  testimonialStars: {
    marginTop: 12,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  // Elite
  eliteSection: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  eliteCard: {
    backgroundColor: "rgba(201,168,76,0.06)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.2)",
  },
  eliteEyebrow: {
    color: "#C9A84C",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 10,
  },
  eliteTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
    marginBottom: 16,
  },
  eliteImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  eliteBody: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  eliteFeatures: {
    gap: 12,
  },
  eliteFeatureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  eliteFeatureText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  // Founder
  founderCard: {
    alignItems: "center",
    paddingVertical: 12,
  },
  founderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(201,168,76,0.3)",
  },
  founderQuote: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 15,
    lineHeight: 24,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 16,
  },
  founderName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  founderRole: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
  },
  // Comparison
  comparisonTable: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  comparisonRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  comparisonLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    marginBottom: 6,
  },
  comparisonValues: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  comparisonWithout: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 14,
    textDecorationLine: "line-through",
  },
  comparisonWithIvy: {
    color: "#C9A84C",
    fontSize: 14,
    fontWeight: "700",
  },
  // Guarantee
  guaranteeCard: {
    backgroundColor: "rgba(34,197,94,0.06)",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.15)",
    alignItems: "center",
  },
  guaranteeTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  guaranteeBody: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  // Final CTA
  finalCta: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: "center",
  },
  finalCtaTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 36,
    marginBottom: 12,
  },
  finalCtaSubtitle: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
});
