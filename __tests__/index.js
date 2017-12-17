import schema from '../src/schema'
import { graphql } from 'graphql'

it('should fetch an item given an id', async () => {
  const query = `
    query Q ($id: Int!) {
      item(id: $id) {
        id,
        score,
        title
      }
    }`

  const root = {}
  const context = {}
  const variables = { id: 8863 }

  const result = await graphql(schema, query, root, context, variables)
  const { data } = result

  expect(data.item).toBeDefined()
  expect(data.item).toHaveProperty('id')
  expect(data.item).toHaveProperty('score')
  expect(data.item).toHaveProperty('title')
})
