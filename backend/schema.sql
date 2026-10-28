
-- Create the project database
CREATE DATABASE IF NOT EXISTS curio_museum;

-- Select the database
USE curio_museum;

-- Create the community discoveries table
CREATE TABLE IF NOT EXISTS community_discoveries (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    period VARCHAR(60) NOT NULL,
    location VARCHAR(100) NOT NULL,
    contributor VARCHAR(70) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    `reference` VARCHAR(180) NOT NULL DEFAULT '',
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NULL,

    CONSTRAINT chk_discovery_title
        CHECK (CHAR_LENGTH(TRIM(title)) > 0),

    CONSTRAINT chk_discovery_category
        CHECK (CHAR_LENGTH(TRIM(category)) > 0),

    CONSTRAINT chk_discovery_period
        CHECK (CHAR_LENGTH(TRIM(period)) > 0),

    CONSTRAINT chk_discovery_location
        CHECK (CHAR_LENGTH(TRIM(location)) > 0),

    CONSTRAINT chk_discovery_contributor
        CHECK (CHAR_LENGTH(TRIM(contributor)) > 0),

    CONSTRAINT chk_discovery_description
        CHECK (CHAR_LENGTH(TRIM(description)) > 0)
);
