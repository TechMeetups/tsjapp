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

var Auth_Router = Backbone.Router.extend({
	routes: {
		"": "root",
		"/oauth/?code=:code":"auth"
	},
  root: function () {},
	auth: function (code)	{
    var code = code.split("&");
    console.log(code)
    Meteor.call('authenticate', code, function (error, result) {
      	console.log(error)
        console.log(result)
  		});
	}
});

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
