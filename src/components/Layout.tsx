import Footer from "components/Footer"
import Header from "components/Header"
import { ReactNode } from "react"
import User from "types/User"
import { addBasePath } from "next/dist/client/add-base-path"

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

const ScreenSizeStats = () => <script src={addBasePath("/js/grabScreenSize.js")} async />

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
    <ScreenSizeStats />
  </>
)

export default Layout
