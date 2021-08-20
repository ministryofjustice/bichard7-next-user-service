import jwt from "jsonwebtoken"

const tokenSecret = "OliverTwist"

const generateNewPasswordToken = (emailAddress, verificationCode) =>
  jwt.sign({ emailAddress, verificationCode }, tokenSecret, { issuer: "Bichard" })

describe("User", () => {
  describe("Display list of users", () => {
    before(async () => {
      await cy.task("seedUsers")
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
      cy.get("tbody tr:nth-child(2) td:nth-child(4)").should("have.text", "0800 222 333")
      cy.get("tbody tr:nth-child(2) td:nth-child(5)").should("have.text", "bichard02@example.com")

      cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Bichard03")
      cy.get("tbody tr:nth-child(3) td:nth-child(2)").should("have.text", "Bichard User 03")
      cy.get("tbody tr:nth-child(3) td:nth-child(3)").should("have.text", "Surname 03")
      cy.get("tbody tr:nth-child(3) td:nth-child(4)").should("have.text", "0800 333 444")
      cy.get("tbody tr:nth-child(3) td:nth-child(5)").should("have.text", "bichard03@example.com")
    })

    it("should display the correct list of users when using the filter", () => {
      cy.visit("/users")
      cy.get('input[id="filter"]').type("Bichard02")
      cy.get('button[id="filter"]').click()
      cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard02")
      cy.get("tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "Bichard User 02")
      cy.get("tbody tr:nth-child(1) td:nth-child(3)").should("have.text", "Surname 02")
      cy.get("tbody tr:nth-child(1) td:nth-child(4)").should("have.text", "0800 222 333")
      cy.get("tbody tr:nth-child(1) td:nth-child(5)").should("have.text", "bichard02@example.com")

      cy.get('input[id="filter"]').type("bichard03")
      cy.get('button[id="filter"]').click()
      cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard03")
      cy.get("tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "Bichard User 03")
      cy.get("tbody tr:nth-child(1) td:nth-child(3)").should("have.text", "Surname 03")
      cy.get("tbody tr:nth-child(1) td:nth-child(4)").should("have.text", "0800 333 444")
      cy.get("tbody tr:nth-child(1) td:nth-child(5)").should("have.text", "bichard03@example.com")
    })
  })

  describe("Creation of new user", () => {
    before(async () => {
      await cy.task("seedUsers")
    })

    it("should be successful if all of the inputs are populated", () => {
      cy.visit("users/newUser")

      cy.get('input[id="username"]').type("Buser")
      cy.get('input[id="forenames"]').type("B forename")
      cy.get('input[id="surname"]').type("B surname")
      cy.get('input[id="phoneNumber"]').type("B phone")
      cy.get('input[id="emailAddress"]').type("bemail1@example.com")

      cy.get('input[id="postalAddress"]').type("B Address")
      cy.get('input[id="postCode"]').type("B Code")
      cy.get('input[id="endorsedBy"]').type("B Endorsed")
      cy.get('input[id="orgServes"]').type("B organisation")

      cy.get("button").click()
      cy.get("h3").should("have.text", "User Buser has been successfully created")
    })

    it("should allow the new user to set their password via a link", () => {
      const emailAddress = "bemail1@example.com"
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

    it("should not possible for the new user to set their password a second time using the same link", () => {
      const emailAddress = "bemail1@example.com"
      const newPassword = "Test@123456"
      cy.task("getPasswordResetCode", emailAddress).then((passwordResetCode) => {
        const newPasswordToken = generateNewPasswordToken(emailAddress, passwordResetCode)
        cy.visit(`/login/new-password?token=${newPasswordToken}`)
        cy.get("input[type=password][name=newPassword]").type(newPassword)
        cy.get("input[type=password][name=confirmPassword]").type(newPassword)
        cy.get("button[type=submit]").click()
        cy.get('span[id="event-name-error"]').should("have.text", "Error: Invalid or expired verification code")
      })
    })

    it("should show a newly-created user in the list of users", () => {
      cy.visit("users")

      cy.get("tbody tr:nth-child(4) td:nth-child(1)").should("have.text", "Buser")
      cy.get("tbody tr:nth-child(4) td:nth-child(2)").should("have.text", "B forename")
      cy.get("tbody tr:nth-child(4) td:nth-child(3)").should("have.text", "B surname")
      cy.get("tbody tr:nth-child(4) td:nth-child(4)").should("have.text", "B phone")
      cy.get("tbody tr:nth-child(4) td:nth-child(5)").should("have.text", "bemail1@example.com")
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
      cy.get("tbody tr:nth-child(2) td:nth-child(4)").should("have.text", "0800 222 333")
      cy.get("tbody tr:nth-child(2) td:nth-child(5)").should("have.text", "bichard02@example.com")

      cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Bichard03")
      cy.get("tbody tr:nth-child(3) td:nth-child(2)").should("have.text", "Bichard User 03")
      cy.get("tbody tr:nth-child(3) td:nth-child(3)").should("have.text", "Surname 03")
      cy.get("tbody tr:nth-child(3) td:nth-child(4)").should("have.text", "0800 333 444")
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
      cy.get('span[id="event-name-error"]').should("have.text", "Error: Username Bichard01 already exists")
    })

    it("should respond with forbidden response code when CSRF tokens are invalid in new user page", (done) => {
      cy.checkCsrf("/users/newUser", "POST").then(() => done())
    })
  })
})
