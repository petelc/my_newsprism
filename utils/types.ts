import { Feed } from "@prisma/client";

export enum ItemType {
  BundleType = "BundleType",
  FeedType = "FeedType",
}

export type FeedObject = {
  id: string;
  name: string;
  url: string;
  tags: TagObject[];
  bundles: BundleObject[];
  author: AuthorObject;
  likes: AuthorObject[];
};

export type BundleObject = {
  id: string;
  name: string;
  description: string;
  tags: TagObject[];
  feeds: FeedObject[];
  author: AuthorObject;
  likes: AuthorObject[];
};

export type AuthorObject = {
  id: string;
  auth0: string;
  picture: string;
  nickname: string;
};

export type TagObject = {
  name: string;
  id: string;
};

export type SelectedFeedState = {
  id: string;
  feeds: Feed[];
  editMode: boolean;
  newMode: boolean;
};

export type BundleState = {
  name: string;
  description: string;
  tags: TagObject[];
  feeds: FeedState[];
};
export type FeedState = {
  id?: number;
  name: string;
  url: string;
  tags: TagObject[];
};

export enum BadgeFieldName {
  tags = "tags",
  feeds = "feeds",
  bundles = "bundles",
}

export enum ActionType {
  ADD = "ADD",
  CREATE = "CREATE",
  NONE = "NONE",
}
