import { GraphQLServer } from "graphql-yoga";

// TYPE DEFS
const typeDefs = `
type Query {
   me: User!
}
type User {
    id:ID!
    name: String!
    email: String!
    age: Int
}
`;
// RESOLVERS
const resolvers = {
  Query: {
    me() {
      return {
        id: "123098",
        name: "kevin",
        email: "kevin@gmail.com",
        age: 21
      };
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start((): void => {
  console.log("the server is up");
});
