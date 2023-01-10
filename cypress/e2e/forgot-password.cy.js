describe("Forgot password", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      cy.tableSetup()
      cy.viewport(1280, 720)
    })

    // TODO: check permissions - insertIntoUserGroupsTable

    it("should prompt the user to check their email after entering an email address", () => {
      cy.visit("/login")
      cy.get("a[data-test='reset-password']").click()
      cy.get("body").contains(/reset password/i)
      cy.get("input[type=email]").type("bichard01@example.com")
      cy.get("button[type=submit]").click()
      cy.get("body").contains(/sent you an email/i)
    })

    it("should not allow submission of something that isn't an email address", () => {
      cy.visit("/login")
      cy.get("a[data-test='reset-password']").click()
      cy.get("input[type=email]").type("foobar")
      cy.get("button[type=submit]").click()
      cy.url().should("match", /\/reset-password\/?$/)
    })

    it("should respond with forbidden response code when CSRF tokens are invalid in forgot password page", (done) => {
      cy.checkCsrf("/login/reset-password", "POST").then(() => done())
    })
  })
})
