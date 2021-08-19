describe("Delete user", () => {
  before(async () => {
    await cy.task("seedUsers")
  })

  it("should respond with forbidden response code when CSRF tokens are invalid in delete page", (done) => {
    cy.checkCsrf("/users/Bichard01/delete", "POST").then(() => done())
  })
})
