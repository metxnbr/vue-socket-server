const test = {
  index: (req) => {
    console.log('query', req.query)
  console.log('body', req.body)
  }
}

module.exports = test