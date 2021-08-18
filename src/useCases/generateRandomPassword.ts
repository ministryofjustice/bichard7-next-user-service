import config from "lib/config"

import randomWords from "random-words"

export default () => {
  return randomWords({
    exactly: config.numberWordsSuggestedPassword,
    join: ""
  })
}
