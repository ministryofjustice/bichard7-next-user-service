import { PG_PROMISE_DEBUG_MODE, PG_PROMISE_TEST_CONNECTION_NAME } from "./testConfig"
import getConnection from "../src/lib/getConnection"

const getTestConnection = () => getConnection(PG_PROMISE_TEST_CONNECTION_NAME, PG_PROMISE_DEBUG_MODE)

export default getTestConnection
