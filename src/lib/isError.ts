const isError = (result: any): result is Error => result instanceof Error

export default isError
