Router.configure({
    layoutTemplate: 'layout'
});
Router.map(function()
{
    this.route('userprofile', {path: '/user_profile'});
    this.route('dashboard', {path:"/events"} );
    this.route('register', {path: '/register'});
    this.route('accountsetup', {path: '/accountsetup'});
    this.route('events.show',  
    {
        path: '/event/:_id', 
        data:function()
        {
            var id = this.params._id;
            var data = Events.findOne({_id:id});
            return data;
        }
    });
    // this.route('tabs.one',
    // {
    //   path: '/tabs/one/:_id',
    //   data:function(){
    //     var id = this.params._id;
    //     var data = contacts.findOne({_id:id});
    //     console.log(data)
    //     return data;
    //   },
    // layoutTemplate: 'tabsLayout'});

    this.route('login', {path: '/login',
        onBeforeAction: function ()
        {
            if (!(Meteor.user() || !Meteor.loggingIn()))
            {
                this.render('login');
                this.next();
            }
            else
            {
                this.render('dashboard');
                this.next();
            }
        }
    });
    
    this.route('/', function ()
    {
      if (Meteor.user())
      {
        this.render('dashboard');
      }
      else
      {
        this.render('index');
      }
    });

});

// End of Routes  ***********************************************************************************

// Route Functions  *********************************************************************************

Router.onBeforeAction(function () {
      this.next();
}, {
    except: ['login']
});
// Router.onAfterAction(function () {
//     var path = Router.current().route.path(this);
//     if(path == null){
//         path = Router.current().url
//     }
// });
