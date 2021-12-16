import config from "lib/config"

const whiteTextStyle = { color: "#fff" }
const redBackgroundStyle = { backgroundColor: "#d4351c" }

const NonProdBanner = () => (
  <div className="govuk-phase-banner" style={redBackgroundStyle}>
    <div className="govuk-width-container ">
      <p className="govuk-phase-banner__content">
        <strong className="govuk-tag govuk-tag--red govuk-phase-banner__content__tag">{"development"}</strong>
        <span className="govuk-phase-banner__text" style={whiteTextStyle}>
          {"This is a development version of Bichard that is being used for testing. "}
          <a href={config.productionUrl} style={whiteTextStyle}>
            {"Go to production instead."}
          </a>
        </span>
      </p>
    </div>
  </div>
)

export default NonProdBanner
