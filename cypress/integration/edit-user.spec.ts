describe("Edit user", () => {
  before(async () => {
    await cy.task("seedUsers")
  })

  it("should display correct user details when navigating to the edit user page", () => {
    cy.visit("users/Bichard01")
    cy.get('a[data-test="edit-user-view"]').click()

    cy.get('input[id="username"]').should("have.value", "Bichard01")
    cy.get('input[id="forenames"]').should("have.value", "Bichard User 01")
    cy.get('input[id="phoneNumber"]').should("have.value", "0800 111 222")
    cy.get('input[id="emailAddress"]').should("have.value", "bichard01@example.com")
    cy.get('input[id="postalAddress"]').should("have.value", "address 01")
    cy.get('input[id="postCode"]').should("have.value", "SE1 0EF")
    cy.get('input[id="endorsedBy"]').should("have.value", "endorsed_by 01")
    cy.get('input[id="orgServes"]').should("have.value", "org_severs 01")
  })

  it("should update user correctly when updating user details", () => {
    cy.visit("users/Bichard01")
    cy.get('a[data-test="edit-user-view"]').click()
    cy.get('input[id="username"]').clear()
    cy.get('input[id="username"]').type("Bichard 06")
    cy.get('input[id="forenames"]').clear()
    cy.get('input[id="forenames"]').type("forename change 01")
    cy.get('input[id="phoneNumber"]').clear()
    cy.get('input[id="phoneNumber"]').type("0300 111 222")
    cy.get('input[id="emailAddress"]').clear()
    cy.get('input[id="emailAddress"]').type("change-email@example.com")
    cy.get('input[id="postalAddress"]').clear()
    cy.get('input[id="postalAddress"]').type("change postal address")
    cy.get('input[id="postCode"]').clear()
    cy.get('input[id="postCode"]').type("WWW 123")
    cy.get('input[id="endorsedBy"]').clear()
    cy.get('input[id="endorsedBy"]').type("change endorsed_by")
    cy.get('input[id="orgServes"]').clear()
    cy.get('input[id="orgServes"]').type("org change 02")
    cy.get('button[type="submit"]').click()

    cy.get('input[id="username"]').should("have.value", "Bichard 06")
    cy.get('input[id="forenames"]').should("have.value", "forename change 01")
    cy.get('input[id="phoneNumber"]').should("have.value", "0300 111 222")
    cy.get('input[id="emailAddress"]').should("have.value", "change-email@example.com")
    cy.get('input[id="postalAddress"]').should("have.value", "change postal address")
    cy.get('input[id="postCode"]').should("have.value", "WWW 123")
    cy.get('input[id="endorsedBy"]').should("have.value", "change endorsed_by")
    cy.get('input[id="orgServes"]').should("have.value", "org change 02")
  })

  it("should invalidate form correctly when form in not valid", () => {
    cy.visit("users/Bichard 06")
    cy.get('a[data-test="edit-user-view"]').click()
    cy.get('input[id="username"]').clear()
    cy.get('input[id="username"]').type("Bichard02")
    cy.get('button[type="submit"]').click()
    cy.get('span[id="event-name-error"]').contains("This user name has been taken please enter another")
  })

  it("should respond with forbidden response code when CSRF tokens are invalid in edit page", (done) => {
    cy.checkCsrf("/users/Bichard01/edit", "POST").then(() => done())
  })
})
