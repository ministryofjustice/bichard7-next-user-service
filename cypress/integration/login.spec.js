import { invalidToken, validToken } from "../helpers/tokens"

const emailCookieName = "LOGIN_EMAIL"

describe("Logging In", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.clearCookies()

      cy.task("deleteFromUsersTable")
      cy.task("insertIntoUsersTable")
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
      cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Unable to verify email address")
    })

    it("should show an error message if visiting verification page with an invalid token", () => {
      cy.visit("/login/verify?token=foobar")
      cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Unable to verify email address")

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
      cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Your details do not match")
    })

    it("should display an error if password is correct but token contains wrong verification code", () => {
      const token = validToken("bichard01@example.com", "foobar")
      cy.visit(`/login/verify?token=${token}`)
      cy.get("input[type=password]").type("password")
      cy.get("button[type=submit]").click()
      cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Your details do not match")
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

        cy.url().should("match", /^http:\/\/localhost:3000\/bichard-ui\/Authenticate/)
        cy.url().should("match", /\?token=[A-Za-z0-9_.]+/)

        done()
      })
    })

    it("should accept a correct password and verification code even after incorrect password attempt", (done) => {
      const emailAddress = "bichard01@example.com"
      const password = "password"

      cy.visit("/login")

      cy.get("input[type=email]").type(emailAddress)
      cy.get("button[type=submit]").click()
      cy.get('h1[data-test="check-email"]').should("exist")

      cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
        const token = validToken(emailAddress, verificationCode)
        cy.visit(`/login/verify?token=${token}`)
        cy.get("input[type=password]").type("foobar")

        cy.get("input[type=password][name=password]").type("incorrect password")
        cy.get("button[type=submit]").click()
        cy.get(".govuk-error-summary").should("be.visible").contains("h2", "Invalid credentials")

        // Note: Although we avoid waits in cypress test as the logic implemented is temporal in nature we can consider this OK
        // Need to wait 10 seconds after inputting an incorrect password
        /* eslint-disable-next-line cypress/no-unnecessary-waiting */
        cy.wait(10000)

        cy.get("input[type=password][name=password]").type(password)
        cy.get("button[type=submit]").click()

        cy.url().should("match", /^http:\/\/localhost:3000\/bichard-ui\/Authenticate/)
        cy.url().should("match", /\?token=[A-Za-z0-9_.]+/)

        done()
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
        cy.get("input[id=rememberEmailYes]").click()
        cy.get("button[type=submit]").click()

        cy.url().should("match", /^http:\/\/localhost:3000\/bichard-ui\/Authenticate/)
        cy.url().should("match", /\?token=[A-Za-z0-9_.]+/)

        done()
      })

      cy.visit("/login")
      cy.url().should("match", /\/login\/verify[^/]*/)

      cy.getCookie(emailCookieName)
        .should("exist")
        .should("have.property", "value")
        .should("have.property", "httpOnly", true)
        .should("have.property", "expiry")
        .then((cookie) => {
          const { expiry } = cookie
          const actualExpiry = new Date(expiry)

          const now = new Date()
          const expectedExpiry = new Date()
          expectedExpiry.setHours(now.getHours() + 24)

          expect(actualExpiry).to.equal(expectedExpiry)
          done()
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

        cy.url().should("match", /^http:\/\/localhost:3000\/bichard-ui\/Authenticate/)
        cy.url().should("match", /\?token=[A-Za-z0-9_.]+/)

        done()
      })

      cy.visit("/login")
      cy.url().should("match", /\/login[^/]*/)
      cy.getCookie(emailCookieName).should("not.exist")
    })

    it("should forget remembered email address when 'not you' link is clicked", (done) => {
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
        cy.get("input[id=rememberEmailYes]").click()
        cy.get("button[type=submit]").click()

        cy.url().should("match", /^http:\/\/localhost:3000\/bichard-ui\/Authenticate/)
        cy.url().should("match", /\?token=[A-Za-z0-9_.]+/)

        done()
      })

      cy.visit("/login")
      cy.url().should("match", /\/login\/verify[^/]*/)

      cy.get("a[data-test=not-you-link").click()
      cy.url().should("match", /\/login[^/]/)
      cy.getCookie(emailCookieName).should("not.exist")
    })

    it("should respond with forbidden response code when CSRF tokens are invalid in verify page", (done) => {
      cy.checkCsrf("/login/verify", "POST").then(() => done())
    })

    it("should respond with forbidden response code when CSRF tokens are invalid in login page", (done) => {
      cy.checkCsrf("/login", "POST").then(() => done())
    })

    it("can successfully log out after logging in", () => {
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

        cy.getCookie(".AUTH").should("exist")

        cy.visit("/logout")
        cy.url().should("not.match", /token=/)

        cy.getCookie(".AUTH").should("not.exist")
      })
    })

    it("can login a second time and update the jwt token in the users table", () => {
      const emailAddress = "bichard01@example.com"
      const password = "password"
      let firstJwtId = ""

      cy.visit("/login")
      cy.get("input[type=email]").type(emailAddress)
      cy.get("button[type=submit]").click()
      cy.get('h1[data-test="check-email"]').should("exist")
      cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
        const token = validToken(emailAddress, verificationCode)

        cy.visit(`/login/verify?token=${token}`)
        cy.get("input[type=password][name=password]").type(password)
        cy.get("button[type=submit]").click()
        cy.task("selectFromUsersTable", emailAddress).then((user) => {
          firstJwtId = user.jwt_id
        })
      })

      cy.visit("/login")
      cy.get("input[type=email]").type(emailAddress)
      cy.get("button[type=submit]").click()
      cy.get('h1[data-test="check-email"]').should("exist")
      cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
        const token = validToken(emailAddress, verificationCode)

        cy.visit(`/login/verify?token=${token}`)
        cy.get("input[type=password][name=password]").type(password)
        cy.get("button[type=submit]").click()
        cy.task("selectFromUsersTable", emailAddress).then((user) => {
          expect(user.jwt_id).not.to.equal(firstJwtId)
        })
      })
    })
  })
})
