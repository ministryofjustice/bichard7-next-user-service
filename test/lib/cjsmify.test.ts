import cjsmify from "lib/cjsmify"

describe("cjsmify()", () => {
  it("should append .cjsm.net to an email address if it doesn't already end in .cjsm.net", () => {
    expect(cjsmify("bichard01@example.com")).toEqual("bichard01@example.com.cjsm.net")
    expect(cjsmify("SUPERVISOR@PNN.POLICE.UK")).toEqual("SUPERVISOR@PNN.POLICE.UK.cjsm.net")
  })

  it("should not append .cjsm.net to an email address if it already ends in .cjsm.net", () => {
    expect(cjsmify("bichard01@example.com.cjsm.net")).toEqual("bichard01@example.com.cjsm.net")
    expect(cjsmify("SUPERVISOR@PNN.POLICE.UK.CJSM.NET")).toEqual("SUPERVISOR@PNN.POLICE.UK.CJSM.NET")
  })
})
