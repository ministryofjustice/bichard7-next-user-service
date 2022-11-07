describe("FAQ", () => {
  it("should display the FAQ title", () => {
    // When
    cy.visit("/faq")
    // Then
    cy.get("[data-test='faq_heading']").should("have.text", "Frequently Asked Questions")
  })

  it("should display the correct last updated information", () => {
    // When
    cy.visit("/faq")
    // Then
    cy.get("[data-test='faq_last-updated'").should("exist")
    cy.get("[data-test='faq_last-updated'").should("contain", "Last Updated:")
    cy.get("[data-test='faq_last-updated']").should("contain", "04-01-2022")
  })

  it("should display the expected 6 questions and answers", () => {
    // When
    cy.visit("/faq")
    // Then
    cy.get("[data-test='faq-item']").should("have.length", "6")
  })
})
