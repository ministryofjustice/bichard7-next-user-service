function getDate(daysInPast) {
  const x = new Date()
  x.setDate(x.getDate() - daysInPast)
  return x
}

const serviceMessages = [
  {
    message: "Message 1",
    created_at: getDate(270)
  },
  {
    message: "Message 2",
    created_at: getDate(180)
  },
  {
    message: "Message 3",
    created_at: getDate(90)
  },
  {
    message: "Message 4",
    created_at: getDate(60)
  },
  {
    message: "Message 5",
    created_at: getDate(35)
  },
  {
    message: "Message 6",
    created_at: getDate(31)
  },
  {
    message: "Message 7",
    created_at: getDate(27)
  },
  {
    message: "Message 8",
    created_at: getDate(25)
  },
  {
    message: "Message 9",
    created_at: getDate(20)
  },
  {
    message: "Message 10",
    created_at: getDate(15)
  },
  {
    message: "Message 11",
    created_at: getDate(10)
  },
  {
    message: "Message 12",
    created_at: getDate(5)
  },
  {
    message: "Message 13",
    created_at: new Date()
  }
]

export default serviceMessages
