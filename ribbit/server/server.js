/*global Meteor*/
Meteor.publish('allusers', function() {
  return Meteor.users.find({}, {
    fields: {'_id': 1, 'emails': 1, 'username': 1, 'profile': 1}
  });
});

var Ribbits = new Meteor.Collection('ribbits');
Meteor.publish('ribbits', function () {
  return Ribbits.find({});
});

Ribbits.allow({
  insert: function () {
    return true;
  }
});

var Follows = new Meteor.Collection('follows');
Meteor.publish('follows', function () {
  return Follows.find();
});

Follows.allow({
  insert: function () {
    return true;
  },

  remove: function () {
    return true;
  }
});
