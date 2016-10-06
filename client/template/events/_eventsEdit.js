AutoForm.hooks({
  'events-update-form': {
    onSuccess: function (operation, result, template) {
      IonModal.close();

    },
    onError: function(operation, error, template) {
      alert(error);
    }
  }
});
Template._eventsEdit.events({
  
});
Template._eventsEdit.helpers({
  current_event: function(){
    return Events.findOne({_id:Router.current().params._id});
  }
});
