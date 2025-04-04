import Paragraph from "./Paragraph"
import Link from "components/Link"

const NotificationBox = () => (
  <>
    <div
      role="region"
      className="moj-alert moj-alert--information moj-alert--with-heading"
      aria-label="information: There are new features available on new Bichard"
      data-module="moj-alert"
    >
      <div>
        <svg
          className="moj-alert__icon"
          role="presentation"
          focusable="false"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 30 30"
          height="30"
          width="30"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13.7,18.5h-2.4v-2.4h2.4V18.5z M12.5,13.7c-0.7,0-1.2-0.5-1.2-1.2V7.7c0-0.7,0.5-1.2,1.2-1.2s1.2,0.5,1.2,1.2v4.8
	        C13.7,13.2,13.2,13.7,12.5,13.7z M12.5,0.5c-6.6,0-12,5.4-12,12s5.4,12,12,12s12-5.4,12-12S19.1,0.5,12.5,0.5z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="moj-alert__content">
        <h2 className="moj-alert__heading">{"There are new features available on new Bichard"}</h2>
        <Paragraph>
          {"View "}
          <Link basePath={false} href={"/help/"}>
            {"the help guidance for new features"}
          </Link>
          {"."}
        </Paragraph>
      </div>
    </div>
  </>
)

export default NotificationBox
