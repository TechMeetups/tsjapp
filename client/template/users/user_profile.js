Template.userprofile.events(
{
    'click #reset_password' : function(event, template)
    {
        var passwordVar = template.find('#Password').value;
        var pic = template.find('#pic').value;
        Meteor.call('resetpassword',Meteor.user()._id,passwordVar,pic);
        // bootbox.alert("password reset successfully.", function() {});
        IonLoading.show({
          customTemplate: "User profile updated successfully",
          duration: 3000
        });
        Router.go('/');
    }
});
