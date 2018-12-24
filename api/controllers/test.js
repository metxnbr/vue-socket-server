const test = {
  index: (req, res) => {
    console.log('query', req.query)
    console.log('body', req.body)
    res.json({
      status: 'test',
    })
  }
}

module.exports = test