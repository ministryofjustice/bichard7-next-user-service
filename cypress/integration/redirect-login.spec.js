import { validToken, decodeAuthenticationToken } from "../helpers/tokens"

describe("Redirection log in", () => {
  before(() => {
    cy.task("deleteFromUsersTable")
    cy.task("insertIntoUsersTable")
  })

  it("should be able to log in given a valid url passed as a 'redirect' query parameter and redirect to the url given in the query parameter", (done) => {
    const emailAddress = "bichard01@example.com"
    const password = "password"
    const redirectPath = "/bichard-ui/customurl"

    cy.visit(`/login?redirect=${redirectPath}`)

    cy.get("input[type=email]").type(emailAddress)
    cy.get("button[type=submit]").click()
    cy.get('h1[data-test="check-email"]').should("exist")

    cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
      const token = validToken(emailAddress, verificationCode)
      cy.visit(`/login/verify?token=${token}&redirect=${redirectPath}`)

      cy.get("input[type=password][name=password]").type(password)
      cy.get("button[type=submit]").click()

      cy.url().should("match", /^http:\/\/localhost:3000\/bichard-ui\/customurl/)

      cy.url().then((url) => {
        expect(url).to.match(/\?token=[A-Za-z0-9_.]+/)
        cy.task("selectFromUsersTable", emailAddress).then((user) => {
          cy.task("selectFromJwtIdTable").then((jwtId) => {
            const decodedToken = decodeAuthenticationToken(url.match(/token=([^..]+\.[^..]+\.[^..]+)/)[1])
            expect(jwtId.id).to.equal(decodedToken.id)
            expect(jwtId.user_id).to.equal(user.id)
            done()
          })
        })
      })
    })
  })
})
