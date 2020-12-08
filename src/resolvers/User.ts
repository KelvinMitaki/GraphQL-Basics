import { comments, posts, users } from "../db";

const User = {
  posts(
    parent: typeof users[0],
    args: any,
    ctx: {
      comments: typeof comments;
      posts: typeof posts;
      users: typeof users;
    },
    info: any
  ) {
    return ctx.posts.filter(pst => pst.author === parent.id);
  },
  comments(
    parent: typeof users[0],
    args: any,
    ctx: {
      comments: typeof comments;
      posts: typeof posts;
      users: typeof users;
    },
    info: any
  ) {
    return ctx.comments.filter(cmt => cmt.author === parent.id);
  }
};

export default User;
