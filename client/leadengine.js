Template.registerHelper('fa_login_url', function(){
  return "https://api.freeagent.com/v2/approve_app?scope=test&redirect_uri="+FA_AUTH_URL+"&response_type=code&client_id="+FA_CLIENT_ID_KEY+"&access_type=offline";
});
Template.registerHelper('cc_login_url', function(){
  return "https://oauth2.constantcontact.com/oauth2/oauth/siteowner/authorize?response_type=code&client_id="+CC_CLIENT_ID_KEY+"&redirect_uri="+CC_AUTH_URL+"&access_type=offline";
});


Deps.autorun(function() {
  contacts_subscribe_list = Meteor.subscribe("contacts",Meteor.userId());
})
Meteor.startup(function(){
  //router = new Auth_Router();

  for(var property in Template){
          if(Blaze.isTemplate(Template[property])){
              var template = Template[property];
              // assign the template an onRendered callback who simply prints the view name
              template.onRendered(function(){

              });
          }
      }
  });
// Client specific code *******************************************************************************
if (Meteor.isClient)
{

  Template.layout.events({
    "click .logout": function(event, template){
      console.log("checklogin")
      Meteor.logout();
      Session.set('login_user',null)
      Router.go("login");
    }
  });

  Template.menu.helpers({
    user : function() {
      return  Meteor.user();
    }
  });
}
