"use strict";

var Planning = new Mongo.Collection("planning");

Date.prototype.getMonday = function () {
  var d = new Date(+this);
  var day = d.getDay();
  var diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

Date.prototype.addDays = function (days) {
  this.setDate(this.getDate() + days);
  return this;
};

Date.prototype.getWeek = function () {
  var onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};

Date.prototype.stripTime = function () {
  var d = new Date(+this);
  return d.setHours(0, 0, 0, 0);
};

function buildCalendarForWeek() {
  var daysNames = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];

  var currentDate = new Date();
  var monday = currentDate.getMonday();

  var range = _.range(7);

  return _.map(range, function (number) {
    var dayDate = new Date(monday).addDays(number);
    var planned = Planning.find({date: dayDate.stripTime()});

    var morning = false;
    var evening = false;
    var school = false;

    if (planned.count() === 1) {
      var type = planned.fetch()[0]._type;

      if (type === 'MORNING') {
        morning = true;
      } else if (type === 'EVENING') {
        evening = true;
      }
    }

    return {
      date: dayDate.stripTime(),
      name: daysNames[dayDate.getDay()],
      morning: morning,
      evening: evening,
      school: school
    };
  });
}

if (Meteor.isClient) {

  var weekNumber = Session.get("weekNumber");

  if (!weekNumber) {
    weekNumber = new Date().getWeek();
    Session.set("weekNumber", weekNumber);
  }

  var cal = buildCalendarForWeek();

  console.log(cal);

  Session.set("planning", cal);

  Template.body.helpers({weekDays: Session.get("planning")});

  Template.body.events = {
    'click .toggle-morning': function (e) {
      e.preventDefault();

      if (!this.morning) {
        var type = 'MORNING';
        var planningItem = {date: this.date, _type: type};

        Meteor.call("savePlanningItem", planningItem, function (error, id) {
          console.log("Saved planning item with:", id);
          Session.set("planning", buildCalendarForWeek());
        });
      } else {
        Meteor.call("resetPlanningItem", this.date, function (error, id) {
          console.log("Reset executed for planning item with:", id);
          Session.set("planning", buildCalendarForWeek());
        });
      }
    },
    'click .toggle-evening': function (e) {
      e.preventDefault();

      if (!this.evening) {
        var type = 'EVENING';
        var planningItem = {date: this.date, _type: type};

        Meteor.call("savePlanningItem", planningItem, function (error, id) {
          console.log("Saved planning item with:", id);
        });
      } else {
        Meteor.call("resetPlanningItem", this.date, function (error, id) {
          console.log("Reset executed for planning item with:", id);
        });
      }
    }
  };
}
