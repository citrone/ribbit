/*global Template, Session, Ribbits, Meteor*/
Template.content.helpers({
  currentPage: function (type) {
    var thePage = Session.get("currentPage");
    return thePage === type;
  }
});

Template.public.helpers({
  ribbits: function () {
    return Ribbits.find({}, {sort: {created_at: -1}});
  },
  
  publicUserFull: function (currentRibbitId) {
    var theUser = Meteor.users.findOne({_id: currentRibbitId});
    
    if (theUser) { return theUser.profile.name; }
    else { return null; }
  },
  
  publicUserName: function (currentRibbitId) {
    var theUser = Meteor.users.findOne({_id: currentRibbitId});
    
    if (theUser) { return theUser.username; }
    else { return null; }
  },

  elapsedTime: function (text) {
    var currentDate = new Date(),
      ribbitDate,
      minutes_elapsed,
      hours_elapsed,
      days_elapsed,
      retVal,
      record = Ribbits.findOne({ribbit: text});

    ribbitDate = new Date(record.created_at);
    minutes_elapsed = (currentDate - ribbitDate) / 60000;
    if (minutes_elapsed > 60) {
      hours_elapsed = minutes_elapsed / 60;
      if (hours_elapsed > 24) {
        days_elapsed = hours_elapsed / 24;
        retVal = parseInt(days_elapsed, 10) + "d";
      } else {
        retVal = parseInt(hours_elapsed, 10) + "h";
      }
    } else {
      retVal = parseInt(minutes_elapsed, 10) + "m";
    }
    return retVal;
  },

  gravatarLink: function (userId) {
    var theUser = Meteor.users.findOne({_id: userId});

    console.log(userId);
    theHash = $.md5(theUser.emails[0].address);
    console.log(theHash);
    return ('http://www.gravatar.com/avatar/' + theHash + '?s=50');
  }
});

Template.buddiescontent.helpers({
  fullName: function () {
    return Meteor.user().profile.name;
  },

  userName: function () {
    return Meteor.user().username;
  },

  noOfRibbits: function () {
    var ribbits = Ribbits.find({user_id: Meteor.userId()}),
      retVal;
    if (ribbits.count() === 1) {
      retVal = "1 Ribbit";
    } else {
      retVal = ribbits.count() + " Ribbits";
    }
    return retVal;
  },

  noOfFollowers: function () {
    var followers = Follows.find({user_id: Meteor.userId()});

    if (followers.count() === 1) {
      return '1 Follower';
    } else {
      return followers.count() + ' Followers';
    }
  },

  noOfFollowees: function () {
    var followees = Follows.find({followee_id: Meteor.userId()});

    if (followees.count() === 1) {
      return '1 Followee';
    } else {
      return followees.count() + ' Followees';
    }
  },

  lastRibbit: function () {
    var lastRibbit = Ribbits.findOne({user_id: Meteor.userId()}, {sort: {created_at: -1}}),
      retVal;

    if (lastRibbit) {
      retVal = lastRibbit.ribbit;
    } else {
      retVal = 'This user has no Ribbits';
    }

    return retVal;
  },

  ribbits: function () {
    var theFollowees = Follows.find({followee_id: Meteor.userId()}),
      followeesList=Array();
    theFollowees.forEach(function (follow) {
      followeesList.push(follow.user_id);
    });
    return Ribbits.find({
      $or: [
        {user_id: Meteor.userId()},
        {user_id: {$in: followeesList}}
      ]
    }, {sort: {created_at: -1}});
  },

  buddyFullName: function (ribbitUserId) {
    var theUser = Meteor.users.findOne({_id: ribbitUserId});
    return theUser.profile.name;
  },

  buddyUserName: function (ribbitUserId) {
    var theUser = Meteor.users.findOne({_id: ribbitUserId});
    return theUser.username;
  },

  elapsedTime: function (text) {
    var currentDate = new Date(),
      ribbitDate,
      minutes_elapsed,
      hours_elapsed,
      days_elapsed,
      retVal,
      record = Ribbits.findOne({ribbit: text});

    ribbitDate = new Date(record.created_at);
    minutes_elapsed = (currentDate - ribbitDate) / 60000;
    if (minutes_elapsed > 60) {
      hours_elapsed = minutes_elapsed / 60;
      if (hours_elapsed > 24) {
        days_elapsed = hours_elapsed / 24;
        retVal = parseInt(days_elapsed, 10) + "d";
      } else {
        retVal = parseInt(hours_elapsed, 10) + "h";
      }
    } else {
      retVal = parseInt(minutes_elapsed, 10) + "m";
    }
    return retVal;
  },

  gravatarLoggedIn: function () {
    console.log(Meteor.user().emails[0].address);
    return ('http://www.gravatar.com/avatar/' + $.md5(Meteor.user().emails[0].address + '?s=80'));
  },

  gravatarLink: function (userId) {
    var theUser = Meteor.users.findOne({_id: userId});

    console.log(userId);
    theHash = $.md5(theUser.emails[0].address);
    console.log(theHash);
    return ('http://www.gravatar.com/avatar/' + theHash + '?s=50');
  }
});

Template.profile.helpers({
  users: function () {
    if (Session.get('searchedName') !== undefined) {
      return Meteor.users.find({
        $and: [
          {_id: {$ne: Meteor.userId()}},
          {username: Session.get('searchedName')}
        ]
      });
    } else {
      return Meteor.users.find({_id: {$ne: Meteor.userId()}});
    }
  },

  lastRibbit: function (userId) {
    var lastRibbit = Ribbits.findOne({user_id: userId}, {sort: {created_at: -1}}),
      retVal;

    if (lastRibbit) {
      retVal = lastRibbit.ribbit;
    } else {
      retVal = 'This user has no Ribbits';
    }

    return retVal;
  },

  noOfFollowers: function (userId) {
    var followers = Follows.find({user_id: userId});
    if (followers.count() === 1) return "1 Follower ";
    else return followers.count() + " Followers ";
  },

  followText: function (userId) {
    var followee = Follows.findOne({
      $and: [
        {followee_id: Meteor.userId()},
        {user_id: userId}
      ]
    });
    if (followee) {
      return 'unfollow';
    } else {
      return 'follow';
    }
  },

  gravatarLink: function (userId) {
    var theUser = Meteor.users.findOne({_id: userId});

    console.log(userId);
    theHash = $.md5(theUser.emails[0].address);
    console.log(theHash);
    return ('http://www.gravatar.com/avatar/' + theHash + '?s=50');
  }
})
