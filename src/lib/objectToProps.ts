const objectToProps = <T>(values: { [key: string]: T }) => ({
  props: {
    ...values
  }
})

export default objectToProps
