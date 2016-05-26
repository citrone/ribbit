/*global Session, Meteor, Template, Accounts*/
Session.set("currentPage", "buddies");

Meteor.subscribe('allusers');

var Ribbits = new Meteor.Collection('ribbits');
Meteor.subscribe('ribbits');

var Follows = new Meteor.Collection('follows');
Meteor.subscribe('follows');

// handling click event on the Log In button
Template.header.events({
  'click #btnLogOut': function (event, template) {
    if (Meteor.userId()) {
      Meteor.logout();
    } else {
      var userName     = template.find('#username').value,
        userPassword = template.find('#password').value;
      Meteor.loginWithPassword(userName, userPassword, function (error) {
        if (error) {
          //$('#userError').fadeIn(500);
          console.log(error);
        }
      });
    }
  },

  'click #public': function (event, template) {
    Session.set("currentPage", "public");
  },

  'click #buddies': function (event, template) {
    Session.set("currentPage", "buddies");
  },
  
  'click #profiles': function (event, template) {
    Session.set("currentPage", "profile");
  }
});

// handling the click event on the CreateAccount button
Template.homecontent.events({
  'click #btnCreateAccount': function (event, template) {
    var userEmail = template.find('#email').value,
      userName  = template.find('#newusername').value,
      password  = template.find('#newpassword').value,
      password2 = template.find('#password2').value,
      name      = template.find('#fullname').value;

    Accounts.createUser({
      username: userName,
      email:    userEmail,
      password: password,
      profile: {
        name: name
      }
    }, function (error) {
      if (error) {
        console.log("Cannot create user");
      }
    });
  }
});

// handling the click event on the Ribbit button
Template.buddiescontent.events({
  'click #createTheRibbit': function (event, template) {
    var ribbitContent= template.find('.ribbitText').value;

    Ribbits.insert({
      user_id: Meteor.user()._id,
      ribbit: ribbitContent,
      created_at: new Date()
    });
    template.find('.ribbitText').value = "";
  }
});

// handling the events in the public ribbits section
Template.public.events({
  'click input': function (event, template) {
    var ribbitContent= template.find('.ribbitText').value;

    Ribbits.insert({
      user_id: Meteor.user()._id,
      ribbit: ribbitContent,
      created_at: new Date()
    });
    template.find('.ribbitText').value = "";
  }
});

// handling events in the profiles section
Template.profile.events({
  'click .follow': function(event, template) {
    var isFollowed, theClickedUserId = event.currentTarget.id,
      theFollowees = Follows.find({user_id: theClickedUserId});

    theFollowees.forEach(function (theFollowee) {
      if (theFollowee.followee_id === Meteor.userId()) {
        isFollowed = true;
      } else {
        isFollowed = false;
      }
    });

    if (!isFollowed) {
      Follows.insert({
        user_id: theClickedUserId,
        followee_id: Meteor.userId()
      });
    } else {
      var theOneToBeRemoved = Follows.findOne({
       $and: [
         {user_id: theClickedUserId},
         {followee_id: Meteor.userId()}
        ]
      });
      Follows.remove(theOneToBeRemoved._id);
    }
  },
  'click input[type="submit"]': function(event, template) {
    var searchedUser = template.find('input[type="text"]').value;
    if (searchedUser !== "") {
      Session.set('searchedName', searchedUser);
    } else {
      Session.set('searchedName', undefined);
    }
    Template.profile();
  }
});
