describe("GOV.UK Assets", () => {
  it("should provide copyright logo that loads correctly", () => {
    cy.visit("/login")
    cy.get(".govuk-footer__copyright-logo").should("have.css", "background-image").and("include", "govuk-crest.png")
  })

  it("should provide favicon icon that loads correctly", () => {
    cy.visit("/login")
    cy.get("link[rel='shortcut icon']").should("have.attr", "href").and("include", "favicon.ico")
  })
})
