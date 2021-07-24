import { QueryBuilder } from "squel"
import { Transform, QueryType, OnError } from "./types"
import Connection from "./Connection"

const query = async <I, O>(
  type: QueryType,
  queries: QueryBuilder[],
  transform: Transform<I, O>,
  onError: OnError
): Promise<O | void> => {
  let result

  switch (type) {
    case QueryType.Any:
      result = await Connection.any<I>(queries[0].toString())
      return transform(result)
    default:
      return onError(new Error(`Query function does not support ${type}`))
  }
}

export default query
