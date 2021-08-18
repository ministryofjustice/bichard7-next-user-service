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

    const csrfToken = generateCsrfToken(req, res)

    return getServerSidePropsFunction({ ...context, formData, csrfToken } as CsrfServerSidePropsContext)
  }

  return result
}
