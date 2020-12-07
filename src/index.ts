import { GraphQLServer } from "graphql-yoga";

// TYPE DEFS
const typeDefs = `
type Query {
    add(num1: Float!, num2: Float!):Float!
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
    add(parent: any, args: { num1: number; num2: number }) {
      return args.num1 + args.num2;
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
