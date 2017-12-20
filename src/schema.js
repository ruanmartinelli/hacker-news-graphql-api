/* global fetch */
import DataLoader from 'dataloader'
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'

function fetchItem (id) {
  const url = `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  return fetch(url).then(res => res.json()) // .then(console.log)
}

function fetchTopStories () {
  const url = `https://hacker-news.firebaseio.com/v0/topstories.json`
  return fetch(url)
    .then(res => res.json())
    .then(ids => ids.slice(0, 3))
    .then(ids => ids.map(fetchItem))
}

const itemLoader = new DataLoader(async keys =>
  Promise.all(keys.map(fetchItem))
)

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
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve: (root, args) => itemLoader.load(args.id)
    },
    topStories: {
      type: new GraphQLList(ItemType),
      resolve: (root, args) => fetchTopStories()
    }
  }
})

export default new GraphQLSchema({ query: RootQuery })
