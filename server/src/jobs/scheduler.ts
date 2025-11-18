import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { twitterService } from '../services/twitterService.js';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

export const startScheduler = () => {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const pending = await prisma.scheduledTweet.findMany({
      where: { status: 'pending', scheduledAt: { lte: now } },
      include: { twitterAccount: true }
    });
    for (const job of pending) {
      try {
        if (job.threadParts) {
          await twitterService.postThread(job.twitterAccount, job.threadParts as any);
        } else {
          await twitterService.postTweet(job.twitterAccount, { text: job.text });
        }
        await prisma.scheduledTweet.update({
          where: { id: job.id },
          data: { status: 'sent', sentAt: new Date() }
        });
      } catch (error: any) {
        logger.error('Failed to send scheduled tweet', error);
        await prisma.scheduledTweet.update({
          where: { id: job.id },
          data: { status: 'failed', errorMessage: error?.message }
        });
      }
    }
  });
};
