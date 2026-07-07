CREATE TABLE `server_type_ports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`server_type_id` integer NOT NULL,
	`label` text NOT NULL,
	`protocol` text NOT NULL,
	`container_port` integer NOT NULL,
	FOREIGN KEY (`server_type_id`) REFERENCES `server_types`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `server_type_ports_container_port_protocol_unique` ON `server_type_ports` (`container_port`,`protocol`);--> statement-breakpoint
CREATE TABLE `server_type_volumes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`server_type_id` integer NOT NULL,
	`label` text NOT NULL,
	`container_path` text NOT NULL,
	FOREIGN KEY (`server_type_id`) REFERENCES `server_types`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `active_servers_ports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`server_id` integer NOT NULL,
	`server_port_type_id` integer NOT NULL,
	`host_port` integer NOT NULL,
	`protocol` text NOT NULL,
	FOREIGN KEY (`server_id`) REFERENCES `active_servers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`server_port_type_id`) REFERENCES `server_type_ports`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `active_servers_ports_host_port_protocol_unique` ON `active_servers_ports` (`host_port`,`protocol`);--> statement-breakpoint
CREATE TABLE `active_servers_volumes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`server_id` integer,
	`sever_type_volume_id` integer NOT NULL,
	`host_path` text NOT NULL,
	FOREIGN KEY (`server_id`) REFERENCES `active_servers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sever_type_volume_id`) REFERENCES `server_type_volumes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `server_users`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_active_servers` (
	`id` integer PRIMARY KEY NOT NULL,
	`ip` text NOT NULL,
	`name` text NOT NULL,
	`status` text NOT NULL,
	`created_by` integer,
	`updated_by` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`server_type_id` integer NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`server_type_id`) REFERENCES `server_types`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_active_servers`("id", "ip", "name", "status", "created_by", "updated_by", "created_at", "updated_at", "server_type_id") SELECT "id", "ip", "name", "status", "created_by", "updated_by", "created_at", "updated_at", "server_type_id" FROM `active_servers`;--> statement-breakpoint
DROP TABLE `active_servers`;--> statement-breakpoint
ALTER TABLE `__new_active_servers` RENAME TO `active_servers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_user_roles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`role_id` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_roles`("id", "user_id", "role_id", "created_at", "updated_at") SELECT "id", "user_id", "role_id", "created_at", "updated_at" FROM `user_roles`;--> statement-breakpoint
DROP TABLE `user_roles`;--> statement-breakpoint
ALTER TABLE `__new_user_roles` RENAME TO `user_roles`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_roles_user_id_unique` ON `user_roles` (`user_id`);--> statement-breakpoint
ALTER TABLE `server_types` DROP COLUMN `pull_count`;--> statement-breakpoint
ALTER TABLE `server_types` DROP COLUMN `star_count`;