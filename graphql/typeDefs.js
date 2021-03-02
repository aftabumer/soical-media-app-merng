const { gql } = require("apollo-server");

module.exports = gql`
  type Post {
    id: ID!
    body: String
    userName: String
    createdAt: String
  }
  type Query {
    getPosts: [Post]
  }
`;
