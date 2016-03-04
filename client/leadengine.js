Meteor.startup(function()
{
  //router = new Auth_Router();
  AutoForm.setDefaultTemplate('ionic');

  for(var property in Template)
  {
          if(Blaze.isTemplate(Template[property]))
          {
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
  Template.layout.events(
  {
    "click .logout": function(event, template)
    {
      console.log("checklogin")
      Meteor.logout();
      Session.set('login_user',null)
      Router.go("login");
    }
  });
  EVENT_INCREMENT = 10;
  function showMoreVisible()
    {
          console.log("Scrolling logs");
          var threshold, target = $("#showMoreEvents");
          console.log(target.length)
          if (!target.length)
            return;

          threshold = $(".overflow-scroll").scrollTop() + $(".overflow-scroll").height() - target.height();
          console.log(threshold)
          console.log(target.offset().top)
          if (target.offset().top < threshold)
          {
              if (!target.data("visible"))
              {
                  console.log("target became visible (inside viewable area)");
                  target.data("visible", true);
                  Session.set("eventLimit",Session.get("eventLimit") + EVENT_INCREMENT);
                //  Session.set("productscopeLimit",Session.get("productscopeLimit") + ITEMS_INCREMENT);
              }
          }
          else
          {
              if (target.data("visible"))
              {
                  console.log("target became invisible (below viewable arae)");
                  target.data("visible", false);
              }
          }

          console.log('LogLimit :'+Session.get("eventLimit")) ;
      }
  $(document).ready(function()
  {
  // run the above func every time the user scrolls
    $(".overflow-scroll").scroll(showMoreVisible());
  });


}
