import jwt from "jsonwebtoken"

const tokenSecret = "OliverTwist"

const generateNewPasswordToken = (emailAddress, verificationCode) =>
  jwt.sign({ emailAddress, verificationCode }, tokenSecret, { issuer: "Bichard" })

describe("User", () => {
  describe("Display list of users", () => {
    beforeEach(() => {
      cy.task("deleteFromUsersTable")
      cy.task("insertIntoUsersTable")
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
      cy.get("tbody tr:nth-child(2) td:nth-child(4)").should("have.text", "0800 111 222")
      cy.get("tbody tr:nth-child(2) td:nth-child(5)").should("have.text", "bichard02@example.com")

      cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Bichard03")
      cy.get("tbody tr:nth-child(3) td:nth-child(2)").should("have.text", "Bichard User 03")
      cy.get("tbody tr:nth-child(3) td:nth-child(3)").should("have.text", "Surname 03")
      cy.get("tbody tr:nth-child(3) td:nth-child(4)").should("have.text", "0800 111 222")
      cy.get("tbody tr:nth-child(3) td:nth-child(5)").should("have.text", "bichard03@example.com")
    })

    it("should display the correct list of users when using the filter", () => {
      cy.visit("/users")
      cy.get('input[id="filter"]').type("Bichard02")
      cy.get('button[id="filter"]').click()
      cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard02")
      cy.get("tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "Bichard User 02")
      cy.get("tbody tr:nth-child(1) td:nth-child(3)").should("have.text", "Surname 02")
      cy.get("tbody tr:nth-child(1) td:nth-child(4)").should("have.text", "0800 111 222")
      cy.get("tbody tr:nth-child(1) td:nth-child(5)").should("have.text", "bichard02@example.com")

      cy.get('input[id="filter"]').focus().clear()
      cy.get('input[id="filter"]').type("bichard03")
      cy.get('button[id="filter"]').click()
      cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard03")
      cy.get("tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "Bichard User 03")
      cy.get("tbody tr:nth-child(1) td:nth-child(3)").should("have.text", "Surname 03")

      cy.get("tbody tr:nth-child(1) td:nth-child(4)").should("have.text", "0800 111 222")
      cy.get("tbody tr:nth-child(1) td:nth-child(5)").should("have.text", "bichard03@example.com")
    })

    it("should display in paginated view when returning many users", () => {
      cy.task("deleteFromUsersTable")
      cy.task("insertManyIntoUsersTable")

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
  })

  describe("Creation of new user", () => {
    before(() => {
      cy.task("deleteFromUsersTable")
      cy.task("insertIntoUsersTable")
    })

    it("should be successful if all of the inputs are populated", () => {
      cy.visit("users/newUser")

      cy.get('input[id="username"]').type("Buser")
      cy.get('input[id="forenames"]').type("B forename")
      cy.get('input[id="surname"]').type("B surname")
      cy.get('input[id="phoneNumber"]').type("B phone")
      cy.get('input[id="emailAddress"]').type("bichardemail1@example.com")

      cy.get('input[id="postalAddress"]').type("B Address")
      cy.get('input[id="postCode"]').type("B Code")
      cy.get('input[id="endorsedBy"]').type("B Endorsed")
      cy.get('input[id="orgServes"]').type("B organisation")

      cy.get("button").click()
      cy.get("h3").should("have.text", "User Buser has been successfully created")
    })

    it("should allow user to generate a random password", () => {
      const emailAddress = "bichardemail1@example.com"
      cy.task("getPasswordResetCode", emailAddress).then((passwordResetCode) => {
        const newPasswordToken = generateNewPasswordToken(emailAddress, passwordResetCode)
        cy.visit(`/login/new-password?token=${newPasswordToken}`)
        cy.get("body").contains(/first time password setup/i)
        cy.get(".govuk-hint").should("be.empty")
        cy.get("a[class=govuk-link]").click()
        cy.get(".govuk-hint").should("not.be.empty")
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
        cy.get('span[id="event-name-error"]').should(
          "have.text",
          "Password contains user specific sensitive information. Please choose another one"
        )
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

    it("should not possible for the new user to set their password if it is not secure enough", () => {
      const emailAddress = "bichardemail1@example.com"
      const newPassword = "shorty"
      cy.task("getPasswordResetCode", emailAddress).then((passwordResetCode) => {
        const newPasswordToken = generateNewPasswordToken(emailAddress, passwordResetCode)
        cy.visit(`/login/new-password?token=${newPasswordToken}`)
        cy.get("input[type=password][name=newPassword]").type(newPassword)
        cy.get("input[type=password][name=confirmPassword]").type(newPassword)
        cy.get("button[type=submit]").click()
        cy.get('span[id="event-name-error"]').should("have.text", "Password is too short")
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
        cy.get('span[id="event-name-error"]').should("have.text", "Invalid or expired verification code")
      })
    })

    it("should show a newly-created user in the list of users", () => {
      cy.visit("users")

      cy.get("tbody tr:nth-child(4) td:nth-child(1)").should("have.text", "Buser")
      cy.get("tbody tr:nth-child(4) td:nth-child(2)").should("have.text", "B forename")
      cy.get("tbody tr:nth-child(4) td:nth-child(3)").should("have.text", "B surname")
      cy.get("tbody tr:nth-child(4) td:nth-child(4)").should("have.text", "B phone")
      cy.get("tbody tr:nth-child(4) td:nth-child(5)").should("have.text", "bichardemail1@example.com")
    })

    it("doesn't update other users when a new user is created", () => {
      cy.visit("users")

      cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard01")
      cy.get("tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "Bichard User 01")
      cy.get("tbody tr:nth-child(1) td:nth-child(3)").should("have.text", "Surname 01")
      cy.get("tbody tr:nth-child(1) td:nth-child(4)").should("have.text", "0800 111 222")
      cy.get("tbody tr:nth-child(1) td:nth-child(5)").should("have.text", "bichard01@example.com")

      cy.get("tbody tr:nth-child(2) td:nth-child(1)").should("have.text", "Bichard02")
      cy.get("tbody tr:nth-child(2) td:nth-child(2)").should("have.text", "Bichard User 02")
      cy.get("tbody tr:nth-child(2) td:nth-child(3)").should("have.text", "Surname 02")
      cy.get("tbody tr:nth-child(2) td:nth-child(4)").should("have.text", "0800 111 222")
      cy.get("tbody tr:nth-child(2) td:nth-child(5)").should("have.text", "bichard02@example.com")

      cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Bichard03")
      cy.get("tbody tr:nth-child(3) td:nth-child(2)").should("have.text", "Bichard User 03")
      cy.get("tbody tr:nth-child(3) td:nth-child(3)").should("have.text", "Surname 03")
      cy.get("tbody tr:nth-child(3) td:nth-child(4)").should("have.text", "0800 111 222")
      cy.get("tbody tr:nth-child(3) td:nth-child(5)").should("have.text", "bichard03@example.com")
    })

    it("should fail if previously used username is given", () => {
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
      cy.get('span[id="event-name-error"]').should("have.text", "Username Bichard01 already exists")
    })

    it("should respond with forbidden response code when CSRF tokens are invalid in new user page", (done) => {
      cy.checkCsrf("/users/newUser", "POST").then(() => done())
    })
  })
})
