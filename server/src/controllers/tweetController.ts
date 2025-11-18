import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.js';
import { twitterService } from '../services/twitterService.js';
import { z } from 'zod';

const prisma = new PrismaClient();

const scheduleSchema = z.object({
  twitterAccountId: z.string(),
  text: z.string().min(1),
  threadParts: z.array(z.object({ text: z.string().min(1) })).optional(),
  scheduledAt: z.string(),
  mediaUrls: z.array(z.string()).optional()
});

export const scheduleTweet = async (req: AuthRequest, res: Response) => {
  const parsed = scheduleSchema.parse(req.body);
  const account = await prisma.twitterAccount.findUnique({ where: { id: parsed.twitterAccountId } });
  if (!account || account.userId !== req.user!.id) return res.status(404).json({ error: 'Account not found' });
  const record = await prisma.scheduledTweet.create({
    data: {
      ...parsed,
      userId: req.user!.id,
      status: 'pending'
    }
  });
  res.status(201).json(record);
};

export const listScheduled = async (req: AuthRequest, res: Response) => {
  const status = req.query.status as string | undefined;
  const scheduled = await prisma.scheduledTweet.findMany({
    where: { userId: req.user!.id, status: status as any },
    orderBy: { scheduledAt: 'asc' }
  });
  res.json(scheduled);
};

export const cancelScheduled = async (req: AuthRequest, res: Response) => {
  await prisma.scheduledTweet.update({ where: { id: req.params.id }, data: { status: 'canceled' } });
  res.json({ success: true });
};

export const postTweetNow = async (req: AuthRequest, res: Response) => {
  const body = z
    .object({
      twitterAccountId: z.string(),
      text: z.string().min(1),
      inReplyToTweetId: z.string().optional()
    })
    .parse(req.body);
  const account = await prisma.twitterAccount.findUnique({ where: { id: body.twitterAccountId } });
  if (!account || account.userId !== req.user!.id) return res.status(404).json({ error: 'Account not found' });
  const result = await twitterService.postTweet(account, {
    text: body.text,
    in_reply_to_tweet_id: body.inReplyToTweetId
  });
  await prisma.tweetInteractionLog.create({
    data: {
      userId: req.user!.id,
      twitterAccountId: account.id,
      tweetId: result.data.id,
      actionType: 'post'
    }
  });
  res.status(201).json(result);
};
