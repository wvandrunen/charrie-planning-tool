"use strict";

var Planning = new Mongo.Collection("planning");

if (Meteor.isServer) {
  Meteor.startup(function () {
  });
}

Meteor.methods({
  savePlanningItem: function (planningItem) {
    console.log('Saving planningItem', planningItem);
    var id = Planning.update({date: planningItem.date}, planningItem, {upsert: true});
    Meteor.flush();
    return id;
  },
  resetPlanningItem: function z(date) {
    console.log('Resetting planningItem with date', date);
    var count = Planning.remove({date: date});
    Meteor.flush();
    return count;
  }
});
