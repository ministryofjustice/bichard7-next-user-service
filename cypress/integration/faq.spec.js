describe("403 - Access denied", () => {
  it("should display the correct 403 page", () => {
    cy.visit("/faq")

    cy.get("head title").should("have.text", "Access denied")
  })
})
