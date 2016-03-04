AutoForm.hooks({
  'events-new-form': {
    onSuccess: function (operation, result, template) {
      IonModal.close();
      Router.go('events.show', {_id: result});
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
