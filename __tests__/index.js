import schema from '../src/schema'
import { graphql } from 'graphql'

it('should work for hello world query', async () => {
  const query = `query Q { hello }`

  const result = await graphql(schema, query)
  const { data } = result

  expect(data.hello).toBe('world')
})
