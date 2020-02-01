const User = require('./user')
const Restaurant = require('./restaurant')
const Order = require('./order')
const Server = require('./server')
const Menu = require('./menu')
const Menu_Order = require('./menu_order')

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

Restaurant.hasMany(User) //SO FOREIGN KEY WILL LIVE ON USER
User.belongsTo(Restaurant)
Restaurant.hasMany(Order) //SO FOREIGN KEY WILL LIVE ON ORDER
Restaurant.hasMany(Server) //SO FOREIGN KEY WILL LIVE ON SERVER
Server.belongsTo(Restaurant)
Server.hasMany(Order) // SO FOREIGN KEY WILL LIVE ON ORDER
Order.belongsTo(Server)
Order.belongsToMany(Menu, {through: {model: Menu_Order}})
Menu.belongsToMany(Order, {through: {model: Menu_Order}})

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,
  Restaurant,
  Order,
  Server,
  Menu,
  Menu_Order
}
