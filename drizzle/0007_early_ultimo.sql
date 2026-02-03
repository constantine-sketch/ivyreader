ALTER TABLE `users` ADD `emailVerified` tinyint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `emailVerificationToken` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `emailVerificationExpires` timestamp;