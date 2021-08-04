import Layout from "components/Layout"
import Head from "next/head"
import Table, { TableHeaders, StringMap } from "components/Table"
import { GetServerSideProps } from "next"
import Users from "../lib/Users"
import { isSuccess } from "../lib/UsersResult"

export const getServerSideProps: GetServerSideProps = async () => {
  let usersList = null
  const result = await Users.list()

  if (isSuccess(result)) {
    usersList = result
  }

  return {
    props: { usersList }
  }
}

interface Props {
  usersList: StringMap[] | null
}

const tableHeaders: TableHeaders = [
  ["username", "Username"],
  ["forenames", "Forename(s)"],
  ["surname", "Surname"],
  ["phoneNumber", "Phone number"],
  ["emailAddress", "Email address"]
]

const users = ({ usersList }: Props) => (
  <>
    <Head>
      <title>{"Users"}</title>
    </Head>
    <Layout>{usersList && <Table tableHeaders={tableHeaders} tableTitle="Users" tableData={usersList} />}</Layout>
  </>
)

export default users
