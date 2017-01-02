Template.userprofile.events(
{
    'click #reset_password' : function(event, template)
    {
        var passwordVar = template.find('#Password').value;
        var passwordVar1 = template.find('#Password1').value;
        var email = template.find('#email').value;
        if(passwordVar != passwordVar1)
        {
            alert('Passwords do not match!') ;
            return ;
        }

        //var pic = template.find('#pic').value;
        Meteor.call('resetpassword',Meteor.user()._id,passwordVar,email,function(e){
          if(e){
            IonPopup.alert({
               title: 'notification',
               template: e
            });
          }else{
            IonLoading.show({
              customTemplate: "Password Reset success!",
              duration: 2000
            });
            Router.go('/');
          }
        });
        // bootbox.alert("password reset successfully.", function() {});


    }
});
Template.userprofile.helpers({
  my_email: function(){
    var email = getUserEmail(Meteor.user())
      if(email== false){
        return "";
      }else{
        return email;
      }
  }
});
