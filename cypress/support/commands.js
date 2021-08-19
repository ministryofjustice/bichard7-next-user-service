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
      cookie: "XSRF-TOKEN%2Flogin=7tyFoLsw-L1-NzWTjPCnTf7YjDNGMAbd8KmU.cmu8gTFgJjXa8insESx4fsNn9jBJL9R3uD%2Be0yb26Es"
    },
    form: true,
    followRedirect: false,
    body: {
      "XSRF-TOKEN":
        "XSRF-TOKEN%2Flogin=TsRDivzH-KLjL_PkicOeXYK0velCTKJz7tBo.sN/lvve0ApcIfIShux0He7AVY1KIbLPlIPhEkATJqiU"
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
