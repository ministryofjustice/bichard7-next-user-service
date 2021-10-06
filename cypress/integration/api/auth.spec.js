import { validToken } from "../../helpers/tokens"

describe("Authentication API endpoint", () => {
  beforeEach(() => {
    cy.task("deleteFromGroupsTable")
    cy.task("deleteFromUsersTable")
    cy.task("insertIntoGroupsTable")
    cy.task("insertIntoUsersTable")
    cy.task("insertIntoUserGroupsTable", {
      email: "bichard01@example.com",
      groups: ["B7UserManager_grp", "B7Supervisor_grp"]
    })
  })

  it("should say user is unauthenticated if not logged in", () => {
    cy.request({ url: "/api/auth", headers: { Referer: "/users/users" }, failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property("authenticated", false)
    })
  })

  it("should say user is authenticated if logged in", () => {
    const emailAddress = "bichard01@example.com"
    const password = "password"

    cy.visit("/login")
    cy.get("input[type=email]").type(emailAddress)
    cy.get("button[type=submit]").click()

    cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
      const token = validToken(emailAddress, verificationCode)
      cy.visit(`/login/verify?token=${token}`)
      cy.get("input[type=password][name=password]").type(password)
      cy.get("button[type=submit]").click()
    })

    cy.request({ url: "/api/auth", headers: { Referer: "/" } }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property("authenticated", true)
    })
  })

  it("should say user is not authenticated if failed to login", () => {
    const emailAddress = "bichard01@example.com"
    const password = "wrongpassword"

    cy.visit("/login")
    cy.get("input[type=email]").type(emailAddress)
    cy.get("button[type=submit]").click()

    cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
      const token = validToken(emailAddress, verificationCode)
      cy.visit(`/login/verify?token=${token}`)
      cy.get("input[type=password][name=password]").type(password)
      cy.get("button[type=submit]").click()
    })

    cy.request({ url: "/api/auth", headers: { Referer: "/users/users" }, failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property("authenticated", false)
    })
  })

  it("should say user doesn't have permission to access the user manager url if user is not in the user manager group", () => {
    const emailAddress = "bichard02@example.com"
    const password = "password"

    cy.visit("/login")
    cy.get("input[type=email]").type(emailAddress)
    cy.get("button[type=submit]").click()

    cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
      const token = validToken(emailAddress, verificationCode)
      cy.visit(`/login/verify?token=${token}`)
      cy.get("input[type=password][name=password]").type(password)
      cy.get("button[type=submit]").click()
    })

    cy.request({ url: "/api/auth", headers: { Referer: "/users/users" }, failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(403)
      expect(response.body).to.have.property("authenticated", true)
    })
  })

  it("should say user doesn't have permission to access the bichard url if user is not in the bichard group", () => {
    const emailAddress = "bichard02@example.com"
    const password = "password"

    cy.visit("/login")
    cy.get("input[type=email]").type(emailAddress)
    cy.get("button[type=submit]").click()

    cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
      const token = validToken(emailAddress, verificationCode)
      cy.visit(`/login/verify?token=${token}`)
      cy.get("input[type=password][name=password]").type(password)
      cy.get("button[type=submit]").click()
    })

    cy.request({ url: "/api/auth", headers: { Referer: "/bichard-ui" }, failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(403)
      expect(response.body).to.have.property("authenticated", true)
    })
  })

  it("should say user can access home page even if user does not belong to any group", () => {
    const emailAddress = "bichard02@example.com"
    const password = "password"

    cy.visit("/login")
    cy.get("input[type=email]").type(emailAddress)
    cy.get("button[type=submit]").click()

    cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
      const token = validToken(emailAddress, verificationCode)
      cy.visit(`/login/verify?token=${token}`)
      cy.get("input[type=password][name=password]").type(password)
      cy.get("button[type=submit]").click()
    })

    cy.request({ url: "/api/auth", headers: { Referer: "/" }, failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(403)
      expect(response.body).to.have.property("authenticated", true)
    })
  })
})
