import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsconfig: "test/tsconfig.json"
    }
  },
  moduleDirectories: ["node_modules", "./src"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/cypress"],
  transformIgnorePatterns: ["/node_modules/", "/.next/", "/cypress"],
  verbose: true
}

export default config
