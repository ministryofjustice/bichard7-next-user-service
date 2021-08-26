import Button from "components/Button"
import Form from "components/Form"
import Layout from "components/Layout"
import SuggestPassword from "components/SuggestPassword"
import TextInput from "components/TextInput"
import getConnection from "lib/getConnection"
import { withAuthentication, withCsrf, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import { isError } from "types/Result"
import User from "types/User"
import { changePassword, signOutUser } from "useCases"
import generateRandomPassword from "useCases/generateRandomPassword"
import createRedirectResponse from "utils/createRedirectResponse"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, res, query, csrfToken, formData, currentUser } = context as CsrfServerSidePropsContext &
      AuthenticationServerSidePropsContext

    if (!currentUser || !currentUser.emailAddress) {
      return createRedirectResponse("/login")
    }

    let errorMessage = ""
    let suggestedPassword = ""
    const { suggestPassword } = query as { suggestPassword: string }

    const { pathname: urlPathname } = new URL(req.url as string, "http://localhost")
    const suggestedPasswordUrl = `${urlPathname}?suggestPassword=true`

    if (req.method === "POST") {
      const { currentPassword, newPassword, confirmPassword } = formData as {
        currentPassword: string
        newPassword: string
        confirmPassword: string
      }

      if (!currentPassword || !newPassword || !confirmPassword) {
        errorMessage = "Error: Passwords cannot be empty"
        return {
          props: { errorMessage, csrfToken, currentUser }
        }
      }

      if (newPassword !== confirmPassword) {
        errorMessage = "Error: Passwords are mismatching"
        return {
          props: { errorMessage, csrfToken, currentUser }
        }
      }

      const connection = getConnection()
      const changePasswordResult = await changePassword(
        connection,
        currentUser.emailAddress,
        currentPassword,
        newPassword
      )

      if (isError(changePasswordResult)) {
        errorMessage = changePasswordResult.message
        return {
          props: { errorMessage, csrfToken, currentUser }
        }
      }

      signOutUser(res)

      return createRedirectResponse("/account/change-password/success")
    }

    if (suggestPassword === "true") {
      suggestedPassword = generateRandomPassword()
    }

    return {
      props: { errorMessage, suggestedPassword, suggestedPasswordUrl, csrfToken, currentUser }
    }
  }
)

interface Props {
  csrfToken: string
  errorMessage: string
  suggestedPassword?: string
  suggestedPasswordUrl?: string
  currentUser?: Partial<User>
}

const ChangePassword = ({ csrfToken, currentUser, errorMessage, suggestedPassword, suggestedPasswordUrl }: Props) => {
  return (
    <>
      <Head>
        <title>{"Change password"}</title>
      </Head>
      <Layout user={currentUser}>
        <div className="govuk-grid-row">
          <h3 data-test="check-email" className="govuk-heading-xl">
            {"Change your password"}
          </h3>
          <Form method="post" csrfToken={csrfToken}>
            <span id="event-name-error" className="govuk-error-message">
              {errorMessage}
            </span>

            <TextInput
              id="currentPassword"
              name="currentPassword"
              label="Current Password"
              type="password"
              width="20"
            />
            <TextInput id="newPassword" name="newPassword" label="New Password" type="password" width="20" />
            <TextInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              width="20"
            />

            <Button noDoubleClick>{"Update password"}</Button>
            <SuggestPassword suggestedPassword={suggestedPassword} suggestedPasswordUrl={suggestedPasswordUrl} />
          </Form>
        </div>
      </Layout>
    </>
  )
}

export default ChangePassword
