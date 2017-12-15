import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema
  // GraphQLInt,
  // GraphQLList,
  // GraphQLNonNull
} from 'graphql'

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    hello: {
      type: GraphQLString,
      resolve () {
        return 'world'
      }
    }
  }
})

export default new GraphQLSchema({ query: RootQuery })
