describe("Viewing a single user", () => {
  beforeEach(() => {
    cy.task("deleteFromUsersTable")
    cy.task("insertIntoUsersTable")
    cy.task("insertIntoUserGroupsTable", { email: "bichard01@example.com", groups: ["B7UserManager_grp"] })
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

  it("should show all summary information", () => {
    // Given
    cy.login("bichard01@example.com", "password")
    // When
    cy.visit("/users/Bichard01")
    // Then
    cy.get('[data-test="summary-item_username_value"]').should("be.visible").contains("Bichard01")
    cy.get('[data-test="summary-item_forename_value"]').should("be.visible").contains("Bichard User 01")
    cy.get('[data-test="summary-item_surname_value"]').should("be.visible").contains("Surname 01")
    cy.get('[data-test="summary-item_email-address_value"]').should("be.visible").contains("bichard01@example.com")
    cy.get('[data-test="summary-item_endorsed-by_value"]').should("be.visible").contains("endorsed_by 01")
    cy.get('[data-test="summary-item_organisation_value"]').should("be.visible").contains("org_severs 01")
    cy.get('[data-test="summary-item_visible-forces_value"]').should("be.visible").contains("001,002,004,014")
    cy.get('[data-test="summary-item_visible-courts_value"]').should("be.visible").contains("B01,B41ME00")
    cy.get('[data-test="summary-item_excluded-triggers_value"]').should("be.visible").contains("TRPR0001")
    cy.get('[data-test="summary-item_group-memberships_value"]').should("be.visible").contains("User Manager")
  })
})
