import { ReactNode } from "react"
import Header from "components/Header"
import Footer from "components/Footer"

interface Props {
  children: ReactNode
}

const Layout = ({ children }: Props) => (
  <>
    <Header serviceName="Ministry of Justice" />

    <div className="govuk-width-container ">
      <main className="govuk-main-wrapper " role="main">
        {children}
      </main>
    </div>

    <Footer />
  </>
)

export default Layout
