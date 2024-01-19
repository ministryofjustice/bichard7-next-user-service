import Footer from "components/Footer"
import Header from "components/Header"
import { addBasePath } from "next/dist/client/add-base-path"
import { ReactNode } from "react"
import User from "types/User"
import NavBar from "./NavBar"

interface Props {
  children: ReactNode
  user?: Partial<User>
  hasAccessToReports?: boolean
  hasAccessToUserManagement?: boolean
  hasAccessToNewBichard?: boolean
}

/* eslint-disable jsx-a11y/alt-text, @next/next/no-img-element */
const FakeAssetForNoJsStatsGathering = () => (
  <noscript>
    <img src="/assets/nojs.png" className="govuk-!-display-none" />
  </noscript>
)

const ScreenSizeStats = () => <script src={addBasePath("/js/grabScreenSize.js")} async />

/* eslint-enable jsx-a11y/alt-text, @next/next/no-img-element */
const Layout = ({ children, user, hasAccessToReports, hasAccessToUserManagement, hasAccessToNewBichard }: Props) => (
  <>
    <FakeAssetForNoJsStatsGathering />
    <Header serviceName="Bichard7" userName={user?.username ?? ""} organisationName={"Ministry of Justice"} />
    {hasAccessToNewBichard ? (
      <NavBar
        hasAccessToReports={hasAccessToReports ?? false}
        hasAccessToUserManagement={hasAccessToUserManagement ?? false}
      />
    ) : undefined}

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
