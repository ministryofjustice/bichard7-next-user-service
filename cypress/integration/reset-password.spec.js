import jwt from "jsonwebtoken"

const tokenSecret = "OliverTwist"

const generatePasswordResetToken = (emailAddress, passwordResetCode) =>
  jwt.sign({ emailAddress, passwordResetCode }, tokenSecret, { issuer: "Bichard" })

const generateLoginVerificationToken = (emailAddress, verificationCode) =>
  jwt.sign({ emailAddress, verificationCode }, tokenSecret, { issuer: "Bichard" })

describe("Reset password", () => {
  context("720p resolution", () => {
    before(() => {
      cy.task("deleteFromUsersTable")
      cy.task("insertIntoUsersTable")
    })

    beforeEach(() => {
      cy.viewport(1280, 720)
    })

    it("should send out email to reset password", () => {
      const emailAddress = "bichard01@example.com"
      cy.visit("/login")
      cy.get("a[href='/login/forgot-password']").click()
      cy.get("body").contains(/forgot password/i)
      cy.get("input[type=email]").type(emailAddress)
      cy.get("button[type=submit]").click()
      cy.get("body").contains(/check your email/i)
    })

    it("should not allow submission when passwords are too short", () => {
      cy.task("getPasswordResetCode", ["bichard01@example.com", "foobar"]).then(() => {
        const token = generatePasswordResetToken("bichard01@example.com", "foobar")
        cy.visit(`/login/reset-password?token=${token}`)
        cy.get("body").contains(/reset password/i)
        cy.get("input[type=password][name=newPassword]").type("shorty")
        cy.get("input[type=password][name=confirmPassword]").type("shorty")
        cy.get("button[type=submit]").click()
        cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Password is insecure")
        cy.get(".govuk-error-summary__body").should("be.visible").contains("div", "Password is too short")
      })
    })

    it("should not allow submission when passwords contain sensitive information", () => {
      cy.task("getPasswordResetCode", ["bichard01@example.com", "foobar"]).then((passwordResetCode) => {
        const token = generatePasswordResetToken("bichard01@example.com", passwordResetCode)
        cy.visit(`/login/reset-password?token=${token}`)
        cy.get("body").contains(/reset password/i)
        cy.get("input[type=password][name=newPassword]").type("bichard01")
        cy.get("input[type=password][name=confirmPassword]").type("bichard01")
        cy.get("button[type=submit]").click()
        cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Password is insecure")
        cy.get(".govuk-error-summary__body")
          .should("be.visible")
          .contains("div", "Password contains user specific sensitive information. Please choose another one")
      })
    })

    it("should not allow submission when password is banned", () => {
      cy.task("getPasswordResetCode", ["bichard01@example.com", "foobar"]).then(() => {
        const token = generatePasswordResetToken("bichard01@example.com", "foobar")
        cy.visit(`/login/reset-password?token=${token}`)
        cy.get("body").contains(/reset password/i)
        cy.get("input[type=password][name=newPassword]").type("123456789")
        cy.get("input[type=password][name=confirmPassword]").type("123456789")
        cy.get("button[type=submit]").click()
        cy.get(".govuk-error-summary")
          .should("be.visible")
          .contains("h2", "Cannot use this password as it is unsecure/banned")
      })
    })

    it("should prompt the user that password reset was successful when provided password is valid", (done) => {
      const emailAddress = "bichard01@example.com"
      const newPassword = "Test@1234567"
      cy.task("getPasswordResetCode", emailAddress).then((passwordResetCode) => {
        const passwordResetToken = generatePasswordResetToken(emailAddress, passwordResetCode)
        cy.visit(`/login/reset-password?token=${passwordResetToken}`)
        cy.get("body").contains(/reset password/i)
        cy.get("input[type=password][name=newPassword]").type(newPassword)
        cy.get("input[type=password][name=confirmPassword]").type(newPassword)
        cy.get("button[type=submit]").click()
        cy.get("body").contains(/You can now sign in with your new password./i)

        cy.visit("/login")
        cy.get("input[type=email]").type(emailAddress)
        cy.get("button[type=submit]").click()
        cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
          const verificationToken = generateLoginVerificationToken(emailAddress, verificationCode)
          cy.visit(`/login/verify?token=${verificationToken}`)
          cy.get("input[type=password][name=password]").type(newPassword)
          cy.get("button[type=submit]").click()
          cy.url().then((url) => {
            expect(url).to.match(/^http:\/\/localhost:3000\/bichard-ui\/Authenticate/)
            expect(url).to.match(/\?token=[A-Za-z0-9_.]+/)
            done()
          })
        })
      })
    })

    it("should not allow submission when password is empty", () => {
      cy.task("getPasswordResetCode", ["bichard01@example.com", "foobar"]).then(() => {
        const token = generatePasswordResetToken("bichard01@example.com", "foobar")
        cy.visit(`/login/reset-password?token=${token}`)
        cy.get("body").contains(/reset password/i)
        cy.get("button[type=submit]").click()
        cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Password field is mandatory")
      })
    })

    it("should not allow submission when passwords do not match", () => {
      cy.task("getPasswordResetCode", ["bichard01@example.com", "foobar"]).then(() => {
        const token = generatePasswordResetToken("bichard01@example.com", "foobar")
        cy.visit(`/login/reset-password?token=${token}`)
        cy.get("body").contains(/reset password/i)
        cy.get("input[type=password][name=newPassword]").type("Test@123456")
        cy.get("input[type=password][name=confirmPassword]").type("DifferentPassword")
        cy.get("button[type=submit]").click()
        cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Passwords do not match")
      })
    })

    it("should show an error message if visiting reset password page with an invalid token", () => {
      cy.visit("/login/reset-password?token=foobar")
      cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Unable to verify")
      cy.get("input[type=text]").should("not.exist")
    })

    it("should allow user to generate a random password", () => {
      cy.task("getPasswordResetCode", ["bichard01@example.com", "foobar"]).then(() => {
        const token = generatePasswordResetToken("bichard01@example.com", "foobar")
        cy.visit(`/login/reset-password?token=${token}`)
        cy.get("body").contains(/reset password/i)
        cy.get(".govuk-hint").should("be.empty")
        cy.get("a[class=govuk-link]").click()
        cy.get(".govuk-hint").should("not.be.empty")
      })
    })

    it("should respond with forbidden response code when CSRF tokens are invalid in reset password page", (done) => {
      cy.checkCsrf("/login/reset-password", "POST").then(() => done())
    })

    it("should not allow to reset using and old password", () => {
      const emailAddress = "bichard02@example.com"
      cy.visit("/login")
      cy.get("a[href='/login/forgot-password']").click()
      cy.get("body").contains(/forgot password/i)
      cy.get("input[type=email]").type(emailAddress)
      cy.get("button[type=submit]").click()
      cy.get("body").contains(/check your email/i)
      const newPassword = "Test@123456"
      cy.task("getPasswordResetCode", emailAddress).then((passwordResetCode) => {
        const passwordResetToken = generatePasswordResetToken(emailAddress, passwordResetCode)
        cy.visit(`/login/reset-password?token=${passwordResetToken}`)
        cy.get("body").contains(/reset password/i)
        cy.get("input[type=password][name=newPassword]").type(newPassword)
        cy.get("input[type=password][name=confirmPassword]").type(newPassword)
        cy.get("button[type=submit]").click()
        cy.get("body").contains(/You can now sign in with your new password./i)
      })

      cy.visit("/login")
      cy.get("a[href='/login/forgot-password']").click()
      cy.get("body").contains(/forgot password/i)
      cy.get("input[type=email]").type(emailAddress)
      cy.get("button[type=submit]").click()
      cy.get("body").contains(/check your email/i)
      cy.task("getPasswordResetCode", emailAddress).then((passwordResetCode) => {
        const passwordResetToken = generatePasswordResetToken(emailAddress, passwordResetCode)
        cy.visit(`/login/reset-password?token=${passwordResetToken}`)
        cy.get("body").contains(/reset password/i)
        cy.get("input[type=password][name=newPassword]").type(newPassword)
        cy.get("input[type=password][name=confirmPassword]").type(newPassword)
        cy.get("button[type=submit]").click()
        cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Password is insecure")
        cy.get(".govuk-error-summary__body").should("be.visible").contains("div", "Cannot use previously used password")
      })
    })
  })
})
