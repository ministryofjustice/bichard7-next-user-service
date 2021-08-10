import jwt from "jsonwebtoken"

const tokenSecret = "OliverTwist"

const invalidToken = () => jwt.sign({ foo: "bar" }, tokenSecret, { issuer: "Bichard" })

const validToken = (emailAddress, verificationCode) =>
  jwt.sign({ emailAddress, verificationCode }, tokenSecret, { issuer: "Bichard" })

describe("Logging In", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      cy.viewport(1280, 720)
    })

    describe("Log in flow", () => {
      before(async () => {
        await cy.task("db:seed:users")
      })

      it("should initially only ask for an email", () => {
        cy.visit("/login")
        cy.get("input[type=email]").should("be.visible")
        cy.get("button[type=submit").should("be.visible")
        cy.get("input[type=password]").should("not.exist")
      })

      it("should prompt the user to check their emails after entering an email address", () => {
        cy.visit("/login")
        cy.get("input[type=email]").type("bichard01@example.com")
        cy.get("button[type=submit]").click()
        cy.get("body").contains(/check your email/i)
      })

      it("should not allow submission of something that isn't an email address", () => {
        cy.visit("/login")
        cy.get("input[type=email]").type("foobar")
        cy.get("button[type=submit]").click()
        cy.url().should("match", /\/login\/?$/)
      })

      it("should show an error message if visiting verification page with no token", () => {
        cy.visit("/login/verify")
        cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Unable to verify")
      })

      it("should show an error message if visiting verification page with an invalid token", () => {
        cy.visit("/login/verify?token=foobar")
        cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Unable to verify")

        cy.visit(`/login/verify?token=${invalidToken()}`)
        cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Unable to verify")
      })

      it("should display the user's email address when they visit the verification link", () => {
        const token = validToken("bichard01@example.com", "foobar")
        cy.visit(`/login/verify?token=${token}`)
        cy.get(".govuk-error-summary").should("not.exist")
        cy.get("body").contains(/bichard01@example.com/i)
      })

      it("should display a password input when visiting the verification link", () => {
        const token = validToken("bichard01@example.com", "foobar")
        cy.visit(`/login/verify?token=${token}`)
        cy.get(".govuk-error-summary").should("not.exist")
        cy.get("input[type=password]").should("be.visible")
      })

      it("should display an error message if an incorrect password is entered on the verification page", () => {
        const token = validToken("bichard01@example.com", "foobar")
        cy.visit(`/login/verify?token=${token}`)
        cy.get("input[type=password]").type("foobar")
        cy.get("button[type=submit]").click()
        cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Invalid credentials")
      })

      it("should display an error if password is correct but token contains wrong verification code", () => {
        const token = validToken("bichard01@example.com", "foobar")
        cy.visit(`/login/verify?token=${token}`)
        cy.get("input[type=password]").type("password")
        cy.get("button[type=submit]").click()
        cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Invalid credentials")
      })

      it("should redirect to Bichard with a token when password and verification code are correct", () => {
        const emailAddress = "bichard01@example.com"

        cy.visit("/login")
        cy.get("input[type=email]").type(emailAddress)
        cy.get("button[type=submit]").click()

        // Wait for verification token to get written to the database
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(5000)

        cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
          const token = validToken(emailAddress, verificationCode)

          cy.request({
            method: "POST",
            url: `/login/verify`,
            form: true,
            followRedirect: false,
            body: {
              token,
              password: "password"
            }
          }).then((response) => {
            expect(response.status).to.eq(302)
            const { location } = response.headers
            expect(location).to.match(/^https:\/\/localhost:9443\/bichard-ui\/Authenticate/)
            expect(location).to.match(/\?token=[A-Za-z0-9_.]+/)
          })
        })
      })
    })
  })
})
