Template.userprofile.events(
{
    'click #reset_password' : function(event, template)
    {
        var passwordVar = template.find('#Password').value;
        var passwordVar1 = template.find('#Password1').value;

        if(passwordVar != passwordVar1)
        {
            alert('Passwords do not match!') ;
            return ; 
        }    

        //var pic = template.find('#pic').value;
        Meteor.call('resetpassword',Meteor.user()._id,passwordVar);
        // bootbox.alert("password reset successfully.", function() {});
        IonLoading.show({
          customTemplate: "Password Reset success!",
          duration: 2000
        });
        Router.go('/');
    }
});
