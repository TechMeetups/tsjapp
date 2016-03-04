Template.eventsShow.created = function () {
  this.autorun(function () {
    this.subscription = Meteor.subscribe('event', Router.current().params._id);
  }.bind(this));
};
Template.eventsShow.rendered = function () {
  this.autorun(function () {
    if (!this.subscription.ready()) {
      IonLoading.show();
    } else {
      IonLoading.hide();
    }
  }.bind(this));
};
Template.eventsShow.helpers({
  format_date : function(date){
    return event_manager.format_data(date)
  }
});
