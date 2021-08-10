describe("User", () => {
  describe("Display list of users", () => {
    before(async () => {
      await cy.task("seedUsers")
    })

    it("should display a list of user in tabular form", () => {
      cy.visit("/users")

      cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard01")
      cy.get("tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "Bichard User 01")
      cy.get("tbody tr:nth-child(1) td:nth-child(3)").should("have.text", "Surname 01")
      cy.get("tbody tr:nth-child(1) td:nth-child(4)").should("have.text", "0800 111 222")
      cy.get("tbody tr:nth-child(1) td:nth-child(5)").should("have.text", "bichard01@example.com")

      cy.get("tbody tr:nth-child(2) td:nth-child(1)").should("have.text", "Bichard02")
      cy.get("tbody tr:nth-child(2) td:nth-child(2)").should("have.text", "Bichard User 02")
      cy.get("tbody tr:nth-child(2) td:nth-child(3)").should("have.text", "Surname 02")
      cy.get("tbody tr:nth-child(2) td:nth-child(4)").should("have.text", "0800 222 333")
      cy.get("tbody tr:nth-child(2) td:nth-child(5)").should("have.text", "bichard02@example.com")

      cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Bichard03")
      cy.get("tbody tr:nth-child(3) td:nth-child(2)").should("have.text", "Bichard User 03")
      cy.get("tbody tr:nth-child(3) td:nth-child(3)").should("have.text", "Surname 03")
      cy.get("tbody tr:nth-child(3) td:nth-child(4)").should("have.text", "0800 333 444")
      cy.get("tbody tr:nth-child(3) td:nth-child(5)").should("have.text", "bichard03@example.com")
    })
  })
})
