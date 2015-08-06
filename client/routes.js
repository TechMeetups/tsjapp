
Router.map(function()
{
    this.route('userprofile', {path: '/user_profile'});
    this.route('dashboard', {path:"/customers"} );
    this.route('faindex', {path: '/fa_index'});
    this.route('ccindex', {path: '/cc_index'});
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
          this.render('login');
        }

    });

    this.route('/oauth', function ()
    {
      console.log(this.request);
      console.log(this.params.query.code);
      var code =  this.params.query.code
      this.render('faindex');
      // Meteor.call('authenticate', code, function (error, result) {
      //   console.log(error)
      //   console.log(result)
      // });
    });
    this.route('/cc_oauth', function ()
    {
      console.log(this.request);
      console.log(this.params.query.code);
      var code =  this.params.query.code
      this.render('ccindex');
      // Meteor.call('authenticate', code, function (error, result) {
      //   console.log(error)
      //   console.log(result)
      // });
    });


});

// End of Routes  ***********************************************************************************

// Route Functions  *********************************************************************************

Router.onBeforeAction(function () {
    var path = Router.current().route.path(this);
    if(path == null){
        path = Router.current().url
    }
    if (!Meteor.user() && !Meteor.loggingIn()) {
        if(path.indexOf("blog") > -1 ){
            this.next();
        }else{
            this.redirect('/');
            this.next();
        }
    }
    else {
      this.next();
    }
}, {
    except: ['login','blogindextemplate','blogshowtemplate','blog']
});
Router.onAfterAction(function () {
    var path = Router.current().route.path(this);
    if(path == null){
        path = Router.current().url
    }
});
