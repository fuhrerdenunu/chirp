import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.SERVER_PORT || '4000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID || '',
    clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
    redirectUri: process.env.TWITTER_REDIRECT_URI || 'http://localhost:4000/api/auth/twitter/callback'
  }
};
