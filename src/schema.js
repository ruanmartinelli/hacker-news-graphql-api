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
    by: { type: GraphQLString, resolve: item => item.by },
    descendants: { type: GraphQLInt, resolve: item => item.descendants },
    id: { type: GraphQLInt, resolve: item => item.id },
    kids: { type: new GraphQLList(GraphQLInt), resolve: item => item.kids },
    score: { type: GraphQLInt, resolve: item => item.score },
    text: { type: GraphQLString, resolve: item => item.text },
    time: { type: GraphQLInt, resolve: item => item.time },
    title: { type: GraphQLString, resolve: item => item.title },
    type: { type: GraphQLString, resolve: item => item.type },
    url: { type: GraphQLString, resolve: item => item.url }
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
    },
    topStories: {
      type: new GraphQLList(ItemType),
      resolve: async () => {
        const url = `https://hacker-news.firebaseio.com/v0/topstories.json`
        const { data: ids } = await get(url)
        const topThree = [ids[0], ids[1], ids[2]]
        const itemPromises = topThree.map(id => {
          // prettier-ignore
          return get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            .then(res => res.data)
        })

        return Promise.all(itemPromises)
      }
    }
  }
})

export default new GraphQLSchema({ query: RootQuery })
