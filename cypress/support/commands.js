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

// const login = ({ emailAddress, password }) => {
//   let runningWithProxy
//   if (Cypress.config("baseUrl") !== "http://localhost:3000/users/login") {
//     console.log(`Running with proxy: ${Cypress.config("baseUrl")}`)
//     runningWithProxy = true
//   } else {
//     console.log(`Running locally: ${Cypress.config("baseUrl")}`)
//     runningWithProxy = false
//   }

//   cy.visit(runningWithProxy ? "http://localhost:3000/users/login" : "/users/login")
//   cy.get("#email").type(emailAddress)
//   cy.get("button[type=submit]").click()
//   cy.get("input#validationCode").should("exist")
//   cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
//     cy.get("input#validationCode").type(verificationCode)
//     cy.get("input#password").type(password)
//     cy.get("button[type=submit]").click()
//   })
// }

// Cypress.Commands.add("login", (emailAddress, password) => {
//   cy.session(
//     [emailAddress, password],
//     () => {
//       cy.intercept("GET", "http://bichard7.service.justice.gov.uk/forces.js?forceID=***", {})

//       login({ emailAddress, password })
//     },
//     {
//       validate() {
//         cy.visit("/login")
//         cy.get('a[data-test="logout"]').should("have.text", "Sign out")
//       }
//     }
//   )
// })
Cypress.Commands.add("login", (emailAddress, password) => {
  cy.visit("/login")
  cy.get("input[type=email]").type(emailAddress)
  cy.get("button[type=submit]").click()
  cy.get("input#validationCode").should("exist")
  cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
    cy.get("input#validationCode").type(verificationCode)
    cy.get("input#password").type(password)
    cy.get("button[type=submit]").click()
    cy.url().should("match", /\/users$/)
  })
})

Cypress.Commands.add("tableSetup", () => {
  cy.task("deleteFromUsersTable")
  cy.task("deleteFromGroupsTable")
  cy.task("deleteFromUsersGroupsTable")
  cy.task("deleteFromServiceMessagesTable")
  cy.task("insertIntoGroupsTable")
  cy.task("insertGroupHierarchies")
  cy.task("insertIntoUsersTable")
  cy.task("insertIntoServiceMessagesTable")
})
