describe("Delete user", () => {
  beforeEach(() => {
    cy.task("deleteFromUsersTable")
    cy.task("insertIntoUsersAndGroupsTable")
  })

  it("should delete the user when confirmation text is valid", () => {
    cy.visit("/users/Bichard02")
    cy.get('a[data-test="delete-user-view"]').click()
    cy.get("h1").contains("Are you sure you want to delete Bichard User 02 Surname 02?")
    cy.get("input[id=delete-account-confirmation]").type("Bichard02")
    cy.get("button[type=submit]").click()
    cy.url().should("contains", "/users")
    cy.get("h3").should("have.text", "User deleted successfully.")
  })

  it("should not allow deleting the user when confirmation text is invalid", () => {
    cy.visit("/users/Bichard02")
    cy.get('a[data-test="delete-user-view"]').click()
    cy.get("h1").contains("Are you sure you want to delete Bichard User 02 Surname 02?")
    cy.get("input[id=delete-account-confirmation]").type("Invalid input")
    cy.get("button[type=submit]").click()
    cy.get('[data-test="error-summary"]').contains("Username mismatch")
    cy.get('[data-test="error-summary"]').contains("Enter the account username")
    cy.url().should("contains", "/users/Bichard02/delete")
  })

  it("should not allow deleting the user when confirmation text is empty", () => {
    cy.visit("/users/Bichard02")
    cy.get('a[data-test="delete-user-view"]').click()
    cy.get("h1").contains("Are you sure you want to delete Bichard User 02 Surname 02?")
    cy.get("button[type=submit]").click()
    cy.get('[data-test="error-summary"]').contains("Username mismatch")
    cy.get('[data-test="error-summary"]').contains("Enter the account username")
    cy.url().should("contains", "/users/Bichard02/delete")
  })

  it("should respond with forbidden response code when CSRF tokens are invalid in delete page", (done) => {
    cy.checkCsrf("/users/Bichard01/delete", "POST").then(() => done())
  })
})
