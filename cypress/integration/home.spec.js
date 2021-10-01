// import { decodeAuthenticationToken } from "../helpers/tokens"

describe("Home", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      cy.task("deleteFromUsersTable")
      cy.task("deleteFromServiceMessagesTable")
      cy.task("insertIntoUsersTable")
      cy.task("insertIntoServiceMessagesTable")
    })

    beforeEach(() => {
      cy.viewport(1280, 720)
    })

    it("should redirect user to home page after successful login", () => {
      const emailAddress = "bichard01@example.com"
      cy.login(emailAddress, "password")
      cy.get("h1").contains(/welcome bichard user 01/i)
      // cy.get("a[id=user-management-link")
      //   .should("have.attr", "href")
      //   .and("match", /^http:\/\/localhost:3000\/users/)
      // cy.get("a[id=audit-logging-link")
      //   .should("have.attr", "href")
      //   .and("match", /^http:\/\/localhost:3000\/audit-logging/)
      // cy.get("a[id=bichard-link")
      //   .should("have.attr", "href")
      //   .and("match", /^http:\/\/localhost:3000\/bichard-ui\/customurl\?token=[A-Za-z0-9_.]+/)

      // cy.get("a[id=bichard-link")
      //   .invoke("attr", "href")
      //   .then((url) => {
      //     expect(url).to.match(/\?token=[A-Za-z0-9_.]+/)
      //     cy.task("selectFromUsersTable", emailAddress).then((user) => {
      //       cy.task("selectFromJwtIdTable").then((jwtId) => {
      //         const decodedToken = decodeAuthenticationToken(url.match(/token=([^..]+\.[^..]+\.[^..]+)/)[1])
      //         expect(jwtId.id).to.equal(decodedToken.id)
      //         expect(jwtId.user_id).to.equal(user.id)
      //         done()
      //       })
      //     })
      //   })
    })

    it("should show paginated service messages", () => {
      cy.login("bichard01@example.com", "password")
      cy.get("body").contains("Latest service messages")
      cy.get(".govuk-grid-column-one-third > .govuk-grid-row").each((row, index) => {
        cy.wrap(row)
          .get(".govuk-body")
          .contains(`Message ${13 - index}`)
      })

      cy.get('a[data-test="Next"]').click()

      cy.get(".govuk-grid-column-one-third > .govuk-grid-row").each((row, index) => {
        cy.wrap(row)
          .get(".govuk-body")
          .contains(`Message ${8 - index}`)
      })

      cy.get('a[data-test="Prev"]').click()

      cy.get(".govuk-grid-column-one-third > .govuk-grid-row").each((row, index) => {
        cy.wrap(row)
          .get(".govuk-body")
          .contains(`Message ${13 - index}`)
      })
    })
  })
})
