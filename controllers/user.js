const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports.register = (req, res) => {

  User.findOne({ email: req.body.email }, (err, user) => {

    if (user) {

      return res.status(406).send({ error: 'Este e-mail já está em uso. Tente outro.' })
    }

    User.create(req.body, (err, user) => {

      return res.status(200).send(user)
    })
  })
}

module.exports.addItemToCart = (req, res) => {

  const { userId, productCode, amount } = req.body;

  console.log(userId)

  User.findById(
    userId,
    (err, user) => {
      console.log('>>>', user);
      let item = { code: productCode, amount: amount }
      user.cart.push(item)
      user.save(item)

      return res.send(user).status(200)
    });
}