import { serialize } from "cookie"
import config from "lib/config"
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { ParsedUrlQuery } from "querystring"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import generateCsrfToken from "./generateCsrfToken"
import verifyCsrfToken from "./verifyCsrfToken"

export default <Props>(getServerSidePropsFunction: GetServerSideProps<Props>): GetServerSideProps<Props> => {
  const result: GetServerSideProps<Props> = async (
    context: GetServerSidePropsContext<ParsedUrlQuery>
  ): Promise<GetServerSidePropsResult<Props>> => {
    const { req, res } = context
    const { isValid, formData } = await verifyCsrfToken(req)

    if (!isValid) {
      res.statusCode = 403
      res.statusMessage = "Invalid CSRF-token"
      return res.end() as never
    }

    const { maximumTokenAgeInSeconds } = config.csrf
    const { formToken, cookieToken, cookieName } = generateCsrfToken(req)
    res.setHeader(
      "Set-Cookie",
      serialize(cookieName, cookieToken, { httpOnly: true, maxAge: maximumTokenAgeInSeconds })
    )

    return getServerSidePropsFunction({ ...context, formData, csrfToken: formToken } as CsrfServerSidePropsContext)
  }

  return result
}
