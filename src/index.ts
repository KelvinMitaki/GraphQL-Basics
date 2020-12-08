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
    text: "this is the First comment",
    author: "1298",
    post: "jkhkj132"
  },
  {
    id: "jkj13",
    text: "this is the Second comment",
    author: "1298",
    post: "jkj132"
  },
  {
    id: "123",
    text: "this is the third comment",
    author: "128",
    post: "jkhkj132"
  },
  {
    id: "13",
    text: "this is the last comment",
    author: "123098",
    post: "132"
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
    comments:[Comment!]!
}

type Post{
    id:ID!
    title:String!
    body:String!
    published:Boolean!
    author:User!
    comments:[Comment!]!
}

type Comment{
  id:ID!
  text: String!
  author: User!
  post: Post!
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
      return comments.filter(
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
  Post: {
    author(parent: typeof posts[0], args: any, ctx: any, info: any) {
      return users.find(usr => usr.id === parent.author);
    },
    comments(parent: typeof posts[0], args: any, ctx: any, info: any) {
      return comments.filter(cmt => cmt.post === parent.id);
    }
  },
  User: {
    posts(parent: typeof users[0], args: any, ctx: any, info: any) {
      return posts.filter(pst => pst.author === parent.id);
    },
    comments(parent: typeof users[0], args: any, ctx: any, info: any) {
      return comments.filter(cmt => cmt.author === parent.id);
    }
  },
  Comment: {
    author(parent: typeof comments[0], args: any, ctx: any, info: any) {
      return users.find(usr => usr.id === parent.author);
    },
    post(parent: typeof comments[0], args: any, ctx: any, info: any) {
      return posts.find(pst => pst.id === parent.post);
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start((): void => {
  console.log("the server is up");
});
