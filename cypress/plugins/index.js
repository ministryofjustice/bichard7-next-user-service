/* eslint-disable import/first */
/* eslint-disable import/order */
/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
import pgPromise from "pg-promise"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoTable from "../../testFixtures/database/insertIntoTable"
import users from "../../testFixtures/database/data/users"

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  const pgp = pgPromise()
  const db = pgp("postgres://bichard:password@localhost:5432/bichard")

  on("task", {
    async getVerificationCode(emailAddress) {
      const result = await db
        .one("SELECT email_verification_code FROM br7own.users WHERE email = $1", emailAddress)
        .catch(console.error)

      return result.email_verification_code
    },

    async getPasswordResetCode(emailAddress) {
      const result = await db
        .one("SELECT password_reset_code FROM br7own.users WHERE email = $1", emailAddress)
        .catch(console.error)

      return result.password_reset_code
    },

    async deleteFromUsersTable() {
      await deleteFromTable("users")
      return null
    },

    async insertIntoUsersTable() {
      await insertIntoTable(users)
      return null
    }
  })
}
