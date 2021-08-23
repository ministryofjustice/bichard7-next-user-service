import { validToken } from "../helpers/tokens"

describe("Redirection log in", () => {
  before(async () => {
    await cy.task("seedUsers")
  })

  it("should be able to log in given a valid url passed as a 'redirect' query parameter and redirect to the url given in the query parameter", (done) => {
    const emailAddress = "bichard01@example.com"
    const password = "password"
    const redirectUrl = "http://localhost:3000/bichard-ui/customurl"

    cy.task("seedUsers").then(() => {
      cy.visit(`/login?redirect=${redirectUrl}`)
      cy.get("input[type=email]").type(emailAddress)
      cy.get("button[type=submit]").click()
      cy.get('h1[data-test="check-email"]').should("exist")
      cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
        const token = validToken(emailAddress, verificationCode)

        cy.visit(`/login/verify?token=${token}&redirect=${redirectUrl}`)
        cy.get("input[type=password][name=password]").type(password)
        cy.get("button[type=submit]").click()
        cy.url().then((url) => {
          expect(url).to.match(/^http:\/\/localhost:3000\/bichard-ui\/customurl/)
          expect(url).to.match(/\?token=[A-Za-z0-9_.]+/)
          done()
        })
      })
    })
  })
})
