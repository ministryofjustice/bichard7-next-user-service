import config from "lib/config"
import wordListPath from "word-list"
import fs from "fs"

const wordArray = fs.readFileSync(wordListPath, "utf8").split("\n")

export default () => {
  let result = ""
  let i = config.suggestedPasswordNumWords
  while (i > 0) {
    const randomWord = wordArray[Math.floor(Math.random() * wordArray.length)]
    if (randomWord.length >= config.suggestedPasswordMinWordLength) {
      i -= 1
      result += randomWord
    }
  }

  return result
}
