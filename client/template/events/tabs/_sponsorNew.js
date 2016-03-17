AutoForm.hooks({
  'sponsor-new-form': {
    onSuccess: function (operation, result, template) {
      IonModal.close();
      console.log(result)
      event_id = Router.current().params._id
      Router.go("/tabs/sponsor/"+event_id+"/"+result)
      // Router.go('sponsor.details', {_id: result});
    },

    onError: function(operation, error, template) {
      alert(error);
    }
  }
});
Template._eventsNew.events({
  // 'click #btn_cancel': function (event, template) {
  //   event.preventDefault();
  //   Router.go('dashboard');
  // }
});
