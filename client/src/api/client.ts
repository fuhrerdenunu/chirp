import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true
});

export interface TwitterAccount {
  id: string;
  screenName: string;
}

export const fetchCurrentUser = async () => {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch (error) {
    return null;
  }
};

export const getColumns = async () => {
  const { data } = await api.get('/columns');
  return data;
};

export const createColumn = async (payload: any) => {
  const { data } = await api.post('/columns', payload);
  return data;
};

export const fetchColumnFeed = async (id: string) => {
  const { data } = await api.get(`/columns/${id}/feed`);
  return data;
};

export const scheduleTweet = async (payload: any) => {
  const { data } = await api.post('/tweets/schedule', payload);
  return data;
};

export const getScheduledTweets = async () => {
  const { data } = await api.get('/tweets/scheduled');
  return data;
};

export const cancelScheduled = async (id: string) => {
  const { data } = await api.post(`/tweets/${id}/cancel`);
  return data;
};

export const postTweetNow = async (payload: any) => {
  const { data } = await api.post('/tweets', payload);
  return data;
};

export const getAnalytics = async (twitterAccountId: string) => {
  const { data } = await api.get('/analytics/overview', { params: { twitterAccountId } });
  return data;
};

export { api };
