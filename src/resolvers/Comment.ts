import { comments, posts, users } from "../db";

const Comment = {
  author(
    parent: typeof comments[0],
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
  post(
    parent: typeof comments[0],
    args: any,
    ctx: {
      comments: typeof comments;
      posts: typeof posts;
      users: typeof users;
    },
    info: any
  ) {
    return ctx.posts.find(pst => pst.id === parent.post);
  }
};

export default Comment;
