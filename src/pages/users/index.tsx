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
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { ParsedUrlQuery } from "querystring"
import KeyValuePair from "types/KeyValuePair"
import Link from "components/Link"
import config from "lib/config"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, query, formData, csrfToken, currentUser } = context as CsrfServerSidePropsContext &
      AuthenticationServerSidePropsContext
    const connection = getConnection()
    let allUsers = null
    let totalUsers = 0
    let pageNumber = 0
    let previousFilter = ""

    if (req.method === "POST") {
      const { filter } = formData as {
        filter: string
      }
      previousFilter = filter
    } else {
      const { filter, page } = query as {
        filter: string
        page: string
      }
      if (filter) {
        previousFilter = filter
      }

      if (page) {
        pageNumber = parseInt(page, 10)
      }
    }

    if (previousFilter) {
      const { result, totalElements } = await getFilteredUsers(connection, previousFilter, pageNumber)
      allUsers = result
      totalUsers = totalElements
      console.log("filterd users", totalElements)
    } else {
      const { result, totalElements } = await getAllUsers(connection, pageNumber)
      allUsers = result
      totalUsers = totalElements
      console.log("all users", totalElements)
    }

    if (isError(allUsers)) {
      console.error(allUsers)
      return {
        props: {
          allUsers: null,
          csrfToken,
          currentUser,
          previousFilter,
          pageNumber,
          totalUsers
        }
      }
    }

    return {
      props: {
        allUsers: allUsers as KeyValuePair<string, string>[] | null,
        csrfToken,
        currentUser,
        previousFilter,
        pageNumber,
        totalUsers
      }
    }
  }
)

interface Props {
  allUsers: KeyValuePair<string, string>[] | null
  csrfToken: string
  currentUser?: Partial<User>
  previousFilter: string
  pageNumber: number
  totalUsers: number
}

const tableHeaders: TableHeaders = [
  ["username", "Username"],
  ["forenames", "Forename(s)"],
  ["surname", "Surname"],
  ["phoneNumber", "Phone number"],
  ["emailAddress", "Email address"]
]

const Users = ({ allUsers, csrfToken, currentUser, previousFilter, pageNumber, totalUsers }: Props) => {
  const nextPage = new URL("/users", config.baseUrl)
  nextPage.searchParams.append("filter", previousFilter)
  nextPage.searchParams.append("page", (pageNumber + 1).toString())

  const prevPage = new URL("/users", config.baseUrl)
  prevPage.searchParams.append("filter", previousFilter)
  prevPage.searchParams.append("page", (pageNumber - 1).toString())
  return (
    <>
      <Head>
        <title>{"Users"}</title>
      </Head>
      <Layout user={currentUser}>
        <Form method="post" csrfToken={csrfToken}>
          <ButtonGroup>
            <TextInput id="filter" name="filter" type="text" defaultValue={previousFilter} />
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

        <div className="govuk-hint">
          <Link href={prevPage.toString()}>{pageNumber > 0 && "< Prev"}</Link>
          {pageNumber}
          <Link href={nextPage.toString()}>
            {pageNumber + 1 < (totalUsers - 1) / config.maxUsersPerPage && "Next >"}
          </Link>
        </div>
      </Layout>
    </>
  )
}

export default Users
