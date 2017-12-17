import { get } from 'axios'
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList
} from 'graphql'

const ItemType = new GraphQLObjectType({
  name: 'Item',
  description: 'An item from the HN API',
  fields: () => ({
    by: { type: GraphQLString },
    descendants: { type: GraphQLInt },
    id: { type: GraphQLInt },
    kids: { type: new GraphQLList(GraphQLInt) },
    score: { type: GraphQLInt },
    text: { type: GraphQLString },
    time: { type: GraphQLInt },
    title: { type: GraphQLString },
    type: { type: GraphQLString },
    url: { type: GraphQLString }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    item: {
      type: ItemType,
      args: { id: { type: GraphQLInt } },
      resolve: async (root, args) => {
        const url = `https://hacker-news.firebaseio.com/v0/item/${args.id}.json`
        const { data } = await get(url)
        return data
      }
    }
  }
})

export default new GraphQLSchema({ query: RootQuery })
