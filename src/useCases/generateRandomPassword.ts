import config from "lib/config"

import randomWords from "random-words"

export default () => {
  let result = ""
  let i = config.numberWordsSuggestedPassword
  while (i > 0) {
    // unfortunately randomWords does not have option to specify the min length of the words generated
    // because of this, for each word, we need to ensure that it meets the minimum length requirement
    // in theory we should never enter an infinite loop ...
    const randomWord = randomWords({ exactly: 1 })[0]
    if (randomWord.length >= config.minLengthPerWordSuggestedPassword) {
      i -= 1
      result += randomWord
    }
  }

  return result
}
