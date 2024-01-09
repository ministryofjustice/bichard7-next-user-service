const pinned = []
const ignored = []
const skipped = [
  /*{ package: "next", version: "13.4.13" }*/
]

module.exports = {
  target: (pkg) => {
    if (pinned.some((pin) => pin === pkg)) {
      const res = "minor"
      console.log(` ${pkg} is pinned to ${res} upgrades only (.ncurc.js)`)
      return res
    }
    return "latest"
  },

  filterResults: (pkg, { upgradedVersion }) => {
    if (ignored.some((ignore) => ignore.package === pkg)) {
      return
    } else if (skipped.some((skip) => skip.package === pkg && skip.version === upgradedVersion)) {
      return
    }
    return true
  }
}
