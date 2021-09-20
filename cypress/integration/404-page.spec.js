describe("404 - Page not found", () => {
  it("should display the correct 404 page when an incorrect url has been requested", () => {
    cy.visit("/bad-url-request", { failOnStatusCode: false })

    cy.get("head title").should("have.text", "Page not found")
    cy.get("h1.govuk-heading-xl").should("have.text", "Page not found")
    cy.get("p.govuk-body:nth-child(2)").should("have.text", "If you typed the web address, check it is correct.")
    cy.get("p.govuk-body:nth-child(3)").should(
      "have.text",
      "If you pasted the web address, check you copied the entire address."
    )
    cy.get("p.govuk-body:nth-child(4)").should(
      "have.text",
      "If the web address is correct or you selected a link or button, contact support."
    )
  })

  it("should respond with correct HTTP status code (404)", () => {
    cy.request({
      failOnStatusCode: false,
      url: "/bad-url-request"
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })
})
