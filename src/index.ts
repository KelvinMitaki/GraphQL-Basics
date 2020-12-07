import { GraphQLServer } from "graphql-yoga";

// TYPE DEFS
const typeDefs = `
type Query {
    id: ID!
    name: String!
    age: Int!
    employed: Boolean!
    gpa: Float
}
`;
// RESOLVERS
const resolvers = {
  Query: {
    id(): string {
      return "123";
    },
    name(): string {
      return "Kevin Mitaki";
    },
    age(): number {
      return 20;
    },
    employed(): boolean {
      return false;
    },
    gpa(): number {
      return 4.2;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start((): void => {
  console.log("the server is up");
});
