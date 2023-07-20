import dotenv from 'dotenv';
dotenv.config();

export * from './regex';
export const { CRAWL_URL, CRAWL_PATH, CRAWL_CHECK_LIVE_PATH, CRAWL_LOGIN_PATH } = process.env;
