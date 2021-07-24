import Layout from "components/Layout"
import Head from "next/head"
import Table, { TableHeaders, StringMap } from "components/Table"
import { GetServerSideProps } from "next"

import query, { objectAsProps } from "lib/query"
import { getAllUsers } from "lib/query/queries"
import { AllUsers, getAllUsers as tGetAllUsers } from "lib/query/transforms"
import { GetAllUsers } from "lib/query/queries/users"
import { QueryError, QueryType } from "lib/query/types"

export const getServerSideProps: GetServerSideProps = async () => {
  const allUsers = await query<GetAllUsers, AllUsers>(QueryType.Any, [getAllUsers], tGetAllUsers, (e: QueryError) =>
    console.error(e)
  )
  return objectAsProps({ allUsers })
}

interface Props {
  allUsers: StringMap[] | null
}

const tableHeaders: TableHeaders = [
  ["username", "Username"],
  ["forenames", "Forename(s)"],
  ["surname", "Surname"],
  ["phoneNumber", "Phone number"],
  ["emailAddress", "Email address"]
]

const users = ({ allUsers }: Props) => (
  <>
    <Head>
      <title>{"Users"}</title>
    </Head>
    <Layout>{allUsers && <Table tableHeaders={tableHeaders} tableTitle="Users" tableData={allUsers} />}</Layout>
  </>
)

export default users
