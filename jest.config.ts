import type { Config } from "@jest/types"
import { TextEncoder } from "util"

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "\\.[jt]sx?$": "babel-jest"
  },
  globals: {
    "ts-jest": {
      tsconfig: "test/tsconfig.json"
    },
    TextEncoder
  },
  moduleDirectories: ["node_modules", "./src"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/cypress"],
  transformIgnorePatterns: ["/node_modules/", "/.next/", "/cypress"],
  verbose: true
}

export default config
