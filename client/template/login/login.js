function resetLoginDetails()
{
  profile = Meteor.user().profile
  if(profile)
  {
  	localStorage.setItem("cc_access_token",isNotEmptyValue(profile.cc_access_token));
  	localStorage.setItem("cc_token_type",isNotEmptyValue(profile.cc_token_type));
  	localStorage.setItem("cc_auth_code",isNotEmptyValue(profile.cc_auth_code));
  	localStorage.setItem("fa_refresh_token",isNotEmptyValue(profile.fa_refresh_token));
  	localStorage.setItem("fa_access_token",isNotEmptyValue(profile.fa_access_token));
  	localStorage.setItem("fa_auth_code",isNotEmptyValue(profile.fa_auth_code));
  	localStorage.setItem("fa_token_type",isNotEmptyValue(profile.fa_token_type));
  }else{
  	localStorage.setItem("cc_access_token","");
  	localStorage.setItem("cc_token_type","");
  	localStorage.setItem("cc_auth_code","");
  	localStorage.setItem("fa_refresh_token","");
  	localStorage.setItem("fa_access_token","");
  	localStorage.setItem("fa_auth_code","");
  	localStorage.setItem("fa_token_type","");
  }
}
Template.register.events(
{

  'click #user_register': function(event, template)
  {
      event.preventDefault();
      var emailVar = $('#login_user_id').val();
      var login_user_name = $('#login_user_name').val();
      var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

      if(!emailReg.test(emailVar))
      {
          IonLoading.show({
            customTemplate: 'Please enter valid Email address',
            duration: 3000
          });
          return false;
      }
      var passwordVar = $('#login_password').val();
      //Meteor.loginWithPassword(emailVar, passwordVar);
      // $('#userwelcomemodel').modal('show');
      //
      // control registration with flag

      Accounts.createUser({email: emailVar,password: passwordVar,profile:{firstname:login_user_name}},
          function(error){
              $('#register_Model').modal('hide');
              if(error)
              {
                IonLoading.show({
                  customTemplate: error.reason,
                  duration: 3000
                });
              }
              else
              {
                   Router.go('events');
              }
          });
  }
});

Template.login.events(
{
      'click #facebook-login': function(event) {
          Meteor.loginWithFacebook({}, function(err){
              if (err) {
                  throw new Meteor.Error("Facebook login failed");
              }else{
                Router.go('events');
              }
          });
        },
        'click #google-login': function(event) {
            Meteor.loginWithGoogle({}, function(err){
                if (err) {
                    throw new Meteor.Error("Facebook login failed");
                }else{
                  Router.go('events');
                }
            });
          },
          'click #twitter-login': function(event) {
            Meteor.loginWithTwitter({}, function(err){
                if (err) {
                    throw new Meteor.Error("Facebook login failed");
                }else{
                  Router.go('events');
                }
            });
          },
        'click .login' : function(event, template){
            $('#loginModel').modal('show');
            $('#register_Model').modal('hide');
            $('#password-reset').modal('hide');
        },
        'click .register' : function(event,template){
            $('#loginModel').modal('hide');
            $('#register_Model').modal('show');
            $('#password-reset').modal('hide');
        },
        'click .forgotpass' : function(event,template){
            $('#loginModel').modal('hide');
            $('#register_Model').modal('hide');
            $('#password-reset').modal('show');

        },
        'submit #forgotPasswordForm': function(e, t)
        {
          e.preventDefault();
          var forgotPasswordForm = $(e.currentTarget),
              email = trimInput(forgotPasswordForm.find('#forgotPasswordEmail').val().toLowerCase());

          if (isNotEmpty(email) && isEmail(email)) {
            Accounts.forgotPassword({email: email}, function(err) {
              if (err) {
                if (err.message === 'User not found [403]') {
                  console.log('This email does not exist.');
                } else {
                  console.log('We are sorry but something went wrong.');
                }
              } else {
                console.log('Email Sent. Check your mailbox.');
              }
            });

          }
          return false;
        },
        'click #sign-in': function(event, template)
        {
  // event.preventDefault();
            var emailVar = $('#login_user_id').val();
            var passwordVar = $('#login_password').val();
            IonLoading.show({
              customTemplate :'<i class="fa fa-cog fa-spin font30"></i>'
            });
            Meteor.loginWithPassword(emailVar, passwordVar,function(error)
            {
                if(error)
                {
                  	console.log("User Login has some error "+error);
                    IonLoading.hide();
                    IonLoading.show({
                      customTemplate: error,
                      duration: 3000
                    });
                    // $('#loginModel').modal('hide');
                    // $('#error-message').html(error.reason);
                    // $('#main-error-box').css("display","block");
                    // setTimeout(function () {
                    //     $('#main-error-box').css("display","none");
                    // },2000);
                    // $('body').removeClass('modal-open');
                    // $('.modal-backdrop').remove();
                  //  IonLoading.hide();
                }
                else
                {
                      localStorage.setItem("login_user_id",Meteor.user()._id);
                      localStorage.setItem("login_user_name",emailVar);
                      localStorage.setItem("login_user_email",emailVar);
                      localStorage.setItem("login_user_pic","");
                      resetLoginDetails();
                      IonLoading.hide();
                      Router.go('events');
                }
            });

        },
        'click #user_register': function(event, template)
        {
            event.preventDefault();
            var emailVar = $('#register_page').find('#login_user_id').val();
            var login_user_name = $('#register_page').find('#login_user_name').val();
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

            if(!emailReg.test(emailVar))
            {

                IonLoading.show({
                  customTemplate: "Please enter valid Email address",
                  duration: 3000
                });
                return false;
            }
            IonLoading.show({
              customTemplate :'<i class="fa fa-cog fa-spin font30"></i>'
            });
            var passwordVar = $('#register_page').find('#login_password').val();
            //Meteor.loginWithPassword(emailVar, passwordVar);
            // $('#userwelcomemodel').modal('show');
            //
            // control registration with flag

            Accounts.createUser({email: emailVar,password: passwordVar,profile:{firstname:login_user_name}},
                function(error){
                    if(error)
                    {   IonLoading.hide();
                      IonLoading.show({
                        customTemplate:error.reason,
                        duration: 3000
                      });
                    }
                    else
                    {
                      IonLoading.hide();
                         Router.go('events');
                    }
                });
        }


    });
    if (Accounts._resetPasswordToken) {
      Session.set('resetPassword', Accounts._resetPasswordToken);
    }

    Template.ResetPassword.helpers({
     resetPassword: function(){
      return Session.get('resetPassword');
     }
    });

    Template.forgotpassword.events(
    {
      'click #forgotPasswordForm': function(e, t)
      {
          var email = $('#forgotPasswordEmail').val();
          var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

          if(!email || !emailReg.test(email))
          {
              IonLoading.show({
                customTemplate: 'Please enter a valid Email Address',
                duration: 3000
              });
              return false;
          }

            Meteor.call('resetpasswordByEmail',email,function(error,ret)
            {
                  console.log('ret='+ret);
              if(ret)
              {
                  console.log('Error reseting password'+ret);
                  IonLoading.show(
                  {
                    customTemplate: "Please enter a valid email to Reset your Password",
                    duration: 3000
                  });
              }
              else
              {
                  console.log('Error reseting password'+ret);
                IonLoading.show({
                  customTemplate: "Email Sent. Check your mailbox.",
                  duration: 3000
                });

                console.log('Email Sent. Check your mailbox.');
                Router.go('/login') ;
              }
            });


          // e.preventDefault();
          // var email = $('#forgotPasswordEmail').val();

          // console.log('forgotPasswordForm:'+email) ;
          //   Accounts.forgotPassword({email: email}, function(err)
          //   {
          //     if (err)
          //     {
          //       if (err.message === 'User not found [403]')
          //       {
          //         console.log('This email does not exist.');
          //         IonLoading.show({
          //           customTemplate: "Please enter a valid email to Reset your Password",
          //           duration: 3000
          //         });

          //       }
          //       else
          //       {
          //         console.log('We are sorry but something went wrong.'+err);
          //         IonLoading.show({
          //           customTemplate: "We are sorry but something went wrong.",
          //           duration: 3000
          //         });


          //       }
          //     }
          //     else
          //     {
          //       IonLoading.show({
          //         customTemplate: "Email Sent. Check your mailbox.",
          //         duration: 3000
          //       });

          //       console.log('Email Sent. Check your mailbox.');
          //       Router.go('/login') ;
          //     }
          //   }) ;


      }

    });
    Template.ResetPassword.events({
      'submit #resetPasswordForm': function(e, t) {
        e.preventDefault();

        var resetPasswordForm = $(e.currentTarget),
            password = resetPasswordForm.find('#resetPasswordPassword').val(),
            passwordConfirm = resetPasswordForm.find('#resetPasswordPasswordConfirm').val();

        if (isNotEmpty(password) && areValidPasswords(password, passwordConfirm)) {
          Accounts.resetPassword(Session.get('resetPassword'), password, function(err) {
            if (err) {
              console.log('We are sorry but something went wrong.');
            } else {
              console.log('Your password has been changed. Welcome back!');
              Session.set('resetPassword', null);
            }
          });
        }
        return false;
      }
    });
