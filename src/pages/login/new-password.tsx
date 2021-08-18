import Button from "components/Button"
import Layout from "components/Layout"
import TextInput from "components/TextInput"
import getConnection from "lib/getConnection"
import parseFormData from "lib/parseFormData"
import { decodeEmailVerificationToken, EmailVerificationToken } from "lib/token/emailVerificationToken"
import { GetServerSideProps } from "next"
import Head from "next/head"
import React from "react"
import { isError } from "types/Result"
import initialiseUserPassword from "useCases/initialiseUserPassword"
import createRedirectResponse from "utils/createRedirectResponse"

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  let errorMessage = ""

  if (req.method === "POST") {
    const { newPassword, confirmPassword } = (await parseFormData(req)) as {
      newPassword: string
      confirmPassword: string
    }
    if (newPassword === "" || confirmPassword === "") {
      errorMessage = "Error: Passwords cannot be empty"
      return {
        props: { errorMessage }
      }
    }

    if (newPassword !== confirmPassword) {
      errorMessage = "Error: Passwords are mismatching"
      return {
        props: { errorMessage }
      }
    }
    const { token } = query as { token: EmailVerificationToken }
    const translatedToken = decodeEmailVerificationToken(token)
    if (isError(translatedToken)) {
      return {
        props: { errorMessage: "Error: Invalid token link" }
      }
    }
    const { emailAddress, verificationCode } = translatedToken

    const connection = getConnection()
    const result = await initialiseUserPassword(connection, emailAddress, verificationCode, newPassword)
    if (!isError(result)) {
      return createRedirectResponse("/login/reset-password/success")
    }
    errorMessage = result.message
  }

  return {
    props: { errorMessage }
  }
}

interface Props {
  errorMessage: string
}

const NewPassword = ({ errorMessage }: Props) => {
  return (
    <>
      <Head>
        <title>{"First time password setup"}</title>
      </Head>
      <Layout>
        <form method="post">
          <span id="event-name-error" className="govuk-error-message">
            {errorMessage}
          </span>

          <TextInput id="newPassword" name="newPassword" label="New Password" type="password" width="20" />
          <TextInput id="confirmPassword" name="confirmPassword" label="Confirm Password" type="password" width="20" />

          <Button noDoubleClick>{"Set password"}</Button>
        </form>
      </Layout>
    </>
  )
}

export default NewPassword
