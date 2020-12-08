import { GraphQLServer } from "graphql-yoga";

const users = [
  {
    id: "123098",
    name: "kevin",
    email: "kevin@gmail.com",
    age: 21
  },
  {
    id: "1298",
    name: "wezo",
    email: "wezo@gmail.com",
    age: 26
  },
  {
    id: "128",
    name: "brian",
    email: "brian@gmail.com",
    age: 22
  }
];
const posts = [
  {
    id: "jkhkj132",
    title: "First blog",
    body: "This is the first blog",
    published: true,
    author: "123098"
  },
  {
    id: "jkj132",
    title: "Second blog",
    body: "This is the second blog",
    published: false,
    author: "1298"
  },
  {
    id: "132",
    title: "last blog",
    body: "This is the last blog",
    published: true,
    author: "123098"
  }
];
const comments = [
  {
    id: "jkhkj13",
    text: "this is the First comment"
  },
  {
    id: "jkj13",
    text: "this is the Second comment"
  },
  {
    id: "123",
    text: "this is the third comment"
  },
  {
    id: "13",
    text: "this is the last comment"
  }
];

// TYPE DEFS
const typeDefs = `
type Query {
   users(query:String):[User!]!
   posts(query:String):[Post!]!
   comments(query:String):[Comment!]!
   me: User!
   post:Post!
}
type User {
    id:ID!
    name: String!
    email: String!
    age: Int
    posts:[Post!]!
}

type Post{
    id:ID!
    title:String!
    body:String!
    published:Boolean!
    author:User!
}

type Comment{
  id:ID!
  text: String!
}
`;
// RESOLVERS
const resolvers = {
  Query: {
    users(parent: any, args: { query?: string }, ctx: any, info: any) {
      if (!args.query) {
        return users;
      }
      return users.filter(usr =>
        usr.name.toLowerCase().includes(args.query!.toLowerCase())
      );
    },
    posts(parent: any, args: { query?: string }, ctx: any, info: any) {
      if (!args.query) {
        return posts;
      }
      return posts.filter(
        pst =>
          pst.title.toLowerCase().includes(args.query!.toLowerCase()) ||
          pst.body.toLowerCase().includes(args.query!.toLowerCase())
      );
    },
    comments(parent: any, args: { query?: string }, ctx: any, info: any) {
      if (!args.query) {
        return comments;
      }
      return comments.filter(cmt =>
        cmt.text.toLowerCase().includes(args.query!.toLowerCase())
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
  Post: {
    author(parent: typeof posts[0], args: any, ctx: any, info: any) {
      return users.find(usr => usr.id === parent.author);
    }
  },
  User: {
    posts(parent: typeof users[0], args: any, ctx: any, info: any) {
      return posts.filter(pst => pst.author === parent.id);
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start((): void => {
  console.log("the server is up");
});
