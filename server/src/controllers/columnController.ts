import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.js';
import { twitterService } from '../services/twitterService.js';
import { z } from 'zod';

const prisma = new PrismaClient();

const columnSchema = z.object({
  type: z.enum(['home', 'mentions', 'list', 'search', 'userTimeline']),
  twitterAccountId: z.string(),
  config: z.record(z.any()).default({}),
  positionIndex: z.number().optional()
});

export const listColumns = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const columns = await prisma.column.findMany({
    where: { userId },
    orderBy: { positionIndex: 'asc' }
  });
  res.json(columns);
};

export const createColumn = async (req: AuthRequest, res: Response) => {
  const parsed = columnSchema.parse(req.body);
  const positionIndex = parsed.positionIndex ?? (await prisma.column.count({ where: { userId: req.user!.id } }));
  const column = await prisma.column.create({
    data: { ...parsed, userId: req.user!.id, positionIndex }
  });
  res.status(201).json(column);
};

export const updateColumn = async (req: AuthRequest, res: Response) => {
  const parsed = columnSchema.partial().parse(req.body);
  const column = await prisma.column.update({ where: { id: req.params.id }, data: parsed });
  res.json(column);
};

export const deleteColumn = async (req: AuthRequest, res: Response) => {
  await prisma.column.delete({ where: { id: req.params.id } });
  res.status(204).send();
};

export const reorderColumns = async (req: AuthRequest, res: Response) => {
  const orderedIds = z.array(z.string()).parse(req.body.ids);
  await Promise.all(
    orderedIds.map((id, index) => prisma.column.update({ where: { id }, data: { positionIndex: index } }))
  );
  res.json({ success: true });
};

export const columnFeed = async (req: AuthRequest, res: Response) => {
  const column = await prisma.column.findUnique({ where: { id: req.params.id }, include: { twitterAccount: true } });
  if (!column || column.userId !== req.user!.id) return res.status(404).json({ error: 'Not found' });
  const params = req.query.cursor ? { pagination_token: req.query.cursor as string } : undefined;
  let path = '/tweets';
  switch (column.type) {
    case 'home':
      path = `/users/${column.twitterAccount.twitterUserId}/timelines/reverse_chronological`;
      break;
    case 'mentions':
      path = `/users/${column.twitterAccount.twitterUserId}/mentions`;
      break;
    case 'list':
      path = `/lists/${(column.config as any).listId}/tweets`;
      break;
    case 'search':
      path = `/tweets/search/recent`;
      break;
    case 'userTimeline':
      path = `/users/${(column.config as any).userId}/tweets`;
      break;
  }
  const data = await twitterService.fetchTimeline(column.twitterAccount, path, {
    ...(params ?? {}),
    query: column.type === 'search' ? (column.config as any).query : undefined
  });
  res.json(data);
};
