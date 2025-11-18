import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import axios from 'axios';
import qs from 'qs';

const prisma = new PrismaClient();

export const twitterLogin = (_req: Request, res: Response) => {
  const params = qs.stringify({
    response_type: 'code',
    client_id: config.twitter.clientId,
    redirect_uri: config.twitter.redirectUri,
    scope: 'tweet.read tweet.write users.read offline.access like.write like.read dm.read',
    state: 'secure_random_state',
    code_challenge: 'challenge',
    code_challenge_method: 'plain'
  });
  res.redirect(`https://twitter.com/i/oauth2/authorize?${params}`);
};

export const twitterCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).send('Missing code');
    const tokenResponse = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      qs.stringify({
        code,
        grant_type: 'authorization_code',
        client_id: config.twitter.clientId,
        redirect_uri: config.twitter.redirectUri,
        code_verifier: 'challenge'
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    const me = await axios.get('https://api.twitter.com/2/users/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const user = await prisma.user.upsert({
      where: { email: `${me.data.data.username}@twitter.local` },
      update: { name: me.data.data.name },
      create: { email: `${me.data.data.username}@twitter.local`, name: me.data.data.name }
    });

    await prisma.twitterAccount.upsert({
      where: { twitterUserId: me.data.data.id },
      update: {
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenExpiresAt: new Date(Date.now() + expires_in * 1000)
      },
      create: {
        userId: user.id,
        twitterUserId: me.data.data.id,
        screenName: me.data.data.username,
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenExpiresAt: new Date(Date.now() + expires_in * 1000)
      }
    });

    const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    res.redirect(config.clientUrl);
  } catch (error) {
    logger.error('Twitter callback failed', error);
    res.status(500).json({ error: 'Auth failed' });
  }
};

export const currentUser = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { accounts: true }
  });
  res.json(user);
};
