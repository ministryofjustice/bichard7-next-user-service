describe("Edit user", () => {
  beforeEach(() => {
    cy.task("deleteFromUsersTable")
    cy.task("deleteFromGroupsTable")
    cy.task("insertIntoUsersAndGroupsTable")
  })

  it("should display correct user details when navigating to the edit user page", () => {
    const emailAddress = "bichard01@example.com"
    cy.visit("users/Bichard01")
    cy.get('a[data-test="edit-user-view"]').click()

    cy.task("selectFromUsersTable", emailAddress).then((user) => {
      cy.task("selectFromGroupsTable", "user_id", user.id).then((groups) => {
        cy.get('input[id="username"]').should("have.value", "Bichard01")
        cy.get('input[id="forenames"]').should("have.value", "Bichard User 01")
        cy.get('input[id="endorsedBy"]').should("have.value", "endorsed_by 01")
        cy.get('input[id="orgServes"]').should("have.value", "org_severs 01")
        cy.get(`select option[value=${groups[0].id}]`).contains(groups[0].name)
      })
    })
  })

  it("should update user correctly when updating user details", () => {
    cy.visit("users/Bichard01")
    cy.get('a[data-test="edit-user-view"]').click()
    cy.get('input[id="forenames"]').clear()
    cy.get('input[id="forenames"]').type("forename change 01")
    cy.get('input[id="endorsedBy"]').clear()
    cy.get('input[id="endorsedBy"]').type("change endorsed_by")
    cy.get('input[id="orgServes"]').clear()
    cy.get('input[id="orgServes"]').type("org change 02")
    cy.get("select").select("B7ExceptionHandler_grp")
    cy.get('button[type="submit"]').click()

    cy.task("selectFromUsersTable", "bichard01@example.com").then((user) => {
      cy.task("selectFromGroupsTable", "user_id", user.id).then((groups) => {
        cy.get('input[id="username"]').should("have.value", "Bichard01")
        cy.get('input[id="forenames"]').should("have.value", "forename change 01")
        cy.get('input[id="emailAddress"]').should("have.value", "bichard01@example.com")
        cy.get('input[id="endorsedBy"]').should("have.value", "change endorsed_by")
        cy.get('input[id="orgServes"]').should("have.value", "org change 02")
        cy.get(`select option[value=${groups[0].id}]`).contains(groups[0].name)
      })
    })
  })

  it("should invalidate form correctly when form in not valid", () => {
    cy.visit("users/Bichard01")
    cy.get('a[data-test="edit-user-view"]').click()
    cy.get('input[id="forenames"]').clear()
    cy.get('input[id="surname"]').clear()
    cy.get('button[type="submit"]').click()
    cy.get("div.govuk-error-summary").contains("Forenames is mandatory")
    cy.get("div.govuk-error-summary").contains("Surname is mandatory")
  })

  it("should respond with forbidden response code when CSRF tokens are invalid in edit page", (done) => {
    cy.checkCsrf("/users/Bichard01/edit", "POST").then(() => done())
  })

  it("should have the email and username text input fields readonly", () => {
    cy.visit("users/Bichard02/edit")
    cy.get('input[value="bichard02@example.com"]').invoke("attr", "readonly").should("eq", "readonly")
    cy.get('input[value="Bichard02"]').invoke("attr", "readonly").should("eq", "readonly")
  })

  it("should show the correct values for groups select input when on the edit user page", () => {
    cy.task("selectFromGroupsTable").then((groups) => {
      cy.visit("users/Bichard01/edit")
      cy.get('select[id="groupId"] option').each(($el, index) => {
        cy.wrap($el).should("have.value", groups[index].id)
        cy.wrap($el).contains(groups[index].name)
      })
    })
  })
})
