const currentUserGroupNames = ["B7UserManager_grp", "B7ExceptionHandler_grp"]
const getCurrentUserGroups = (allGroups) => allGroups.filter((g) => currentUserGroupNames.includes(g.name))

describe("Edit user", () => {
  beforeEach(() => {
    cy.task("deleteFromUsersTable")
    cy.task("deleteFromGroupsTable")
    cy.task("deleteFromUsersGroupsTable")
    cy.task("insertIntoGroupsTable")
    cy.task("insertIntoUsersTable")
    cy.task("insertIntoUserGroupsTable", {
      email: "bichard02@example.com",
      groups: currentUserGroupNames
    })
    Cypress.Cookies.preserveOnce(".AUTH")
  })

  it("should display correct user details when navigating to the edit user page", () => {
    cy.login("bichard02@example.com", "password")

    const emailAddress = "bichard01@example.com"
    cy.visit("users/Bichard01")
    cy.get('a[data-test="edit-user-view"]').click()

    cy.task("selectFromUsersTable", emailAddress).then((user) => {
      cy.task("selectFromGroupsTable", "user_id", user.id).then((groups) => {
        const currentUserGroups = getCurrentUserGroups(groups)
        cy.get('input[id="username"]').should("have.value", "Bichard01")
        cy.get('input[id="forenames"]').should("have.value", "Bichard User 01")
        cy.get('input[id="endorsedBy"]').should("have.value", "endorsed_by 01")
        cy.get('input[id="orgServes"]').should("have.value", "org_severs 01")
        cy.get('input[id="visibleForces001"]').should("be.checked")
        cy.get('input[id="visibleForces004"]').should("be.checked")
        cy.get('input[id="visibleCourts"]').should("have.value", "B01,B41ME00")
        cy.get('input[id="excludedTriggersTRPR0001"]').should("be.checked")
        cy.get('[data-test="checkbox-user-groups"]')
          .find('[data-test="checkbox-multiselect-checkboxes"]')
          .find(`label[for="${currentUserGroups[0].id}"]`)
          .should("have.text", currentUserGroups[0].name)
      })
    })
  })

  it("should update user correctly when updating user details", () => {
    cy.login("bichard02@example.com", "password")
    cy.visit("users/Bichard01")
    cy.get('a[data-test="edit-user-view"]').click()
    cy.get('input[id="forenames"]').clear()
    cy.get('input[id="forenames"]').type("forename change 01")
    cy.get('input[id="endorsedBy"]').clear()
    cy.get('input[id="endorsedBy"]').type("change endorsed_by")
    cy.get('input[id="orgServes"]').clear()
    cy.get('input[id="orgServes"]').type("org change 02")
    cy.get('button[type="submit"]').click()
    cy.get('input[id="visibleForces001"]').uncheck()
    cy.get('input[id="visibleForces002"]').check()
    cy.get('input[id="visibleCourts"]').clear()
    cy.get('input[id="visibleCourts"]').type("B02,B42MD00")
    cy.get('input[id="excludedTriggersTRPR0001"]').check()
    cy.get('input[id="excludedTriggersTRPR0004"]').check()
    cy.get('[data-test="checkbox-user-groups"]')
      .find('[data-test="checkbox-multiselect-checkboxes"]')
      .find(`input[name="B7ExceptionHandler_grp"]`)
      .check()

    cy.task("selectFromUsersTable", "bichard01@example.com").then((user) => {
      cy.task("selectFromGroupsTable", "user_id", user.id).then((groups) => {
        const currentUserGroups = getCurrentUserGroups(groups)
        cy.get('input[id="username"]').should("have.value", "Bichard01")
        cy.get('input[id="forenames"]').should("have.value", "forename change 01")
        cy.get('input[id="emailAddress"]').should("have.value", "bichard01@example.com")
        cy.get('input[id="endorsedBy"]').should("have.value", "change endorsed_by")
        cy.get('input[id="orgServes"]').should("have.value", "org change 02")
        cy.get('[data-test="checkbox-user-groups"]')
          .find('[data-test="checkbox-multiselect-checkboxes"]')
          .find(`[data-test="B7ExceptionHandler_grp"]`)
          .contains(currentUserGroups[0].name)
      })
    })
  })

  it("should invalidate form correctly when form in not valid", () => {
    cy.login("bichard02@example.com", "password")
    cy.visit("users/Bichard01")
    cy.get('a[data-test="edit-user-view"]').click()
    cy.get('input[id="forenames"]').clear()
    cy.get('input[id="surname"]').clear()
    cy.get('button[type="submit"]').click()
    cy.get("div.govuk-error-summary").contains("Enter the user's forename(s)")
    cy.get("div.govuk-error-summary").contains("Enter the user's surname")
  })

  it("should respond with forbidden response code when CSRF tokens are invalid in edit page", (done) => {
    cy.checkCsrf("/users/Bichard01/edit", "POST").then(() => done())
  })

  it("should have the email and username text input fields readonly", () => {
    cy.login("bichard02@example.com", "password")
    cy.visit("users/Bichard02/edit")
    cy.get('input[value="bichard02@example.com"]').invoke("attr", "readonly").should("eq", "readonly")
    cy.get('input[value="Bichard02"]').invoke("attr", "readonly").should("eq", "readonly")
  })

  it("should show the correct values for groups select input when on the edit user page", () => {
    cy.login("bichard02@example.com", "password")
    cy.task("selectFromGroupsTable").then((groups) => {
      const currentUserGroups = getCurrentUserGroups(groups)

      cy.visit("users/Bichard01/edit")
      cy.get('[data-test="checkbox-user-groups"]')
        .find('[data-test="checkbox-multiselect-checkboxes"]')
        .find("input")
        .should("have.length", currentUserGroups.length)
      cy.get('[data-test="checkbox-user-groups"]')
        .find('[data-test="checkbox-multiselect-checkboxes"]')
        .find("input")
        .each(($el, index) => {
          cy.wrap($el.id).eq("have.value", currentUserGroups[index].id)
          cy.wrap($el).contains(currentUserGroups[index].name)
        })
    })
  })
})
