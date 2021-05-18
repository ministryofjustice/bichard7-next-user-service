import { ReactNode } from "react"
import Header from "./Header"
import Footer from "./Footer"

interface Props {
  children: ReactNode
}

const Layout = ({ children }: Props) => (
  <>
    <Header serviceName="Ministry of Justice: Bichard 7" />

    <div className="govuk-width-container ">
      <main className="govuk-main-wrapper " role="main">
        {children}
      </main>
    </div>

    <Footer />
  </>
)

export default Layout
