describe("404 - Page not found", () => {
  it("should display the correct 404 page when an incorrect url has been requested", () => {
    cy.visit("/bad-url-request", { failOnStatusCode: false })

    cy.contains("Page not found")
    cy.contains("If you typed the web address, check it is correct.")
    cy.contains("If you pasted the web address, check you copied the entire address.")
    cy.contains("If the web address is correct or you selected a link or button, contact support.")
  })

  it("should respond with the correct HTTP status code (404)", () => {
    cy.request({
      failOnStatusCode: false,
      url: "/bad-url-request"
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })
})
