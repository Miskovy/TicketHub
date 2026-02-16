CREATE TABLE `medical_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`medical_id` int,
	`image_path` varchar(255) NOT NULL,
	CONSTRAINT `medical_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `medicals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`full_name` varchar(255),
	`phone_number` varchar(20),
	`describtion` text NOT NULL,
	`status` enum('pending','accepted','rejected') DEFAULT 'pending',
	`rejection_reason` text,
	`price` decimal(10,2),
	`document_url` varchar(512),
	`document_type` enum('image','file'),
	CONSTRAINT `medicals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `booking_details` (
	`id` int AUTO_INCREMENT NOT NULL,
	`booking_id` int,
	`full_name` varchar(255),
	`email` varchar(255),
	`phone` varchar(20),
	`notes` text,
	`adults_count` int DEFAULT 0,
	`children_count` int DEFAULT 0,
	`infants_count` int DEFAULT 0,
	`total_amount` decimal(10,2),
	`created_at` timestamp,
	CONSTRAINT `booking_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `booking_extras` (
	`id` int AUTO_INCREMENT NOT NULL,
	`booking_id` int,
	`extra_id` int,
	`adult_count` int DEFAULT 0,
	`child_count` int DEFAULT 0,
	`infant_count` int DEFAULT 0,
	`created_at` timestamp DEFAULT '2026-02-16 07:50:57.121',
	CONSTRAINT `booking_extras_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `category_medical` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	CONSTRAINT `category_medical_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contactus` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(20),
	`message` text NOT NULL,
	CONSTRAINT `contactus_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `medical_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`medical_id` int,
	`category_id` int,
	`created_at` timestamp DEFAULT '2026-02-16 07:50:57.121',
	CONSTRAINT `medical_categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`admin_id` int,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`is_read` boolean DEFAULT false,
	`created_at` timestamp DEFAULT '2026-02-16 07:50:57.122',
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tour_promo_code` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tour_id` int NOT NULL,
	`promo_code_id` int NOT NULL,
	CONSTRAINT `tour_promo_code_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `bookings` MODIFY COLUMN `created_at` timestamp DEFAULT '2026-02-16 07:50:57.120';--> statement-breakpoint
ALTER TABLE `email_verifications` MODIFY COLUMN `created_at` date DEFAULT '2026-02-16';--> statement-breakpoint
ALTER TABLE `manual_payment_method` MODIFY COLUMN `uploadedAt` date DEFAULT '2026-02-16';--> statement-breakpoint
ALTER TABLE `payments` MODIFY COLUMN `created_at` date DEFAULT '2026-02-16';--> statement-breakpoint
ALTER TABLE `tour_discounts` MODIFY COLUMN `value` decimal(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `tours` MODIFY COLUMN `startDate` date NOT NULL;--> statement-breakpoint
ALTER TABLE `tours` MODIFY COLUMN `endDate` date NOT NULL;--> statement-breakpoint
ALTER TABLE `bookings` ADD `discount_number` decimal(10,2);--> statement-breakpoint
ALTER TABLE `bookings` ADD `location` varchar(255);--> statement-breakpoint
ALTER TABLE `bookings` ADD `address` varchar(255);--> statement-breakpoint
ALTER TABLE `tour_discounts` ADD `kind_by` enum('person','total') NOT NULL;--> statement-breakpoint
ALTER TABLE `tours` ADD `file` varchar(255);--> statement-breakpoint
ALTER TABLE `tours` ADD `policy` text;--> statement-breakpoint
ALTER TABLE `users` ADD `google_id` varchar(255);--> statement-breakpoint
ALTER TABLE `medical_images` ADD CONSTRAINT `medical_images_medical_id_medicals_id_fk` FOREIGN KEY (`medical_id`) REFERENCES `medicals`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `medicals` ADD CONSTRAINT `medicals_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `booking_details` ADD CONSTRAINT `booking_details_booking_id_bookings_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `booking_extras` ADD CONSTRAINT `booking_extras_booking_id_bookings_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `booking_extras` ADD CONSTRAINT `booking_extras_extra_id_extras_id_fk` FOREIGN KEY (`extra_id`) REFERENCES `extras`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `medical_categories` ADD CONSTRAINT `medical_categories_medical_id_medicals_id_fk` FOREIGN KEY (`medical_id`) REFERENCES `medicals`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `medical_categories` ADD CONSTRAINT `medical_categories_category_id_category_medical_id_fk` FOREIGN KEY (`category_id`) REFERENCES `category_medical`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_admin_id_admins_id_fk` FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tour_promo_code` ADD CONSTRAINT `tour_promo_code_tour_id_tours_id_fk` FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tour_promo_code` ADD CONSTRAINT `tour_promo_code_promo_code_id_promo_code_id_fk` FOREIGN KEY (`promo_code_id`) REFERENCES `promo_code`(`id`) ON DELETE no action ON UPDATE no action;