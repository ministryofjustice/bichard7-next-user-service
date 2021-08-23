import Layout from "components/Layout"
import Button from "components/Button"
import Head from "next/head"
import { LinkColumn, Table, TableHeaders } from "components/Table"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { getAllUsers } from "useCases"
import getConnection from "lib/getConnection"
import User from "types/User"
import { isError } from "types/Result"
import React from "react"
import TextInput from "components/TextInput"
import Form from "components/Form"
import ButtonGroup from "components/ButtonGroup"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import getFilteredUsers from "useCases/getFilteredUsers"
import { withMultipleServerSideProps, withAuthentication, withCsrf } from "middleware"
import AuthenticationServerSideProps from "types/AuthenticationServerSideProps"
import { ParsedUrlQuery } from "querystring"
import KeyValuePair from "types/KeyValuePair"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, formData, csrfToken, currentUser } = context as CsrfServerSidePropsContext &
      AuthenticationServerSideProps
    const connection = getConnection()
    let allUsers = null
    const { filter } = formData as {
      filter: string
    }

    if (req.method === "POST" && filter) {
      allUsers = await getFilteredUsers(connection, filter)
    } else {
      allUsers = await getAllUsers(connection)
    }

    if (isError(allUsers)) {
      console.error(allUsers)
      return {
        props: {
          allUsers: null,
          csrfToken,
          currentUser
        }
      }
    }

    return {
      props: {
        allUsers: allUsers as KeyValuePair<string, string>[] | null,
        csrfToken,
        currentUser
      }
    }
  }
)

interface Props {
  allUsers: KeyValuePair<string, string>[] | null
  csrfToken: string
  currentUser?: Partial<User>
}

const tableHeaders: TableHeaders = [
  ["username", "Username"],
  ["forenames", "Forename(s)"],
  ["surname", "Surname"],
  ["phoneNumber", "Phone number"],
  ["emailAddress", "Email address"]
]

const Users = ({ allUsers, csrfToken, currentUser }: Props) => (
  <>
    <Head>
      <title>{"Users"}</title>
    </Head>
    <Layout user={currentUser}>
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
