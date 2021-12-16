describe("Display list of users", () => {
  beforeEach(() => {
    cy.task("deleteFromUsersTable")
    cy.task("insertIntoUsersTable")
  })

  it("should not allow the current user to view a user who is in a different force", () => {
    // Given
    cy.login("bichard02@example.com", "password")
    // When
    cy.visit("/users/Bichard03", { failOnStatusCode: false })
    // Then
    cy.get('[data-test="404_header"]').should("contain.text", "Page not found")
  })

  it("should prevent user from clicking on delete user button", () => {
    // Given
    cy.login("bichard01@example.com", "password")
    // When
    cy.visit("/users/Bichard01")
    // Then
    cy.get('[data-test="disabled-delete-anchor"]').should("be.visible")
  })

  it("should display a list of user in tabular form", () => {
    cy.login("bichard01@example.com", "password")
    cy.visit("/users")

    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard01")
    cy.get("tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "Bichard User 01")
    cy.get("tbody tr:nth-child(1) td:nth-child(3)").should("have.text", "Surname 01")
    cy.get("tbody tr:nth-child(1) td:nth-child(4)").should("have.text", "bichard01@example.com")

    cy.get("tbody tr:nth-child(2) td:nth-child(1)").should("have.text", "Bichard02")
    cy.get("tbody tr:nth-child(2) td:nth-child(2)").should("have.text", "Bichard User 02")
    cy.get("tbody tr:nth-child(2) td:nth-child(3)").should("have.text", "Surname 02")
    cy.get("tbody tr:nth-child(2) td:nth-child(4)").should("have.text", "bichard02@example.com")

    cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Bichard03")
    cy.get("tbody tr:nth-child(3) td:nth-child(2)").should("have.text", "Bichard User 03")
    cy.get("tbody tr:nth-child(3) td:nth-child(3)").should("have.text", "Surname 03")
    cy.get("tbody tr:nth-child(3) td:nth-child(4)").should("have.text", "bichard03@example.com")
  })

  it("should display the correct list of users when using the filter", () => {
    cy.login("bichard01@example.com", "password")
    cy.visit("/users")
    cy.get('input[id="filter"]').type("Bichard02")
    cy.get('button[id="filter"]').click()
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard02")
    cy.get("tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "Bichard User 02")
    cy.get("tbody tr:nth-child(1) td:nth-child(3)").should("have.text", "Surname 02")
    cy.get("tbody tr:nth-child(1) td:nth-child(4)").should("have.text", "bichard02@example.com")

    cy.get('input[id="filter"]').focus().clear()
    cy.get('input[id="filter"]').type("bichard03")
    cy.get('button[id="filter"]').click()
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard03")
    cy.get("tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "Bichard User 03")
    cy.get("tbody tr:nth-child(1) td:nth-child(3)").should("have.text", "Surname 03")
    cy.get("tbody tr:nth-child(1) td:nth-child(4)").should("have.text", "bichard03@example.com")
  })

  it("should display the correct list of users when using the filter when logged in as super user", () => {
    cy.task("deleteFromGroupsTable")
    cy.task("insertIntoGroupsTable")
    cy.task("insertIntoUserGroupsTable", {
      email: "bichard04@example.com",
      groups: ["B7UserManager_grp", "B7SuperUserManager_grp"]
    })
    cy.login("bichard04@example.com", "password")
    cy.visit("/users")
    cy.get('input[id="filter"]').type("Bichard02")
    cy.get('button[id="filter"]').click()
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard02")
    cy.get("tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "Bichard User 02")
    cy.get("tbody tr:nth-child(1) td:nth-child(3)").should("have.text", "Surname 02")
    cy.get("tbody tr:nth-child(1) td:nth-child(4)").should("have.text", "bichard02@example.com")

    cy.get('input[id="filter"]').focus().clear()
    cy.get('input[id="filter"]').type("bichard03")
    cy.get('button[id="filter"]').click()
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard03")
    cy.get("tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "Bichard User 03")
    cy.get("tbody tr:nth-child(1) td:nth-child(3)").should("have.text", "Surname 03")
    cy.get("tbody tr:nth-child(1) td:nth-child(4)").should("have.text", "bichard03@example.com")
  })

  it("should display in paginated view when returning many users", () => {
    cy.task("deleteFromUsersTable")
    cy.task("insertManyIntoUsersTable")
    cy.login("bichard01@example.com", "password")

    cy.visit("/users")
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard01")
    cy.get("tbody tr:nth-child(2) td:nth-child(1)").should("have.text", "Bichard02")
    cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Bichard03")
    cy.get("tbody tr:nth-child(4) td:nth-child(1)").should("have.text", "Bichard04")
    cy.get("tbody tr:nth-child(5) td:nth-child(1)").should("have.text", "Bichard05")
    cy.get("tbody tr:nth-child(6) td:nth-child(1)").should("have.text", "Bichard06")
    cy.get("tbody tr:nth-child(7) td:nth-child(1)").should("have.text", "Bichard07")
    cy.get("tbody tr:nth-child(8) td:nth-child(1)").should("have.text", "Bichard08")
    cy.get("tbody tr:nth-child(9) td:nth-child(1)").should("have.text", "Bichard09")
    cy.get("tbody tr:nth-child(10) td:nth-child(1)").should("have.text", "Bichard10")

    cy.get('a[data-test="Next"]').click()
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard11")
    cy.get("tbody tr:nth-child(2) td:nth-child(1)").should("have.text", "Bichard12")
    cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Bichard13")

    cy.get('a[data-test="Prev"]').click()
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard01")
    cy.get("tbody tr:nth-child(2) td:nth-child(1)").should("have.text", "Bichard02")
    cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Bichard03")
    cy.get("tbody tr:nth-child(4) td:nth-child(1)").should("have.text", "Bichard04")
    cy.get("tbody tr:nth-child(5) td:nth-child(1)").should("have.text", "Bichard05")
    cy.get("tbody tr:nth-child(6) td:nth-child(1)").should("have.text", "Bichard06")
    cy.get("tbody tr:nth-child(7) td:nth-child(1)").should("have.text", "Bichard07")
    cy.get("tbody tr:nth-child(8) td:nth-child(1)").should("have.text", "Bichard08")
    cy.get("tbody tr:nth-child(9) td:nth-child(1)").should("have.text", "Bichard09")
    cy.get("tbody tr:nth-child(10) td:nth-child(1)").should("have.text", "Bichard10")
  })

  it("should display different users depending on the force codes assigned", () => {
    cy.task("deleteFromUsersTable")
    cy.task("insertManyIntoUsersTable")
    cy.login("bichard13@example.com", "password")

    cy.visit("/users")
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard01")
    cy.get("tbody tr:nth-child(2) td:nth-child(1)").should("have.text", "Bichard02")
    cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Bichard03")
    cy.get("tbody tr:nth-child(4) td:nth-child(1)").should("have.text", "Bichard04")
    cy.get("tbody tr:nth-child(5) td:nth-child(1)").should("have.text", "Bichard05")
    cy.get("tbody tr:nth-child(6) td:nth-child(1)").should("have.text", "Bichard06")
    cy.get("tbody tr:nth-child(7) td:nth-child(1)").should("have.text", "Bichard09")
    cy.get("tbody tr:nth-child(8) td:nth-child(1)").should("have.text", "Bichard10")
    cy.get("tbody tr:nth-child(9) td:nth-child(1)").should("have.text", "Bichard11")
    cy.get("tbody tr:nth-child(10) td:nth-child(1)").should("have.text", "Bichard12")

    cy.get('input[id="filter"]').type("Bichard1")
    cy.get('button[id="filter"]').click()
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard10")
    cy.get("tbody tr:nth-child(2) td:nth-child(1)").should("have.text", "Bichard11")
    cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Bichard12")
    cy.get("tbody tr:nth-child(4) td:nth-child(1)").should("have.text", "Bichard13")
  })
})
