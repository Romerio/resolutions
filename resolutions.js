Resolutions = new Mongo.Collection("resolutions");

if (Meteor.isClient) {

  Meteor.subscribe("resolutions");

  Template.body.helpers({
    resolutions: function() {

      if (Session.get("hideFinished")) {
        return Resolutions.find({checked: {$ne: true}});
      } else {
        return Resolutions.find();
      }
    },
    "hideFinished": function() {
      return Session.get("hideFinished");
    }
  });

  Template.body.events({

    // Adicionando Resolution
    "submit .new-resolution": function(event) {
      var titleVar = event.target.title.value;
      var currentUser = Meteor.userId();

      Meteor.call("addResolutions", titleVar, currentUser, new Date());

      event.target.title.value = "";

      return false;
    },

    "change .hide-finished": function(event) {
      Session.set("hideFinished", event.target.checked);
    }
  });

  Template.resolution.events({

    // Atualizando Resolution
    "click .toggle-checked": function() {
      var currentUser = Meteor.userId();
      Meteor.call("updateResolutions", this._id, currentUser, !this.checked);
    },

    // Removendo Resolution
    "click .delete": function() {
      var currentUser = Meteor.userId();
      Meteor.call("removeResolutions", this._id, currentUser);
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish("resolutions", function() {
    var currentUser = this.userId;
    return Resolutions.find({createBy: currentUser});
  });

}

Meteor.methods({
  removeResolutions: function(id, user) {
    Resolutions.remove({_id: id, createBy: user});
  },

  updateResolutions: function(id, user, checked) {
    Resolutions.update({_id: id, createBy: user}, {$set: {checked: checked}});
  },

  addResolutions: function(title, user, date) {
    console.log("chamou");
    Resolutions.insert({title: title, createBy: user, createdAt: date});
  }
});

