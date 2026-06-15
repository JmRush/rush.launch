PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_server_users` (
	`server_id` integer,
	`user_id` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`server_id`) REFERENCES `servers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_server_users`("server_id", "user_id", "created_at", "updated_at") SELECT "server_id", "user_id", "created_at", "updated_at" FROM `server_users`;--> statement-breakpoint
DROP TABLE `server_users`;--> statement-breakpoint
ALTER TABLE `__new_server_users` RENAME TO `server_users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_servers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ip` text NOT NULL,
	`port` integer NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`status` text NOT NULL,
	`type` text NOT NULL,
	`created_by` integer,
	`updated_by` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_servers`("id", "ip", "port", "name", "description", "status", "type", "created_by", "updated_by", "created_at", "updated_at") SELECT "id", "ip", "port", "name", "description", "status", "type", "created_by", "updated_by", "created_at", "updated_at" FROM `servers`;--> statement-breakpoint
DROP TABLE `servers`;--> statement-breakpoint
ALTER TABLE `__new_servers` RENAME TO `servers`;--> statement-breakpoint
CREATE TABLE `__new_user_roles` (
	`user_id` integer,
	`role_id` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_roles`("user_id", "role_id", "created_at", "updated_at") SELECT "user_id", "role_id", "created_at", "updated_at" FROM `user_roles`;--> statement-breakpoint
DROP TABLE `user_roles`;--> statement-breakpoint
ALTER TABLE `__new_user_roles` RENAME TO `user_roles`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_roles_user_id_unique` ON `user_roles` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_user_tokens` (
	`token` text PRIMARY KEY NOT NULL,
	`user_id` integer,
	`created_at` integer NOT NULL,
	`update_at` integer NOT NULL,
	`revoked_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_tokens`("token", "user_id", "created_at", "update_at", "revoked_at") SELECT "token", "user_id", "created_at", "update_at", "revoked_at" FROM `user_tokens`;--> statement-breakpoint
DROP TABLE `user_tokens`;--> statement-breakpoint
ALTER TABLE `__new_user_tokens` RENAME TO `user_tokens`;--> statement-breakpoint
ALTER TABLE `users` ADD `password` text NOT NULL;