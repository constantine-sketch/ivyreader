# IvyReader Mobile App Design

## Overview

IvyReader is a sophisticated reading tracking and social reading mobile application designed for iOS and Android. The app helps users track their reading progress, build consistent reading habits through gamification, and connect with a community of readers. The design follows Apple Human Interface Guidelines for a native iOS feel while maintaining cross-platform compatibility.

## Screen List

### Primary Screens

**Dashboard (Home)** - The main hub displaying personalized reading metrics, current book progress, and quick actions. This is the default landing screen after login.

**My Library** - A comprehensive view of all books organized into Currently Reading, Queue, and Archive tabs with search functionality.

**Society** - The social feed where users can view community activity, post updates, see leaderboards, and discover trending books.

**Book Detail** - Detailed view of a single book showing metadata, reading progress, notes, and session history.

**Profile** - User profile displaying personal statistics, achievements, and account settings.

### Secondary Screens

**Log Session** - A modal or screen for logging reading time and pages read with optional notes.

**Add Book** - Interface for manually adding books to the library with title, author, category, and cover image.

**Add Note** - Quick note-taking interface attached to the current reading position.

**Manage Queue** - Drag-and-drop interface for reordering books in the reading queue.

## Primary Content and Functionality

### Dashboard Screen

The dashboard presents a personalized greeting based on time of day along with the current date and performance period indicator. The daily goal tracker shows progress toward a time-based reading goal with a circular or linear progress indicator. Four metric cards display current streak with comparison to personal average, total pages read for the current quarter with percentile ranking, focus score with daily average time, and total time invested in reading.

The currently reading section features a prominent book card with cover image, category badge, title and author, progress percentage and page count, visual progress bar, and action buttons for logging sessions and adding notes. Below this, the up next queue shows three upcoming books with cover thumbnails, titles, authors, and category tags. A weekly volume chart visualizes reading time across the past seven days with a bar chart showing minutes per day.

### My Library Screen

The library organizes books into three tabs: Currently Reading shows active books with progress indicators, Queue displays planned reading in priority order, and Archive contains completed books with ratings and completion dates. A search bar at the top enables filtering by title, author, or category. Each book displays as a card with cover image, title, author, category badge, and progress or completion status. An add book button in the header allows manual book entry.

### Society Screen

The society feed includes two tabs: Following shows activity from users the current user follows, while Global displays community-wide activity. Users can publish posts with text content, optional book references, and engagement metrics showing likes and comments. The feed displays user avatars, usernames, timestamps, post content, and attached book information.

A sidebar widget shows the top readers leaderboard for the current week with rankings, usernames, and pages read. Another widget displays trending books with active reader counts. Users can interact with posts through like, comment, and share actions.

### Book Detail Screen

The book detail screen shows a large cover image, complete metadata including title, author, category, and page count, and current reading progress with percentage and pages remaining. A reading history section lists all logged sessions with dates, duration, and pages read. User notes appear chronologically with timestamps and page references. Action buttons enable starting a new session, adding notes, marking as complete, or removing from library.

### Log Session Screen

This modal interface captures reading session data including start and end times with duration calculation, pages read with starting and ending page numbers, and optional session notes. A save button commits the session to the database and updates all related statistics and progress indicators.

## Key User Flows

### Starting a Reading Session

User taps "Resume Reading" on dashboard → App opens currently reading book detail → User taps "Log Session" → Session logging interface appears → User enters time spent and pages read → User taps "Save" → Progress updates across dashboard and library → User returns to dashboard with updated metrics.

### Adding a New Book

User navigates to My Library → Taps "Add Book" button → Form appears with fields for title, author, category, page count, and optional cover image → User fills in information → User taps "Save" → Book appears in Queue tab → User can drag to reorder in queue or start reading immediately.

### Engaging with Community

User navigates to Society tab → Scrolls through activity feed → Sees a friend finished a book → User taps like button and adds comment → User taps "Publish" to create own post → Writes insight about current reading → Optionally attaches book reference → Posts to feed → Community can engage with the post.

### Building a Reading Streak

User reads daily and logs sessions → Streak counter increments each day → After seven days, user sees "7 Day Streak" achievement → Comparison shows "+3 days vs avg" → User motivated to continue → Missing a day resets streak → App sends gentle reminder notification.

## Color Choices

IvyReader uses a sophisticated dark theme as the primary interface with an elegant color palette. The background consists of deep forest green (#0A1F1A) and near-black (#0D0D0D) creating a calm, focused reading environment. Surface colors use slightly lighter shades (#1A2F2A for cards and elevated elements) with subtle borders in muted green-gray (#2D4A42).

Accent colors feature a rich gold (#D4AF37) for primary actions and highlights, creating a premium feel reminiscent of classic bookbinding. Text uses off-white (#F5F5F0) for primary content and muted sage (#A8B8B0) for secondary information. Category badges use subtle color coding: blue-green for science, warm amber for philosophy, cool slate for fiction, and burgundy for history.

Success states use a soft emerald green (#4ECDC4), warnings appear in warm amber (#F4A460), and errors display in muted coral (#E07A5F). These colors maintain readability while avoiding harsh contrast that would strain eyes during extended reading sessions.

## Mobile-First Design Principles

The interface assumes portrait orientation as the primary mode with all critical actions accessible within thumb reach on larger devices. Navigation uses a bottom tab bar with four primary destinations: Dashboard, Library, Society, and Profile. The currently reading book and log session actions remain accessible via floating action buttons or prominent cards.

Gestures enhance navigation with swipe-right to go back, swipe-down to refresh feeds and statistics, and long-press on book cards for quick actions menu. Pull-to-refresh works on all list and feed views. Cards and buttons use generous touch targets of at least 44x44 points following iOS guidelines.

Typography scales appropriately with large, bold serif headings for book titles and elegant sans-serif body text for readability. The layout uses consistent spacing with 16-point base padding and 8-point increments. Scrollable content includes proper safe area insets for notched devices and respects the bottom tab bar height.

## Technical Implementation Notes

The app uses React Native with Expo for cross-platform development, NativeWind for styling with Tailwind classes, and Drizzle ORM with MySQL for data persistence. User authentication leverages Manus-OAuth for secure login. Local state management uses React Context for theme and user preferences with AsyncStorage for offline persistence.

Reading statistics calculate in real-time from session logs stored in the database. Streak tracking runs daily checks comparing session dates. Leaderboards aggregate weekly totals with efficient database queries. The social feed implements infinite scroll with pagination for performance.

Book covers store in S3-compatible storage with local caching for offline access. Push notifications remind users of reading goals and highlight friend activity. The app supports both light and dark themes with automatic switching based on system preferences, though dark mode serves as the default for optimal reading comfort.
