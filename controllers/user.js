const mongoose = require('mongoose')
const User = mongoose.model('User')

savesUserData = (userData, req, res) => {

  userData.save((err, userData) => {
    if (err) {
      res.status(404).json(err)
    } else {
      res.status(200).json(userData)
    }
  })
}

checkCart = (cart, itemId) => {

  let checkResult = []
  for (const item of cart) {
    if (item.code === itemId) {
      checkResult.push(item)
    }
  }

  return checkResult
}

updatesProductPriceByQuantity = (amount, price, operationType, currantValue) => {

  if (operationType == 'subtraction') {
    return currantValue - price
  } else {
    return price * amount
  }
}

upSertItemToCart = (user, requisitionData, req, res) => {

  const SUM = 'sum'

  const { productName, productId, amount, price } = requisitionData

  let priceByQuantity = updatesProductPriceByQuantity(amount, price, SUM)
  let checkedCart = checkCart(user.cart, productId)

  if (checkedCart.length > 0) {
    user.cart.splice(user.cart.indexOf(checkedCart[0]), 1)
    let modifiedItem = {
      name: productName,
      code: checkedCart[0].code,
      amount: amount,
      price: priceByQuantity
    }
    user.cart.push(modifiedItem)
    // TODO: DRY
    user.save((err, user) => {
      if (err) {
        res.status(404).json(err)
      } else {
        let thisReview = user.cart[user.cart.length - 1];
        res.status(200).json(thisReview)
      }
    })
  } else {

    let item = { name: productName, code: productId, amount: amount }
    user.cart.push(item)
    // TODO: DRY
    user.save((err, user) => {
      if (err) {
        res.status(404).json(err)
      } else {
        res.status(200).json(user)
      }
    })
  }
}

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

  const { userId, productName, productCode, amount } = req.body;

  User
    .findById(userId)
    .select('cart')
    .exec((err, user) => {

      const { productName, productId, amount } = req.body

      if (!user) {
        return res.status(404).send({ message: 'Usuário ñ encontrado!' })
      }

      if (user.cart.length <= 0) {

        let item = { name: productName, code: productId, amount: amount }
        user.cart.push(item)

        user.save((err, user) => {
          if (err) {
            res.status(404).json(err)
          } else {
            res.status(200).json(user)
          }
        })
      } else {

        upSertItemToCart(user, req.body, req, res)
      }
    });
}

module.exports.removeItemFromCart = (req, res) => {

  const { productName, amount, price, userId, productId } = req.body
  // TODO: criar enum
  const SUBTRACTION = 'subtraction'

  User.findById(
    userId,
    (err, user) => {


      if (!user) {
        res.status(400).send({
          ok: false,
          message: 'Usuário ñ encontrado'
        })
      }

      if (amount == 0) {

        let checkedCart = checkCart(user.cart, productId)
        user.cart.splice(user.cart.indexOf(checkedCart[0]), 1)
        user.save((err, user) => {
          if (err) {
            res.status(404).json(err)
          } else {
            res.status(200).json(user)
          }
        })
      } else {

        let checkedCart = checkCart(user.cart, productId)
        let priceByQuantity = updatesProductPriceByQuantity(amount, price, SUBTRACTION, checkedCart[0].price)

        user.cart.splice(user.cart.indexOf(checkedCart[0]), 1)

        let item = {
          name: productName,
          code: checkedCart[0].code,
          amount: amount,
          price: priceByQuantity
        }

        user.cart.push(item)

        user.save((err, user) => {
          if (err) {
            res.status(404).json(err)
          } else {
            res.status(200).json(user)
          }
        })
      }
    })
}