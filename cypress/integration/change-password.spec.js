describe("Change password", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      cy.task("deleteFromUsersTable")
      cy.task("insertIntoUsersTable")
      cy.clearCookies()
    })

    it("should prompt the user that password change was successful when provided password is valid", () => {
      const emailAddress = "bichard01@example.com"
      const newPassword = "Test@123456"
      cy.login("bichard01@example.com", "password")
      cy.visit("/account/change-password")
      cy.get("body").contains(/change password/i)
      cy.get("input[type=password][name=currentPassword]").type("password")
      cy.get("input[type=password][name=newPassword]").type(newPassword)
      cy.get("input[type=password][name=confirmPassword]").type(newPassword)
      cy.get("button[type=submit]").click()
      cy.get("body").contains(/You can now sign in with your new password./i)

      // Note: Although we avoid waits in cypress test as the logic implemented is temporal in nature we can consider this OK
      /* eslint-disable-next-line cypress/no-unnecessary-waiting */
      cy.wait(10000)
      cy.login(emailAddress, newPassword)
    })

    it("should not allow submission when passwords are too short", () => {
      cy.login("bichard01@example.com", "password")
      cy.visit("/account/change-password")
      cy.get("body").contains(/change password/i)
      cy.get("input[type=password][name=currentPassword]").type("password")
      cy.get("input[type=password][name=newPassword]").type("shorty")
      cy.get("input[type=password][name=confirmPassword]").type("shorty")
      cy.get("button[type=submit]").click()
      cy.get('span[id="event-name-error"]').should("have.text", "Password is too short.")
    })

    it("should not allow submission when password is empty", () => {
      cy.login("bichard01@example.com", "password")
      cy.visit("/account/change-password")
      cy.get("body").contains(/change password/i)
      cy.get("button[type=submit]").click()
      cy.get('span[id="event-name-error"]').should("have.text", "Passwords cannot be empty.")
    })

    it("should not allow submission when passwords do not match", () => {
      cy.login("bichard01@example.com", "password")
      cy.visit("/account/change-password")
      cy.get("body").contains(/change password/i)
      cy.get("input[type=password][name=currentPassword]").type("password")
      cy.get("input[type=password][name=newPassword]").type("NewPassowrd")
      cy.get("input[type=password][name=confirmPassword]").type("DifferentNewPassword")
      cy.get("button[type=submit]").click()
      cy.get('span[id="event-name-error"]').should("have.text", "Passwords do not match.")
    })

    it("should allow user to generate a random password", () => {
      cy.login("bichard01@example.com", "password")
      cy.visit("/account/change-password")
      cy.get("body").contains(/change password/i)
      cy.get(".govuk-inset-text").should("not.exist")
      cy.get("a[class=govuk-link]").click()
      cy.get(".govuk-inset-text").should("not.be.empty")
    })

    it("should redirect to login page if user is not logged in", () => {
      cy.visit("/account/change-password")
      cy.url().should("contain", "/login")
    })

    it("should respond with forbidden response code when CSRF tokens are invalid", () => {
      cy.login("bichard01@example.com", "password")
      cy.checkCsrf("/account/change-password", "POST")
    })
  })
})
