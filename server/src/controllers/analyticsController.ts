import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();

export const analyticsOverview = async (req: AuthRequest, res: Response) => {
  const { twitterAccountId } = req.query as { twitterAccountId: string };
  const dateFrom = req.query.from ? new Date(req.query.from as string) : undefined;
  const filters = {
    twitterAccountId,
    userId: req.user!.id,
    createdAt: dateFrom ? { gte: dateFrom } : undefined
  } as any;

  const tweetsPosted = await prisma.tweetInteractionLog.count({
    where: { ...filters, actionType: 'post' }
  });
  const likes = await prisma.tweetInteractionLog.count({ where: { ...filters, actionType: 'like' } });
  const retweets = await prisma.tweetInteractionLog.count({ where: { ...filters, actionType: 'retweet' } });
  const scheduledExecuted = await prisma.scheduledTweet.count({
    where: { ...filters, status: 'sent' }
  });
  res.json({ tweetsPosted, likes, retweets, scheduledExecuted });
};
