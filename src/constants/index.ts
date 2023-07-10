import dotenv from 'dotenv';
dotenv.config();

export const { CRAWL_URL, CRAWL_PATH } = process.env;
export * from './regex';
