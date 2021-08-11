import { GetServerSidePropsResult } from "next"

export default <T>(url: string): GetServerSidePropsResult<T> => {
  return {
    redirect: {
      destination: url,
      statusCode: 302
    }
  }
}
