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

      it("should redirect to Bichard7 when valid credentials are entered", () => {
        cy.request({
          method: "POST",
          url: "/",
          form: true,
          body: {
            email: "bichard01@example.com",
            password: "password"
          },
          followRedirect: false
        }).then((response) => {
          const loc = response.headers.location
          expect(loc).to.equal("https://localhost:9443/bichard-ui/")
        })
      })

      it("should show an error message when invalid credentials are entered", () => {
        cy.get("input[type=email]").type("foobar@example.com").should("have.value", "foobar@example.com")
        cy.get("input[type=password").type("foobar")
        cy.get("form").submit()
        cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Invalid credentials")
      })
    })
  })
})
