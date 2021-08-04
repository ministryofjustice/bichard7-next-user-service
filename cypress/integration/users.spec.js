describe("User", () => {
  describe("Display list of users", () => {
    it("should display a list of user in tabular form", () => {
      cy.visit("/users")

      cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Allocator1")
      cy.get("tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "Bichard User")
      cy.get("tbody tr:nth-child(1) td:nth-child(3)").should("have.text", "01")
      cy.get("tbody tr:nth-child(1) td:nth-child(4)").should("have.text", "1234")
      cy.get("tbody tr:nth-child(1) td:nth-child(5)").should("have.text", "allocator1@example.com")

      cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "ExceptionHandler1")
      cy.get("tbody tr:nth-child(3) td:nth-child(2)").should("have.text", "Bichard User")
      cy.get("tbody tr:nth-child(3) td:nth-child(3)").should("have.text", "01")
      cy.get("tbody tr:nth-child(3) td:nth-child(4)").should("have.text", "1234")
      cy.get("tbody tr:nth-child(3) td:nth-child(5)").should("have.text", "exceptionhandler1@example.com")

      cy.get("tbody tr:nth-child(7) td:nth-child(1)").should("have.text", "TriggerHandler1")
      cy.get("tbody tr:nth-child(7) td:nth-child(2)").should("have.text", "Bichard User")
      cy.get("tbody tr:nth-child(7) td:nth-child(3)").should("have.text", "01")
      cy.get("tbody tr:nth-child(7) td:nth-child(4)").should("have.text", "1234")
      cy.get("tbody tr:nth-child(7) td:nth-child(5)").should("have.text", "triggerhandler1@example.com")

      cy.get("tbody tr:nth-child(13) td:nth-child(1)").should("have.text", "TriggerHandler2")
      cy.get("tbody tr:nth-child(13) td:nth-child(2)").should("have.text", "Bichard User")
      cy.get("tbody tr:nth-child(13) td:nth-child(3)").should("have.text", "01")
      cy.get("tbody tr:nth-child(13) td:nth-child(4)").should("have.text", "1234")
      cy.get("tbody tr:nth-child(13) td:nth-child(5)").should("have.text", "triggerhandler2@example.com")
    })
  })
})
