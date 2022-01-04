describe("FAQ", () => {
  it("should display the FAQ title", () => {
    // When
    cy.visit("/faq")
    // Then
    cy.get("[data-test='faq_heading']").should("have.text", "FAQ")
  })

  it("should display the correct last updated information", () => {
    // When
    cy.visit("/faq")
    // Then
    cy.get("[data-test='faq_last-updated']").should("contain", "04-01-2022")
  })

  it("should display the expected 5 questions and answers", () => {
    // When
    cy.visit("/faq")
    // Then
    cy.get("[data-test='faq_question']").should("have.length", "5")
    cy.get("[data-test='faq_answer']").should("have.length", "5")
  })
})
