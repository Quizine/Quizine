const User = require('./user')
const Restaurant = require('./restaurant')
const Order = require('./order')
const Waiter = require('./waiter')
const Menu = require('./menu')
const {MenuItemOrder} = require('./menu_order')

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

Restaurant.hasMany(User) //SO FOREIGN KEY WILL LIVE ON USER
User.belongsTo(Restaurant)
Restaurant.hasMany(Order) //SO FOREIGN KEY WILL LIVE ON ORDER
Restaurant.hasMany(Menu) //SO FOREIGN KEY WILL LIVE ON MENU
Restaurant.hasMany(Waiter) //SO FOREIGN KEY WILL LIVE ON WAITER
Waiter.belongsTo(Restaurant)
Menu.belongsTo(Restaurant)
Waiter.hasMany(Order) // SO FOREIGN KEY WILL LIVE ON ORDER
Order.belongsTo(Waiter)
Order.belongsToMany(Menu, {through: MenuItemOrder})
Menu.belongsToMany(Order, {through: MenuItemOrder})

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
  Waiter,
  Menu,
  MenuItemOrder
}
