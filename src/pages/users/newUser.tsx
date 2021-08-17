import Button from "components/Button"
import Layout from "components/Layout"
import Head from "next/head"
import SuccessBanner from "components/SuccessBanner"
import { GetServerSideProps } from "next"
import UserCreateDetails from "types/UserDetails"
import getConnection from "lib/getConnection"
import parseFormData from "lib/parseFormData"
import createUser from "useCases/createUser"
import userFormIsValid from "lib/userFormIsValid"
import UserForm from "components/users/UserForm"

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let errorMessage = ""
  let successMessage = ""

  if (req.method === "POST") {
    const userCreateDetails: UserCreateDetails = (await parseFormData(req)) as {
      username: string
      forenames: string
      surname: string
      phoneNumber: string
      emailAddress: string
      postCode: string
      postalAddress: string
      endorsedBy: string
      organisation: string
    }

    const formIsValid = userFormIsValid(userCreateDetails)

    if (formIsValid) {
      const connection = getConnection()
      const result = await createUser(connection, userCreateDetails)
      errorMessage = result.error.message
      if (errorMessage === "") {
        successMessage = `User ${userCreateDetails.username} has been successfully created`
      }
    } else {
      errorMessage = "Please make sure that all mandatory fields are non empty"
    }
  }
  return {
    props: { errorMessage, successMessage, missingMandatory: true }
  }
}

interface Props {
  errorMessage: string
  successMessage: string
  missingMandatory: boolean
}

const newUser = ({ errorMessage, successMessage, missingMandatory }: Props) => (
  <>
    <Head>
      <title>{"New User"}</title>
    </Head>
    <Layout>
      <span id="event-name-error" className="govuk-error-message">
        {errorMessage}
      </span>
      {successMessage && <SuccessBanner message={successMessage} />}
      <form method="post">
        <UserForm
          missingUsername={missingMandatory}
          missingForenames={missingMandatory}
          missingPhoneNumber={missingMandatory}
          missingEmail={missingMandatory}
        />

        <Button noDoubleClick>{"Add user"}</Button>
      </form>

      <a href="/users" className="govuk-back-link">
        {" "}
        {"Back"}{" "}
      </a>
    </Layout>
  </>
)

export default newUser
