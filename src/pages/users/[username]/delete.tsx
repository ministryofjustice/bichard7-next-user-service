/* eslint-disable filenames/match-exported */
import Layout from "components/Layout"
import Head from "next/head"
import { User } from "lib/User"
import { GetServerSideProps, GetServerSidePropsResult } from "next"
import Button from "components/Button"
import ButtonGroup from "components/ButtonGroup"
import Link from "components/Link"
import ErrorSummary from "components/ErrorSummary"
import { Fieldset, FieldsetHint, FieldsetLegend } from "components/Fieldset"
import Warning from "components/Warning"
import TextInput from "components/TextInput"
import { isError } from "types/Result"
import createRedirectResponse from "utils/createRedirectResponse"
import getConnection from "lib/getConnection"
import { deleteUser, getUserByUsername } from "useCases"

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req
}): Promise<GetServerSidePropsResult<Props>> => {
  const { username } = query
  const connection = getConnection()
  const user = await getUserByUsername(connection, username as string)

  if (!user) {
    return {
      notFound: true
    }
  }

  if (isError(user)) {
    return createRedirectResponse("/error")
  }

  if (req.method === "POST") {
    const deleteUserResult = await deleteUser(connection, req, user)

    if (deleteUserResult.isDeleted) {
      return createRedirectResponse(`/users/${user.username}/deleted`)
    }

    if (deleteUserResult.validationFailed) {
      return {
        props: {
          user,
          showInputNotMatchingError: true
        }
      }
    }

    if (deleteUserResult.serverSideError) {
      return createRedirectResponse("/error")
    }
  }

  return {
    props: { user }
  }
}

interface Props {
  user: User
  showInputNotMatchingError?: boolean
}

const Delete = ({ user, showInputNotMatchingError }: Props) => {
  const fullName = `${user.forenames} ${user.surname}`

  return (
    <>
      <Head>
        <title>{"Users"}</title>
      </Head>
      <Layout>
        {showInputNotMatchingError && (
          <ErrorSummary title="Username mismatch">
            {"The provided username in the confirmation box does not match."}
          </ErrorSummary>
        )}

        <form action="#" method="post">
          <Fieldset>
            <FieldsetLegend>{`Are you sure you want to delete ${fullName}?`}</FieldsetLegend>
            <FieldsetHint>
              <Warning>{"This action is irreversible and will permanently delete the user."}</Warning>
            </FieldsetHint>
            <TextInput
              id="delete-account-confirmation"
              name="deleteAccountConfirmation"
              label={`If you are sure about deleting this account, type '${user.username}' in the box below.`}
              type="text"
              width="20"
            />
          </Fieldset>
          <ButtonGroup>
            <Button variant="warning">{"Delete account"}</Button>
            <Link href={`/users/${user.username}`}>{"Cancel"}</Link>
          </ButtonGroup>
        </form>
      </Layout>
    </>
  )
}

export default Delete
