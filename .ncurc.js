/*
  Skipped:
  - next
    - 13.4.13 causes failures with fetch
*/
const pinned = ["eslint", "eslint-plugin", "@typescript-eslint/eslint-plugin", "@typescript-eslint/parser", "eslint-config-airbnb-typescript"]
const ignored = []
const skipped = [{ package: "next", version: "13.4.13" }]

module.exports = {
  target: (package) => {
    if (pinned.some((pin) => pin === package)) {
      const res = "minor"
      console.log(` ${package} is pinned to ${res} upgrades only (.ncurc.js)`)
      return res
    }
    return "latest"
  },

  filterResults: (package, { upgradedVersion }) => {
    if (ignored.some((ignore) => ignore.package === package)) {
      return
    } else if (skipped.some((skip) => skip.package === package && skip.version === upgradedVersion)) {
      return
    }
    return true
  }
}
