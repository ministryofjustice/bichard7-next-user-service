export type DBResult<T> = T
export type TransformResult<T> = T
export type Transform<I, O> = (dbResult: DBResult<I>) => TransformResult<O>
export type QueryError = Error
export type OnError = (e: QueryError) => void

export enum QueryType {
  Any = "Any"
}
