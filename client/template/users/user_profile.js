Template.userprofile.events({
    'click #reset_password' : function(event, template){
        var passwordVar = template.find('#password').value;
        Meteor.call('resetpassword',Meteor.user()._id,passwordVar);
        bootbox.alert("password reset successfully.", function() {});
    }
});
