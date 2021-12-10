import Layout from "components/Layout"
import Head from "next/head"
import User from "types/User"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import Button from "components/Button"
import ButtonGroup from "components/ButtonGroup"
import Link from "components/Link"
import ErrorSummary from "components/ErrorSummary/ErrorSummary"
import { Fieldset, FieldsetHint, FieldsetLegend } from "components/Fieldset"
import Warning from "components/Warning"
import TextInput from "components/TextInput"
import { isError } from "types/Result"
import createRedirectResponse from "utils/createRedirectResponse"
import getConnection from "lib/getConnection"
import { deleteUser, getUserByUsername } from "useCases"
import Form from "components/Form"
import { withAuthentication, withCsrf, withMultipleServerSideProps } from "middleware"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isPost } from "utils/http"
import getAuditLogger from "lib/getAuditLogger"
import logger from "utils/logger"
import config from "lib/config"
import { ErrorSummaryList } from "components/ErrorSummary"
import usersHaveSameForce from "lib/usersHaveSameForce"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { query, req, formData, csrfToken, currentUser } = context as CsrfServerSidePropsContext &
      AuthenticationServerSidePropsContext
    const { username } = query

    if (!currentUser) {
      logger.error("Unable to determine current user")
      return createRedirectResponse("/500")
    }

    const connection = getConnection()
    const user = await getUserByUsername(connection, username as string)

    if (isError(user)) {
      logger.error(user)
      return createRedirectResponse("/500")
    }

    if (!user || !usersHaveSameForce(currentUser, user)) {
      return {
        notFound: true
      }
    }

    if (isPost(req)) {
      const { deleteAccountConfirmation } = formData as { deleteAccountConfirmation: string }

      if (user.username !== deleteAccountConfirmation) {
        return {
          props: {
            user,
            showInputNotMatchingError: true,
            csrfToken,
            currentUser
          }
        }
      }

      const auditLogger = getAuditLogger(context, config)
      const deleteUserResult = await deleteUser(connection, auditLogger, user)

      if (deleteUserResult.isDeleted) {
        return createRedirectResponse(`/users?action=user-deleted`)
      }

      if (deleteUserResult.serverSideError) {
        logger.error(deleteUserResult.serverSideError)
        return createRedirectResponse("/500")
      }
    }

    return {
      props: { user, csrfToken, currentUser }
    }
  }
)

interface Props {
  user: Partial<User>
  showInputNotMatchingError?: boolean
  csrfToken: string
  currentUser?: Partial<User>
}

const Delete = ({ user, showInputNotMatchingError, csrfToken, currentUser }: Props) => {
  const fullName = `${user.forenames} ${user.surname}`

  return (
    <>
      <Head>
        <title>{"Users"}</title>
      </Head>
      <Layout user={currentUser}>
        <Form method="post" csrfToken={csrfToken}>
          <Fieldset>
            <FieldsetLegend>{`Are you sure you want to delete ${fullName}?`}</FieldsetLegend>
            <FieldsetHint>
              <Warning>{"This action is irreversible."}</Warning>
            </FieldsetHint>
            <ErrorSummary title="Username mismatch" show={!!showInputNotMatchingError}>
              <ErrorSummaryList
                items={[
                  {
                    id: "delete-account-confirmation",
                    error: "Enter the account username"
                  }
                ]}
              />
            </ErrorSummary>

            <TextInput
              id="delete-account-confirmation"
              name="deleteAccountConfirmation"
              label={`If you are sure about deleting this account, type '${user.username}' in the box below.`}
              type="text"
              width="20"
              error={showInputNotMatchingError && "Username does not match"}
            />
          </Fieldset>
          <ButtonGroup>
            <Button variant="warning" noDoubleClick>
              {"Delete account"}
            </Button>
            <Link data-test="cancel" href={`/users/${user.username}`}>
              {"Cancel"}
            </Link>
          </ButtonGroup>
        </Form>
      </Layout>
    </>
  )
}

export default Delete
