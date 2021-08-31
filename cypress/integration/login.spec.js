import { invalidToken, validToken } from "../helpers/tokens"

describe("Logging In", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.clearCookies()
    })

    beforeEach(() => {
      cy.task("deleteFromUsersTable")
      cy.task("insertIntoUsersTable")
    })

    describe("Log in flow", () => {
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
        cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Invalid credentials")
      })

      it("should show an error message if visiting verification page with an invalid token", () => {
        cy.visit("/login/verify?token=foobar")
        cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Invalid credentials")

        cy.visit(`/login/verify?token=${invalidToken()}`)
        cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Unable to verify email address")
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
    })

    it("should display an error if password is correct but token contains wrong verification code", () => {
      const token = validToken("bichard01@example.com", "foobar")
      cy.visit(`/login/verify?token=${token}`)
      cy.get("input[type=password]").type("password")
      cy.get("button[type=submit]").click()
      cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Invalid credentials")
    })

    it("should redirect to Bichard with a token when password and verification code are correct", (done) => {
      const emailAddress = "bichard01@example.com"
      const password = "password"

      cy.visit("/login")
      cy.get("input[type=email]").type(emailAddress)
      cy.get("button[type=submit]").click()
      cy.get('h1[data-test="check-email"]').should("exist")
      cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
        const token = validToken(emailAddress, verificationCode)

        cy.visit(`/login/verify?token=${token}`)
        cy.get("input[type=password][name=password]").type(password)
        cy.get("button[type=submit]").click()
        cy.url().then((url) => {
          expect(url).to.match(/^http:\/\/localhost:3000\/bichard-ui\/Authenticate/)
          expect(url).to.match(/\?token=[A-Za-z0-9_.]+/)

          cy.visit("/")
          cy.getCookie(".AUTH").then((cookie) => {
            expect(cookie).is.not.undefined
            const { value, httpOnly } = cookie
            expect(value).is.not.undefined
            expect(value).is.not.empty
            expect(value).match(/.+\..+\..+/)
            expect(httpOnly).to.be.true
            done()
          })
        })
      })
    })

    it("should remember email address when remember checkbox is checked", (done) => {
      const emailAddress = "bichard01@example.com"
      const password = "password"

      cy.visit("/login")
      cy.get("input[type=email]").type(emailAddress)
      cy.get("button[type=submit]").click()
      cy.get('h1[data-test="check-email"]').should("exist")
      cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
        const token = validToken(emailAddress, verificationCode)

        cy.visit(`/login/verify?token=${token}`)
        cy.get("input[type=password][name=password]").type(password)
        cy.get("input[id=rememberEmailAddress]").click()
        cy.get("button[type=submit]").click()
        cy.url().then((url) => {
          expect(url).to.match(/^http:\/\/localhost:3000\/bichard-ui\/Authenticate/)
          expect(url).to.match(/\?token=[A-Za-z0-9_.]+/)

          cy.visit("/")
          cy.getCookie("LOGIN_EMAIL").then((cookie) => {
            expect(cookie).is.not.undefined
            const { value, httpOnly, expiry } = cookie
            expect(value).is.not.undefined
            expect(value).is.not.empty
            expect(httpOnly).to.be.true
            expect(expiry).is.not.undefined

            const expiryDate = new Date(expiry * 1000)
            const now = new Date()
            now.setHours(now.getHours() + 24)
            expect(expiryDate.toDateString()).equals(now.toDateString())
            expect(expiryDate.getHours()).equals(now.getHours())

            cy.url().then((verifyUrl) => {
              expect(verifyUrl).to.match(/^http:\/\/localhost:3000\/login\/verify\?.+/)
              done()
            })
          })
        })
      })
    })

    it("should not remember email address when remember checkbox is not checked", (done) => {
      const emailAddress = "bichard01@example.com"
      const password = "password"

      cy.visit("/login")
      cy.get("input[type=email]").type(emailAddress)
      cy.get("button[type=submit]").click()
      cy.get('h1[data-test="check-email"]').should("exist")
      cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
        const token = validToken(emailAddress, verificationCode)

        cy.visit(`/login/verify?token=${token}`)
        cy.get("input[type=password][name=password]").type(password)
        cy.get("button[type=submit]").click()
        cy.url().then((url) => {
          expect(url).to.match(/^http:\/\/localhost:3000\/bichard-ui\/Authenticate/)
          expect(url).to.match(/\?token=[A-Za-z0-9_.]+/)

          cy.visit("/")
          cy.getCookie("LOGIN_EMAIL").then((cookie) => {
            expect(cookie).is.null

            cy.url().then((loginUrl) => {
              expect(loginUrl).to.equals("http://localhost:3000/login")
              done()
            })
          })
        })
      })
    })

    it("should not remember email address when email address is already remembered but remember checkbox is not checked", (done) => {
      const emailAddress = "bichard01@example.com"
      const password = "password"

      cy.visit("/login")
      cy.get("input[type=email]").type(emailAddress)
      cy.get("button[type=submit]").click()
      cy.get('h1[data-test="check-email"]').should("exist")
      cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
        const token = validToken(emailAddress, verificationCode)

        cy.visit(`/login/verify?token=${token}`)
        cy.get("input[type=password][name=password]").type(password)
        cy.get("input[id=rememberEmailAddress]").click()
        cy.get("button[type=submit]").click()
        cy.url().then((url) => {
          expect(url).to.match(/^http:\/\/localhost:3000\/bichard-ui\/Authenticate/)
          expect(url).to.match(/\?token=[A-Za-z0-9_.]+/)

          cy.visit("/")
          cy.getCookie("LOGIN_EMAIL").then((cookie) => {
            expect(cookie).is.not.undefined
            const { value, httpOnly, expiry } = cookie
            expect(value).is.not.undefined
            expect(value).is.not.empty
            expect(httpOnly).to.be.true
            expect(expiry).is.not.undefined

            const expiryDate = new Date(expiry * 1000)
            const now = new Date()
            now.setHours(now.getHours() + 24)
            expect(expiryDate.toDateString()).equals(now.toDateString())
            expect(expiryDate.getHours()).equals(now.getHours())

            cy.url().then((verifyUrl) => {
              expect(verifyUrl).to.match(/^http:\/\/localhost:3000\/login\/verify\?.+/)
              cy.get("a[data-test=not-you-link]").click()

              cy.getCookie("LOGIN_EMAIL").then((emailAddressCookie) => {
                expect(emailAddressCookie).is.null

                cy.url().then((loginUrl) => {
                  expect(loginUrl).to.match(/http:\/\/localhost:3000\/login?.+/)
                  done()
                })
              })
            })
          })
        })
      })
    })

    it("should respond with forbidden response code when CSRF tokens are invalid in verify page", (done) => {
      cy.checkCsrf("/login/verify", "POST").then(() => done())
    })

    it("should respond with forbidden response code when CSRF tokens are invalid in login page", (done) => {
      cy.checkCsrf("/login", "POST").then(() => done())
    })
  })
})
