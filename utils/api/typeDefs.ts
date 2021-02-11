import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
    scalar JSON

    type Feed {
        id: String
        name: String
        url: String
        author: User
        tags: [FeedTag]
        bundles: [Bundle]
        likes: [User]
        savedArticles: [SavedArticle]
    }

    type Bundle {
        id: String
        name: String
        description: String 
        author: User
        tags: [BundleTag]
        feeds: [Feed]
        likes: [User]
    }

    type User {
        id: String
        auth0: String
        nickname: String
        picture: String
        bundles: [Bundle]
        feeds: [Feed]
        feedLikes: [Feed]
        bundleLikes: [Bundle]
    }

    type SavedArticle {
        id: String
        author: User
        url: String
        content: JSON 
        feed: Feed
    }

    type FeedTag {
        id: String
        name: String
        feeds: [Feed] 
    }

    type BundleTag {
        id: String
        name: String
        bundles: [Bundle]
    }

    
    # FEED INPUTS
    input FeedInput {
        id: String
    }

    input BundleInput {
        id: String 
    }

    input SavedArticleInput {
        url: String
    }

    
    input FeedCreateInput {
        id: String
        url: String
        name: String 
        tags: NestedFeedTagCreateInput
    }

    input NestedFeedTagCreateInput {
        create: [FeedTagCreateInput]
        connect: [FeedTagWhereUniqueInput]
    }

    input FeedTagCreateInput {
        id: String
        name: String
    }

    input FeedTagWhereUniqueInput {
        id: String
        name: String 
    }
    # END FEED INPUT

    # BUNDLE INPUT
    input BundleCreateInput {
        id: String
        name: String
        description: String
        tags: NestedBundleTagCreateInput
        feeds: NestedBundleFeedCreateInput
    }

    input NestedBundleTagCreateInput {
        create: [BundleTagCreateInput]
        connect: [BundleTagWhereUniqueInput]
    }

    input BundleTagCreateInput {
        id: String
        name: String
    }

    input BundleTagWhereUniqueInput {
        id: String
        name: String
    }

    input NestedBundleFeedCreateInput {
        create: [FeedCreateInput]
        connect: [FeedWhereUniqueInput]
    }

    input FeedWhereUniqueInput {
        id: String
        url: String
    }

    input likeBundleInput {
        bundleId: String
        likeState: Boolean
    }

    input likeFeedInput {
        feedId: String
        likeState: Boolean
    }

    input FindFeedTagInput {
        search: String
    }

    input FindBundleTagInput {
        search: String 
    }

    input FindFeedInput {
        search: String 
    }

    input FeedUpdateInput {
        id: String
        url: String
        name: String
        tags: NestedFeedTagUpdateInput
    }

    input NestedFeedTagUpdateInput {
        create: [FeedTagCreateInput]
        connect: [FeedTagWhereUniqueInput]
        disconnect: [FeedTagWhereUniqueInput]
    }

    input BundleUpdateInput {
        id: String
        name: String
        description: String
        tags: NestedBundleTagUpdateInput
        feeds: NestedBundleFeedUpdateInput 
    }

    input NestedBundleTagUpdateInput {
        create: [BundleTagCreateInput]
        connect: [BundleTagWhereUniqueInput]
        disconnect: [BundleTagWhereUniqueInput]
    }

    input NestedBundleFeedUpdateInput {
        create: [FeedCreateInput]
        connect: [FeedWhereUniqueInput]
        disconnect: [FeedWhereUniqueInput]
    }

    input SavedArticleCreateInput {
        id: String
        feed: [NestedFeedCreateInput]
        content: JSON
        url: String 
    }

    input NestedFeedCreateInput {
        connect: [FeedWhereUniqueInput]
    }

    input DeleteSavedArticleInput {
        id: String 
    }

    type Query {
        hello: String
        feed (data: FeedInput): Feed
        bundle (data: BundleInput): Bundle
        feeds: [Feed]
        bundles: [Bundle]
        findFeedTags (data: FindFeedTagInput): [FeedTag]
        findBundleTags (data: FindBundleTagInput): [BundleTag]
        findFeeds (data: FindFeedInput): [Feed] 
        savedArticle(data: SavedArticleInput): SavedArticle
        savedArticles: [SavedArticle]
        me: User 
    }

    type Mutation {
        createFeed(data: FeedCreateInput): Feed
        createBundle(data: BundleCreateInput): Bundle 
        likeBundle(data: likeBundleInput): Bundle
        likeFeed(data: likeFeedInput): Feed 
        updateBundle(data: BundleUpdateInput): Bundle
        updateFeed(data: FeedUpdateInput): Feed
        createSavedArticle(data: SavedArticleCreateInput): SavedArticle
        deleteBundle(data: BundleInput): Bundle
        deleteFeed(data: FeedInput): Feed
        deleteSavedArticle(data: DeleteSavedArticleInput): SavedArticle
    }
`;