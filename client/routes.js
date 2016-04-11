Router.configure({
    layoutTemplate: 'layout'
});
Router.map(function()
{
    this.route('userprofile', {path: '/user_profile'});

    this.route('usersettings', {path: '/user_settings'});

    this.route('events', {path:"/events"} );

    this.route('register', {path: '/register'});
    this.route('ResetPassword', {path: '/ResetPassword'});

    this.route('accountsetup', {path: '/accountsetup'});
    this.route('forgotpassword', {path: '/forgotpassword'});

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

    this.route('sponsor.tab',
      {
        path: '/tabs/sponsor/:_id',
        layoutTemplate: 'tabsLayout'
      }
    );

    this.route('checkout.tab',
      {
        path: '/tabs/checkout',
        layoutTemplate: 'tabsLayout'
      }
    );

    this.route('sponsor.details',
    {
      path: '/tabs/sponsor/:_id/:_sponsor_id',
      data:function(){
        var id = this.params._sponsor_id;
        var data = Sponsor.findOne({_id:id});
        return data;
      },
    layoutTemplate: 'tabsLayout'
  });


    this.route('attendees.tab',
    {
      path: '/tabs/attendees/:_id',
      layoutTemplate: 'tabsLayout'
    });

    this.route('messages.tab',
    {
      path: '/tabs/messages',
      layoutTemplate: 'tabsLayout'
    });

    this.route('attendees.details',
    {
      path: '/tabs/attendees/:_id/:_attendee_id',
      data:function(){
        var id = this.params._attendee_id;
        var data = Meteor.users.findOne({_id:id});
        return data;
      },
      layoutTemplate: 'tabsLayout'}
    );

    this.route('job.details',
    {
      path: '/tabs/job/:_company_id/:_job_id',
      data:function()
      {
        var id = this.params._job_id;
        var data = Job.findOne({_id:id});
        return data;
      },
    layoutTemplate: 'tabsLayout'
  });

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

    this.route('jobs.tab',
    {
      path: '/tabs/jobs/:_id',
     layoutTemplate: 'tabsLayout'
    });

    this.route('jobsTab',
    {
      path: '/tabs/jobsTab',
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
