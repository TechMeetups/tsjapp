
if (Meteor.isServer)
{

    Meteor.publish("events", function (limit, searchValue)
    {
      console.log(searchValue)
      console.log(limit)
      if(!limit || limit < 1)
          limit = 10 ;
        if( searchValue &&  searchValue.length > 1){
          console.log(Events.find({'name': {'$regex': new RegExp(searchValue, "i")}}, {sort:{ created_at:-1},limit:limit}).count());
          return Events.find({'name': {'$regex': new RegExp(searchValue, "i")}}, {sort:{ created_at:-1},limit:limit});
        }else{
          console.log(Events.find({},{limit:limit}).count());
          return Events.find({},{limit:limit});
        }
    });
    Meteor.publish("attendees", function (limit, searchValue,event_id)
    {
      user_ids=[]
      event_attendees =   EventAttendee.find({event_id:event_id}, {sort:{ created_at:-1}},{fields: {'attendee_id':1}}).fetch()
      console.log(event_attendees)
      for(i =0; i< event_attendees.length ;i++){
        user_ids.push(event_attendees[i].attendee_id)
      }
      console.log(searchValue);
      if(!limit || limit < 1)
          limit = 10 ;
        if( searchValue &&  searchValue.length > 1){
          console.log(Meteor.users.find({_id:{$in:user_ids},'profile.firstname':{'$regex': new RegExp(searchValue, "i")}},{limit:limit}).count())
          return Meteor.users.find({_id:{$in:user_ids},'profile.firstname':{'$regex': new RegExp(searchValue, "i")}},{limit:limit});
          //return Attendees.find({_id:{$in:user_ids},'name':{'$regex': new RegExp(searchValue, "i")}},{sort:{ created_at:-1},limit:limit});
        }else{
          return Meteor.users.find({_id:{$in:user_ids}},{limit:limit});
        }
    });

    Meteor.publish('attendees_details', function(event_id,attendee_id) {
      user_ids=[]
      event_attendees =   EventAttendee.find({event_id:event_id,attendee_id:attendee_id}, {sort:{ created_at:-1}},{fields: {'attendee_id':1}}).fetch()
      for(i =0; i< event_attendees.length ;i++){
        user_ids.push(event_attendees[i].attendee_id)
      }
      return Meteor.users.find({_id:{$in:user_ids}});
    });
    Meteor.publish('event', function(_id) {
      return Events.find({_id: _id});
    });
    Meteor.startup(function () {

        // By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users asking for help with their account, be sure to set this to an email address that you can receive email at.
        Accounts.emailTemplates.from = 'admin <no-reply@CCIntegration.com>';
        // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
        Accounts.emailTemplates.siteName = 'Graphical.IO';
        // A Function that takes a user object and returns a String for the subject line of the email.
        Accounts.emailTemplates.verifyEmail.subject = function(user) {
            return 'Confirm Your Email Address';
        };
        // A Function that takes a user object and a url, and returns the body text for the email.
        // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
        Accounts.emailTemplates.verifyEmail.text = function(user, url) {
            return 'click on the following link to verify your email address: ' + url;
        };

    });
    Accounts.onCreateUser(function(options, user) {
      console.log("on account create");
      if(options.autocreate){
          user.profile = {user_id :options.profile.user_id,firstname:options.profile.firstname};
          userRegistration(user,options.password)
      }else{
          if(options){
            user.profile = {};
            user.profile = options.profile
          }
          userRegistration(user,"hidden")
      }
      return user;
    });
    var userRegistration = function(user,pass){
        var fromEmail = "admin@techmeetups.com";
        var toEmail = user.emails[0].address;
        Email.send({
            from: fromEmail,
            to: toEmail,
            replyTo: fromEmail ,
            subject: "CCIntegration Registration",
            text: "Hi "+user.profile.firstname+",\nYour Email: "+user.emails[0].address+" has been registered."+
            "\nYour password is : "+pass+"\n\n"+
            "Thank you.\n"+
            "The CCIntegration Team.\n"+Meteor.absoluteUrl()+"\n"
            // + "http://www.graphical.io/assets/img/Graphical-IO.png"
        });
    }

    var userPasswordReset = function(user,pass)
    {
        var fromEmail = "admin@techmeetups.com";
        var toEmail = user.emails[0].address;
        Email.send({
            from: fromEmail,
            to: toEmail,
            replyTo: fromEmail ,
            subject: "CCIntegration Password Reset",
            text: "Hi "+user.profile.firstname+",\nYour password has been reset."+
            "\nYour new password is : "+pass+"\n\n"+
            "Thank you.\n"+
            "The CCIntegration Team.\n"+Meteor.absoluteUrl()+"\n"
            // +"http://www.graphical.io/assets/img/Graphical-IO.png"
        });
    }

    var sendMessage = function (user_email)
    {
        var fromEmail = "admin@techmeetups.com";
        var toEmail = " shawn@techmeetups.com";
        Email.send({
            from: fromEmail,
            to: toEmail,
            replyTo: fromEmail ,
            subject: "TechStartupJobs Registration Request",
            text: "Hi SysAdmin,\nUser: "+user_email+" wants to register on TechStartupJobs App\n\n"+
            "Thank you.\n"+
            "The CCIntegration Team.\n"+Meteor.absoluteUrl()+"\n"
            // + "http://www.graphical.io/assets/img/Graphical-IO.png"
        });
   }

      Meteor.methods(
      {
        'sendMessage': function (toId)
        {
            if (Meteor.isServer)
                sendMessage(toId);
        },
        'sendTaskassignNotification' : function(useremail,WBS_id,project_name,notes,resource_id)
        {
            if (Meteor.isServer)
                sendTaskassignNotification(useremail,WBS_id,project_name,notes,resource_id) ;
        },
        'sendTaskassignNotificationTemplate' : function(useremail,WBS_id,project_name,notes)
        {
            if (Meteor.isServer)
                sendTaskassignNotificationTemplate(useremail,WBS_id,project_name,notes) ;
        },
        'sendNoteNotification' : function(useremail,project,process,workitem,itemtype,resource,notes)
        {
            if (Meteor.isServer)
                sendNoteNotification(useremail,project,process,workitem,itemtype,resource,notes) ;
        },
        'sendtaskCompletedNotification':function(useremail,project,workitem,notes){
            sendtaskCompletedNotification(useremail,project,workitem,notes);
        },
        resetpassword : function (user_id,pass)
        {
            Accounts.setPassword(user_id, pass);
        },
        resetpasswordByEmail : function (email){
          var user = Meteor.users.findOne({'emails.address': {$regex:email,$options:'i'}});
          if(user){
            pass = guid()
            Accounts.setPassword(user._id, pass);
            userPasswordReset(user,pass)
            return "Password Reset successfully Please check your email for new password."
          }else{
            return "User not available with provided email"
          }
        },
        authenticate : function(code){
          this.unblock();
          return authenticate(code)
        },
        insert_attendee : function(data,event_id){
          user_id = Accounts.createUser({
                          username: data.name,
                          email : data.email,
                          password : "welcome",
                          profile  : {
                              firstname : data.name,
                              skill : data.skill,
                              experience:data.experience,
                              lookingfor: data.lookingfor,
                              created_at:new Date(),
                              pic: data.pic
                          }

          });
        //  attendee_id = Attendees.insert(data)
          event_id = event_id
          joined_on= new Date();
          EventAttendee.insert({attendee_id:user_id,event_id:event_id,joined_on:joined_on,created_at:new Date()})
        }

    });
}
