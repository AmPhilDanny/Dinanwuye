create schema if not exists dinanwuye_auth;
create schema if not exists dinanwuye_profile;
create schema if not exists dinanwuye_messaging;
create schema if not exists dinanwuye_trust_safety;

create table if not exists dinanwuye_auth."User" (
  "id" text primary key default gen_random_uuid()::text,
  "email" text unique,
  "phone" text unique,
  "emailHash" text,
  "phoneHash" text,
  "passwordHash" text,
  "status" text not null default 'active',
  "role" text not null default 'user',
  "isVerified" boolean not null default false,
  "deviceFingerprint" text,
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null
);
create table if not exists dinanwuye_auth."RefreshToken" (
  "id" text primary key default gen_random_uuid()::text,
  "userId" text not null references dinanwuye_auth."User"("id") on delete cascade,
  "jti" text unique not null,
  "expiresAt" timestamp(3) not null,
  "revokedAt" timestamp(3),
  "deviceInfo" text,
  "createdAt" timestamp(3) not null default current_timestamp
);
create table if not exists dinanwuye_auth."OtpCode" (
  "id" text primary key default gen_random_uuid()::text,
  "userId" text references dinanwuye_auth."User"("id") on delete cascade,
  "identifier" text not null,
  "codeHash" text not null,
  "purpose" text not null default 'signup',
  "expiresAt" timestamp(3) not null,
  "consumedAt" timestamp(3),
  "attempts" integer not null default 0,
  "createdAt" timestamp(3) not null default current_timestamp
);
create index if not exists "User_email_idx" on dinanwuye_auth."User"("email");
create index if not exists "User_phone_idx" on dinanwuye_auth."User"("phone");
create index if not exists "User_status_idx" on dinanwuye_auth."User"("status");
create index if not exists "RefreshToken_userId_idx" on dinanwuye_auth."RefreshToken"("userId");
create index if not exists "OtpCode_userId_purpose_idx" on dinanwuye_auth."OtpCode"("userId", "purpose");
create index if not exists "OtpCode_identifier_idx" on dinanwuye_auth."OtpCode"("identifier");

create table if not exists dinanwuye_profile."Profile" (
  "id" text primary key default gen_random_uuid()::text,
  "userId" text unique not null,
  "name" text not null,
  "dob" timestamp(3) not null,
  "gender" text not null,
  "seeking" text[] not null,
  "bio" text,
  "heightCm" integer,
  "ethnicity" text,
  "religion" text,
  "relationshipIntent" text,
  "education" text,
  "occupation" text,
  "languages" text[] not null,
  "interests" text[] not null,
  "locationLat" double precision,
  "locationLng" double precision,
  "locationName" text,
  "isVerified" boolean not null default false,
  "isActive" boolean not null default true,
  "isPremium" boolean not null default false,
  "lastActiveAt" timestamp(3) not null default current_timestamp,
  "onboardingStep" integer not null default 0,
  "onboardingComplete" boolean not null default false,
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null
);
create table if not exists dinanwuye_profile."Photo" (
  "id" text primary key default gen_random_uuid()::text,
  "profileId" text not null references dinanwuye_profile."Profile"("id") on delete cascade,
  "s3Key" text not null,
  "order" integer not null default 0,
  "moderationStatus" text not null default 'pending',
  "createdAt" timestamp(3) not null default current_timestamp
);
create table if not exists dinanwuye_profile."Preference" (
  "id" text primary key default gen_random_uuid()::text,
  "profileId" text unique not null references dinanwuye_profile."Profile"("id") on delete cascade,
  "ageMin" integer not null default 21,
  "ageMax" integer not null default 45,
  "distanceKm" integer not null default 50,
  "filtersJson" jsonb,
  "showOnlineStatus" boolean not null default true,
  "showDistance" boolean not null default true,
  "incognitoMode" boolean not null default false,
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null
);
create index if not exists "Profile_gender_seeking_idx" on dinanwuye_profile."Profile"("gender", "seeking");
create index if not exists "Profile_isVerified_idx" on dinanwuye_profile."Profile"("isVerified");
create index if not exists "Photo_profileId_idx" on dinanwuye_profile."Photo"("profileId");

create table if not exists dinanwuye_messaging."Conversation" (
  "id" text primary key default gen_random_uuid()::text,
  "matchId" text,
  "userAId" text not null,
  "userBId" text not null,
  "status" text not null default 'active',
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null,
  unique ("userAId", "userBId")
);
create table if not exists dinanwuye_messaging."Message" (
  "id" text primary key default gen_random_uuid()::text,
  "conversationId" text not null references dinanwuye_messaging."Conversation"("id") on delete cascade,
  "senderId" text not null,
  "contentEncrypted" text not null,
  "contentType" text not null default 'text',
  "mediaRef" text,
  "readAt" timestamp(3),
  "createdAt" timestamp(3) not null default current_timestamp
);
create index if not exists "Conversation_userAId_idx" on dinanwuye_messaging."Conversation"("userAId");
create index if not exists "Conversation_userBId_idx" on dinanwuye_messaging."Conversation"("userBId");
create index if not exists "Message_conversationId_createdAt_idx" on dinanwuye_messaging."Message"("conversationId", "createdAt");
create index if not exists "Message_senderId_idx" on dinanwuye_messaging."Message"("senderId");

create table if not exists dinanwuye_trust_safety."Block" (
  "id" text primary key default gen_random_uuid()::text,
  "blockerId" text not null,
  "blockedId" text not null,
  "reason" text,
  "createdAt" timestamp(3) not null default current_timestamp,
  unique ("blockerId", "blockedId")
);
create table if not exists dinanwuye_trust_safety."Report" (
  "id" text primary key default gen_random_uuid()::text,
  "reporterId" text not null,
  "targetId" text not null,
  "category" text not null,
  "details" text,
  "contextRef" text,
  "status" text not null default 'pending',
  "resolvedBy" text,
  "resolvedAt" timestamp(3),
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null
);
create table if not exists dinanwuye_trust_safety."Ban" (
  "id" text primary key default gen_random_uuid()::text,
  "userId" text unique not null,
  "reason" text not null,
  "bannedBy" text not null,
  "expiresAt" timestamp(3),
  "createdAt" timestamp(3) not null default current_timestamp,
  "liftedAt" timestamp(3)
);
create index if not exists "Block_blockerId_idx" on dinanwuye_trust_safety."Block"("blockerId");
create index if not exists "Block_blockedId_idx" on dinanwuye_trust_safety."Block"("blockedId");
create index if not exists "Report_targetId_status_idx" on dinanwuye_trust_safety."Report"("targetId", "status");
create index if not exists "Report_reporterId_idx" on dinanwuye_trust_safety."Report"("reporterId");
create index if not exists "Ban_userId_idx" on dinanwuye_trust_safety."Ban"("userId");
