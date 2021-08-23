import config from "lib/config"
import wordListPath from "word-list"
import fs from "fs"
import crypto from "crypto"

const wordArray = fs.readFileSync(wordListPath, "utf8").split("\n")

export default () => {
  let result = ""
  let i = config.suggestedPasswordNumWords
  while (i > 0) {
    const trueRandomIndex = crypto.randomInt(wordArray.length)
    const randomWord = wordArray[trueRandomIndex]
    if (randomWord.length >= config.suggestedPasswordMinWordLength) {
      i -= 1
      result += randomWord
    }
  }

  return result
}
