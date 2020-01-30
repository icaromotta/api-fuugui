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
/* Adiciona item ao carrinho*/
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

  User.findById(
    req.params.userId,
    (err, user) => {

      user.cart.map((item) => {

        if (item._id == req.params.itemId) {
          // delete item._id
          console.log('>>>', item)
        }
      })
      // return res.send(user).status(200)
    });
}

/* Adiciona novo item */
addItem = (item) => { }

/* Verifica se o item existe no carrinho */
checkCart = (cart, itemId) => {

  let checkResult = []
  for (const item of cart) {
    if (item.code === itemId) {
      checkResult.push(item)
    }
  }

  return checkResult
}

/* Verifica a disponibilidade do item enviado */
upSertItemToCart = (user, requisitionData, req, res) => {

  const { productName, productId, amount } = requisitionData
  let checkedCart = checkCart(user.cart, productId)

  // TODO: Adiciona bloco de código ao metodo addItem
  if (checkedCart.length > 0) {

    user.cart.splice(user.cart.indexOf(checkedCart[0]), 1)
    let modifiedItem = { name: productName, code: checkedCart[0].code, amount: amount }
    user.cart.push(modifiedItem)

    user.save((err, user) => {
      if (err) {

        res.status(404).json(err)
      } else {
        let thisReview = user.cart[user.cart.length - 1];
        res.status(200).json(thisReview)
      }
    })
  } else {

    console.log('INSERIR')

    // TODO: Adiciona bloco de código ao metodo addItem
    let item = { name: productName, code: productId, amount: amount }
    user.cart.push(item)

    user.save((err, user) => {
      if (err) {
        res.status(404).json(err)
      } else {
        res.status(200).json(user)
      }
    })
  }


  // for (const item of cart) {

  // console.log(item);

  // if(!item) {
  //   console.log('Salva!', item);
  // } else {
  //   console.log('Atualiza', item);
  // }

  // user.cart.splice(user.cart.indexOf(item.code), 1);
  // let updateItem = { name: productName, code: productCode, amount: amount }
  // user.cart.push(updateItem)
  // console.log('>>', user)


  // Atualiza a quantidade do item(produto)
  // if (item.code === productCode) {

  // console.log('>>', item)

  // user.cart.splice(user.cart.indexOf(item.code), 1);
  // let updateItem = { name: productName, code: productCode, amount: amount }
  // user.cart.push(updateItem)



  // user.save((err, user) => {
  //   if (err) {

  //     res.status(404).json(err)
  //   } else {
  //     let thisReview = user.cart[user.cart.length - 1];
  //     res.status(200).json(thisReview)
  //   }
  // })


  // } else {
  // console.log('>>>>>')
  // Adiciona novo item
  // let newItem = { name: productName, code: productCode, amount: amount }
  // user.cart.push(newItem)
  // user.save((err, user) => {
  //   if (err) {
  //     res.status(404).json(err)
  //   } else {
  //     let thisReview = user.cart[user.cart.length - 1];
  //     res.status(200).json(thisReview)
  //   }
  // });
  // }

  // }
}