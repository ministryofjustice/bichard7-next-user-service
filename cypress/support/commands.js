import { generateLoginVerificationToken } from "../helpers/tokens"

Cypress.Commands.add("checkCsrf", (url, method) => {
  cy.request({
    failOnStatusCode: false,
    method,
    url,
    headers: {
      cookie: "CSRFToken%2Flogin=JMHZOOog-n0ZMO-UfRCZTCUxiQutsEeLpS8I.CJOHfajQ2zDKOZPaBh5J8VT%2FK4UrG6rB6o33VIvK04g"
    },
    form: true,
    followRedirect: false,
    body: {
      CSRFToken:
        "CSRFToken%2Flogin=1629375460103.JMHZOOog-n0ZMO-UfRCZTCUxiQutsEeLpS8I.7+42/hdHVuddtxLw8IvGvIPVhkFj6kbvYukS1mGm64o"
    }
  }).then((withTokensResponse) => {
    expect(withTokensResponse.status).to.eq(403)
    cy.request({
      failOnStatusCode: false,
      method,
      url,
      form: true,
      followRedirect: false
    }).then((withoutTokensResponse) => {
      expect(withoutTokensResponse.status).to.eq(403)
    })
  })
})

Cypress.Commands.add("login", (emailAddress, password) => {
  cy.visit("/login")
  cy.get("input[type=email]").type(emailAddress)
  cy.get("button[type=submit]").click()
  cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
    const verificationToken = generateLoginVerificationToken(emailAddress, verificationCode)
    cy.visit(`/login/verify?token=${verificationToken}`)
    cy.get("input[type=password][name=password]").type(password)
    cy.get("button[type=submit]").click()
    cy.url().then((url) => {
      expect(url).to.equal("http://localhost:3000/users/home")
    })
  })
})
