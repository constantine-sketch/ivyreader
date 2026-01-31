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
