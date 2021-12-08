import { generateNewPasswordToken } from "../helpers/tokens"

describe("Creation of new user", () => {
  before(() => {
    cy.task("deleteFromUsersTable")
    cy.task("deleteFromGroupsTable")
    cy.task("deleteFromUsersGroupsTable")
    cy.task("insertIntoGroupsTable")
    cy.task("insertIntoUsersTable")
    cy.task("insertIntoUserGroupsTable", {
      email: "bichard01@example.com",
      groups: ["B7UserManager_grp", "B7Supervisor_grp"]
    })
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce(".AUTH")
  })

  it("should be successful and stay on add user page if all of the inputs are populated", () => {
    cy.login("bichard01@example.com", "password")
    cy.visit("users/new-user")

    cy.get('input[id="username"]').type("Buser")
    cy.get('input[id="forenames"]').type("B forename")
    cy.get('input[id="surname"]').type("B surname")
    cy.get('input[id="emailAddress"]').type("bichardemail1@example.com")
    cy.get('input[id="endorsedBy"]').type("B Endorsed")
    cy.get('input[id="orgServes"]').type("B organisation")
    cy.get('input[id="visibleForces001"]').check()
    cy.get('input[id="visibleForces004"]').check()
    cy.get('input[id="visibleCourts"]').type("B01,B41ME00")

    cy.get('span[data-test="included-triggers"]').click()
    cy.get('input[id="excludedTriggersTRPR0001"]').uncheck()

    cy.get("button[name=saveAndAddAnother]").click()
    cy.get('[data-test="success-banner_heading"]').should("have.text", "User Buser has been successfully created.")
  })

  it("should be successful and navigate to users page if all of the inputs are populated", () => {
    cy.visit("users/new-user")

    cy.get('input[id="username"]').type("Buser2")
    cy.get('input[id="forenames"]').type("B forename")
    cy.get('input[id="surname"]').type("B surname")
    cy.get('input[id="emailAddress"]').type("bichardemail2@example.com")
    cy.get('input[id="endorsedBy"]').type("B Endorsed")
    cy.get('input[id="orgServes"]').type("B organisation")
    cy.get('input[id="visibleForces001"]').check()
    cy.get('input[id="visibleForces004"]').check()
    cy.get('input[id="visibleCourts"]').type("B01,B41ME00")

    cy.get('span[data-test="included-triggers"]').click()
    cy.get('input[id="excludedTriggersTRPR0001"]').uncheck()

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

  it("should not allow the new user to set their password if it contains sensitive information", () => {
    const emailAddress = "bichardemail1@example.com"
    const newPassword = "bichardemail1"
    cy.task("getPasswordResetCode", emailAddress).then((passwordResetCode) => {
      const newPasswordToken = generateNewPasswordToken(emailAddress, passwordResetCode)
      cy.visit(`/login/new-password?token=${newPasswordToken}`)
      cy.get("input[type=password][name=newPassword]").type(newPassword)
      cy.get("input[type=password][name=confirmPassword]").type(newPassword)
      cy.get("button[type=submit]").click()
      cy.get('[data-test="error-summary"]').contains("Password contains personal information.")
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
      cy.get('[data-test="success-banner_heading"]').should("have.text", "You can now sign in with your new password.")
    })
  })

  it("should fail to set password and provide new user with feedback when password is too short", () => {
    const emailAddress = "bichardemail1@example.com"
    const newPassword = "shorty"
    cy.task("getPasswordResetCode", emailAddress).then((passwordResetCode) => {
      const newPasswordToken = generateNewPasswordToken(emailAddress, passwordResetCode)
      cy.visit(`/login/new-password?token=${newPasswordToken}`)
      cy.get("input[type=password][name=newPassword]").type(newPassword)
      cy.get("input[type=password][name=confirmPassword]").type(newPassword)
      cy.get("button[type=submit]").click()
      cy.get('[data-test="error-summary"]').contains("Password is too short.")
    })
  })

  it("should fail to set password and provide new user with feedback when password is banned", () => {
    const emailAddress = "bichardemail1@example.com"
    const newPassword = "password"
    cy.task("getPasswordResetCode", emailAddress).then((passwordResetCode) => {
      const newPasswordToken = generateNewPasswordToken(emailAddress, passwordResetCode)
      cy.visit(`/login/new-password?token=${newPasswordToken}`)
      cy.get("input[type=password][name=newPassword]").type(newPassword)
      cy.get("input[type=password][name=confirmPassword]").type(newPassword)
      cy.get("button[type=submit]").click()
      cy.get('[data-test="error-summary"]').contains("Password is too easy to guess.")
    })
  })

  it("should respond with forbidden response code when CSRF tokens are invalid in new password page", (done) => {
    const emailAddress = "bichardemail1@example.com"
    cy.task("getPasswordResetCode", emailAddress).then((passwordResetCode) => {
      const newPasswordToken = generateNewPasswordToken(emailAddress, passwordResetCode)
      cy.checkCsrf(`/login/new-password?token=${newPasswordToken}`, "POST").then(() => done())
    })
  })

  it("should fail to set password and provide feedback when new user tries to set password a second time using the same link", () => {
    const emailAddress = "bichardemail1@example.com"
    const newPassword = "Test@123456"
    cy.task("getPasswordResetCode", emailAddress).then((passwordResetCode) => {
      const newPasswordToken = generateNewPasswordToken(emailAddress, passwordResetCode)
      cy.visit(`/login/new-password?token=${newPasswordToken}`)
      cy.get("input[type=password][name=newPassword]").type(newPassword)
      cy.get("input[type=password][name=confirmPassword]").type(newPassword)
      cy.get("button[type=submit]").click()
      cy.get('[data-test="error-summary"]').contains("Invalid or expired verification code.")
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
    cy.get('input[id="visibleForces001"]').check()

    cy.get("button[name=saveAndAddAnother]").click()
    cy.get('[data-test="error-summary"]').contains("Username Bichard01 already exists.")
  })

  it("should fail if no force is selected for user", () => {
    // Given
    cy.visit("users/new-user")

    cy.get('input[id="username"]').type("Bichard01")
    cy.get('input[id="forenames"]').type("B forename")
    cy.get('input[id="surname"]').type("B surname")
    cy.get('input[id="emailAddress"]').type("bemail2@example.com")
    cy.get('input[id="endorsedBy"]').type("B Endorsed")
    cy.get('input[id="orgServes"]').type("B organisation")

    // When
    cy.get("button[name=saveAndAddAnother]").click()

    // Then
    cy.get('[data-test="error-summary"]').contains("Please ensure that user is assigned to least one force.")
  })

  it("should show the correct values for groups select input when on the create new user page", () => {
    cy.task("selectFromGroupsTable").then((groups) => {
      const userGroups = groups.filter((g) => g.name === "B7Supervisor_grp" || g.name === "B7UserManager_grp")
      cy.visit("users/new-user")
      cy.get('[data-test="checkbox-user-groups"]')
        .find('[data-test="checkbox-multiselect-checkboxes"]')
        .each(($el, index) => {
          cy.wrap($el).find(`input[id=${userGroups[index].id}]`).should("exist")
          cy.wrap($el).find("label").contains(userGroups[index].friendly_name)
        })
    })
  })

  it("should assign the correct group to a newly created user", () => {
    const emailAddress = "bemailzz@example.com"

    cy.visit("users/new-user")

    cy.get('input[id="username"]').type("Buserzz")
    cy.get('input[id="forenames"]').type("B forename zz")
    cy.get('input[id="surname"]').type("B surname zzz")
    cy.get('input[id="emailAddress"]').type(emailAddress)
    cy.get('input[id="endorsedBy"]').type("B Endorsed zz")
    cy.get('input[id="orgServes"]').type("B organisation zz")
    cy.get('input[id="visibleForces001"]').check()
    cy.get('input[id="visibleForces004"]').check()
    cy.get('input[id="visibleCourts"]').type("B01,B41ME00")
    cy.get('span[data-test="included-triggers"]').click()
    cy.get('input[id="excludedTriggersTRPR0001"]').uncheck()
    cy.get('[data-test="checkbox-user-groups"]')
      .find('[data-test="checkbox-multiselect-checkboxes"]')
      .find(`input[name="B7UserManager_grp"]`)
      .check()
    cy.get("button[name=save]").click()

    cy.task("selectFromUsersGroupsTable").then((usersGroups) => {
      cy.task("selectFromGroupsTable").then((groups) => {
        const selectedGroup = groups.filter((g) => g.name === "B7UserManager_grp")[0]
        cy.task("selectFromUsersTable", emailAddress).then((user) => {
          const userGroups = usersGroups.filter((u) => u.user_id === user.id)
          expect(user.id).to.equal(userGroups[0].user_id)
          expect(userGroups[0].group_id).to.equal(selectedGroup.id)
          expect(user.visible_forces).to.equal("001,004")
          expect(user.visible_courts).to.equal("B01,B41ME00")
          expect(user.excluded_triggers).to.equal("TRPR0001")
        })
      })
    })
  })

  it("should show a user-friendly validation error message when username contains a forbidden character", () => {
    // Given
    cy.visit("users/new-user")
    cy.get('input[id="username"]').type("B%user2")
    cy.get('input[id="forenames"]').type("B forename")
    cy.get('input[id="surname"]').type("B surname")
    cy.get('input[id="emailAddress"]').type("bichardemail2@example.com")
    cy.get('input[id="endorsedBy"]').type("B Endorsed")
    cy.get('input[id="orgServes"]').type("B organisation")
    cy.get('input[id="visibleForces001"]').check()
    cy.get('input[id="visibleForces004"]').check()
    cy.get('input[id="visibleCourts"]').type("B01,B41ME00")

    cy.get('span[data-test="included-triggers"]').click()
    cy.get('input[id="excludedTriggersTRPR0001"]').uncheck()

    // When
    cy.get("button[name=save]").click()

    // Then
    const errorMessage =
      "Your username may only contain letters, numbers, dots (.), hyphens(-) and/or underscores (_), your username must also begin and end with a letter or a number"

    // The summary should contain the validation error
    cy.get('[data-test="error-summary"]').should("be.visible").contains(errorMessage)

    // The validation error should be inline with the text input
    cy.get('[data-test="text-input_username-error"]').should("be.visible").contains(errorMessage)
  })

  it("should show a user-friendly validation error message when email contains the cjsm domain", () => {
    // Given
    cy.visit("users/new-user")
    cy.get('input[id="username"]').type("Buser2")
    cy.get('input[id="forenames"]').type("B forename")
    cy.get('input[id="surname"]').type("B surname")
    cy.get('input[id="emailAddress"]').type("bichardemail2@example.cjsm.net")
    cy.get('input[id="endorsedBy"]').type("B Endorsed")
    cy.get('input[id="orgServes"]').type("B organisation")
    cy.get('input[id="visibleForces001"]').check()
    cy.get('input[id="visibleForces004"]').check()
    cy.get('input[id="visibleCourts"]').type("B01,B41ME00")

    cy.get('span[data-test="included-triggers"]').click()
    cy.get('input[id="excludedTriggersTRPR0001"]').uncheck()

    // When
    cy.get("button[name=save]").click()

    // Then
    const errorMessage = "The user's email address should not end with .cjsm.net"

    // The summary should contain the validation error
    cy.get('[data-test="error-summary"]').should("be.visible").contains(errorMessage)

    // The validation error should be inline with the text input
    cy.get('[data-test="text-input_emailAddress-error"]').should("be.visible").contains(errorMessage)
  })

  it("should respond with forbidden response code when CSRF tokens are invalid in new user page", (done) => {
    cy.checkCsrf("/users/new-user", "POST").then(() => done())
  })
})
