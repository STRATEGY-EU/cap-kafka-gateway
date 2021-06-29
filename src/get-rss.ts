import fetch from 'node-fetch';
import parser from 'fast-xml-parser';

export const queryRssFeed = async <T>(
  url: string,
  username?: string,
  password?: string
): Promise<T | undefined> => {
  const authN = username && password && Buffer.from(`${username}:${password}`).toString('base64');
  const result = await fetch(url, {
    method: 'GET',
    headers: authN ? { Authorization: `Basic ${authN}` } : undefined,
  }).catch((e) => {
    console.error(e);
  });
  const xml = result ? await result.text() : undefined;
  return xml ? (parser.parse(xml) as T) : undefined;
};
