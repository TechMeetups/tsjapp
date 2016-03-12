Router.configure({
    layoutTemplate: 'layout'
});
Router.map(function()
{
    this.route('userprofile', {path: '/user_profile'});
    this.route('events', {path:"/events"} );
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
        },layoutTemplate: 'tabsLayout'
    });

    this.route('attendees.tab',
    {
      path: '/tabs/attendees/:_id',
      layoutTemplate: 'tabsLayout'});


    this.route('attendees.details',
    {
      path: '/tabs/attendees/:_id/:_attendee_id',
      data:function(){
        var id = this.params._attendee_id;
        var data = Meteor.users.findOne({_id:id});
        return data;
      },
    layoutTemplate: 'tabsLayout'});
    this.route('company.details',
    {
      path: '/tabs/company/:_id/:_company_id',
      data:function(){
        var id = this.params._company_id;
        var data = Company.findOne({_id:id});
        return data;
      },
    layoutTemplate: 'tabsLayout'});

    this.route('companies.tab',
    {
      path: '/tabs/companies/:_id',
     layoutTemplate: 'tabsLayout'
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
                this.render('events');
                this.next();
            }
        }
    });

    this.route('/', function ()
    {
      if (Meteor.user())
      {
        this.render('events');
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
