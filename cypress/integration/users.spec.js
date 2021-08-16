describe("User", () => {
  describe("Display list of users", () => {
    before((done) => {
      cy.task("seedUsers").then(() => done())
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

    it("should be able to create a new user", () => {
      cy.visit("users/newUser")

      cy.get('input[id="username"]').type("Buser")
      cy.get('input[id="forenames"]').type("B forename")
      cy.get('input[id="surname"]').type("B surname")
      cy.get('input[id="phoneNumber"]').type("B phone")
      cy.get('input[id="emailAddress"]').type("bemail1@example.com")

      cy.get('input[id="postalAddress"]').type("B Address")
      cy.get('input[id="postCode"]').type("B Code")
      cy.get('input[id="endorsedBy"]').type("B Endorsed")
      cy.get('input[id="orgServes"]').type("B organisation")

      cy.get("button").click()
      cy.get("h3").should("have.text", "User Buser has ben successfully created")
    })

    it("should be able to view a newly created user", () => {
      cy.visit("users")

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

      cy.get("tbody tr:nth-child(4) td:nth-child(1)").should("have.text", "Buser")
      cy.get("tbody tr:nth-child(4) td:nth-child(2)").should("have.text", "B forename")
      cy.get("tbody tr:nth-child(4) td:nth-child(3)").should("have.text", "B surname")
      cy.get("tbody tr:nth-child(4) td:nth-child(4)").should("have.text", "B phone")
      cy.get("tbody tr:nth-child(4) td:nth-child(5)").should("have.text", "bemail1@example.com")
    })

    it("should not allow account with same username to be created", () => {
      cy.visit("users/newUser")

      cy.get('input[id="username"]').type("Bichard01")
      cy.get('input[id="forenames"]').type("B forename")
      cy.get('input[id="surname"]').type("B surname")
      cy.get('input[id="phoneNumber"]').type("B phone")
      cy.get('input[id="emailAddress"]').type("bemail2@example.com")

      cy.get('input[id="postalAddress"]').type("B Address")
      cy.get('input[id="postCode"]').type("B Code")
      cy.get('input[id="endorsedBy"]').type("B Endorsed")
      cy.get('input[id="orgServes"]').type("B organisation")

      cy.get("button").click()
      cy.get('span[id="event-name-error"]').should("have.text", "Error: Username Bichard01 already exists")
    })
  })
})
