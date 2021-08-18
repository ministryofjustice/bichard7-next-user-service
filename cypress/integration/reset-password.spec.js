import jwt from "jsonwebtoken"

const tokenSecret = "OliverTwist"

const generatePasswordResetToken = (emailAddress, passwordResetCode) =>
  jwt.sign({ emailAddress, passwordResetCode }, tokenSecret, { issuer: "Bichard" })

const generateLoginVerificationToken = (emailAddress, verificationCode) =>
  jwt.sign({ emailAddress, verificationCode }, tokenSecret, { issuer: "Bichard" })

describe("Reset password", () => {
  context("720p resolution", () => {
    before(() => {
      cy.task("seedUsers")
    })

    beforeEach(() => {
      cy.viewport(1280, 720)
    })

    it("should prompt the user that password reset was successful when provided password is valid", (done) => {
      const emailAddress = "bichard01@example.com"
      const newPassword = "Test@123456"
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
        cy.get("body").contains(/You can now sign in with your new password./i)

        cy.visit("/login")
        cy.get("input[type=email]").type(emailAddress)
        cy.get("button[type=submit]").click()
        cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
          const verificationToken = generateLoginVerificationToken(emailAddress, verificationCode)
          cy.visit(`/login/verify?token=${verificationToken}`)

          cy.request({
            method: "POST",
            url: `/login/verify`,
            form: true,
            followRedirect: false,
            body: {
              token: verificationToken,
              password: newPassword
            }
          }).then((response) => {
            const { location } = response.headers
            expect(location).to.match(/^https:\/\/localhost:9443\/bichard-ui\/Authenticate/)
            expect(location).to.match(/\?token=[A-Za-z0-9_.]+/)
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
  })
})
