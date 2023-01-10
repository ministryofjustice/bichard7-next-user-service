describe("Home", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      cy.tableSetup()
      cy.task("insertIntoUserGroupsTable", {
        email: "bichard01@example.com",
        groups: ["B7UserManager_grp", "B7AuditLoggingManager_grp", "B7Supervisor_grp"]
      })
      cy.viewport(1280, 720)
    })

    it("should redirect user to home page after successful login", () => {
      const emailAddress = "bichard01@example.com"
      cy.login(emailAddress, "password")
      cy.get("h1").contains(/welcome bichard user 01/i)
      cy.get("a[id=user-management-link]").should("have.attr", "href").and("equal", "/users/users")
      cy.get("a[id=bichard-link]").should("have.attr", "href").and("equal", "/bichard-ui/InitialRefreshList")
    })

    it("should show paginated service messages", () => {
      cy.login("bichard01@example.com", "password")
      cy.get("body").contains("Latest service messages")
      cy.get(".govuk-grid-column-one-third > .govuk-grid-row").each((row, index) => {
        cy.wrap(row)
          .get(".govuk-body")
          .contains(`Message ${13 - index}`)
      })

      cy.get('a[data-test="Next"]').click()

      cy.get(".govuk-grid-column-one-third > .govuk-grid-row").each((row, index) => {
        cy.wrap(row)
          .get(".govuk-body")
          .contains(`Message ${8 - index}`)
      })

      cy.get('a[data-test="Prev"]').click()

      cy.get(".govuk-grid-column-one-third > .govuk-grid-row").each((row, index) => {
        cy.wrap(row)
          .get(".govuk-body")
          .contains(`Message ${13 - index}`)
      })
    })
  })
})
