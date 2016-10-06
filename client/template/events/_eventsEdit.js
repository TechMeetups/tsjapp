AutoForm.hooks({
  'events-update-form': {
    onSuccess: function (operation, result, template) {
      IonModal.close();
      console.log(result)
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

    onError: function(operation, error, template) {
      alert(error);
    }
  }
});
Template._eventsEdit.events({
  // 'click #btn_cancel': function (event, template) {
  //   event.preventDefault();
  //   Router.go('dashboard');
  // }
});
Template._eventsEdit.helpers({
  current_event: function(){
    return Events.findOne({_id:Router.current().params._id});
  }
});
