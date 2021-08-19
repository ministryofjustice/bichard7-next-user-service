/* eslint-disable import/first */
jest.mock("hooks/useCsrfServerSideProps/verifyCsrfToken")
jest.mock("hooks/useCsrfServerSideProps/generateCsrfToken")

import { useCsrfServerSideProps } from "hooks"
import generateCsrfToken from "hooks/useCsrfServerSideProps/generateCsrfToken"
import verifyCsrfToken from "hooks/useCsrfServerSideProps/verifyCsrfToken"
import { GetServerSidePropsContext } from "next"
import QueryString from "qs"
import { ParsedUrlQuery } from "querystring"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"

it("should include form data and CSRF token in the context", async () => {
  const mockedVerifyCsrfToken = verifyCsrfToken as jest.MockedFunction<typeof verifyCsrfToken>
  const mockedGenerateCsrfToken = generateCsrfToken as jest.MockedFunction<typeof generateCsrfToken>

  const dummyFormData = <QueryString.ParsedQs>{ "Dummy-Form-Field": "DummyValue" }
  mockedVerifyCsrfToken.mockResolvedValue({ formData: dummyFormData, isValid: true })
  const dummyTokens = { formToken: "DummyFormToken", cookieToken: "DummyCookieToken", cookieName: "DummyCookieName" }
  mockedGenerateCsrfToken.mockReturnValue(dummyTokens)

  let cookie: string
  let cookieAction: string
  const dummyResponse = {
    setHeader: (action: string, cookieValue: string) => {
      cookieAction = action
      cookie = cookieValue
    }
  }
  const dummyContext = { req: {}, res: dummyResponse } as GetServerSidePropsContext<ParsedUrlQuery>

  const handler = useCsrfServerSideProps((context) => {
    const { formData, csrfToken, req } = context as CsrfServerSidePropsContext

    expect(req).toBeDefined()
    expect(csrfToken).toBe("DummyFormToken")
    expect(formData).toBeDefined()
    expect(formData["Dummy-Form-Field"]).toBe("DummyValue")
    expect(cookieAction).toBe("Set-Cookie")
    expect(cookie).toContain("DummyCookieName=DummyCookieToken")

    return undefined as never
  })

  await handler(dummyContext)
})

it("should set forbidden response code when CSRF token verification fails", async () => {
  const mockedVerifyCsrfToken = verifyCsrfToken as jest.MockedFunction<typeof verifyCsrfToken>

  const dummyFormData = <QueryString.ParsedQs>{ "Dummy-Form-Field": "DummyValue" }
  mockedVerifyCsrfToken.mockResolvedValue({ formData: dummyFormData, isValid: false })

  let isEndCalled = false
  const dummyContext = {
    res: {
      statusCode: 200,
      statusMessage: "Ok",
      end: () => {
        isEndCalled = true
      }
    }
  } as GetServerSidePropsContext<ParsedUrlQuery>

  const handler = useCsrfServerSideProps(() => undefined as never)

  await handler(dummyContext)

  const { statusCode, statusMessage } = dummyContext.res
  expect(statusCode).toBe(403)
  expect(statusMessage).toBe("Invalid CSRF-token")
  expect(isEndCalled).toBe(true)
})
