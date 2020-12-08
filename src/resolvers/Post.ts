import { comments, posts, users } from "../db";
const Post = {
  author(
    parent: typeof posts[0],
    args: any,
    ctx: {
      comments: typeof comments;
      posts: typeof posts;
      users: typeof users;
    },
    info: any
  ) {
    return ctx.users.find(usr => usr.id === parent.author);
  },
  comments(
    parent: typeof posts[0],
    args: any,
    ctx: {
      comments: typeof comments;
      posts: typeof posts;
      users: typeof users;
    },
    info: any
  ) {
    return ctx.comments.filter(cmt => cmt.post === parent.id);
  }
};

export default Post;
