import { ReactNode } from "react"
import Header from "components/Header"
import Footer from "components/Footer"
import User from "types/User"
import config from "lib/config"
import NonProdBanner from "./NonProdBanner"

interface Props {
  children: ReactNode
  user?: Partial<User>
}

const Layout = ({ children, user }: Props) => (
  <>
    {!config.hideNonProdBanner && <NonProdBanner />}
    <Header serviceName="Ministry of Justice" user={user} />

    <div className="govuk-width-container">
      <main className="govuk-main-wrapper" role="main">
        {children}
      </main>
    </div>

    <Footer />
  </>
)

export default Layout
