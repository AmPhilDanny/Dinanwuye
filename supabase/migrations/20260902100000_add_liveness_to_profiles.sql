-- Create the LivenessAttempt table (exists in Prisma schema but was never created via SQL)
CREATE TABLE IF NOT EXISTS dinanwuye_auth."LivenessAttempt" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL REFERENCES dinanwuye_auth."User"("id") ON DELETE CASCADE,
  "challenges" TEXT[] NOT NULL,
  "completed" TEXT[] NOT NULL,
  "passed" BOOLEAN NOT NULL,
  "confidence" DOUBLE PRECISION,
  "deviceRef" TEXT,
  "failureReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "LivenessAttempt_userId_createdAt_idx" ON dinanwuye_auth."LivenessAttempt"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "LivenessAttempt_passed_createdAt_idx" ON dinanwuye_auth."LivenessAttempt"("passed", "createdAt");

-- Sync isVerified from User to Profile (UPDATE statements, not ALTER)
-- When User.isVerified is true, ensure Profile.isVerified matches
UPDATE dinanwuye_profile."Profile" p
SET "isVerified" = TRUE
FROM dinanwuye_auth."User" u
WHERE p."userId" = u."id"
  AND u."isVerified" = TRUE
  AND p."isVerified" = FALSE;
