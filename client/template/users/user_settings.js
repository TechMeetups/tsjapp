
Template.usersettings.events(
{
    // 'click #reset_password' : function(event, template)
    // {
    //     var passwordVar = template.find('#Password').value;
    //     //var pic = template.find('#pic').value;
    //     Meteor.call('resetpassword',Meteor.user()._id,passwordVar);
    //     // bootbox.alert("password reset successfully.", function() {});
    //     IonLoading.show({
    //       customTemplate: "Password Reset success!",
    //       duration: 2000
    //     });
    //     Router.go('/');
    // },
    'click #update_settings': function(event, template)
    {
            event.preventDefault();
            var firstname = template.find('#firstname').value;
            var city = template.find('#city').value;
            var profession = template.find('#profession').value;
            var experience = template.find('#experience').value;
            var skill = template.find('#skill').value;
            var lookingfor = template.find('#lookingfor').value;
            var pic = template.find('#pic').value;

            data = {firstname:firstname, city:city, profession:profession, experience:experience, skill:skill,
                lookingfor:lookingfor,pic:pic}
            console.log(data) ;
            
             attendee_manager.update(Meteor.user()._id,data) ; 
            
            history.back() ;                 
             
          //  template.modal.hide();
            // Router.go('events');
    }
});

Template.usersettings.helpers(
{
    profile : function()
    {
        console.log(Meteor.user().profile) ; 
        return Meteor.user().profile ; 
    }
}) ;     
