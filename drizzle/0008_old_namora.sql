CREATE TABLE `accountability_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`senderType` enum('user','founder') NOT NULL,
	`content` text NOT NULL,
	`isRead` tinyint NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `accountability_messages_id` PRIMARY KEY(`id`)
);
