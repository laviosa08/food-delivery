require('./config/database.js');

const User = function(user) {
  this.id = user.id;
  this.name = user.name;
  this.active = user.active;
};