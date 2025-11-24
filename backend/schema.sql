-- Users Table: Stores user authentication and profile information
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL, -- Should be hashed
  `avatar` VARCHAR(255),
  `bio` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stories Table: Core table for all the stories
CREATE TABLE IF NOT EXISTS `stories` (
  `id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `authorId` VARCHAR(36) NOT NULL,
  `genre` VARCHAR(100),
  `type` ENUM('short-story', 'multi-chapter') NOT NULL DEFAULT 'short-story',
  `description` TEXT,
  `coverImage` VARCHAR(255),
  `publishedAt` TIMESTAMP,
  `isPublished` BOOLEAN NOT NULL DEFAULT FALSE,
  `isTrending` BOOLEAN NOT NULL DEFAULT FALSE,
  `isNewRelease` BOOLEAN NOT NULL DEFAULT FALSE,
  `isFeatured` BOOLEAN NOT NULL DEFAULT FALSE,
  `language` VARCHAR(10),
  `isbn` VARCHAR(20),
  `publisher` VARCHAR(255),
  `publicationDate` DATE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Chapters Table: For multi-chapter stories
CREATE TABLE IF NOT EXISTS `chapters` (
  `id` VARCHAR(36) NOT NULL,
  `storyId` VARCHAR(36) NOT NULL,
  `chapterNumber` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` LONGTEXT,
  `audioUrl` VARCHAR(255),
  `duration` VARCHAR(50),
  `readTime` VARCHAR(50),
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`storyId`) REFERENCES `stories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Story Stats Table: Aggregated stats for stories
CREATE TABLE IF NOT EXISTS `story_stats` (
  `storyId` VARCHAR(36) NOT NULL,
  `views` INT NOT NULL DEFAULT 0,
  `likes` INT NOT NULL DEFAULT 0,
  `bookmarks` INT NOT NULL DEFAULT 0,
  `commentsCount` INT NOT NULL DEFAULT 0,
  `rating` DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`storyId`),
  FOREIGN KEY (`storyId`) REFERENCES `stories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Books Table: Represents a collection of stories, like a book
CREATE TABLE IF NOT EXISTS `books` (
  `id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `authorId` VARCHAR(36) NOT NULL,
  `description` TEXT,
  `coverImage` VARCHAR(255),
  `isbn` VARCHAR(20),
  `publisher` VARCHAR(255),
  `publicationDate` DATE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Book_Stories Table: Links books and stories in a many-to-many relationship
CREATE TABLE IF NOT EXISTS `book_stories` (
  `bookId` VARCHAR(36) NOT NULL,
  `storyId` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`bookId`, `storyId`),
  FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`storyId`) REFERENCES `stories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
