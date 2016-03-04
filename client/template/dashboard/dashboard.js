Template.dashboard.created = function () {
  this.autorun(function () {
    this.subscription = Meteor.subscribe('events');
  }.bind(this));
};

Template.dashboard.rendered = function () {
  this.autorun(function () {
    if (!this.subscription.ready()) {
      IonLoading.show();
    } else {
      IonLoading.hide();
    }
  }.bind(this));
};

Template.dashboard.helpers({
  events: function () {
    return Events.find();
  }
});
Template.dashboard.events({
  'onkeyup #search': function (event, template) {
    console.log($(this).val());
    //session.set("search","")
  }
});
