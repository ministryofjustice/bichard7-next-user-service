const user = {
  email: "bichard01@example.com"
}

describe("Reset password", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      cy.task("deleteFromUsersTable")
      cy.task("deleteFromGroupsTable")
      cy.task("insertIntoUsersAndGroupsTable")
      cy.viewport(1280, 720)
    })

    it("should send out email to reset password", () => {
      cy.visit("/login")
      cy.get("a[data-test='reset-password']").click()
      cy.get("body").contains(/reset password/i)
      cy.get("input[type=email]").type(user.email)
      cy.get("button[type=submit]").click()
      cy.get("body").contains(/sent you an email/i)
    })

    it("should ignore email case when resetting the password", () => {
      cy.visit("/login")
      cy.get("a[data-test='reset-password']").click()
      cy.get("body").contains(/reset password/i)
      cy.get("input[type=email]").type(user.email.toUpperCase())
      cy.get("button[type=submit]").click()
      cy.get("body").contains(/sent you an email/i)
    })

    it("should not allow submission when passwords are too short", () => {
      cy.visit(`/login/reset-password`)
      cy.get("input[name=emailAddress]").type(user.email)
      cy.get("button[type=submit]").click()
      cy.get("body").contains(/sent you an email/i)
      cy.task("getVerificationCode", user.email).then((verificationCode) => {
        cy.get("input#validationCode").type(verificationCode)
        cy.get("input#newPassword").type("shorty")
        cy.get("input[type=password][name=confirmPassword]").type("shorty")
        cy.get("button[type=submit]").click()
        cy.get('[data-test="error-summary"]').contains("Password is too short.")
      })
    })

    it("should not allow submission when passwords contain sensitive information", () => {
      cy.visit(`/login/reset-password`)
      cy.get("input[name=emailAddress]").type(user.email)
      cy.get("button[type=submit]").click()
      cy.get("body").contains(/sent you an email/i)
      cy.task("getVerificationCode", user.email).then((verificationCode) => {
        cy.get("input#validationCode").type(verificationCode)
        cy.get("input#newPassword").type("bichard01")
        cy.get("input[type=password][name=confirmPassword]").type("bichard01")
        cy.get("button[type=submit]").click()
        cy.get('[data-test="error-summary"]').contains("Password contains personal information.")
      })
    })

    it("should not allow submission when password is banned", () => {
      cy.visit(`/login/reset-password`)
      cy.get("input[name=emailAddress]").type(user.email)
      cy.get("button[type=submit]").click()
      cy.get("body").contains(/sent you an email/i)
      cy.task("getVerificationCode", user.email).then((verificationCode) => {
        cy.get("input#validationCode").type(verificationCode)
        cy.get("input#newPassword").type("123456789")
        cy.get("input[type=password][name=confirmPassword]").type("123456789")
        cy.get("button[type=submit]").click()
        cy.get('[data-test="error-summary"]').contains("Password is too easy to guess.")
      })
    })

    it("should prompt the user that password reset was successful when provided password is valid", () => {
      const newPassword = "Test@1234567"
      cy.visit(`/login/reset-password`)
      cy.get("input[name=emailAddress]").type(user.email)
      cy.get("button[type=submit]").click()
      cy.get("body").contains(/sent you an email/i)
      cy.task("getVerificationCode", user.email).then((verificationCode) => {
        cy.get("input#validationCode").type(verificationCode)
        cy.get("input#newPassword").type(newPassword)
        cy.get("input[type=password][name=confirmPassword]").type(newPassword)
        cy.get("button[type=submit]").click()
        cy.get("body").contains(/You can now sign in with your new password./i)
      })
    })

    it("should not allow submission when password is empty", () => {
      cy.visit(`/login/reset-password`)
      cy.get("input[name=emailAddress]").type(user.email)
      cy.get("button[type=submit]").click()
      cy.get("body").contains(/sent you an email/i)
      cy.task("getVerificationCode", user.email).then((verificationCode) => {
        cy.get("input#validationCode").type(verificationCode)
        cy.get("button[type=submit]").click()
        cy.get('[data-test="error-summary"]').contains("Enter a new password")
      })
    })

    it("should not allow submission when passwords do not match", () => {
      cy.visit(`/login/reset-password`)
      cy.get("input[name=emailAddress]").type(user.email)
      cy.get("button[type=submit]").click()
      cy.get("body").contains(/sent you an email/i)
      cy.task("getVerificationCode", user.email).then((verificationCode) => {
        cy.get("input#validationCode").type(verificationCode)
        cy.get("input#newPassword").type("Test@123456")
        cy.get("input[type=password][name=confirmPassword]").type("DifferentPassword")
        cy.get("button[type=submit]").click()
        cy.get('[data-test="error-summary"]').contains("Enter the same password twice")
      })
    })

    it("should allow user to generate a random password", () => {
      cy.visit(`/login/reset-password`)
      cy.get("input[name=emailAddress]").type(user.email)
      cy.get("button[type=submit]").click()
      cy.get("body").contains(/sent you an email/i)

      cy.get("div[data-test='generated-password']").should("not.exist")
      cy.get("a[data-test='generate-password']").click()
      cy.get("div[data-test='generated-password']").should("not.be.empty")
    })

    it("should respond with forbidden response code when CSRF tokens are invalid in reset password page", (done) => {
      cy.checkCsrf("/login/reset-password", "POST").then(() => done())
    })

    it("should not allow to reset using and old password", () => {
      const newPassword = "Test@1234567"
      cy.visit(`/login/reset-password`)
      cy.get("input[name=emailAddress]").type(user.email)
      cy.get("button[type=submit]").click()
      cy.get("body").contains(/sent you an email/i)
      cy.task("getVerificationCode", user.email).then((verificationCode) => {
        cy.get("input#validationCode").type(verificationCode)
        cy.get("input#newPassword").type(newPassword)
        cy.get("input[type=password][name=confirmPassword]").type(newPassword)
        cy.get("button[type=submit]").click()
        cy.get("body").contains(/You can now sign in with your new password./i)
      })

      cy.visit(`/login/reset-password`)
      cy.get("input[name=emailAddress]").type(user.email)
      cy.get("button[type=submit]").click()
      cy.get("body").contains(/sent you an email/i)
      cy.task("getVerificationCode", user.email).then((verificationCode) => {
        cy.get("input#validationCode").type(verificationCode)
        cy.get("input#newPassword").type(newPassword)
        cy.get("input[type=password][name=confirmPassword]").type(newPassword)
        cy.get("button[type=submit]").click()
        cy.get('[data-test="error-summary"]').contains("Cannot use previously used password.")
      })
    })
  })
})
