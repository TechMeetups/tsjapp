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
  current_user_envent_state : function()
  {

   return  Session.get('current_user_envent_state');
  }
});

Template.eventsShow.events(
{
  'click #jobseeker_ticket': function (event, template)
  {

    IonLoading.show({
      customTemplate: "Generating Ticket...",
      duration: 2000
    });

    event_id = Router.current().params._id
    user_id = Meteor.userId()
    event = Events.findOne({_id:event_id});
    checkout_item = {
      user_id : user_id,
      pic : event.pic.length > 1 ? event.pic : " ",
      item_type:"ticket",
      desc:"free ticket "+event.name,
      amount:"0.0",
      paid:"unpaid",
      item_id:event_id,
      created_at:new Date()
    }
    console.log(checkout_item)
    //checkout_manager.checkout_item(checkout_item)
    event_manager.create_request_for_event_attendee(event_id,user_id,checkout_item)
  },
  'click #sponsor_btn': function (event, template){
    event_id = Router.current().params._id
    Router.go("/tabs/sponsor/"+event_id)
  },
  'click #btn_notification': function (event, template) {
    IonPopup.confirm({
       title: 'confirm notification?',
       template: 'Please press ok to notify all attendees for event change notification.',
       onOk: function() {
         console.log(Router.current().params._id)
         Meteor.call("notification_event_update", Router.current().params._id, function(error, result){
           if(error){
             console.log("error", error);
           }
           if(result){

           }
         });
       },
       onCancel: function() {
         Router.go('events.show', {_id: Router.current().params._id});
       }
     });
  },
  "click #btn_add_notification" : function(e,t){
    IonPopup.confirm({
       title: 'confirm notification?',
       template: 'Please press ok to notify all attendees for company notification.',
       onOk: function() {
         console.log(Router.current().params._id)
         Meteor.call("notification_event_add", Router.current().params._id, function(error, result){
           if(error){
             console.log("error", error);
           }
           if(result){

           }
         });
       },
       onCancel: function() {

       }
     });
  }
});
