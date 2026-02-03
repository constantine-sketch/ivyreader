# IvyReader TODO

## Core Features

- [ ] User authentication and profile setup
- [x] Dashboard with personalized greeting and date
- [x] Daily reading goal tracker with progress indicator
- [x] Current streak counter with comparison metrics
- [x] Pages read quarterly metric with percentile ranking
- [x] Focus score calculation and display
- [x] Total time invested tracker
- [x] Currently reading book card with cover, progress, and metadata
- [x] Progress bar visualization for current book
- [ ] Log reading session functionality
- [ ] Add note to current reading
- [x] Up next queue display (3 books)
- [x] Weekly volume chart (bar chart for 7 days)
- [x] Resume reading quick action button

## Library Management

- [x] My Library screen with tab navigation
- [x] Currently Reading tab with active books
- [x] Queue tab with planned reading
- [x] Archive tab with completed books
- [x] Search functionality for library
- [ ] Add book manually with form
- [ ] Book detail screen with full metadata
- [ ] Reading history display per book
- [ ] Notes display per book
- [ ] Manage queue with reordering
- [ ] Mark book as complete
- [ ] Remove book from library

## Social Features

- [x] Society feed screen
- [x] Following tab for friend activity
- [x] Global tab for community activity
- [x] Publish post with text and optional book reference
- [x] Like posts
- [x] Comment on posts
- [x] Share posts
- [x] Top readers leaderboard (weekly)
- [x] Trending books widget
- [x] User avatars and profiles
- [ ] Follow/unfollow users

## Data Models and Backend

- [ ] User model with profile and stats
- [ ] Book model with metadata and cover storage
- [ ] Reading session model with time and page tracking
- [ ] Note model with book and page references
- [ ] Social post model with engagement metrics
- [ ] User relationship model for follows
- [ ] Database schema setup
- [ ] API endpoints for CRUD operations
- [ ] Leaderboard calculation logic
- [ ] Statistics aggregation

## UI/UX Polish

- [x] Dark theme with forest green and gold accents
- [x] Custom color palette implementation
- [x] Serif typography for headings
- [x] Card-based layout system
- [x] Bottom tab navigation
- [ ] Floating action buttons
- [ ] Swipe gestures for navigation
- [ ] Pull-to-refresh on feeds
- [ ] Loading states and skeletons
- [ ] Error handling and empty states
- [ ] Safe area handling for notched devices

## Branding

- [x] Generate custom IvyReader logo
- [x] Update app icon
- [x] Update splash screen
- [x] Update app name in configuration
- [x] Set brand colors in theme


## Bug Fixes

- [x] Fix button press handlers not responding to clicks
- [ ] Add proper navigation between screens
- [ ] Implement tab switching functionality


## Production Features (For Sunday Launch)

- [x] Create database schema for books, sessions, notes, and stats
- [x] Implement user authentication with Manus OAuth
- [x] Create API endpoints for CRUD operations
- [ ] Connect Log Session to save real data
- [ ] Connect Add Book to database
- [ ] Connect Add Note functionality
- [ ] Update statistics from real session data
- [ ] Implement Google Books API for book metadata
- [ ] Add book cover image fetching
- [ ] Test all features end-to-end

## Seed Data

- [x] Create seed script with finance/philosophy books
- [x] Generate demo users (80% male, finance bro demographic)
- [x] Add realistic reading sessions and stats
- [x] Create social posts with insights
- [x] Populate leaderboard data

- [x] Create demo user records in users table


## Frontend Integration

- [x] Connect dashboard to real user stats and books
- [x] Connect library screen to real books data
- [x] Connect society screen to real social posts
- [x] Connect profile screen to real user data
- [ ] Implement log session functionality
- [ ] Implement add book functionality
- [ ] Implement create post functionality
- [ ] Add authentication wrapper with login screen


## Authentication Flow

- [x] Create authentication wrapper component
- [x] Update root layout to check auth status
- [x] Show login screen for unauthenticated users
- [x] Test OAuth login flow


## Log Session Feature

- [x] Create LogSessionModal component with form inputs
- [x] Add modal state management to dashboard
- [x] Connect form to trpc.sessions.create mutation
- [x] Update statistics after session logged
- [x] Create seed sessions with variance for all demo users
- [x] Test session logging and stat updates


## Add Book Feature

- [x] Create Google Books API service module
- [x] Implement book search with autocomplete
- [x] Create AddBookModal component with search UI
- [x] Display search results with covers and metadata
- [x] Add status selection (Reading/Queue)
- [x] Connect to database to save books
- [x] Test book search and addition flow
- [x] Add "Add Book" button to Library screen


## Auth Flow

- [x] Add logout button to Profile screen
- [x] Implement logout functionality
- [x] Test login/logout cycle
- [x] Verify user data persists after logout/login


## Social Proof

- [x] Modify Society screen to show all users' posts (not just following)
- [x] Update leaderboard to show all demo users
- [x] Make social feed display global activity for social proof


## Social Feed Fixes

- [x] Fix getSocialPosts to join users table and return actual names
- [x] Add seed data for post likes
- [x] Add seed data for post comments
- [x] Update social feed UI to display like/comment counts


## Bug Fixes

- [x] Fix logout button not working
- [x] Ensure logout clears session and returns to login screen


## Library Visibility

- [x] Show demo books in Library when user has no books
- [x] Test Add Book flow with Google Books API
- [x] Verify books display with covers


## Bug Fixes

- [x] Fix Google Books API search not returning results
- [x] Debug AddBookModal search functionality


## New Features

- [x] Display book covers in Library (replace gray boxes)
- [x] Expand curated books to ~100 Huberman bro themed titles
- [x] Add manual book entry option in Add Book modal


## Essential Production Flows (1 Hour Sprint)

- [x] Display like/comment counts on posts
- [x] Make Log Session fully functional with database save
- [x] Auto-update statistics after session logged
- [x] Add Create Post button and modal
- [x] Display reading notes on dashboard


## Resume Reading Flow

- [x] Create Reading Session screen with timer
- [x] Add motivational quotes (Huberman/stoicism themed)
- [x] Implement pause/resume functionality
- [x] Implement end session button
- [x] Connect to database to save session
- [x] Test end-to-end flow


## Bug Fixes & Enhancements

- [x] Fix Resume Reading button not navigating
- [x] Create post-session note page
- [x] Show pages read and book details on note page
- [x] Connect note saving to database


## Reading Session UX Improvements

- [x] Differentiate pause button (temporary) from end session button (final)
- [x] Update post-session page to show start page and end page inputs
- [x] Add "Personal Takeaways" text area on post-session page
- [x] Save session with user-entered page numbers
- [ ] Test complete reading flow with new UX


## Timer Screen Cleanup

- [x] Remove start page and end page counter from reading session timer


## UI Polish

- [x] Change End Session button color to more appealing option


## Session & Notes Management

- [x] Fix Save Session button not working on post-session page
- [x] Create session history view for each book
- [x] Add notes/takeaways view for each book
- [x] Integrate session and notes views into book detail page


## Book Selection UX

- [x] Create book picker modal component
- [x] Add book picker to Resume Reading button on dashboard
- [x] Allow users to select any book from library to start reading


## UX Correction

- [x] Move book picker to general Resume Reading button at top of dashboard
- [x] Restore direct navigation for book card's Resume Reading button


## Authentication UX

- [x] Change OAuth login to use in-app browser (expo-web-browser) instead of external browser


## OAuth Bug Fix

- [x] Fix OAuth callback handling - users get stuck in loading after authentication on iOS
- [x] Ensure callback URL properly redirects back to app after successful login


## OAuth Redirect URI Fix

- [x] Fix redirect URI to use custom app scheme (manus*) instead of Expo dev scheme (exp://)


## OAuth Callback Issue

- [x] Fix OAuth callback - app returns to login screen after account selection instead of completing authentication
- [x] Ensure deep link callback is captured and session token is stored properly


## Post-Session Page Bugs

- [x] Fix Save Session button not working on post-session page
- [x] Fix keyboard not dismissing after text input on post-session page


## Google Books API Integration

- [x] Set up Google Books API backend endpoint for book search
- [x] Create Add Book screen with search bar
- [x] Display search results with book covers and metadata
- [x] Auto-fill book details when user selects from search results
- [x] Update book database schema to store cover image URLs
- [x] Add fallback to manual entry if book not found


## Add Book Page Bug

- [x] Fix text inputs not allowing typing on Add Book screen


## Add Book Flow Issue

- [x] Fix Add Book flow - books don't appear in Library after creation
- [x] Ensure proper data refresh after adding a book
- [x] Add success feedback when book is added


## Book Covers & UI Enhancements

- [x] Display book covers in Library tab
- [x] Display book cover in dashboard current book card
- [x] Display book covers in book picker modal
- [x] Add pull-to-refresh in Library tab
- [x] Implement book editing functionality in Book Detail page
- [x] Add edit button to Book Detail page


## Add Book Page Redesign

- [x] Change search to show dropdown results as user types
- [x] Update placeholder to "Search our database"
- [x] Keep manual entry section intact below search
- [x] Remove search button, make it automatic dropdown


## Subscription Tiers & Monetization

- [x] Create subscription tier data model (Free, Premium, Elite)
- [x] Add user subscription status to database schema
- [x] Build subscription selection/upgrade screen
- [x] Create feature comparison table UI
- [ ] Add upgrade prompts/paywalls for premium features
- [ ] Integrate Stripe Checkout for subscriptions
- [ ] Set up Stripe webhook handlers for payment events
- [ ] Add subscription management (upgrade/downgrade/cancel)
- [ ] Implement feature gating based on tier
- [x] Add subscription status to user profile


## Subscription Page UX Fixes

- [x] Add back button to subscription page header
- [x] Add prominent "Upgrade to Premium" button to Profile page
- [x] Ensure default subscription tier is 'free' for new users


## UI & Feature Updates

- [x] Make upgrade button more minimalist on Profile page
- [x] Debug and fix Add Book database insertion issue
- [x] Create curated reading lists page
- [x] Add navigation to curated reading lists from dashboard or library


## Reading Lists Tab Navigation

- [x] Move Reading Lists from standalone page to bottom tab navigation
- [x] Add Reading Lists tab icon
- [x] Remove Reading Lists button from dashboard
- [x] Add back button to Reading Lists page (temporary until tab is created)


## UI/UX Fixes

- [x] Fix Settings section layout to look more professional
- [x] Remove back button from Lists tab (no longer needed as bottom tab)

## Social Engagement Features

- [x] Create database schema for post likes
- [x] Create database schema for post comments
- [ ] Create database schema for post shares
- [x] Implement like post API endpoint
- [x] Implement comment on post API endpoint
- [ ] Implement share post API endpoint
- [x] Connect like button in Society tab to backend
- [x] Connect comment button in Society tab to backend (displays count)
- [ ] Connect share button in Society tab to backend
- [x] Update UI to show real-time engagement counts

## Google Books API

- [x] Verify Google Books API integration is working correctly
- [x] Test book search functionality
- [x] Fix any issues with book data retrieval


## Comment Flow Implementation

- [x] Create CommentModal component for writing comments
- [x] Create CommentThreadView component for displaying all comments on a post
- [x] Connect comment button to open CommentModal
- [x] Implement comment submission with database save
- [x] Display user names and timestamps in comment threads
- [x] Add pull-to-refresh for comment threads

## Book Search API Issues

- [x] Debug Google Books API rate limiting issues (confirmed 429 errors)
- [ ] Research Amazon Product Advertising API as alternative (requires approval)
- [x] Consider Open Library API as free alternative
- [x] Implement Open Library API as primary book search (no rate limits)


## Book Search UI Fix

- [x] Fix search results layout to prevent overlapping with manual entry form
- [x] Add proper spacing and visual separation between search results and manual entry
- [x] Style search result cards with proper layout (cover, title, author)
- [x] Add clear "OR ADD MANUALLY" divider between sections


## Dashboard and Library Fixes

- [x] Fix Up Next section to display book cover images
- [x] Fix View Library button navigation on dashboard
- [x] Add cover URLs to all books in seed data (already present)

## Comment Modal Mobile Issues

- [x] Fix keyboard covering comment input on mobile
- [x] Ensure comment input stays in view when keyboard opens
- [x] Fix KeyboardAvoidingView behavior for iOS and Android

## Publish Feature

- [x] Design publish feature flow (reading updates, reviews, thoughts with optional book attachment)
- [x] Create publish button/modal UI
- [x] Implement publish to social feed functionality
- [x] Add ability to attach book to published post
- [x] Add optional rating when publishing about a book


## Pull-to-Refresh for All Tabs

- [x] Add pull-to-refresh to Dashboard tab
- [x] Add pull-to-refresh to Library tab (already had it)
- [x] Add pull-to-refresh to Lists tab
- [x] Add pull-to-refresh to Society tab
- [x] Add pull-to-refresh to Profile tab

## Delete Flows

- [x] Implement delete book flow with confirmation dialog (long press in Library)
- [x] Add delete book API endpoint (already existed)
- [x] Implement delete comment flow (user's own comments only, long press in CommentModal)
- [x] Add delete comment API endpoint
- [x] Implement delete post flow (user's own posts only, long press in Society feed)
- [x] Add delete post API endpoint
- [x] Add confirmation dialogs for all delete actions


## Keyboard and Input Fixes

- [x] Fix Society tab publish input keyboard getting stuck
- [x] Fix comment modal textbar being out of view when keyboard opens
- [x] Ensure proper KeyboardAvoidingView behavior across all input fields

## Add Book Status Selection

- [x] Add status picker (Reading/Queue/Archive) to Add Book page
- [x] Set default status to "Queue"
- [x] Update book creation to use selected status
- [x] Add visual indicator for selected status


## Dashboard Cleanup

- [x] Remove Publish Update button from Dashboard tab

## User Profile Viewing

- [x] Create user profile page component showing stats and library
- [x] Add navigation from usernames/avatars in Society feed to profile pages
- [x] Display user's books, reading stats, and recent posts on profile page
- [x] Add back button to return to previous screen

## Notification System

- [x] Create notifications database schema
- [x] Implement notification API endpoints (create, list, mark as read)
- [x] Create notification bell icon in app header
- [x] Build notification list UI component
- [x] Add notification triggers for post likes
- [x] Add notification triggers for post comments
- [ ] Add notification triggers for reading milestones (future enhancement)
- [ ] Implement push notification delivery (future enhancement)


## Follow/Unfollow System

- [x] Update database schema to support follow relationships (already exists in userFollows table)
- [x] Implement follow/unfollow API endpoints
- [x] Add follow/unfollow button to user profile pages
- [x] Display follower and following counts on profiles
- [x] Update Following tab in Society to filter posts from followed users only
- [ ] Add "You're not following anyone yet" empty state in Following tab (future enhancement)

## Premium Upgrade with Calendly

- [x] Add "Upgrade" section to Profile settings
- [x] Create Calendly booking cards for "Ivy League Consulting for Families"
- [x] Create Calendly booking cards for "90-Day Attention Span 1-on-1 Consulting"
- [x] Add external link handling for Calendly URLs
- [x] Display current subscription tier prominently

## Elite Accountability Features

- [x] Create buddy pairing database schema (buddyPairs table)
- [ ] Build Elite onboarding flow with buddy request option (future phase)
- [ ] Implement 72-hour matching period logic (future phase)
- [ ] Create buddy dashboard showing partner's progress (future phase)
- [ ] Add notification when buddy is matched (future phase)
- [x] Create Elite Pomodoro sessions page with schedule and join link
- [x] Add Elite-only Pomodoro button in Society tab
- [x] Gate Pomodoro feature behind Elite subscription check


## Library and Reading Improvements

- [x] Enable multiple books in "Reading" status simultaneously (already supported)
- [x] Verify delete book flow works correctly (already implemented via long press)
- [x] Make Up Next books tappable to start reading sessions
- [x] Add navigation from Up Next to reading session screen
- [x] Remove share buttons from Society feed posts


## Delete Button and Archive Visibility

- [x] Add visible delete buttons to book cards in Library (in addition to long press)
- [x] Style delete buttons to be subtle but discoverable
- [x] Update user profile page to show archived books section
- [x] Add API endpoint to fetch user's archived books by userId (uses existing books.list)
- [x] Display archived books in grid layout on profile pages


## Delete Button Refinement

- [x] Move delete button from top-right to bottom-right of book cards
- [x] Remove colored background from delete button
- [x] Make delete button smaller and more subtle (plain × text)
- [x] Verify confirmation dialog works on button press


## Up Next Image Bug Fix

- [x] Fix book cover images in Up Next section displaying with incorrect aspect ratios
- [x] Ensure all book covers show properly (no blank gray boxes)
- [x] Make cover images consistent size and properly scaled


## Onboarding Flow

- [ ] Create database schema for user onboarding status and preferences
- [ ] Build Welcome screen with IvyReader intro
- [ ] Build Reading Goals screen (pages/week, favorite genres)
- [ ] Build Add First Book screen with search integration
- [ ] Build Notifications setup screen (push on mobile, email on web)
- [ ] Create onboarding router with step progression
- [ ] Add first-time user detection logic
- [ ] Redirect new users to onboarding on app launch
- [ ] Store onboarding completion status in database
- [ ] Integrate with tier selection from marketing website
- [ ] Test onboarding flow on web and mobile platforms


## Onboarding Flow

- [x] Create database schema for onboarding status fields
- [x] Build Welcome screen component
- [x] Build Reading Goals setup screen with pages/week and genre selection
- [x] Build Add First Book screen with book search
- [x] Build Notifications setup screen
- [x] Create onboarding router and navigation logic
- [x] Add first-time user detection and redirect to onboarding
- [x] Store onboarding data in user profile
- [x] Redirect to main app after onboarding completion
- [ ] Test onboarding flow on web and mobile (ready for testing)

## Enhanced Onboarding Flow

- [ ] Add profile/account creation screen (name, username, avatar selection)
- [ ] Integrate existing book search API into onboarding Add First Book screen
- [ ] Create database flow to save profile data to users table
- [ ] Create database flow to save first book to books table with proper user association
- [ ] Create database flow to save reading goals to user profile
- [ ] Ensure notification preferences are saved to user settings
- [ ] Test complete data flow from onboarding to main app
- [ ] Verify all onboarding data appears correctly in dashboard, library, and profile

## Enhanced Onboarding Status Update

- [x] Add profile/account creation screen (name, username, avatar selection)
- [x] Integrate existing book search API into onboarding Add First Book screen
- [x] Create database flow to save profile data to users table
- [x] Create database flow to save first book to books table with proper user association
- [x] Create database flow to save reading goals to user profile
- [x] Ensure notification preferences are saved to user settings
- [ ] Test complete data flow from onboarding to main app
- [ ] Verify all onboarding data appears correctly in dashboard, library, and profile

## Book Search & Marketing Integration

- [ ] Debug book search not returning results in onboarding
- [ ] Fix Open Library API integration
- [ ] Implement deep linking to receive subscription tier from marketing website
- [ ] Update onboarding flow to set user tier from deep link parameters
- [ ] Test complete flow: marketing website → payment → deep link → app with correct tier

## Completed: Book Search & Marketing Integration

- [x] Debug book search not returning results in onboarding (fixed totalPages field name)
- [x] Fix Open Library API integration (returns proper book data with defaults)
- [x] Implement deep linking to receive subscription tier from marketing website
- [x] Create purchase-complete deep link handler
- [x] Add updateSubscriptionTier API endpoint
- [x] Create MARKETING_INTEGRATION.md guide for marketing team
- [x] Update onboarding flow to work with tier from deep link
- [ ] Test complete flow: marketing website → payment → deep link → app with correct tier (ready for testing)

## Returning User Flow

- [ ] Update OAuth callback to check if user has completed onboarding
- [ ] Skip onboarding for returning users, go directly to main app
- [ ] Update purchase-complete handler to respect onboarding status
- [ ] Test flow: returning user logs in → goes directly to dashboard

## Completed: Returning User Flow

- [x] Update OAuth callback to check if user has completed onboarding
- [x] Skip onboarding for returning users, go directly to main app
- [x] Update purchase-complete handler to respect onboarding status
- [x] Returning users now bypass onboarding and go straight to dashboard

## Onboarding Completion Bug

- [ ] Fix onboarding stuck issue - users can't proceed to main app after completing onboarding
- [ ] Ensure onboardingCompleted flag is set properly in database
- [ ] Verify redirect to main app works after onboarding
- [ ] Test all onboarding steps complete successfully

## Completed: Onboarding Completion Fix

- [x] Fix onboarding stuck issue - users can now proceed to main app after completing onboarding
- [x] Added query invalidation to refresh user data after profile and onboarding updates
- [x] Ensured onboardingCompleted flag is set properly in database
- [x] Verified redirect to main app works after onboarding completion
- [x] All onboarding steps complete successfully and grant access to main app

## Onboarding UX Improvements

- [ ] Add loading indicator during account setup delay
- [ ] Implement optimistic user state updates to eliminate waiting
- [ ] Test complete onboarding flow from login to dashboard
- [ ] Verify no more stuck/loop issues

## Completed: Onboarding UX Improvements

- [x] Added loading indicator "Setting up your account..." during completion
- [x] Updated Auth.User type to include onboardingCompleted and other fields
- [x] Fixed useAuth to map all user fields from API response
- [x] User state now includes onboarding status for proper routing

## Tier-Specific Onboarding

### Free Tier (Heavily Gated)
- [ ] Create Free tier welcome screen with limited features messaging
- [ ] Restrict to 3 books max in library
- [ ] No reading lists access
- [ ] No Society (community) access
- [ ] Basic reading tracking only
- [ ] Show upgrade prompts throughout

### Premium Tier (Current Flow)
- [ ] Ungate curated reading lists
- [ ] Full library access (unlimited books)
- [ ] Basic Society access
- [ ] Full reading tracking with analytics
- [ ] No upgrade prompts for gated features

### Elite Tier (Full Access)
- [ ] Create Elite-specific welcome with VIP messaging
- [ ] All Premium features plus:
- [ ] Priority Society features
- [ ] Advanced analytics
- [ ] Exclusive reading challenges
- [ ] Personal reading concierge features

### Feature Gating
- [ ] Create TierGate component for feature restrictions
- [ ] Add upgrade prompts for Free users
- [ ] Route users to correct onboarding based on tier

## Revised Tier-Specific Onboarding (Premium & Elite Only)

### Premium Tier
- [ ] Aesthetic welcome screen with Premium branding
- [ ] Ungate curated reading lists
- [ ] Full library access
- [ ] Society access
- [ ] Advanced reading analytics

### Elite Tier
- [ ] VIP welcome screen with gold/luxury aesthetic
- [ ] Exclusive Elite onboarding experience
- [ ] All Premium features plus exclusive Elite perks
- [ ] Personal concierge messaging
- [ ] Priority features highlighted

## Completed: Tier-Specific Onboarding

- [x] Aesthetic welcome screen with tier-aware branding
- [x] Elite VIP welcome screen with gold aesthetic
- [x] Tier-aware profile screen
- [x] Tier-aware goals screen
- [x] Tier-aware first-book screen
- [x] Tier-aware notifications screen
- [x] All screens have animations and polished UI

## Tier Gating System & Products

### Phase 1: Tier Configuration
- [ ] Create TierConfig with feature-to-tier mapping
- [ ] Build useTierAccess hook
- [ ] Create TierGate wrapper component
- [ ] Create UpgradePrompt modal

### Phase 2: Premium Product
- [ ] Curated Reading Lists screen
- [ ] Standard analytics dashboard
- [ ] Reader Society community features
- [ ] Book tracking with insights

### Phase 3: Elite Product
- [ ] AI-powered book recommendations (Concierge)
- [ ] Advanced reading analytics
- [ ] Elite badge/status display
- [ ] Priority features section

### Phase 4: Integration
- [ ] Route users to tier-appropriate dashboard
- [ ] Tier-specific welcome content
- [ ] Upgrade prompts at gate points

## Completed - Tier Gating System & Products

### Phase 1: Tier Configuration
- [x] Create TierConfig with feature-to-tier mapping
- [x] Build useTierAccess hook
- [x] Create TierGate wrapper component
- [x] Create UpgradePrompt modal

### Phase 2: Premium Product
- [x] Curated Reading Lists screen (updated existing)
- [x] Tier-aware dashboard
- [x] Reader Society community features (existing)
- [x] Book tracking with insights (existing)

### Phase 3: Elite Product
- [x] AI-powered book recommendations (Concierge tab)
- [x] Elite dark theme throughout app
- [x] Elite badge/status display
- [x] VIP onboarding experience

### Phase 4: Integration
- [x] Route users to tier-appropriate dashboard
- [x] Tier-specific welcome content on dashboard
- [x] Upgrade prompts at gate points

## Tier Access Updates
- [ ] Premium gets full access to curated reading lists
- [ ] Upgrade buttons show "Upgrade to Elite" for Premium users
- [ ] Remove AI tab from bottom navigation
- [ ] Add AI Concierge teaser in Profile section

## Tier Access Changes Completed
- [x] Premium users now have full access to reading lists (no lock icons)
- [x] Upgrade buttons show "Upgrade to Elite" for Premium users
- [x] Removed AI tab from bottom navigation
- [x] Added AI Concierge teaser in Profile section with pulse animation
- [x] Elite users can access AI Concierge directly from Profile
- [x] Non-Elite users see teaser with upgrade prompt

## New Features - Subscription, Society & Accountability
- [ ] Build /subscription route with current plan display
- [ ] Add billing history section to subscription page
- [ ] Add upgrade/downgrade options to subscription page
- [ ] Enhance Society tab with prominent Pomodoro group calls for Elite
- [ ] Make Pomodoro section more aesthetic
- [ ] Create Accountability bottom tab
- [ ] Add chat with founders feature
- [ ] Add accountability partner messaging system
- [ ] Implement messaging UI components

## Features Completed - Subscription, Society & Accountability
- [x] Build /subscription route with current plan display
- [x] Add billing history section to subscription page
- [x] Add upgrade/downgrade options to subscription page
- [x] Enhance Society tab with prominent Pomodoro group calls for Elite
- [x] Make Pomodoro section more aesthetic with animations
- [x] Create Accountability bottom tab
- [x] Add chat with founders feature (Elite exclusive)
- [x] Add accountability partner messaging system
- [x] Implement messaging UI components

## Launch Preparation Audit
### Profile Settings (Broken)
- [ ] Edit Profile - only logs to console, needs actual screen
- [ ] Notifications settings - only logs to console, needs actual screen
- [ ] Privacy settings - only logs to console, needs actual screen
- [ ] About IvyReader - only logs to console, needs actual screen

### Features to Verify
- [ ] Book detail page functionality
- [ ] Reading session timer
- [ ] Post-session notes
- [ ] Pomodoro sessions page
- [ ] List detail page
- [ ] User profile page (other users)
- [ ] Create post functionality in Society

## Launch Preparation Fixes (Completed)
- [x] Create Edit Profile screen with name, username, avatar editing
- [x] Create Notifications Settings screen with toggle preferences
- [x] Create Privacy Settings screen with visibility and data management
- [x] Create About screen with app info and links
- [x] Wire Profile settings buttons to new screens
- [x] Fix Library book cards to navigate to book detail
- [x] Add "Start Reading" button to currently reading books
- [x] Fix Reading Lists navigation to list-detail screen
- [x] Enhance list-detail with add book functionality
- [x] Sync curated list IDs between reading-lists and list-detail screens

## Email Verification & Admin Dashboard
- [ ] Email verification system for post-purchase validation
- [ ] Admin dashboard layout and authentication
- [ ] Subscriber management panel (view all users, tiers, status)
- [ ] Curated reading list management (add/edit/delete lists)
- [ ] Engagement metrics dashboard (active users, books tracked, reading sessions)

## Email Verification & Admin Dashboard (Completed)
- [x] Add email verification fields to user schema
- [x] Create email verification utility functions
- [x] Add sendVerificationEmail and verifyEmail API endpoints
- [x] Create verify-email page for handling verification links
- [x] Create admin dashboard with overview, users, lists, and metrics tabs
- [x] Add admin routes with role-based access control
- [x] Add user management (view, update role, delete)
- [x] Add engagement metrics (DAU, WAU, conversion rate, MRR)
- [x] Add curated lists management view
- [x] Add admin dashboard link in profile (visible only to admins)
