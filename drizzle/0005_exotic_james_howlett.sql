ALTER TABLE `users` ADD `onboardingCompleted` tinyint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `readingGoalPagesPerWeek` int;--> statement-breakpoint
ALTER TABLE `users` ADD `favoriteGenres` text;--> statement-breakpoint
ALTER TABLE `users` ADD `notificationsEnabled` tinyint DEFAULT 1 NOT NULL;