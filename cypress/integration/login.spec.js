describe("Logging In", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      cy.viewport(1280, 720)
    })

    describe("Log in form", () => {
      beforeEach(() => {
        cy.visit("/")
      })

      it("should ask for an email and password", () => {
        cy.get("input[type=email]").should("be.visible")
        cy.get("input[type=password").should("be.visible")
      })

      it("should redirect to Bichard7", () => {
        cy.get("form").submit()
        cy.url().should("eq", "https://localhost:9443/bichard-ui/")
      })
    })
  })
})
