describe("Logging Out", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.clearCookies()

      cy.tableSetup()
    })

    // TODO: check permissions - insertIntoUserGroupsTable

    it("can successfully log out after logging in", () => {
      cy.login("bichard01@example.com", "password")
      cy.getCookie(".AUTH").should("exist")

      cy.get("a[data-test=logout]").click()
      cy.getCookie(".AUTH").should("not.exist")
      cy.get("body").contains(/Signed out of Bichard/i)
    })

    it("links back to login page after logging out", () => {
      cy.login("bichard01@example.com", "password")
      cy.get("a[data-test=logout]").click()

      cy.get("body").contains(/In order to sign back in, please click here/i)
      cy.get("a[data-test=log-back-in]").click()

      cy.url().should("match", /\/login\/?$/)
      cy.get("input[type=email]").should("be.visible")
      cy.get("button[type=submit").should("be.visible")
    })
  })
})
