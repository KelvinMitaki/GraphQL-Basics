import { GraphQLServer } from "graphql-yoga";
import { v1 } from "uuid";
import { comments, posts, users } from "./db";

// RESOLVERS
const resolvers = {
  Query: {
    users(
      parent: any,
      args: { query?: string },
      ctx: {
        comments: typeof comments;
        posts: typeof posts;
        users: typeof users;
      },
      info: any
    ) {
      if (!args.query) {
        return users;
      }
      return ctx.users.filter(usr =>
        usr.name.toLowerCase().includes(args.query!.toLowerCase())
      );
    },
    posts(
      parent: any,
      args: { query?: string },
      ctx: {
        comments: typeof comments;
        posts: typeof posts;
        users: typeof users;
      },
      info: any
    ) {
      if (!args.query) {
        return posts;
      }
      return ctx.posts.filter(
        pst =>
          pst.title.toLowerCase().includes(args.query!.toLowerCase()) ||
          pst.body.toLowerCase().includes(args.query!.toLowerCase())
      );
    },
    comments(
      parent: any,
      args: { query?: string },
      ctx: {
        comments: typeof comments;
        posts: typeof posts;
        users: typeof users;
      },
      info: any
    ) {
      if (!args.query) {
        return comments;
      }
      return ctx.comments.filter(
        cmt =>
          cmt.text.toLowerCase().includes(args.query!.toLowerCase()) ||
          cmt.author.toLowerCase().includes(args.query!.toLowerCase())
      );
    },
    me() {
      return {
        id: "123098",
        name: "kevin",
        email: "kevin@gmail.com",
        age: 21
      };
    },
    post() {
      return {
        id: "jkhkj132",
        title: "First blog",
        body: "This is the first blog",
        published: true
      };
    }
  },
  Mutation: {
    createUser(
      parent: any,
      args: { data: { name: string; email: string; age: number } },
      ctx: {
        comments: typeof comments;
        posts: typeof posts;
        users: typeof users;
      },
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
      ctx: {
        comments: typeof comments;
        posts: typeof posts;
        users: typeof users;
      },
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
      ctx: {
        comments: typeof comments;
        posts: typeof posts;
        users: typeof users;
      },
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
    deleteUser(
      parent: any,
      args: { id: string },
      ctx: {
        comments: typeof comments;
        posts: typeof posts;
        users: typeof users;
      },
      info: any
    ) {
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
    deletePost(
      parent: any,
      args: { id: string },
      ctx: {
        comments: typeof comments;
        posts: typeof posts;
        users: typeof users;
      },
      info: any
    ) {
      const postIndx = ctx.posts.findIndex(pst => pst.id === args.id);
      if (postIndx === -1) {
        throw new Error("No post with that ID");
      }
      const deletedPost = ctx.posts.splice(postIndx, 1);
      ctx.comments = ctx.comments.filter(cmt => cmt.post !== args.id);
      return deletedPost[0];
    },
    deleteComment(
      parent: any,
      args: { id: string },
      ctx: {
        comments: typeof comments;
        posts: typeof posts;
        users: typeof users;
      },
      info: any
    ) {
      const commentIndx = ctx.comments.findIndex(cmt => cmt.id === args.id);
      if (commentIndx === -1) {
        throw new Error("No comment with that id");
      }
      const deletedComment = ctx.comments.splice(commentIndx, 1);
      return deletedComment[0];
    }
  },
  Post: {
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
  },
  User: {
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
  },
  Comment: {
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
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: {
    comments,
    posts,
    users
  }
});

server.start((): void => {
  console.log("the server is up");
});
