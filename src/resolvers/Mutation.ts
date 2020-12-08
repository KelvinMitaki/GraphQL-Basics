import { comments, posts, users } from "../db";
import { v1 } from "uuid";
import { Context } from "../db";

const Mutation = {
  createUser(
    parent: any,
    args: { data: { name: string; email: string; age: number } },
    ctx: Context,
    info: any
  ) {
    const emailExists = ctx.users.some(
      usr => usr.email.toLowerCase() === args.data.email.toLowerCase()
    );
    if (emailExists) {
      throw new Error("Email exists");
    }
    const user: typeof users[0] = {
      id: v1(),
      name: args.data.name,
      email: args.data.email,
      age: args.data.age
    };
    ctx.users.push(user);
    return user;
  },
  updateUser(parent: any, args: {}) {},
  createPost(
    parent: any,
    args: {
      data: {
        title: string;
        body: string;
        published: boolean;
        author: string;
      };
    },
    ctx: Context,
    info: any
  ) {
    const authorExists = ctx.users.some(
      usr => usr.id.toLowerCase() === args.data.author.toLowerCase()
    );
    if (!authorExists) {
      throw new Error("No author with that ID");
    }
    const post: typeof posts[0] = { id: v1(), ...args.data };
    ctx.posts.push(post);
    return post;
  },
  createComment(
    parent: any,
    args: { data: { text: string; author: string; post: string } },
    ctx: Context,
    info: any
  ) {
    const postExists = ctx.posts.some(
      pst => pst.id === args.data.post && pst.published
    );
    const authorExists = ctx.users.some(usr => usr.id === args.data.author);
    if (!postExists || !authorExists) {
      throw new Error("post or author doesnot exist");
    }
    const comment: typeof comments[0] = {
      id: v1(),
      ...args.data
    };
    ctx.comments.push(comment);
    return comment;
  },
  deleteUser(parent: any, args: { id: string }, ctx: Context, info: any) {
    const userIndx = ctx.users.findIndex(usr => usr.id === args.id);
    if (userIndx === -1) {
      throw new Error("No user with that id");
    }
    const deletedUser = ctx.users.splice(userIndx, 1);
    ctx.posts = ctx.posts.filter(pst => {
      if (pst.author === args.id) {
        ctx.comments = ctx.comments.filter(cmt => cmt.author !== args.id);
      }
      return pst.author !== args.id;
    });
    ctx.comments = ctx.comments.filter(cmt => cmt.author !== args.id);
    return deletedUser[0];
  },
  deletePost(parent: any, args: { id: string }, ctx: Context, info: any) {
    const postIndx = ctx.posts.findIndex(pst => pst.id === args.id);
    if (postIndx === -1) {
      throw new Error("No post with that ID");
    }
    const deletedPost = ctx.posts.splice(postIndx, 1);
    ctx.comments = ctx.comments.filter(cmt => cmt.post !== args.id);
    return deletedPost[0];
  },
  deleteComment(parent: any, args: { id: string }, ctx: Context, info: any) {
    const commentIndx = ctx.comments.findIndex(cmt => cmt.id === args.id);
    if (commentIndx === -1) {
      throw new Error("No comment with that id");
    }
    const deletedComment = ctx.comments.splice(commentIndx, 1);
    return deletedComment[0];
  }
};

export default Mutation;
