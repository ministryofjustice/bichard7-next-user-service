describe("GOV.UK Assets", () => {
  it("should provide copyright logo that loads correctly", () => {
    cy.visit("/login")
    cy.get(".govuk-footer__copyright-logo")
      .should("have.css", "background-image")
      .then((backgroundImage) => {
        // The CSS property is something like `url("http://...")`, so we need
        // to grab the actual URL out of the middle of the parens
        const imageUrl = backgroundImage.match(/url\(['"]([^'"]+)['"]\)/i)[1]
        cy.request({
          url: imageUrl,
          failOnStatusCode: false
        }).then((resp) => {
          expect(resp.status).not.to.equal(404)
          expect(resp.body).not.to.equal(undefined)
        })
      })
  })

  it("should provide favicon icon that loads correctly", () => {
    cy.get("link[rel='shortcut icon']")
      .should("have.attr", "href")
      .then((iconHref) => {
        // cy.request automatically uses Cypress' defined baseUrl, which
        // includes /users already - so we need to strip it out here to get it
        // to work
        const iconUrl = iconHref.replace("/users/", "/")
        cy.request({
          url: iconUrl,
          failOnStatusCode: false
        }).then((resp) => {
          expect(resp.status).not.to.equal(404)
          expect(resp.body).not.to.equal(undefined)
        })
      })
  })
})
