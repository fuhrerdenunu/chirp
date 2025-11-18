-- Example migration generated from schema.prisma
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE "TwitterAccount" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "twitterUserId" TEXT NOT NULL,
  "screenName" TEXT NOT NULL,
  "accessToken" TEXT NOT NULL,
  "refreshToken" TEXT NOT NULL,
  "tokenExpiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE "Column" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "twitterAccountId" TEXT NOT NULL REFERENCES "TwitterAccount"("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL,
  "config" JSONB NOT NULL,
  "positionIndex" INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE "ScheduledTweet" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "twitterAccountId" TEXT NOT NULL REFERENCES "TwitterAccount"("id") ON DELETE CASCADE,
  "text" TEXT NOT NULL,
  "threadParts" JSONB,
  "mediaUrls" JSONB,
  "scheduledAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "status" TEXT DEFAULT 'pending' NOT NULL,
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "sentAt" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE "TweetInteractionLog" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "twitterAccountId" TEXT NOT NULL REFERENCES "TwitterAccount"("id") ON DELETE CASCADE,
  "tweetId" TEXT NOT NULL,
  "actionType" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX "Column_user_idx" ON "Column"("userId");
CREATE INDEX "ScheduledTweet_status_idx" ON "ScheduledTweet"("status");
