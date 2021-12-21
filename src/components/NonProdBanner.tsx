import config from "lib/config"
import styles from "../styles/components/NonProdBanner.module.css"

const NonProdBanner = () => (
  <div className={`govuk-phase-banner ${styles.nonProdBanner}`}>
    <div className="govuk-width-container ">
      <p className="govuk-phase-banner__content">
        <strong className="govuk-tag govuk-tag--red govuk-phase-banner__content__tag">{"development"}</strong>
        <span className="govuk-phase-banner__text">
          {"This is a development version of Bichard that is being used for testing. "}
          <a href={config.productionUrl}>{"Go to production instead."}</a>
        </span>
      </p>
    </div>
  </div>
)

export default NonProdBanner
