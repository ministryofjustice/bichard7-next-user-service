import { GetServerSidePropsResult } from "next"

export default <Props>(url: string): GetServerSidePropsResult<Props> => {
  return {
    redirect: {
      destination: url,
      statusCode: 302
    }
  }
}
