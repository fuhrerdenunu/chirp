import axios, { AxiosInstance } from 'axios';
import qs from 'qs';
import { PrismaClient, TwitterAccount } from '@prisma/client';
import { logger } from '../utils/logger.js';
import { config } from '../utils/config.js';

const prisma = new PrismaClient();

const baseURL = 'https://api.twitter.com/2';

class TwitterService {
  private createClient(token: string): AxiosInstance {
    return axios.create({
      baseURL,
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  private async refreshToken(account: TwitterAccount): Promise<string> {
    // Simplified OAuth 2 refresh flow
    const tokenResponse = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      qs.stringify({
        grant_type: 'refresh_token',
        refresh_token: account.refreshToken,
        client_id: config.twitter.clientId
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    await prisma.twitterAccount.update({
      where: { id: account.id },
      data: {
        accessToken: access_token,
        refreshToken: refresh_token ?? account.refreshToken,
        tokenExpiresAt: new Date(Date.now() + expires_in * 1000)
      }
    });
    return access_token;
  }

  private async getValidToken(account: TwitterAccount): Promise<string> {
    if (new Date(account.tokenExpiresAt) > new Date(Date.now() + 60 * 1000)) {
      return account.accessToken;
    }
    logger.info('Refreshing Twitter token', { account: account.id });
    return this.refreshToken(account);
  }

  async fetchTimeline(account: TwitterAccount, path: string, params?: Record<string, string>) {
    const token = await this.getValidToken(account);
    const client = this.createClient(token);
    const res = await client.get(path, { params });
    return res.data;
  }

  async postTweet(account: TwitterAccount, payload: { text: string; in_reply_to_tweet_id?: string }) {
    const token = await this.getValidToken(account);
    const client = this.createClient(token);
    const res = await client.post('/tweets', payload);
    return res.data;
  }

  async postThread(account: TwitterAccount, thread: { text: string }[]) {
    const token = await this.getValidToken(account);
    const client = this.createClient(token);
    let replyTo: string | undefined;
    const posted = [] as any[];
    for (const part of thread) {
      const res = await client.post('/tweets', { text: part.text, reply: replyTo ? { in_reply_to_tweet_id: replyTo } : undefined });
      replyTo = res.data.data.id;
      posted.push(res.data.data);
    }
    return posted;
  }

  async likeTweet(account: TwitterAccount, tweetId: string) {
    const token = await this.getValidToken(account);
    const client = this.createClient(token);
    return client.post(`/users/${account.twitterUserId}/likes`, { tweet_id: tweetId });
  }

  async retweet(account: TwitterAccount, tweetId: string) {
    const token = await this.getValidToken(account);
    const client = this.createClient(token);
    return client.post(`/users/${account.twitterUserId}/retweets`, { tweet_id: tweetId });
  }

  async deleteTweet(account: TwitterAccount, tweetId: string) {
    const token = await this.getValidToken(account);
    const client = this.createClient(token);
    return client.delete(`/tweets/${tweetId}`);
  }

  async fetchUser(account: TwitterAccount, userId: string) {
    const token = await this.getValidToken(account);
    const client = this.createClient(token);
    const res = await client.get(`/users/${userId}`, { params: { 'user.fields': 'name,username,profile_image_url' } });
    return res.data;
  }
}

export const twitterService = new TwitterService();
