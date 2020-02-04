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

updatesProductPriceByQuantity = (amount, price) => {

  return price * amount
}

upSertItemToCart = (user, requisitionData, req, res) => {

  const { productName, productId, amount, price } = requisitionData

  let priceByQuantity = updatesProductPriceByQuantity(amount, price)
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

    let priceByQuantity = updatesProductPriceByQuantity(amount, price)
    let item = { name: productName, code: productId, amount: amount, price: priceByQuantity }
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
// TODO: change functions name: handleCartsItem
module.exports.addItemToCart = (req, res) => {

  const { userId, productName, productCode, amount } = req.body;

  User
    .findById(userId)
    .select('cart')
    .exec((err, user) => {

      const { productName, productId, amount, price } = req.body

      if (!user) {

        return res.status(404).send({ message: 'Usuário ñ encontrado!' })
      }

      // TODO: Apply ternary operator
      if (user.cart.length <= 0) {
        // TODO: DRY
        let priceByQuantity = updatesProductPriceByQuantity(amount, price)
        let item = { name: productName, code: productId, amount: amount, price: priceByQuantity }
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

  // BLOCO DE CÓDIGO QUE REMOVE ITEM CASO QUANTIDADE SEJA 0
      // let checkedCart = checkCart(user.cart, productId)
      // if (amount == 0) {
      //   user.cart.splice(user.cart.indexOf(checkedCart[0]), 1)

      //   user.save((err, user) => {
      //     if (err) {
      //       res.status(404).send(err)
      //     } else {
      //       res.status(200).send(user)
      //     }
      //   })
      // }
}