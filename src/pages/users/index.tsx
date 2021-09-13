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
import isPost from "utils/isPost"

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

    if (isPost(req)) {
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

    let queryResult
    if (previousFilter) {
      queryResult = await getFilteredUsers(connection, previousFilter, pageNumber)
    } else {
      queryResult = await getAllUsers(connection, pageNumber)
    }

    if (isError(queryResult)) {
      console.error(queryResult)
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
    const { result, totalElements } = queryResult
    allUsers = result
    totalUsers = totalElements

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

  const pageNumberStyle = {
    style: {
      padding: "10px"
    },
    spacing: {
      "padding-left": "0px"
    }
  }

  let styles = { ...pageNumberStyle.style }

  if (pageNumber === 0) {
    styles = { ...styles, ...pageNumberStyle.spacing }
  }

  const pageString = `Page ${pageNumber + 1} of ${Math.ceil(totalUsers / config.maxUsersPerPage)}`
  return (
    <>
      <Head>
        <title>{"Users"}</title>
      </Head>
      <Layout user={currentUser}>
        <h1 className="govuk-heading-l">{"Users"}</h1>
        <Form method="post" csrfToken={csrfToken}>
          <ButtonGroup>
            <a id="add" className="govuk-button govuk-!-margin-right-8" href="/users/newUser">
              {"Add user"}
            </a>
            <TextInput className="align-right" id="filter" name="filter" type="text" defaultValue={previousFilter} />
            <Button className="govuk-!-margin-left-4" noDoubleClick id="filter">
              {"Filter"}
            </Button>
          </ButtonGroup>
        </Form>

        {allUsers && (
          <Table tableHeaders={tableHeaders} tableData={allUsers}>
            <LinkColumn
              data-test="link-to-user-view"
              field="username"
              href={(user) => `users/${(user as User).username}`}
            />
          </Table>
        )}

        <div className="govuk-hint">
          <Link href={prevPage.toString()} data-test="Prev">
            {pageNumber > 0 && "< Prev"}
          </Link>
          <span style={styles}>{pageString}</span>
          <Link href={nextPage.toString()} data-test="Next">
            {pageNumber + 1 < (totalUsers - 1) / config.maxUsersPerPage && "Next >"}
          </Link>
        </div>
      </Layout>
    </>
  )
}

export default Users
