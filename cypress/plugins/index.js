/// <reference types="cypress" />

import pgPromise from "pg-promise"

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = async (on, config) => {
  const pgp = pgPromise()
  const db = pgp("postgres://bichard:password@localhost:5432/bichard")

  on("task", {
    async getVerificationCode(emailAddress) {
      const result = await db.one("SELECT email_verification_code FROM br7own.users WHERE email = $1", emailAddress)
      return result.email_verification_code
    }
  })
}
