describe("Delete user", () => {
  beforeEach(async () => {
    await cy.task("seedUsers")
  })

  it("should delete the user when confirmation text is valid", () => {
    cy.visit("/users/Bichard02")
    cy.get('a[data-test="delete-user-view"]').click()
    cy.get("h1").contains("Are you sure you want to delete Bichard User 02 Surname 02?")
    cy.get("input[id=delete-account-confirmation]").type("Bichard02")
    cy.get("button[type=submit]").click()
    cy.get(".govuk-notification-banner").contains("User 'Bichard User 02 Surname 02' has been deleted successfully.")
    cy.get("a.govuk-back-link").click()
    cy.url().should("contains", "/users")
  })

  it("should not allow deleting the user when confirmation text is invalid", () => {
    cy.visit("/users/Bichard02")
    cy.get('a[data-test="delete-user-view"]').click()
    cy.get("h1").contains("Are you sure you want to delete Bichard User 02 Surname 02?")
    cy.get("input[id=delete-account-confirmation]").type("Invalid input")
    cy.get("button[type=submit]").click()
    cy.get(".govuk-error-summary").contains("Username mismatch")
    cy.get(".govuk-error-summary").contains("The provided username in the confirmation box does not match.")
    cy.url().should("contains", "/users/Bichard02/delete")
  })

  it("should not allow deleting the user when confirmation text is empty", () => {
    cy.visit("/users/Bichard02")
    cy.get('a[data-test="delete-user-view"]').click()
    cy.get("h1").contains("Are you sure you want to delete Bichard User 02 Surname 02?")
    cy.get("button[type=submit]").click()
    cy.get(".govuk-error-summary").contains("Username mismatch")
    cy.get(".govuk-error-summary").contains("The provided username in the confirmation box does not match.")
    cy.url().should("contains", "/users/Bichard02/delete")
  })

  it("should respond with forbidden response code when CSRF tokens are invalid in delete page", (done) => {
    cy.checkCsrf("/users/Bichard01/delete", "POST").then(() => done())
  })
})
