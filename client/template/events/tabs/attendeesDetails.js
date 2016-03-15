Template.attendeesDetails.created = function () {
  this.autorun(function () {
    this.subscription = Meteor.subscribe('attendees_details',Router.current().params._id,Router.current().params._attendee_id);
  }.bind(this));
};
Template.attendeesDetails.rendered = function () {
  this.autorun(function () {
    if (!this.subscription.ready()) {
      IonLoading.show();
    } else {
      IonLoading.hide();
    }
  }.bind(this));
};
Template.attendeesDetails.helpers({
  format_date : function(date){
    return event_manager.format_data(date)
  }
});
Template.attendeesDetails.events(
{
  'click #meet_candidate' : function(event, template)
  {
    attendee_id = Router.current().params._attendee_id;
    user_id = Meteor.userId();
    request_type = "meet_candidate"
    request ={request_type:request_type,user_id:user_id,attendee_id:attendee_id}
    console.log(request)
    event_manager.meet_candidate(request);
  }
});
