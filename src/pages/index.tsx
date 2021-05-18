import Button from "components/Button"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import TextInput from "components/TextInput"

const Index = () => (
  <Layout>
    <GridRow>
      <h1 className="govuk-heading-xl">Sign in to Bichard 7</h1>
      <form>
        <TextInput id="email" name="email" label="Email address" type="email" />
        <TextInput id="password" name="password" label="Password" type="password" />
        <Button>Sign in</Button>
      </form>
    </GridRow>
  </Layout>
)

export default Index
