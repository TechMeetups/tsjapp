AutoForm.hooks({
  'editCompany': {
    onSuccess: function (operation, result, template) {
      IonModal.close();
    },
    onError: function(operation, error, template) {
      alert(error);
    }
  }
});
Template._editCompany.events({
  // 'click #btn_cancel': function (event, template) {
  //   event.preventDefault();
  //   Router.go('dashboard');
  // }
});
Template._editCompany.helpers({
  company : function(){
    return Company.findOne({});
  }
});
