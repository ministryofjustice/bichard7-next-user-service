describe("Logging In", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      cy.viewport(1280, 720)
    })

    describe("When you visit the log in form", () => {
      it("should ask for an email and password", () => {
        cy.visit("/")
        cy.get("input[type=email]").should("be.visible")
        cy.get("input[type=password").should("be.visible")
      })
    })
  })
})
