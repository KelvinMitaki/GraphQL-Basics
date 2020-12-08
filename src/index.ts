import { GraphQLServer } from "graphql-yoga";
import { comments, posts, users } from "./db";
import Comment from "./resolvers/Comment";
import Mutation from "./resolvers/Mutation";
import Post from "./resolvers/Post";
import Query from "./resolvers/Query";
import User from "./resolvers/User";

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    User,
    Post,
    Comment
  },
  context: {
    comments,
    posts,
    users
  }
});

server.start((): void => {
  console.log("the server is up");
});
