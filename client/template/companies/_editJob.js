AutoForm.hooks({
  'editJob': {
    onSuccess: function (operation, result, template) {
      IonModal.close();
    },
    onError: function(operation, error, template) {
      alert(error);
    }
  }
});
Template._editJob.events({
  // 'click #btn_cancel': function (event, template) {
  //   event.preventDefault();
  //   Router.go('dashboard');
  // }
});
Template._editJob.helpers({
  job : function(){
    return Job.findOne({});
  }
});
