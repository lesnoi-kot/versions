export type Source = {
  id: string;
  name: string;
  description: string;
  releases: Release[];
  url: string;
  minReleasePublishedAt: Date | null;
  maxReleasePublishedAt: Date | null;
  isFetching: boolean;
};

export type SourceShortInfo = {
  id: string;
  name: string;
};

export type Release = {
  id: string;
  name: string;
  tagName: string;
  url: string;
  publishedAt: Date;
  isSemver: boolean;
  major: number;
  minor: number;
  patch: number;
  isPrerelease: boolean;
};
