Router.configure({
    layoutTemplate: 'layout'
});
Router.map(function()
{
    this.route('userprofile', {path: '/user_profile'});
    this.route('dashboard', {path:"/customers"} );
    this.route('faindex', {path: '/fa_index'});
    this.route('ccindex', {path: '/cc_index'});
    this.route('register', {path: '/register'});
    this.route('accountsetup', {path: '/accountsetup'});
    this.route('contacts.show',  {
        path: '/customer/:_id'

    });
    this.route('tabs.one',
    {
      path: '/tabs/one/:_id',
      data:function(){
        var id = this.params._id;
        var data = contacts.findOne({_id:id});
        console.log(data)
        return data;
      },
    layoutTemplate: 'tabsLayout'});
    this.route('tabs.two', {path: '/tabs/two/:_id', layoutTemplate: 'tabsLayout',
    data:function(){
      var id = this.params._id;
      var data = contacts.findOne({_id:id});
      console.log(data)
      return data;
    }});
    this.route('tabs.three', {path: '/tabs/three/:_id', data:function(){
      var id = this.params._id;
      var data = contacts.findOne({_id:id});
      console.log(data)
      return data;
    },layoutTemplate: 'tabsLayout'});
    this.route('tabs.four', {path: '/tabs/four/:_id', data:function(){
      var id = this.params._id;
      var data = contacts.findOne({_id:id});
      console.log(data)
      return data;
    },layoutTemplate: 'tabsLayout'});
    this.route('fatabs.one', {path: '/fatabs/one/:_id', data:function(){
      var id = this.params._id;
      var data = contacts.findOne({_id:id});
      console.log(data)
      return data;
    },layoutTemplate: 'tabsLayout'});
    this.route('fatabs.two', {path: '/fatabs/two/:_id', data:function(){
      var id = this.params._id;
      var data = contacts.findOne({_id:id});
      console.log(data)
      return data;
    }, layoutTemplate: 'tabsLayout'});
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

    this.route('/oauth', function ()
    {
      console.log(this.request);
      console.log(this.params.query.code);
      var code =  this.params.query.code;
      var old_auth_code = localStorage.getItem("fa_auth_code");

      if(old_auth_code != code){
        $('#processingmodelwindow').modal('show');
        localStorage.setItem("fa_auth_code",code);
        getFaAcesstoken(code,function(data){
          console.log(data);
          if(data){
            localStorage.setItem("fa_access_token",data.access_token);
            localStorage.setItem("fa_token_type",data.token_type);
            localStorage.setItem("fa_refresh_token",data.refresh_token);
            updateUserFaAccess();
            $('#processingmodelwindow').modal('hide');
            Router.go('/customers');
            //location.reload();
          }else{
            $('#processingmodelwindow').modal('hide');
            bootbox.alert("Error in Authenticate Please try after some time");
            Router.go('/accountsetup');
          }
        });
      }
    });
    this.route('/cc_oauth', function ()
    {
      console.log(this.request);
      console.log(this.params.query.code);
      var auth_code =  this.params.query.code
      var old_auth_code = localStorage.getItem("cc_auth_code");
      if(old_auth_code != auth_code){
        localStorage.setItem("cc_auth_code",auth_code);
        $('#processingmodelwindow').modal('show');
        getCCAccessToken(auth_code,function(result){
          if(result){
            console.log(result)
            localStorage.setItem("cc_access_token",result.access_token);
            localStorage.setItem("cc_token_type",result.token_type);
            updateUserCCAccess();
            $('#processingmodelwindow').modal('hide');
            Router.go('/customers');
          }else{
            $('#processingmodelwindow').modal('hide');
            bootbox.alert("Error in Authenticate Please try after some time");
            Router.go('/accountsetup');
          }
        });
      }
    });
});

// End of Routes  ***********************************************************************************

// Route Functions  *********************************************************************************

Router.onBeforeAction(function () {
      this.next();
}, {
    except: ['login','blogindextemplate','blogshowtemplate','blog']
});
// Router.onAfterAction(function () {
//     var path = Router.current().route.path(this);
//     if(path == null){
//         path = Router.current().url
//     }
// });
