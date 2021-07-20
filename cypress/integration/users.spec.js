describe("User", () => {
  describe("Display list of users", () => {
    it("should display a list of user in tabular form", () => {
      cy.visit("/users")

      cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard01")
      cy.get("tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "Bichard User 01")
      cy.get("tbody tr:nth-child(1) td:nth-child(3)").should("have.text", "01")
      cy.get("tbody tr:nth-child(1) td:nth-child(4)").should("have.text", "1234")
      cy.get("tbody tr:nth-child(1) td:nth-child(5)").should("have.text", "bichard01@example.com")

      cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Audit1")
      cy.get("tbody tr:nth-child(3) td:nth-child(2)").should("have.text", "Bichard User 03")
      cy.get("tbody tr:nth-child(3) td:nth-child(3)").should("have.text", "01")
      cy.get("tbody tr:nth-child(3) td:nth-child(4)").should("have.text", "1234")
      cy.get("tbody tr:nth-child(3) td:nth-child(5)").should("have.text", "audit1@example.com")

      cy.get("tbody tr:nth-child(7) td:nth-child(1)").should("have.text", "TriggerHandler1")
      cy.get("tbody tr:nth-child(7) td:nth-child(2)").should("have.text", "Bichard User 07")
      cy.get("tbody tr:nth-child(7) td:nth-child(3)").should("have.text", "01")
      cy.get("tbody tr:nth-child(7) td:nth-child(4)").should("have.text", "1234")
      cy.get("tbody tr:nth-child(7) td:nth-child(5)").should("have.text", "triggerhandler1@example.com")

      cy.get("tbody tr:nth-child(13) td:nth-child(1)").should("have.text", "TriggerHandler2")
      cy.get("tbody tr:nth-child(13) td:nth-child(2)").should("have.text", "Bichard User 13")
      cy.get("tbody tr:nth-child(13) td:nth-child(3)").should("have.text", "01")
      cy.get("tbody tr:nth-child(13) td:nth-child(4)").should("have.text", "1234")
      cy.get("tbody tr:nth-child(13) td:nth-child(5)").should("have.text", "triggerhandler2@example.com")
    })
  })
})
