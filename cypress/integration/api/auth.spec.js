import { validToken } from "../../helpers/tokens"

describe("Display list of users", () => {
  beforeEach(() => {
    cy.task("deleteFromUsersTable")
    cy.task("insertIntoUsersTable")
  })

  it("should say user is unauthenticated if not logged in", () => {
    cy.request({ url: "/api/auth", failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property("authenticated", false)
    })
  })

  it("should say user is authenticated if logged in", () => {
    const emailAddress = "bichard01@example.com"
    const password = "password"

    cy.visit("/login")
    cy.get("input[type=email]").type(emailAddress)
    cy.get("button[type=submit]").click()

    cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
      const token = validToken(emailAddress, verificationCode)
      cy.visit(`/login/verify?token=${token}`)
      cy.get("input[type=password][name=password]").type(password)
      cy.get("button[type=submit]").click()
    })

    cy.request("/api/auth").then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property("authenticated", true)
    })
  })
})
