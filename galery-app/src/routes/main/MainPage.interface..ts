export interface Photo {
  id: string;
  likes: number;
  description: string;
  urls: Urls;
  views: number;
  downloads: number;
}

export type Photos = Photo[];

interface Urls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
}
