import { Context } from "../db";

const Subscription = {
  comment: {
    subscribe(parent: any, args: { id: string }, ctx: Context, info: any) {
      const post = ctx.posts.find(pst => pst.id === args.id && pst.published);
      if (!post) {
        throw new Error("No post with that id");
      }
      ctx.pubsub.asyncIterator(`comment ${post.id}`);
    }
  }
};

export default Subscription;
