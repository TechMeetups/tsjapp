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
    event_id = Router.current().params._id
    user_id = Meteor.userId()
    event_manager.current_user_envent_state(event_id,user_id)
  }.bind(this));
};
Template.eventsShow.helpers({
  format_date : function(date){
    return event_manager.format_data(date)
  },
  current_user_envent_state : function(){
    console.log(Session.get('current_user_envent_state'))
   return  Session.get('current_user_envent_state');
  }
});

Template.eventsShow.events(
{
  'click #jobseeker_ticket': function (event, template)
  {
    IonLoading.show();
    event_id = Router.current().params._id
    user_id = Meteor.userId()
    event_manager.create_request_for_event_attendee(event_id,user_id)
  },
  'click #sponsor_btn': function (event, template){
    event_id = Router.current().params._id
    Router.go("/tabs/sponsor/"+event_id)
  }
});
