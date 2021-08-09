/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
const createUsers = require("../db/seed/createUsers")

module.exports = (on) => {
  on("task", {
    "db:seed:users": async () => {
      // eslint-disable-next-line no-return-await
      return await createUsers()
    }
  })
}
