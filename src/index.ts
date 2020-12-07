import { GraphQLServer } from "graphql-yoga";

// TYPE DEFS
const typeDefs = `
type Query {
    hello: String!
    name: String!
}
`;
// RESOLVERS
const resolvers = {
  Query: {
    hello(): string {
      return "This is my first query";
    },
    name(): string {
      return "Kevin Mitaki";
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start((): void => {
  console.log("the server is up");
});
