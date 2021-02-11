import { Context } from './context';
import { verifyOwnership } from './verifyOwnership';

const createFieldResolver = (modelName, parName) => ({
    [parName]: async ({ id }, args, { prisma }: Context) => {
        const modelResponse = await prisma[modelName].findUnique({
            where: { id },
            include: { [parName]: true }
        })
        return modelResponse[parName]
    }
})

export const resolvers = {
    Feed: {
        ...createFieldResolver('feed', 'author'),
        ...createFieldResolver('feed', 'tags'),
        ...createFieldResolver('feed', 'bundles'),
        ...createFieldResolver('feed', 'likes'),
    },
    Bundle: {
        ...createFieldResolver('bundle', 'author'),
        ...createFieldResolver('bundle', 'tags'),
        ...createFieldResolver('bundle', 'feeds'),
        ...createFieldResolver('bundle', 'likes'),
    },
    BundleTag: {
        ...createFieldResolver('bundleTag', 'bundles'),
    },
    FeedTag: {
        ...createFieldResolver('feedTag', 'feeds'),
    },
    SavedArticle: {
        ...createFieldResolver('savedArticle', 'author'),
        ...createFieldResolver('savedArticle', 'feed'),
    },
    User: {
        ...createFieldResolver('user', 'bundles'),
        ...createFieldResolver('user', 'feeds'),
        ...createFieldResolver('user', 'feedLikes'),
        ...createFieldResolver('user', 'bundleLikes'),
    },
    Query: {
        hello: (parent, args, context: Context) => 'hi',
        feed: (parent, { data: { id } }, { prisma }: Context) => prisma.feed.findUnique({ where: { id } }),
        feeds: (parent, args, { prisma }: Context) => prisma.feed.findMany(),
        bundle: (parent, { data: { id } }, { prisma }: Context) => prisma.bundle.findUnique({ where: { id } }),
        bundles: (parent, args, { prisma }: Context) => prisma.bundle.findMany(),
        findFeedTags: (parent, { data }, { prisma }: Context) => {
            return prisma.feedTag.findMany({
                where: {
                    name: {
                        contains: data.search
                    }
                }
            })
        },
        findBundleTags: (parent, { data }, { prisma }: Context) => {
            return prisma.bundleTag.findMany({
                where: {
                    name: {
                        contains: data.search
                    }
                }
            })
        },
        findFeeds: (parent, { data }, { prisma }: Context) => {
            return prisma.feed.findMany({
                where: {
                    name: {
                        contains: data.search
                    }
                }
            })
        },
        savedArticle: async (parent, { data: { url } }, { prisma, user: { id: authorId } }: Context) => {
            const result = await prisma.savedArticle.findMany({ where: { url, authorId } });
            return result[0];
        },
        savedArticles: (parent, args, { prisma, user: { id: authorId }}: Context) => {
            return prisma.savedArticle.findMany({
                where: { authorId: authorId ? authorId : null },
            });
        },
        me: (parent, args, { prisma, user: { id } }: Context) => {
            return prisma.user.findUnique({
                where: { id },
            });
        },
    },
    Mutation: {
        createFeed: async (parent, { data }, { prisma, user }: Context) => {
            const author = { author: { connect: { id: user.id } } };
            const result = await prisma.feed.create({ data: { ...data, ...author } });
            return result;
        },
        createBundle: async (parent, { data }, { prisma, user }: Context) => {
            const author = { author: { connect: { id: user.id } } };
            const result = await prisma.bundle.create({ data: { ...data, ...author } });
            return result;
        },
        likeBundle: async (parent, { data }, { prisma, user }: Context) => {
            const { bundleId, likeState } = data;
            const connectState = likeState ? 'connect' : 'disconnect'
            return prisma.bundle.update({
                where: { id: bundleId },
                data: { likes: { [connectState]: { id: user.id } }}
            });
        },
        likeFeed: async (parent, { data }, { prisma, user }: Context) => {
            const { feedId, likeState } = data;
            const connectState = likeState ? 'connect' : 'disconnect'
            return prisma.feed.update({
                where: { id: feedId },
                data: { likes: { [connectState]: { id: user.id } }}
            });
        },
        updateBundle: async (parent, { data: {id, ...bundleUpdate} }, { prisma, user }: Context) => {
            const bundle = await prisma.bundle.findUnique({
                where: { id },
                include: { author: true }
            });
            console.log(user);
            await verifyOwnership(bundle, user);

            return prisma.bundle.update({
                where: {
                    id
                },
                data: {
                    ...bundleUpdate
                }
            });
        },
        updateFeed: async (parent, { data: {id, ...feedUpdate } }, { prisma, user }: Context) => {
            const feed = await prisma.feed.findUnique({
                where: { id },
                include: { author: true }
            });
            await verifyOwnership(feed, user);

            return prisma.feed.update({
                where: {
                    id
                },
                data: {
                    ...feedUpdate
                }
            });
        },
        createSavedArticle: async (parent, { data }, { prisma, user }: Context) => {
            const author = { author: { connect: { id: user.id } } };
            return await prisma.savedArticle.create({ data: { ...data, ...author } });
        },
        deleteBundle: async (parent, { data: { id } }, { prisma, user }: Context) => {
            const bundle = await prisma.bundle.findUnique({ 
                where: { id },
                include: { author: true }
            });
            await verifyOwnership(bundle, user);
            await prisma.bundle.delete({ where: { id: bundle.id }});
            return bundle;
        },
        deleteFeed: async (parent, { data: { id }  }, { prisma, user }: Context) => {
            const feed = await prisma.feed.findUnique({ 
                where: { id },
                include: { author: true }
            });
            await verifyOwnership(feed, user);
            await prisma.feed.delete({ where: { id: feed.id }});
            return feed;
        },
        deleteSavedArticle: async (parent, { data: { id }  }, { prisma, user }: Context) => {
            const savedArticle = await prisma.savedArticle.findUnique({ 
                where: { id },
                include: { author: true }
            });
            await verifyOwnership(savedArticle, user);
            await prisma.savedArticle.delete({ where: { id: savedArticle.id }});
            return savedArticle;
        },
    },
};
