describe("Change password", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      cy.viewport(1280, 720)
    })

    it("should prompt the user that password change was successful when provided password is valid", (done) => {
      const emailAddress = "bichard01@example.com"
      const newPassword = "Test@123456"
      cy.seedUsersAndLogin("bichard01@example.com", "password").then(() => {
        cy.visit("/account/change-password")
        cy.get("body").contains(/change password/i)
        cy.get("input[type=password][name=currentPassword]").type("password")
        cy.get("input[type=password][name=newPassword]").type(newPassword)
        cy.get("input[type=password][name=confirmPassword]").type(newPassword)
        cy.get("button[type=submit]").click()
        cy.get("body").contains(/You can now sign in with your new password./i)
        cy.login(emailAddress, newPassword).then(() => done())
      })
    })

    it("should not allow submission when passwords are too short", (done) => {
      cy.seedUsersAndLogin("bichard01@example.com", "password").then(() => {
        cy.visit("/account/change-password")
        cy.get("body").contains(/change password/i)
        cy.get("input[type=password][name=currentPassword]").type("password")
        cy.get("input[type=password][name=newPassword]").type("shorty")
        cy.get("input[type=password][name=confirmPassword]").type("shorty")
        cy.get("button[type=submit]").click()
        cy.get('span[id="event-name-error"]').should("have.text", "Error: Password is too short")
        done()
      })
    })

    it("should not allow submission when password is empty", (done) => {
      cy.seedUsersAndLogin("bichard01@example.com", "password").then(() => {
        cy.visit("/account/change-password")
        cy.get("body").contains(/change password/i)
        cy.get("button[type=submit]").click()
        cy.get('span[id="event-name-error"]').should("have.text", "Error: Passwords cannot be empty")
        done()
      })
    })

    it("should not allow submission when passwords do not match", (done) => {
      cy.seedUsersAndLogin("bichard01@example.com", "password").then(() => {
        cy.visit("/account/change-password")
        cy.get("body").contains(/change password/i)
        cy.get("input[type=password][name=currentPassword]").type("password")
        cy.get("input[type=password][name=newPassword]").type("NewPassowrd")
        cy.get("input[type=password][name=confirmPassword]").type("DifferentNewPassword")
        cy.get("button[type=submit]").click()
        cy.get('span[id="event-name-error"]').should("have.text", "Error: Passwords are mismatching")
        done()
      })
    })

    it("should allow user to generate a random password", (done) => {
      cy.seedUsersAndLogin("bichard01@example.com", "password").then(() => {
        cy.visit("/account/change-password")
        cy.get("body").contains(/change password/i)
        cy.get(".govuk-hint").should("be.empty")
        cy.get("a[class=govuk-link]").click()
        cy.get(".govuk-hint").should("not.be.empty")
        done()
      })
    })

    it("should redirect to login page if user is not logged in", () => {
      cy.visit("/account/change-password")
      cy.url().should("contain", "/login")
    })

    it("should respond with forbidden response code when CSRF tokens are invalid", (done) => {
      cy.seedUsersAndLogin("bichard01@example.com", "password").then(() => {
        cy.checkCsrf("/account/change-password", "POST").then(() => done())
      })
    })
  })
})
