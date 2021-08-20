import Layout from "components/Layout"
import Button from "components/Button"
import Head from "next/head"
import { LinkColumn, Table, TableHeaders } from "components/Table"
import { GetServerSidePropsResult } from "next"
import { getAllUsers } from "useCases"
import getConnection from "lib/getConnection"
import KeyValuePair from "types/KeyValuePair"
import User from "types/User"
import { isError } from "types/Result"
import React from "react"
import TextInput from "components/TextInput"
import Form from "components/Form"
import ButtonGroup from "components/ButtonGroup"
import { useCsrfServerSideProps } from "hooks/useCsrfServerSideProps"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import getFilteredUsers from "useCases/getFilteredUsers"

export const getServerSideProps = useCsrfServerSideProps(async (context): Promise<GetServerSidePropsResult<Props>> => {
  const { req, formData, csrfToken } = context as CsrfServerSidePropsContext
  const connection = getConnection()
  let allUsers = null

  if (req.method === "POST") {
    const { filter } = formData as {
      filter: string
    }
    allUsers = await getFilteredUsers(connection, filter)
  } else {
    allUsers = await getAllUsers(connection)
  }

  if (isError(allUsers)) {
    console.error(allUsers)
    return {
      props: {
        allUsers: null,
        csrfToken
      }
    }
  }

  return {
    props: {
      allUsers,
      csrfToken
    }
  }
})

interface Props {
  allUsers: KeyValuePair<string, string>[] | null
  csrfToken: string
}

const tableHeaders: TableHeaders = [
  ["username", "Username"],
  ["forenames", "Forename(s)"],
  ["surname", "Surname"],
  ["phoneNumber", "Phone number"],
  ["emailAddress", "Email address"]
]

const Users = ({ allUsers, csrfToken }: Props) => (
  <>
    <Head>
      <title>{"Users"}</title>
    </Head>
    <Layout>
      <Form method="post" csrfToken={csrfToken}>
        <ButtonGroup>
          <TextInput id="filter" name="filter" type="text" />
          <Button noDoubleClick id="filter">
            {"Filter"}
          </Button>
        </ButtonGroup>
      </Form>

      <a href="/users/newUser">
        <Button id="add">{"Add user"}</Button>
      </a>
      {allUsers && (
        <Table tableHeaders={tableHeaders} tableTitle="Users" tableData={allUsers}>
          <LinkColumn
            data-test="link-to-user-view"
            field="username"
            href={(user) => `users/${(user as User).username}`}
          />
        </Table>
      )}
    </Layout>
  </>
)

export default Users
