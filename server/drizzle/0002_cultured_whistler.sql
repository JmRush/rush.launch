ALTER TABLE `servers` RENAME TO `server_types`;--> statement-breakpoint
CREATE TABLE `active_servers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ip` text NOT NULL,
	`port` integer NOT NULL,
	`name` text NOT NULL,
	`status` text NOT NULL,
	`created_by` integer,
	`updated_by` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`server_type_id` integer,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`server_type_id`) REFERENCES `server_types`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_server_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`image_url` text NOT NULL,
	`namespace` text NOT NULL,
	`repository` text NOT NULL,
	`tags` text DEFAULT (json_array()) NOT NULL,
	`pull_count` integer NOT NULL,
	`star_count` integer NOT NULL,
	`last_updated` integer NOT NULL,
	`storage_size` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_server_types`("id", "name", "description", "image_url", "namespace", "repository", "tags", "pull_count", "star_count", "last_updated", "storage_size", "created_at", "updated_at") SELECT "id", "name", "description", "image_url", "namespace", "repository", "tags", "pull_count", "star_count", "last_updated", "storage_size", "created_at", "updated_at" FROM `server_types`;--> statement-breakpoint
DROP TABLE `server_types`;--> statement-breakpoint
ALTER TABLE `__new_server_types` RENAME TO `server_types`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_server_users` (
	`server_id` integer,
	`user_id` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`server_id`) REFERENCES `active_servers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_server_users`("server_id", "user_id", "created_at", "updated_at") SELECT "server_id", "user_id", "created_at", "updated_at" FROM `server_users`;--> statement-breakpoint
DROP TABLE `server_users`;--> statement-breakpoint
ALTER TABLE `__new_server_users` RENAME TO `server_users`;