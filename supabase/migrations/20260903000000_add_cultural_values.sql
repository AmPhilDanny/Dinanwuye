-- Add culturalValues column to profiles table
ALTER TABLE dinanwuye_profile."Profile"
ADD COLUMN IF NOT EXISTS "culturalValues" TEXT[] DEFAULT '{}';
