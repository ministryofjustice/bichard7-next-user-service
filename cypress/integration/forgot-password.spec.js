describe("Forgot password", () => {
  context("720p resolution", () => {
    before(async () => {
      await cy.task("seedUsers")
    })

    beforeEach(() => {
      cy.viewport(1280, 720)
    })

    it.only("should prompt the user to check their email after entering an email address", () => {
      cy.visit("/login")
      cy.get("a[href='/login/forgot-password']").click()
      cy.get("body").contains(/forgot password/i)
      cy.get("input[type=email]").type("bichard01@example.com")
      cy.get("button[type=submit]").click()
      cy.get("body").contains(/check your email/i)
    })

    it("should not allow submission of something that isn't an email address", () => {
      cy.visit("/login")
      cy.get("a[href='/login/forgot-password']").click()
      cy.get("input[type=email]").type("foobar")
      cy.get("button[type=submit]").click()
      cy.url().should("match", /\/forgot-password\/?$/)
    })
  })
})
