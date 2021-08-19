// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("checkCsrf", (url, method) => {
  cy.request({
    failOnStatusCode: false,
    method,
    url,
    headers: {
      cookie: "XSRF-TOKEN%2Flogin=JMHZOOog-n0ZMO-UfRCZTCUxiQutsEeLpS8I.CJOHfajQ2zDKOZPaBh5J8VT%2FK4UrG6rB6o33VIvK04g"
    },
    form: true,
    followRedirect: false,
    body: {
      "XSRF-TOKEN":
        "XSRF-TOKEN%2Flogin=1629375460103.JMHZOOog-n0ZMO-UfRCZTCUxiQutsEeLpS8I.7+42/hdHVuddtxLw8IvGvIPVhkFj6kbvYukS1mGm64o"
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
