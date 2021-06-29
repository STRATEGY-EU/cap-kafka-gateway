export interface RssFeed {
  rss: Rss;
}

export interface Rss {
  channel: Channel;
}

export interface Channel {
  title: string;
  link: string;
  description?: string;
  language?: string;
  'atom:link'?: string;
  item?: Item[];
}

export interface Item {
  guid: string;
  title: string;
  link?: string;
  description?: string;
  category?: string;
  pubDate?: string;
}
