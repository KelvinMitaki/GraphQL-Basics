import { GraphQLServer } from "graphql-yoga";

// TYPE DEFS
const typeDefs = `
type Query {
   add(numbers: [Float!]):Float!
   grades:[Int!]!
   greeting(name: String):String!
   me: User!
   post:Post!
}
type User {
    id:ID!
    name: String!
    email: String!
    age: Int
}

type Post{
    id:ID!
    title:String!
    body:String!
    published:Boolean!
}
`;
// RESOLVERS
const resolvers = {
  Query: {
    add(parent: any, args: { numbers: number[] }) {
      if (args.numbers.length === 0) {
        return 0;
      }
      return args.numbers.reduce((acc, cur) => acc + cur);
    },
    grades() {
      return [1, 2, 3, 4];
    },
    greeting(parent: any, args: { name?: string }, ctx: any, info: any) {
      if (args.name) {
        return `Hello ${args.name}`;
      }
      return "Hello";
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
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start((): void => {
  console.log("the server is up");
});
