import Button from "components/Button"
import Layout from "components/Layout"
import TextInput from "components/TextInput"
import getConnection from "lib/getConnection"
import parseFormData from "lib/parseFormData"
import { decodeEmailToken, EmailToken } from "lib/token/emailToken"
import { GetServerSideProps } from "next"
import Head from "next/head"
import React from "react"
import initialiseUserPassword from "useCases/initialiseUserPassword"

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  let errorMessage = ""
  try {
    const { token } = query as { token: EmailToken }
    const { emailAddress, verificationCode } = decodeEmailToken(token)

    console.log(emailAddress, verificationCode)

    if (req.method === "POST") {
      const { nPassword, cPassword } = (await parseFormData(req)) as {
        nPassword: string
        cPassword: string
      }
      if (nPassword === "" || cPassword === "") {
        errorMessage = "Error: Passords cannot be empty"
        return {
          props: { errorMessage }
        }
      }

      if (nPassword !== cPassword) {
        errorMessage = "Error: Passords are mismatching"
        return {
          props: { errorMessage }
        }
      }

      const connection = getConnection()
      const result = await initialiseUserPassword(connection, emailAddress, verificationCode, nPassword)
      console.log(result)
    }
  } catch (error) {
    console.log(error)
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

          <TextInput id="nPassword" name="nPassword" label="New Password" type="password" width="20" />
          <TextInput id="cPassword" name="cPassword" label="Confirm Password" type="password" width="20" />

          <Button noDoubleClick>{"Set password"}</Button>
        </form>
      </Layout>
    </>
  )
}

export default NewPassword
