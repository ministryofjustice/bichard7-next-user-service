import { generateNewPasswordToken } from "../helpers/tokens"

describe("Creation of new user", () => {
  before(() => {
    cy.task("deleteFromUsersTable")
    cy.task("deleteFromGroupsTable")
    cy.task("deleteFromUsersGroupsTable")
    cy.task("insertIntoGroupsTable")
    cy.task("insertIntoUsersTable")
  })

  it("should be successful and stay on add user page if all of the inputs are populated", () => {
    cy.visit("users/new-user")

    cy.get('input[id="username"]').type("Buser")
    cy.get('input[id="forenames"]').type("B forename")
    cy.get('input[id="surname"]').type("B surname")
    cy.get('input[id="emailAddress"]').type("bichardemail1@example.com")
    cy.get('input[id="endorsedBy"]').type("B Endorsed")
    cy.get('input[id="orgServes"]').type("B organisation")

    cy.get("button[name=saveAndAddAnother]").click()
    cy.get("h3").should("have.text", "User Buser has been successfully created.")
  })

  it("should be successful and navigate to users page if all of the inputs are populated", () => {
    cy.visit("users/new-user")

    cy.get('input[id="username"]').type("Buser2")
    cy.get('input[id="forenames"]').type("B forename")
    cy.get('input[id="surname"]').type("B surname")
    cy.get('input[id="emailAddress"]').type("bichardemail2@example.com")
    cy.get('input[id="endorsedBy"]').type("B Endorsed")
    cy.get('input[id="orgServes"]').type("B organisation")

    cy.get("button[name=save]").click()
    cy.url().should("contain", "/users")
    cy.get("h3").should("have.text", "User created successfully.")
    cy.get("h1").should("have.text", "Users")
  })

  it("should allow user to generate a random password", () => {
    const emailAddress = "bichardemail1@example.com"
    cy.task("getPasswordResetCode", emailAddress).then((passwordResetCode) => {
      const newPasswordToken = generateNewPasswordToken(emailAddress, passwordResetCode)
      cy.visit(`/login/new-password?token=${newPasswordToken}`)
      cy.get("body").contains(/first time password setup/i)
      cy.get(".govuk-inset-text").should("not.exist")
      cy.get("a[class=govuk-link]").click()
      cy.get(".govuk-inset-text").should("not.be.empty")
    })
  })

  it("should not possible for the new user to set their password if it contains sensitive information", () => {
    const emailAddress = "bichardemail1@example.com"
    const newPassword = "bichardemail1"
    cy.task("getPasswordResetCode", emailAddress).then((passwordResetCode) => {
      const newPasswordToken = generateNewPasswordToken(emailAddress, passwordResetCode)
      cy.visit(`/login/new-password?token=${newPasswordToken}`)
      cy.get("input[type=password][name=newPassword]").type(newPassword)
      cy.get("input[type=password][name=confirmPassword]").type(newPassword)
      cy.get("button[type=submit]").click()
      cy.get("div.govuk-error-summary").contains("Password contains personal information.")
    })
  })

  it("should allow the new user to set their password via a link", () => {
    const emailAddress = "bichardemail1@example.com"
    const newPassword = "Test@123456"
    cy.task("getPasswordResetCode", emailAddress).then((passwordResetCode) => {
      const newPasswordToken = generateNewPasswordToken(emailAddress, passwordResetCode)
      cy.visit(`/login/new-password?token=${newPasswordToken}`)
      cy.get("input[type=password][name=newPassword]").type(newPassword)
      cy.get("input[type=password][name=confirmPassword]").type(newPassword)
      cy.get("button[type=submit]").click()
      cy.get("h3").should("have.text", "You can now sign in with your new password.")
    })
  })

  it("should not possible for the new user to set their password if it is too short", () => {
    const emailAddress = "bichardemail1@example.com"
    const newPassword = "shorty"
    cy.task("getPasswordResetCode", emailAddress).then((passwordResetCode) => {
      const newPasswordToken = generateNewPasswordToken(emailAddress, passwordResetCode)
      cy.visit(`/login/new-password?token=${newPasswordToken}`)
      cy.get("input[type=password][name=newPassword]").type(newPassword)
      cy.get("input[type=password][name=confirmPassword]").type(newPassword)
      cy.get("button[type=submit]").click()
      cy.get("div.govuk-error-summary").contains("Password is too short.")
    })
  })

  it("should not possible for the new user to set their password if it is banned", () => {
    const emailAddress = "bichardemail1@example.com"
    const newPassword = "password"
    cy.task("getPasswordResetCode", emailAddress).then((passwordResetCode) => {
      const newPasswordToken = generateNewPasswordToken(emailAddress, passwordResetCode)
      cy.visit(`/login/new-password?token=${newPasswordToken}`)
      cy.get("input[type=password][name=newPassword]").type(newPassword)
      cy.get("input[type=password][name=confirmPassword]").type(newPassword)
      cy.get("button[type=submit]").click()
      cy.get("div.govuk-error-summary").contains("Password is too easy to guess.")
    })
  })

  it("should respond with forbidden response code when CSRF tokens are invalid in new password page", (done) => {
    const emailAddress = "bichardemail1@example.com"
    cy.task("getPasswordResetCode", emailAddress).then((passwordResetCode) => {
      const newPasswordToken = generateNewPasswordToken(emailAddress, passwordResetCode)
      cy.checkCsrf(`/login/new-password?token=${newPasswordToken}`, "POST").then(() => done())
    })
  })

  it("should not possible for the new user to set their password a second time using the same link", () => {
    const emailAddress = "bichardemail1@example.com"
    const newPassword = "Test@123456"
    cy.task("getPasswordResetCode", emailAddress).then((passwordResetCode) => {
      const newPasswordToken = generateNewPasswordToken(emailAddress, passwordResetCode)
      cy.visit(`/login/new-password?token=${newPasswordToken}`)
      cy.get("input[type=password][name=newPassword]").type(newPassword)
      cy.get("input[type=password][name=confirmPassword]").type(newPassword)
      cy.get("button[type=submit]").click()
      cy.get("div.govuk-error-summary").contains("Invalid or expired verification code.")
    })
  })

  it("should show a newly-created user in the list of users", () => {
    cy.visit("users")

    cy.get("tbody tr:nth-child(4) td:nth-child(1)").should("have.text", "Buser")
    cy.get("tbody tr:nth-child(4) td:nth-child(2)").should("have.text", "B forename")
    cy.get("tbody tr:nth-child(4) td:nth-child(3)").should("have.text", "B surname")
    cy.get("tbody tr:nth-child(4) td:nth-child(4)").should("have.text", "bichardemail1@example.com")
  })

  it("doesn't update other users when a new user is created", () => {
    cy.visit("users")

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

  it("should fail if previously used username is given", () => {
    cy.visit("users/new-user")

    cy.get('input[id="username"]').type("Bichard01")
    cy.get('input[id="forenames"]').type("B forename")
    cy.get('input[id="surname"]').type("B surname")
    cy.get('input[id="emailAddress"]').type("bemail2@example.com")
    cy.get('input[id="endorsedBy"]').type("B Endorsed")
    cy.get('input[id="orgServes"]').type("B organisation")

    cy.get("button[name=saveAndAddAnother]").click()
    cy.get("div.govuk-error-summary").contains("Username Bichard01 already exists.")
  })

  it("should respond with forbidden response code when CSRF tokens are invalid in new user page", (done) => {
    cy.checkCsrf("/users/new-user", "POST").then(() => done())
  })

  it("should show the correct values for groups select input when on the create new user page", () => {
    cy.task("selectFromGroupsTable").then((groups) => {
      cy.visit("users/new-user")
      cy.get('select[id="groupId"] option').each(($el, index) => {
        cy.wrap($el).should("have.value", groups[index].id)
        cy.wrap($el).contains(groups[index].name)
      })
    })
  })

  it("should assign the correct group to a newly created user", () => {
    const emailAddress = "bemailzz@example.com"

    cy.task("deleteFromUsersTable")
    cy.task("deleteFromGroupsTable")
    cy.task("deleteFromUsersGroupsTable")
    cy.task("insertIntoGroupsTable")

    cy.visit("users/new-user")

    cy.get('input[id="username"]').type("Buserzz")
    cy.get('input[id="forenames"]').type("B forename zz")
    cy.get('input[id="surname"]').type("B surname zzz")
    cy.get('input[id="emailAddress"]').type(emailAddress)
    cy.get('input[id="endorsedBy"]').type("B Endorsed zz")
    cy.get('input[id="orgServes"]').type("B organisation zz")
    cy.get("select").select("B7ExceptionHandler_grp")
    cy.get("button[name=save]").click()

    cy.task("selectFromUsersGroupsTable").then((usersGroups) => {
      cy.task("selectFromGroupsTable").then((groups) => {
        cy.task("selectFromUsersTable", emailAddress).then((user) => {
          expect(user.id).to.equal(usersGroups[0].user_id)
          expect(groups[2].id).to.equal(usersGroups[0].group_id)
        })
      })
    })
  })
})
