import { generateLoginVerificationToken } from "../helpers/tokens"

describe("Forgot password", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      cy.task("deleteFromUsersTable")
      cy.task("insertIntoUsersTable")
    })

    beforeEach(() => {
      cy.viewport(1280, 720)
    })

    it("should prompt the user to check their email after entering an email address", () => {
      cy.visit("/login")
      cy.get("a[data-test='forgot-password']").click()
      cy.get("body").contains(/forgot password/i)
      cy.get("input[type=email]").type("bichard01@example.com")
      cy.get("button[type=submit]").click()
      cy.get("body").contains(/check your email/i)
    })

    it("should not allow submission of something that isn't an email address", () => {
      cy.visit("/login")
      cy.get("a[data-test='forgot-password']").click()
      cy.get("input[type=email]").type("foobar")
      cy.get("button[type=submit]").click()
      cy.url().should("match", /\/forgot-password\/?$/)
    })

    it("should respond with forbidden response code when CSRF tokens are invalid in forgot password page", (done) => {
      cy.checkCsrf("/login/forgot-password", "POST").then(() => done())
    })
  })
})
