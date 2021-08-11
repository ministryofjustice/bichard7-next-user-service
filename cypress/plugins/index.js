/* eslint-disable import/first */
/* eslint-disable import/order */
/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
import pgPromise from "pg-promise"

const createUsers = require("../db/seed/createUsers")

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
    },

    async seedUsers() {
      return createUsers()
    }
  })
}
