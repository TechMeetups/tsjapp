if(Meteor.Device.isPhone()){
    Router.onAfterAction(function(){
        changeLayout();
        this.next();
    });
}

function toggle_sidebar()
{
    if(!Meteor.Device.isPhone())
    {
        Meteor.defer(function ()
        {
            $('#main-content').css({
                'margin-left': '0px'
            });
            $('#sidebar > ul').hide();
            $('#sidebar').hide();
            $("#container").addClass("sidebar-closed");
        });
    }
}

Template.menu.rendered = function ()
{

    if(!this._rendered)
    {
        this._rendered = true;
        $("#sidebar").niceScroll({styler:"fb",cursorcolor:"#4ECDC4", cursorwidth: '3', cursorborderradius: '10px', background: '#404040', spacebarenabled:false, cursorborder: ''});
        $("html").niceScroll({styler:"fb",cursorcolor:"#4ECDC4", cursorwidth: '6', cursorborderradius: '10px', background: '#404040', spacebarenabled:false,  cursorborder: '', zindex: '1000'});

    }
    $('.fa-bars').on('tap',function()
    {
        if ($('#sidebar > ul').is(":visible") === true)
        {
            $('#main-content').css({
                'margin-left': '0px'
            });
            $('#sidebar > ul').hide();
            $('#sidebar').hide();
            $("#container").addClass("sidebar-closed");
        }
        else
        {
            $('#main-content').css({
                'margin-left': '210px'
            });
            $('#sidebar').show();
            $('#sidebar > ul').show();
            $("#container").removeClass("sidebar-closed");
        }
    });

    $('.logout').on('tap',function()
    {
        Session.set('selected_project',"")
        Meteor.logout();
    });
    $('.sub-menu a').on('tap',function()
    {

        var o = ($(event.target).offset());
        diff = 250 - o.top;
        if(diff>0)
        {
            $("#sidebar").scrollTo("-="+Math.abs(diff),500);
        }
        else
        {
            $("#sidebar").scrollTo("+="+Math.abs(diff),500);
        }
    });
}

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
                  toggle_sidebar();
              });
          }
      }
  });
// Client specific code *******************************************************************************
if (Meteor.isClient)
{

  Blog.config({
      blogIndexTemplate: 'blogindextemplate',
      blogShowTemplate: 'blogshowtemplate'
  });
  Template.menu.helpers({
    user : function() {
      return  Meteor.user();
    }
  });
  Template.blogindextemplate.helpers({
        is_blog_admin : function() {
            if (Meteor.user()) {
                var user = Meteor.user();
                var role = user.roles;
                if (role && role[0] == "admin") {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    });
    Template.blogshowtemplate.helpers({
        is_blog_admin : function() {
            if (Meteor.user()) {
                var user = Meteor.user();
                var role = user.roles;
                if (role && role[0] == "admin") {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    });
}
