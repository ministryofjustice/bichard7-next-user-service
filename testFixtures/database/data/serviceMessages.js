const serviceMessages = [
  {
    message: "Message 1",
    created_at: () => {
      const x = new Date()
      x.setDate(x.getDate() - 270)
      return x
    }
  },
  {
    message: "Message 2",
    created_at: () => {
      const x = new Date()
      x.setDate(x.getDate() - 180)
      return x
    }
  },
  {
    message: "Message 3",
    created_at: () => {
      const x = new Date()
      x.setDate(x.getDate() - 90)
      return x
    }
  },
  {
    message: "Message 4",
    created_at: () => {
      const x = new Date()
      x.setDate(x.getDate() - 60)
      return x
    }
  },
  {
    message: "Message 5",
    created_at: () => {
      const x = new Date()
      x.setDate(x.getDate() - 35)
      return x
    }
  },
  {
    message: "Message 6",
    created_at: () => {
      const x = new Date()
      x.setDate(x.getDate() - 31)
      return x
    }
  },
  {
    message: "Message 7",
    created_at: () => {
      const x = new Date()
      x.setDate(x.getDate() - 27)
      return x
    }
  },
  {
    message: "Message 8",
    created_at: () => {
      const x = new Date()
      x.setDate(x.getDate() - 25)
      return x
    }
  },
  {
    message: "Message 9",
    created_at: () => {
      const x = new Date()
      x.setDate(x.getDate() - 20)
      return x
    }
  },
  {
    message: "Message 10",
    created_at: () => {
      const x = new Date()
      x.setDate(x.getDate() - 15)
      return x
    }
  },
  {
    message: "Message 11",
    created_at: () => {
      const x = new Date()
      x.setDate(x.getDate() - 10)
      return x
    }
  },
  {
    message: "Message 12",
    created_at: () => {
      const x = new Date()
      x.setDate(x.getDate() - 5)
      return x
    }
  },
  {
    message: "Message 13",
    created_at: new Date()
  }
]

export default serviceMessages
