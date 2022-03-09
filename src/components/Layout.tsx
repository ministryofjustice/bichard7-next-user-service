import Footer from "components/Footer"
import Header from "components/Header"
import { ReactNode } from "react"
import User from "types/User"

interface Props {
  children: ReactNode
  user?: Partial<User>
}

/* eslint-disable jsx-a11y/alt-text, @next/next/no-img-element */
const FakeAssetForNoJsStatsGathering = () => (
  <noscript>
    <img src="/assets/nojs.png" className="govuk-!-display-none" />
  </noscript>
)
/* eslint-enable jsx-a11y/alt-text, @next/next/no-img-element */

const Layout = ({ children, user }: Props) => (
  <>
    <FakeAssetForNoJsStatsGathering />
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
