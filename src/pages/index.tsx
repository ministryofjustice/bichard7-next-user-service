import Button from "components/Button"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { authenticate } from "lib/authentication"
import { GetServerSideProps } from "next"
import parse from "urlencoded-body-parser"

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (req.method === "POST") {
    const { email, password } = await parse(req)
    const user = authenticate({ emailAddress: email, password })

    if (user.loggedIn) {
      return {
        redirect: {
          destination: "https://localhost:9443/bichard-ui/",
          permanent: false
        }
      }
    }
  }

  return {
    props: {}
  }
}

const Index = () => (
  <>
    <Head>
      <title>{"Sign in to Bichard 7"}</title>
    </Head>
    <Layout>
      <GridRow>
        <h1 className="govuk-heading-xl">{"Sign in to Bichard 7"}</h1>
        <form action="/" method="post">
          <TextInput id="email" name="email" label="Email address" type="email" />
          <TextInput id="password" name="password" label="Password" type="password" />
          <Button>{"Sign in"}</Button>
        </form>
      </GridRow>
    </Layout>
  </>
)

export default Index
