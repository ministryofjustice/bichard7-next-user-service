describe("403 - Access denied", () => {
  it("should display the correct 403 page", () => {
    cy.visit("/403", { failOnStatusCode: false })

    cy.get("head title").should("have.text", "Access denied")
    cy.get("h1.govuk-heading-xl").should("have.text", "Access denied")
    cy.get("p.govuk-body:nth-child(2)").should("have.text", "You do not have permission to access this page.")
    cy.get("p.govuk-body:nth-child(3)").should(
      "have.text",
      "We suggest that you return to the home page and choose an available service to you."
    )
    cy.get("p.govuk-body:nth-child(4)").should(
      "have.text",
      "If you believe you have permission to access this page, you can contact support to report this issue."
    )
  })

  it("should respond with correct HTTP status code (404)", () => {
    cy.request({
      failOnStatusCode: false,
      url: "/403"
    }).then((response) => {
      expect(response.status).to.eq(403)
    })
  })
})
