import Layout from "components/Layout"
import Head from "next/head"
import Table, { TableHeaders, StringMap } from "components/Table"
import { GetServerSideProps } from "next"
import UsersProvider from "../lib/Users"
import { isSuccess } from "../lib/UsersResult"

export const getServerSideProps: GetServerSideProps = async () => {
  let ret
  const result = await UsersProvider.list()

  if (isSuccess(result)) {
    ret = result
  } else {
    ret = null
  }
  return {
    props: { usersList: ret }
  }
}

interface Props {
  usersList: StringMap[] | null
}

const tableHeaders: TableHeaders = [
  ["username", "User name"],
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
    <Layout>{usersList ? <Table tableHeaders={tableHeaders} tableTitle="Users" tableData={usersList} /> : null}</Layout>
  </>
)

export default users
