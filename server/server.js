
if (Meteor.isServer)
{
    var keywords = [] ;

    Meteor.publish("events", function (limit, searchValue, showPast )
    {
      console.log(searchValue)
      console.log(limit)
      if(!limit || limit < 1)
          limit = 10 ;
        // if( searchValue &&  searchValue.length > 1)
        // {
        //   console.log(Events.find({'name': {'$regex': new RegExp(searchValue, "i")}}, {sort:{ start:1},limit:limit}).count());
        //   return Events.find({'name': {'$regex': new RegExp(searchValue, "i")}}, {sort:{ start:1},limit:limit});
        // }
        // else
        // {

        var $search = {}

          if( showPast )
          {
            // var today = new Date('1/1/2000') ;
            $search = {  } ;
            return Events.find($search ,{sort:{ start:-1},limit:limit});
          }
          else
          {
              var today = new Date() ;
              $search['start'] = { $gte : today  } ;
              return Events.find($search ,{sort:{ start:1},limit:limit});

//              $set[chk_date] = { $gte: start , $lt: end } ;
          }

          console.log('Search') ;
           console.log($search) ;
          // console.log(Events.find({},{sort:{ start:1},limit:limit}).count());

        // }
    });

    Meteor.publish("sponsor_list", function (user_id, attendee_id)
    {
      return Sponsor.find({});
    });

    Meteor.publish("keyword_map", function ()
    {
      return KeywordMap.find({});
    });

    Meteor.publish("connect_request_for_user", function (user_id)
    {
        console.log('connect_request_for_user:'+user_id);
        return ConnectRequest.find(
                { $or :
                  [
                    { user_id : user_id } ,
                    { attendee_id : user_id }
                  ]
                }) ;

    });

     Meteor.publish("connect_request_for_attendees", function (user_id, attendee_id)
    {
        return ConnectRequest.find(
        {
          // user_id:user_id,attendee_id:attendee_id,request_type:"meet_candidate"
              request_type:"meet_candidate",
                 $or :
                  [
                    { user_id : user_id ,     attendee_id : attendee_id } ,
                    { user_id : attendee_id , attendee_id : user_id }
                  ] ,


        } ) ;


    });

    Meteor.publish("connect_request_for_job", function (user_id,job_id)
    {
      return ConnectRequest.find({user_id:user_id,job_id:job_id,request_type:{$in:["job_meet","job_apply"]}})
    });

    Meteor.publish("attendees", function (limit, searchValue,event_id, job_id)
    {
      console.log('Publishing attendees --------------------------') ;
      console.log('limit:'+limit+' searchValue:'+searchValue+' Event Id:'+event_id+' Job Id:'+job_id ) ;

      if(job_id)
      {
          keywords = match_manager.loadKeyWords() ;

          var job = Job.findOne({_id : job_id}) ;
          if( job )
            tag_job(job) ;

          // tag_job_skill(job) ;
          // tag_job_profession(job) ;
          // tag_job_experience(job) ;
      }


      if(event_id)
      {
          user_ids=[] ;
          event_attendees =  EventAttendee.find({event_id:event_id}, {sort:{ created_at:-1}},{fields: {'attendee_id':1}}).fetch()

          if(job)
          {
              for(ai =0; ai< event_attendees.length ;ai++)
              {
                  var usr = Meteor.users.findOne( { _id : event_attendees[ai].attendee_id } ) ;

                  if( usr )
                  {
                      counter = match_user_job(usr,job) ;


                      if(counter > 0)
                      {
                          // console.log('MATCH FOUND ********************') ;
                          user_ids.push(event_attendees[ai].attendee_id)  ;
                      }
                  }
              }

          }
          else
          {
              for(i =0; i< event_attendees.length ;i++)
                user_ids.push(event_attendees[i].attendee_id)   ;
          }

          console.log('Found Users:'+user_ids.length) ;
          //console.log(user_ids) ;

          if( searchValue &&  searchValue.length > 1)
          {
                return Meteor.users.find(
                  {
                    _id:{$in:user_ids},
                    $or :
                    [
                      { 'profile.firstname':{'$regex': new RegExp(searchValue, "i")} } ,
                      { 'profile.skill':{'$regex': new RegExp(searchValue, "i")} } ,
                      { 'profile.profession':{'$regex': new RegExp(searchValue, "i")} } ,
                      { 'profile.lookingfor':{'$regex': new RegExp(searchValue, "i")} } ,
                      { 'profile.city':{'$regex': new RegExp(searchValue, "i")} } ,
                    ]
                  },
                  {limit:limit});
          }
          else
          {
                return Meteor.users.find({_id:{$in:user_ids}},{sort:{ 'profile.premium' : -1},limit:limit});
          }
      }
      else
      {
          if( searchValue &&  searchValue.length > 1)
          {
              return Meteor.users.find(
                {
                    $or :
                    [
                      { 'profile.firstname':{'$regex': new RegExp(searchValue, "i")} } ,
                      { 'profile.skill':{'$regex': new RegExp(searchValue, "i")} } ,
                      { 'profile.profession':{'$regex': new RegExp(searchValue, "i")} } ,
                      { 'profile.lookingfor':{'$regex': new RegExp(searchValue, "i")} } ,
                      { 'profile.city':{'$regex': new RegExp(searchValue, "i")} } ,
                    ]
                },
                {limit:limit});
          }
          else
          {
              return Meteor.users.find({ },{sort:{ 'profile.premium' : -1},limit:limit});
          }
      }



    });

    Meteor.publish("jobs", function (limit,event_id,company_id,searchValue)
    {
      $set = {} ;

      if(event_id)
        $set['event_id'] = event_id ;

      if(company_id)
        $set['company_id'] = company_id ;

      if (searchValue)
        $set['$text']  = {$search: searchValue} ;

      if(!limit || limit < 1)
          limit = 10 ;
      jobs = Job.find($set,{sort:{ created_at:-1},limit:limit}).fetch();
      company_ids = jobs.map(function(doc){return doc.company_id});
      console.log(company_ids)
      return [Job.find($set,{sort:{ created_at:-1},limit:limit}),Company.find({_id:{$in:company_ids}})];
    });


    Meteor.publish("messages", function (user_id,attendee_id,event_id,limit)
    {
      $set = {} ;

      if(user_id)
        $set['user_id'] = user_id ;

      if(attendee_id)
        $set['attendee_id'] = attendee_id ;

      if(event_id)
        $set['event_id'] = event_id ;

      if(!limit || limit < 1)
          limit = 10 ;

      return Messages.find($set,{limit:limit});
    });

    Meteor.publish("checkout_item", function (user_id)
    {
      return Checkout.find({user_id:user_id,paid:"unpaid"});
    });

    Meteor.publish('company_details', function(event_id,company_id)
    {
      company_ids=[]
      event_company =   EventCompany.find({event_id:event_id,company_id:company_id}, {sort:{ created_at:-1}},{fields: {'company_id':1}}).fetch()
      for(i =0; i< event_company.length ;i++){
        company_ids.push(event_company[i].company_id)
      }
      return Company.find({_id:{$in:company_ids}});
    });
    Meteor.publish('company_details_without_event', function(company_id)
    {
      return Company.find({_id:company_id});
    });

    Meteor.publish("company_list", function (limit, searchValue)
    {
      // if(!limit || limit < 1)
      //     limit = 10 ;
        if( searchValue &&  searchValue.length > 1)
        {
          return Company.find({'name':{'$regex': new RegExp(searchValue, "i")}},{sort:{ created_at:-1},limit:limit});
        }
        else
        {
          return Company.find({},{sort:{ created_at:-1},limit:limit});
        }
    });
    Meteor.publish("company", function (limit, searchValue,event_id)
    {
      company_ids=[]

      event_company =   EventCompany.find({event_id:event_id}, {sort:{ created_at:-1}},{fields: {'company_id':1}}).fetch()

      for(i =0; i< event_company.length ;i++){
        company_ids.push(event_company[i].company_id)
      }

      // if(!limit || limit < 1)
      //     limit = 10 ;
        if( searchValue &&  searchValue.length > 1)
        {
          return Company.find({_id:{$in:company_ids},'name':{'$regex': new RegExp(searchValue, "i")}},
            {sort:{ created_at:-1},limit:limit});
        }
        else
        {


          return Company.find({_id:{$in:company_ids}},{sort:{ created_at:-1},limit:limit});
        }
    });

    Meteor.publish('attendees_details', function(event_id,attendee_id)
    {
      user_ids=[]
      event_attendees =   EventAttendee.find({event_id:event_id,attendee_id:attendee_id}, {sort:{ created_at:-1}},{fields: {'attendee_id':1}}).fetch()
      for(i =0; i< event_attendees.length ;i++){
        user_ids.push(event_attendees[i].attendee_id)
      }
      return Meteor.users.find({_id:{$in:user_ids}});
    });

    Meteor.publish('job_details', function(company_id,job_id) {
      return Job.find({_id:job_id,company_id:company_id});
    });

    Meteor.publish('event', function(_id)
    {
      return Events.find({_id: _id});
    });

    Meteor.publish("get_matched_candidates", function (job_id)
    {
      console.log("get_matched_candidates.job_id"+job_id) ;

      var searchValue ;

      var job = Jobs.findOne({_id:job_id}) ;
      if(!job)
        return null ;
      searchValue = job.desc ;

      return Meteor.users.find({'profile.skill':{'$regex': new RegExp(searchValue, "i")}});

    });


    Meteor.startup(function ()
    {

        // By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users asking for help with their account, be sure to set this to an email address that you can receive email at.
        Accounts.emailTemplates.from = 'admin@techmeetups.com';
        // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
        Accounts.emailTemplates.siteName = 'TechStartupJobs.com';
        // A Function that takes a user object and returns a String for the subject line of the email.
        Accounts.emailTemplates.verifyEmail.subject = function(user)
        {
            return 'Confirm Your Email Address';
        };
        // A Function that takes a user object and a url, and returns the body text for the email.
        // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
        Accounts.emailTemplates.verifyEmail.text = function(user, url) {
            return 'click on the following link to verify your email address: ' + url;
        };
        user = Meteor.users.findOne({ "emails.address" : 'jayeshdalwadi2007@gmail.com' });
        shawn = Meteor.users.findOne({ "emails.address" : 'shawn@techmeetups.com' });
        if(shawn){
          Roles.addUsersToRoles(shawn._id, ['admin'])
        }
        if(user){
          Roles.addUsersToRoles(user._id, ['admin'])
        }

        Job._ensureIndex(
           {
             title: "text",
             desc: "text",
             city:"text"

           }) ;

        // Meteor.users._ensureIndex(
        //    {
        //      'profile.skill': "text"
        //    }) ;
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
          if(options.profile.auto_created != true){
            userRegistration(user,"hidden")
          }

      }
      return user;
    });
    var userRegistration = function(user,pass){
        var fromEmail = "admin@techmeetups.com";
        console.log(user)
        console.log(user.emails)
        var toEmail='';
        var username = user.profile.firstname
        if(user.emails != undefined){
          var toEmail = user.emails[0].address;
        }
        if(user.services.facebook){
          var toEmail = user.services.facebook.email
          username = user.profile.name
        }
        if(user.services.google){
          var toEmail = user.services.google.email
          username = user.profile.name
        }
        if(user.services.twitter){
          // var toEmail = user.services.twitter.email
          username = user.profile.name
        }
        if(toEmail || toEmail.length < 1){
          toEmail = fromEmail
          username += "\n User registration with Twitter account: " + username ;
        }
        Email.send({
            from: fromEmail,
            to: toEmail,
            replyTo: fromEmail ,
            subject: "TechStartupJobs App Registration",
            text: "Hi "+username+",\nYour Email: "+toEmail+" has been registered."+
            "\nYour password is : "+pass+"\n\n"+
          "Thank you.\n"+
          "The TechStartupJobs Team.\n"+
          "http://techstartupjobs.com\n"+
          "Join.Connect.Meet.Apply"
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
            subject: "TechStartupJobs Password Reset",
            text: "Hi "+user.profile.firstname+",\nYour password has been reset."+
            "\nYour new password is : "+pass+"\n\n"+
          "Thank you.\n"+
          "The TechStartupJobs Team.\n"+
          "http://techstartupjobs.com\n"+
          "Join.Connect.Meet.Apply"
            // +"http://www.graphical.io/assets/img/Graphical-IO.png"
        });
    }
    var request_for_meet_job= function(user,company,job)
    {
      var fromEmail = "admin@techmeetups.com";
      var toEmail = "marketing@techmeetups.com";
      var ccEmail = "shawn@techmeetups.com";

      Email.send({
          from: fromEmail,
          to: toEmail,
          cc: ccEmail,
          replyTo: fromEmail ,
          subject: "TechStartupJobs App - " + "Meeting Request to "+company.name+" for Job "+job.title,
          text: "Hi,\nCandidate "+user.profile.firstname+" ("+user.emails[0].address+") wants to meet "+company.name+" for Job "+job.title+
          "\n\n"+
          "Thank you.\n"+
          "The TechStartupJobs Team.\n"+
          "http://techstartupjobs.com\n"+
          "Join.Connect.Meet.Apply"
          // +"http://www.graphical.io/assets/img/Graphical-IO.png"
      });
    }

    var send_ticket_details = function(event,user,ticket_no)
    {
      var fromEmail = "admin@techmeetups.com";
      var toEmail = user.emails[0].address;
      var ccEmail = "marketing@techmeetups.com";
      var dt = moment(event.start).format("DD/MM/YYYY");

      Email.send({
          from: fromEmail,
          to: toEmail,
          replyTo: fromEmail ,
          cc:ccEmail,
          subject: "TechStartupJobs App - " + "Ticket Details for " + event.name ,
          text: "Hi "+user.profile.firstname+'\n'+
                  "\nYou have purchased a ticket for\n"+
                  "\nEvent : "+event.name+
                  "\nDate : "+dt+
                  "\nAddress : "+event.address+
                  "\nTicket No : "+ticket_no+
                 "\n\n"+
                 "Please show your ticket on the TechStartupJobs App to gain access to the event.\n\n"+
          "Thank you.\n"+
          "The TechStartupJobs Team.\n"+
          "http://techstartupjobs.com\n"+
          "Join.Connect.Meet.Apply"
          // +"http://www.graphical.io/assets/img/Graphical-IO.png"
      });
    }
    var send_event_change_notification = function(event,user){

        var fromEmail = "admin@techmeetups.com";
        var toEmail = user.emails[0].address;
        var start_dt = moment(event.start).format("llll");
        var end_dt = moment(event.end).format("llll");
        Email.send({
            from: fromEmail,
            to: toEmail,
            replyTo: fromEmail ,
            subject: "Event Change Notification" ,
            text: "Hi "+user.profile.firstname+'\n'+
                    "\nPlease find updated Event details\n"+
                    "\nEvent   : "+event.name+
                    "\nDetails : "+event.desc+
                    "\nStart   : "+start_dt+
                    "\nFinish  : "+end_dt+
                    "\nAddress : "+event.address+
                   "\n\n"+
                   "Please email us if you need more details.\n\n"+
            "Thank you.\n"+
            "The TechStartupJobs Team.\n"+
            "http://techstartupjobs.com\n"+
            "Join.Connect.Meet.Apply"
            // +"http://www.graphical.io/assets/img/Graphical-IO.png"
        });

    }
    var send_event_add_notification = function(event,user,email){

        var fromEmail = "admin@techmeetups.com";
        var toEmail = email;
        var username = user.profile.firstname
        if(username && username.length > 1){
          username = username
        }else {
          username = ""
        }
        var start_dt = moment(event.start).format("llll");
        var end_dt = moment(event.end).format("llll");
        Email.send({
            from: fromEmail,
            to: toEmail,
            replyTo: fromEmail ,
            subject: "Event Notification" ,
            text: "Hi "+user.profile.firstname+'\n'+
                    "\nPlease find updated Event details\n"+
                    "\nEvent   : "+event.name+
                    "\nDetails : "+event.desc+
                    "\nStart   : "+start_dt+
                    "\nFinish  : "+end_dt+
                    "\nAddress : "+event.address+
                   "\n\n"+
                   "Please email us if you need more details.\n\n"+
            "Thank you.\n"+
            "The TechStartupJobs Team.\n"+
            "http://techstartupjobs.com\n"+
            "Join.Connect.Meet.Apply"
            // +"http://www.graphical.io/assets/img/Graphical-IO.png"
        });

    }
    var send_company_add_notification = function(company,user,email){

        var fromEmail = "admin@techmeetups.com";
        var toEmail = email;
        var username = user.profile.firstname
        if(username && username.length > 1){
          username = username
        }else {
          username = ""
        }
        Email.send({
            from: fromEmail,
            to: toEmail,
            replyTo: fromEmail ,
            subject: "Company Notification" ,
            text: "Hi "+username+'\n'+
                    "\nPlease find company details\n"+
                    "\nName   : "+company.name+
                    "\nCity : "+company.city+
                    "\nDetails : "+company.desc+

                   "\n\n"+
                   "Please email us if you need more details.\n\n"+
            "Thank you.\n"+
            "The TechStartupJobs Team.\n"+
            "http://techstartupjobs.com\n"+
            "Join.Connect.Meet.Apply"
            // +"http://www.graphical.io/assets/img/Graphical-IO.png"
        });

    }
    var send_job_add_notification = function(job,user,email){

        var fromEmail = "admin@techmeetups.com";
        var toEmail = email;
        var username = user.profile.firstname
        if(username && username.length > 1){
          username = username
        }else {
          username = ""
        }
        Email.send({
            from: fromEmail,
            to: toEmail,
            replyTo: fromEmail ,
            subject: "Job Notification" ,
            text: "Hi "+username+'\n'+
                    "\nPlease find Job details\n"+
                    "\nTitle   : "+job.title+
                    "\nCity : "+job.city+
                    "\nExperience : "+job.experience+
                    "\nSkill : "+job.skill+
                    "\nDetails : "+job.desc+
                   "\n\n"+
                   "Please email us if you need more details.\n\n"+
            "Thank you.\n"+
            "The TechStartupJobs Team.\n"+
            "http://techstartupjobs.com\n"+
            "Join.Connect.Meet.Apply"
            // +"http://www.graphical.io/assets/img/Graphical-IO.png"
        });

    }
    var request_for_meet_candidate = function (user,attendee,message)
    {
      var fromEmail = "admin@techmeetups.com";
      var toEmail = attendee.emails[0].address ;
      var ccEmail = "marketing@techmeetups.com";
      Email.send({
          from: fromEmail,
          to: toEmail,
          replyTo: fromEmail ,
          cc:ccEmail,
          subject: 'TechStartupJobs App - ' + user.profile.firstname+ " has sent you a message",
          text: "Hi "+attendee.profile.firstname+"\n\n" +
          "A User '"+user.profile.firstname+"'  ("+user.emails[0].address+") has sent you a message.\n\n"+
          "Message : "+message+"\n\n"+
          "Please check their profile and message or email them if interested."+
          "\n\n"+
          "Thank you.\n"+
          "The TechStartupJobs Team.\n"+
          "http://techstartupjobs.com\n"+
          "Join.Connect.Meet.Apply"
          // +"http://www.graphical.io/assets/img/Graphical-IO.png"
      });
    }




    var request_for_apply_job= function(user,company,job)
    {
      var fromEmail = "admin@techmeetups.com";
      var toEmail = "marketing@techmeetups.com";
      var ccEmail = "shawn@techmeetups.com";

      Email.send(
      {
          from: fromEmail,
          to: toEmail,
          cc:ccEmail,
          replyTo: fromEmail ,
          subject: "TechStartupJobs App - " + "Job Application to "+company.name+" for Job "+job.title,
          text: "Hi,\nCandidate "+user.profile.firstname+" ("+user.emails[0].address+") wants to apply to "+company.name+
          " for the Job '"+job.title+"'"+"\n\n"+
          "Thank you.\n"+
          "The TechStartupJobs Team.\n"+
          "http://techstartupjobs.com\n"+
          "Join.Connect.Meet.Apply"
          // +"http://www.graphical.io/assets/img/Graphical-IO.png"
      });
    }
    var request_for_join_event= function(user,event){
      var fromEmail = "admin@techmeetups.com";
      var toEmail = "marketing@techmeetups.com";
      Email.send({
          from: fromEmail,
          to: toEmail,
          replyTo: fromEmail ,
          subject: "TechStartupJobs App " + "Request to join "+event.name+" event",
          text: "Hi,\n"+user.profile.firstname+"("+user.emails[0].address+") has request to join "+event.name+" event."+
          "\nPlease arrange pass for this event.\n\n"+
          "Thank you.\n"+
          "The TechStartupJobs Team.\n"+
          "http://techstartupjobs.com\n"+
          "Join.Connect.Meet.Apply"
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
            subject: "TechStartupJobs App " +  "Registration Request",
            text: "Hi SysAdmin,\nUser: "+user_email+" wants to register on TechStartupJobs App\n\n"+
          "Thank you.\n"+
          "The TechStartupJobs Team.\n"+
          "http://techstartupjobs.com\n"+
          "Join.Connect.Meet.Apply"
            // + "http://www.graphical.io/assets/img/Graphical-IO.png"
        });
   }

    var request_2pay_now = function(user,cart)
    {
      var fromEmail = "admin@techmeetups.com";
      var toEmail = "marketing@techmeetups.com";
      var ccEmail = "shawn@techmeetups.com";

      var products = "" , tot = 0   ;

      for(i=0;i<cart.length;i++)
      {
        products = cart[i].desc + ' ' + cart[i].amount + '\n' ;
        tot =  tot + eval( isNumber(cart[i].amount)) ;
      }

      products += '\nTotal : '+tot+'\n' ;

      Email.send(
      {
          from: fromEmail,
          to: toEmail,
          cc:ccEmail,
          replyTo: fromEmail ,
          subject: "TechStartupJobs App - " + "Request to Pay ",
          text: "Hi,\n"+user.profile.firstname+" ("+user.emails[0].address+") wants to pay for purchases"+"\n\n"+
          "Purchased Items : \n"+
          products+ "\n"+
          "Thank you.\n"+
          "The TechStartupJobs Team.\n"+
          "http://techstartupjobs.com\n"+
          "Join.Connect.Meet.Apply"
          // +"http://www.graphical.io/assets/img/Graphical-IO.png"
      });

      return true ;
    }


    var email_get_candidate_cv = function (user,attendee)
    {
      var fromEmail = "admin@techmeetups.com";
      var toEmail = "marketing@techmeetups.com";
      var ccEmail = "shawn@techmeetups.com";

      Email.send({
          from: fromEmail,
          to: toEmail,
          replyTo: fromEmail ,
          cc:ccEmail,
          subject: 'TechStartupJobs App - ' + user.profile.firstname+ " requests a CV",
          text: "Hi\n\n" +
          "A client '"+user.profile.firstname+"'  ("+user.emails[0].address+") requests the CV of\n\n"+
          attendee.profile.firstname+ ' ('+user.emails[0].address + ') \n\n'+
          "Please provide this CV."+
          "\n\n"+
          "Thank you.\n"+
          "The TechStartupJobs Team.\n"+
          "http://techstartupjobs.com\n"+
          "Join.Connect.Meet.Apply"
          // +"http://www.graphical.io/assets/img/Graphical-IO.png"
      });
    }

    var email_organise_candidate_call = function (user,attendee)
    {
      var fromEmail = "admin@techmeetups.com";
      var toEmail = "marketing@techmeetups.com";
      var ccEmail = "shawn@techmeetups.com";

      Email.send({
          from: fromEmail,
          to: toEmail,
          replyTo: fromEmail ,
          cc:ccEmail,
          subject: 'TechStartupJobs App - ' + user.profile.firstname+ " requests a Call",
          text: "Hi\n\n" +
          "A client '"+user.profile.firstname+"'  ("+user.emails[0].address+") requests a Call with\n\n"+
          attendee.profile.firstname+ ' ('+user.emails[0].address + ') \n\n'+
          "Please organise this Call."+
          "\n\n"+
          "Thank you.\n"+
          "The TechStartupJobs Team.\n"+
          "http://techstartupjobs.com\n"+
          "Join.Connect.Meet.Apply"
          // +"http://www.graphical.io/assets/img/Graphical-IO.png"
      });
    }


    var email_matched_list = function(user,message)
    {
            var fromEmail = "admin@techmeetups.com";
            var toEmail = user.emails[0].address ;
            var ccEmail = "marketing@techmeetups.com";

            Email.send(
            {
                from: fromEmail,
                to: toEmail,
                replyTo: fromEmail ,
                cc:ccEmail,
                subject: 'TechStartupJobs App - Matched Candidate Report',
                text: "Hi "+user.profile.firstname+"\n\n" +
                "Here is your Matched Candidate Report.\n\n"+
                message+"\n\n"+
                "Thank you.\n"+
                "The TechStartupJobs Team.\n"+
                "http://techstartupjobs.com\n"+
                "Join.Connect.Meet.Apply"
                // +"http://www.graphical.io/assets/img/Graphical-IO.png"
            });
    }

      var email_matched_event = function ( user, job_id, event_id, searchValue, limit, company_id )
      {
        var message = "" ;

        console.log('Server.email_matched_event') ;
        console.log('Event Id:'+event_id+' Company Id:'+company_id+' Job Id:'+job_id+' Search Value:'+searchValue) ;
        //console.log('Keywords:'+keywords.length ) ;

        var event = Events.findOne({_id : event_id}) ;
        if(!event)
          return ;

        message += "\n\nEvent : "+event.name+'\n'  ;
        message += "********************************************************************************"+'\n'  ;

        if( company_id )
           message = email_matched_company( user, job_id, event_id, searchValue, limit, company_id ) ;
        else
        {
          var companies = EventCompany.find({event_id : event_id}).fetch()  ;
          for( c=0;c<companies.length;c++)
          {
              message += email_matched_company( user, job_id, event_id, searchValue, limit, companies[c].company_id ) ;
          }

        }

        return message ;

      }

     var email_matched_company = function ( user, job_id, event_id, searchValue, limit, company_id )
     {
        var message = "" ;

        console.log('Server.email_matched_company') ;
        console.log('Event Id:'+event_id+' Company Id:'+company_id+' Job Id:'+job_id+' Search Value:'+searchValue) ;
        //console.log('Keywords:'+keywords.length ) ;

        var company = Company.findOne({_id : company_id}) ;
        if(!company)
          return ;

        message += "\n\nCompany : "+company.name+'\n'  ;
        message += "============================================================="+'\n'  ;

        if( job_id )
        {
            message = email_matched_job( user, job_id, event_id, searchValue, limit, company_id ) ;
        }
        else
        {
          var jobs = Job.find({company_id : company_id}).fetch()  ;

          for( jc=0;jc<jobs.length;jc++)
          {
              message += email_matched_job( user, jobs[jc]._id, event_id, searchValue, limit, company_id ) ;
          }

        }

        return message ;

     }

     var email_matched_job = function ( user, job_id, event_id, searchValue, limit, company_id )
     {
        var message = "" ;

        console.log('Server.email_matched_job') ;
        console.log('Event Id:'+event_id+' Company Id:'+company_id+' Job Id:'+job_id+' Search Value:'+searchValue) ;
        //console.log('Keywords:'+keywords.length ) ;

        var job = Job.findOne({_id:job_id}) ;
        if(!job)
          return false ;

        // var event = Events.findOne({_id:event_id}) ;
        // if(!event)
        //   return false ;

        var matched = find_matched(limit,searchValue, event_id, job_id) ;

        message += "\n\nJob : "+job.title +'\n'  ;
        message += "-----------------------------------------------------"+'\n'  ;

        message += matched.length + " matching candidates : \n\n" ;

        for(ic=0;ic<matched.length;ic++)
        {
          message += (ic+1) + '. ' +matched[ic].profile.firstname ;

          if( matched[ic].profile.profession )
            message += ' - ' + matched[ic].profile.profession ;

          if( matched[ic].profile.experience )
            message += ' (' + matched[ic].profile.experience + ' years of exp)' ;

          message += '\n' ;
        }

        return message ;
     }

    var find_matched = function (limit, searchValue,event_id, job_id)
    {
      console.log('Finding matched --------------------------') ;
      console.log('limit:'+limit+' searchValue:'+searchValue+' Event Id:'+event_id+' Job Id:'+job_id ) ;

      var user_ids=[] ;

      if(job_id)
      {
          var job = Job.findOne({_id : job_id}) ;

          // if( job )
          //   tag_job(job) ;

          // tag_job_skill(job) ;
          // tag_job_profession(job) ;
          // tag_job_experience(job) ;
      }


      if(event_id)
      {

          var event_attendees =  EventAttendee.find({event_id:event_id}, {sort:{ created_at:-1}},{fields: {'attendee_id':1}}).fetch()
          console.log('event_attendees.length:'+event_attendees.length ) ;

          if(job)
          {
              for(a=0; a < event_attendees.length ;a++)
              {
                  var usr = Meteor.users.findOne( { _id : event_attendees[a].attendee_id } ) ;

                  // console.log(usr) ;
                  // console.log('event_attendees[a].attendee_id:'+event_attendees[a].attendee_id) ;

                  if( usr )
                  {
                      var counter = match_user_job(usr,job) ;

                      if(counter > 0)
                      {
                          // console.log('MATCH FOUND ********************') ;
                          user_ids.push(event_attendees[a].attendee_id)  ;
                      }
                  }
              }

          }
          else
          {
              for(i =0; i< event_attendees.length ;i++)
                user_ids.push(event_attendees[i].attendee_id)   ;
          }

          console.log('--------------------- Found Users:'+user_ids.length) ;
          // console.log(user_ids) ;

          if( searchValue &&  searchValue.length > 1)
          {
                return Meteor.users.find({_id:{$in:user_ids},'profile.firstname':{'$regex': new RegExp(searchValue, "i")}},
                  {limit:limit}).fetch();
          }
          else
          {
                return Meteor.users.find({_id:{$in:user_ids}},{limit:limit}).fetch();
          }
      }
      else
      {
          if( searchValue &&  searchValue.length > 1)
          {
              return Meteor.users.find({ 'profile.firstname':{'$regex': new RegExp(searchValue, "i")}},{limit:limit}).fetch();
          }
          else
          {
              return Meteor.users.find({ },{limit:limit}).fetch();
          }
      }
    }




tag_job = function(job)
{
    var updt_job = false ;
    var title = job.title.toLowerCase() ;
    // var words = title.split(/[\s,]+/) ;

    var skill_list = [] ;
    var org_skill_count = 0 ;

    if(job.skill)
    {
        skill_list = job.skill.split(',') ;
        org_skill_count = skill_list.length ;

        console.log('org_skill_count:'+org_skill_count) ;
        for(sc=0;sc<org_skill_count;sc++)
            console.log(sc+'.'+skill_list[sc]) ;
    }


    var profession_list = [] ;
    var org_profession_count = 0 ;

    if(job.profession)
    {
        profession_list = job.profession.split(',') ;
        org_profession_count = profession_list.length ;

        console.log('org_profession_count:'+org_profession_count) ;
        for(pc=0;pc<org_profession_count;pc++)
            console.log(pc+'.'+profession_list[pc]) ;
    }



    for(j=0;j<keywords.length;j++)
    {
        switch(keywords[j].class)
        {
            case 'skill' :  if( title.search( keywords[j].keyword ) > -1)
                            {
                                var pos = skill_list.indexOf(keywords[j].word);
                                if( pos < 0)
                                {
                                    console.log('Mapped Skill :'+keywords[j].keyword+' --> '+keywords[j].word ) ;
                                    skill_list.push(keywords[j].word) ;
                                }
                            }
                            break ;

            case  'profession' : if( title.search( keywords[j].keyword ) > -1)
                                  {
                                      var pos = profession_list.indexOf(keywords[j].word);
                                      if( pos < 0)
                                      {
                                          console.log('Mapped Profession :'+keywords[j].keyword+' --> '+keywords[j].word ) ;
                                          profession_list.push(keywords[j].word) ;
                                      }
                                  }
                                  break ;

            case  'experience' : if( title.search( keywords[j].keyword ) > -1)
                                  {
                                    updt_job = true ;
                                    job.experience = keywords[j].word ;
                                  }
                                  break ;
        }

    }


    if(skill_list && skill_list.length > 0)
    {
        uskill = Array.from(new Set(skill_list));

        if( uskill.length > org_skill_count)
        {
          skill_str = uskill.join() ;
          console.log('New Skill found. Updating Job with Skill :'+skill_str) ;
          updt_job = true ;
          job.skill = skill_str ;
        }

    }

    if(profession_list && profession_list.length > 0)
    {
        var uprofession = Array.from(new Set(profession_list));

        if( uprofession.length > org_profession_count)
        {
            profession_str = uprofession.join() ;
            console.log('New Profession found. Updating Job with Profession :'+profession_str) ;
            updt_job = true ;
            job.profession = profession_str ;
        }
    }

    if(updt_job)
    {
        Job.update({_id:job._id}, { $set : { skill : job.skill , profession : job.profession, experience : job.experience } } ) ;
    }



    return job ;
}


tag_job_skill = function(job)
{

  // console.log('Checking Job------------------------')
  // console.log(job) ;

    var title = job.title.toLowerCase() ;
    var words = title.split(/[\s,]+/) ;

    var skill_list = [] ;
    var org_skill_count = 0 ;

    if(job.skill)
    {
        skill_list = job.skill.split(/[\s,]+/) ;
        org_skill_count = skill_list.length ;
    }

    // for(i=0;i<words.length;i++)
    // {
    //     for(j=0;j<keywords.length;j++)
    //     {
    //         if( words[i] == keywords[j].keyword && keywords[j].class == 'skill')
    //         {
    //             var pos = skill_list.indexOf(keywords[j].word);
    //             if( pos < 0)
    //             {
    //                 console.log('Mapped :'+words[i]+' -->'+keywords[j].word ) ;
    //                 skill_list.push(keywords[j].word) ;
    //             }
    //         }
    //     }
    // }

    for(j=0;j<keywords.length;j++)
    {
        if( keywords[j].class == 'skill')
        {
            if( title.search( keywords[j].keyword ) > -1)
            {
                var pos = skill_list.indexOf(keywords[j].word);
                if( pos < 0)
                {
                    console.log('Mapped :'+keywords[j].keyword+' --> '+keywords[j].word ) ;
                    skill_list.push(keywords[j].word) ;
                }
            }
        }
    }


    if(skill_list && skill_list.length > 0)
    {
        uskill = Array.from(new Set(skill_list));

        if( uskill.length > org_skill_count)
        {
          skill_str = uskill.join() ;
          console.log('New Skill found. Updating Job with Skill :'+skill_str) ;
          Job.update({_id:job._id},{ $set: {"skill":skill_str}}) ;
          job.skill = skill_str ;
        }

    }

  // console.log('Tagged Job------------------------')
  // console.log(job) ;


    return job ;
}

tag_job_profession = function(job)
{
    var title = job.title.toLowerCase() ;
    var words = title.split(/[\s,]+/) ;

    var profession_list = [] ;
    var org_profession_count = 0 ;

    if(job.profession)
    {
        profession_list = job.profession.split('/[\s,]+/') ;
        org_profession_count = profession_list.length ;
    }

    // for(i=0;i<words.length;i++)
    // {
    //     for(j=0;j<keywords.length;j++)
    //     {
    //         if( words[i] == keywords[j].keyword && keywords[j].class == 'profession')
    //         {
    //             var pos = profession_list.indexOf(keywords[j].word);
    //             if( pos < 0)
    //             {
    //               console.log('Mapped :'+words[i]+' -->'+keywords[j].word ) ;
    //               profession_list.push(keywords[j].word) ;
    //             }
    //         }
    //     }
    // }



    for(j=0;j<keywords.length;j++)
    {
        if( keywords[j].class == 'profession')
        {
            if( title.search( keywords[j].keyword ) > -1)
            {
                var pos = profession_list.indexOf(keywords[j].word);
                if( pos < 0)
                {
                    console.log('Mapped :'+keywords[j].keyword+' --> '+keywords[j].word ) ;
                    profession_list.push(keywords[j].word) ;
                }
            }
        }
    }

    if(profession_list && profession_list.length > 0)
    {
        var uprofession = Array.from(new Set(profession_list));

        if( uprofession.length > org_profession_count)
        {
            profession_str = uprofession.join() ;
            console.log('New Profession found. Updating Job with Profession :'+profession_str) ;
            Job.update({_id:job._id},{ $set: {"profession":profession_str}}) ;
            job.profession = profession_str ;
        }
    }

    return job ;
}

tag_job_experience = function(job)
{
    var title = job.title.toLowerCase() ;
    var words = title.split(/[\s,]+/) ;

    for(i=0;i<words.length;i++)
    {
        for(j=0;j<keywords.length;j++)
        {
            if( words[i] == keywords[j].keyword && keywords[j].class == 'experience')
            {
                Job.update({_id:job._id},{ $set: {"experience":keywords[j].word}}) ;
                job.experience = keywords[j].word ;
                break ;
            }
        }
    }

    return job ;
}



  var import_attandee_files = function(file,event_id)
  {
    console.log("enter function import_file_orders")
     var lines = file.split(/\r\n|\n/);
     var l = lines.length - 1;

    event = Events.findOne({_id:event_id});
    if(event)
    {
       event_id = event._id;
    }

    console.log('import_attandee_files.event_id:'+event_id)
    console.log('No of Atendees:'+l)

     for (var i=1; i < l; i++)
     {
        try
        {
           var line = lines[i];
           var skill, prof, lookingfor ;
           var line_parts ;

           line = rmv_start_quote(line) ;
           line = rmv_end_quote(line) ;

           console.log(i+" ->"+line) ;

           line_parts = line.split(new RegExp(',(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))'));
           if( line_parts[1] === undefined)
           {
              line_parts = line.split(new RegExp(';(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))'));
              if( line_parts[1] === undefined)
              {
                 console.log('File format Error !') ;
                 return ;
              }
              else
              {
                 console.log('Swtching to ; as delimiter') ;
              }
           }

           var cols = [ "firstname", "email", "exp.yrs", "skills", "date joined", "looking for", "profession",
           "pic", "cv", "linkedin", "city"  ] ;

           for(k=0;k<=10;k++)
           {
              console.log(k+'['+cols[k]+']='+line_parts[k])
           }

            if( line_parts[4] )
             dataObj = new Date(moment(line_parts[4]));
            else
              dataObj = new Date() ;

            if( line_parts[2] )
            {
                exp = parseInt( line_parts[2] ) ;
                if( isNaN (exp) )
                  exp = 0 ;
            }



           if(line_parts[3])
             skill = line_parts[3].replace(/["']/g, "");
           else
            skill="" ;

          if(line_parts[6])
             prof = line_parts[6].replace(/["']/g, "");
           else
            prof="" ;

          if(line_parts[1])
            email = line_parts[1].trim();
          else
          {
              console.log(i+" ERROR ! No Email found !: "+ line_parts[1]) ;
              continue ;
          }

          if( ! line_parts[5] )
            lookingfor = 'Job' ;
          else
            lookingfor = line_parts[5] ;

           user = Meteor.users.findOne({"emails.address" : email});
           user_id=''

          if(user)
          {
            user_id = user._id
            console.log(i+" User already Registered In System : "+ line_parts[1])+' Updating'

            var profile  =
            {
                    firstname : line_parts[0],
                    experience: exp,
                    skill : skill,
                    lookingfor: lookingfor,
                    profession: prof,
                    pic: line_parts[7],
                    cv: line_parts[8],
                    linkedin : line_parts[9],
                    city : line_parts[10]
            } ;

            attendee_manager.update(user_id,profile) ;
          }
          else
          {
            user_id = Accounts.createUser(
            {
                username: line_parts[1],
                email : line_parts[1],
                password : line_parts[1],
                profile  :
                {
                    firstname : line_parts[0],
                    experience: exp,
                    skill : skill,
                    lookingfor: lookingfor,
                    profession: prof,
                    pic: line_parts[7],
                    cv: line_parts[8],
                    linkedin : line_parts[9],
                    city : line_parts[10],
                    created_at:new Date(),
                    auto_created : true
              }
            });
            console.log(i+" User created In System : "+ line_parts[1])
          }

          ticket_no = guid();
          event_attendee = EventAttendee.findOne({attendee_id:user_id,event_id:event_id});

          if(event_attendee)
          {
            console.log("User Already Registered In An Event : "+ line_parts[1])
          }
          else
          {
             EventAttendee.insert({attendee_id:user_id,event_id:event_id,joined_on:dataObj,ticket_no:ticket_no,created_at:new Date()});
             console.log("Users Registered to Event : "+ line_parts[1])
          }

        }catch ( e )
        {
          console.log(e);
        }
     }
    };

    var rmv_start_quote = function(line)
    {
      if( line.charAt(0) === '"')
      {
          line = line.slice(1,line.length) ;
      }
      return line ;
    }

    var rmv_end_quote = function(line)
    {
       if( line.charAt(line.length-1) === '"')
       {
          line = line.slice(0,line.length-1) ;
       }

       return line ;
    }

    // 0 - firstname, 1 - email, 2 - exp years, 3 - skills, 4 - date joined, 5 looking for, 6 - profession , 7 - pic, 8 - cv, 9 - linkedin, 10 - city, 11 - event name, 12 EB id

    var import_all_attandee_files = function(file)
    {
      console.log("enter function import_all_file_orders")
       var lines = file.split(/\r\n|\n/);
       var l = lines.length ;



       for (var i=1; i < l; i++)
       {
          console.log('Checking Row :'+i) ; 

          try
          {
             var line = lines[i];
             var line_parts = line.split(new RegExp(',(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))'));
             join_date = line_parts[4].trim();
             if(join_date.length < 1){
               join_date = new Date()
             }

             console.log(join_date) ; 

             dataObj = new Date(moment(join_date));


             eventbright_id= line_parts[12]
             var ecity = line_parts[10].trim()
             event_name = line_parts[11]

              exp = line_parts[2].trim();
             exp_array = exp.match(/\d+/g)
             if(exp_array && exp_array.length > 1){
               exp =exp_array[1]
             }else if(exp_array && exp_array.length == 1){
               exp =exp_array[0]
             }else{
               exp='';
             }

             if(line_parts[3])
               skill = line_parts[3].replace(/["']/g, "");
             else
              skill="" ;

             email = line_parts[1].trim();

             import_one_attendee( email , line_parts[0] , exp, skill, line_parts[5], line_parts[6], line_parts[7], line_parts[8], 
              line_parts[9], line_parts[10], eventbright_id, event_name, ecity, dataObj )

            //  event = Events.findOne({eventbright_id:eventbright_id});
            //  if(event)
            //  {
            //     event_id = event._id;
            //  }
            //  else
            //  {

            //    event_id =  Events.insert({name:event_name,eventbright_id:eventbright_id,created_at:new Date(), city : ecity });
            //  }
            //  console.log('import_attandee_files.event_id'+event_id)


            //  user = Meteor.users.findOne({"emails.address" : email});
            //  user_id=''

            // if(user)
            // {
            //   user_id = user._id
            //   console.log("User Already Registered In System : "+ line_parts[1])+' Updating'

            //   var profile  =
            //   {
            //           firstname : line_parts[0],
            //           experience: exp,
            //           skill : skill.trim(),
            //           lookingfor: line_parts[5],
            //           profession: line_parts[6],
            //           pic: line_parts[7],
            //           cv: line_parts[8],
            //           linkedin : line_parts[9],
            //           city : line_parts[10]
            //   } ;

            //   attendee_manager.update(user_id,profile) ;
            // }
            // else
            // {
            //   user_id = Accounts.createUser(
            //   {
            //       username: line_parts[1],
            //       email : line_parts[1],
            //       password : line_parts[1],
            //       profile  :
            //       {
            //           firstname : line_parts[0],
            //           experience: exp,
            //           skill : skill,
            //           lookingfor: line_parts[5],
            //           profession: line_parts[6],
            //           pic: line_parts[7],
            //           cv: line_parts[8],
            //           linkedin : line_parts[9],
            //           city : line_parts[10],
            //           created_at:new Date(),
            //           auto_created : true
            //     }
            //   });
            //   console.log("User created In System : "+ line_parts[1])
            // }

            // ticket_no = guid();
            // event_attendee = EventAttendee.findOne({attendee_id:user_id,event_id:event_id});

            // if(event_attendee)
            // {
            //   console.log("Users Already Registered In An Event : "+ line_parts[1])
            // }
            // else
            // {
            //    EventAttendee.insert({attendee_id:user_id,event_id:event_id,joined_on:dataObj,ticket_no:ticket_no,created_at:new Date()});
            //    console.log("Users Registered In An Event : "+ line_parts[1])
            // }

          }catch ( e )
          {
            console.log(e);
          }
        }
      };

          


      function sendEventUpdateNotification(event_id){
        event = Events.findOne({_id:event_id});
        user_ids = EventAttendee.find({event_id:event_id}).fetch().map(function(doc){return doc.attendee_id});
        all_user = Meteor.users.find({_id:{$in:user_ids}}).fetch();
        for(var i=0;i<all_user.length;i++){
          send_event_change_notification(event,all_user[i])
        }
      }

      Meteor.methods(
      {
        'email_matched_job' : function(user, title, profession, experience, skill, city, showemail, showlinkedin )
        {
            console.log('Server.email_matched_job') ;
            console.log( arguments ) ;

            var job = {} ; 
            job.title = title ; 
            job.experience = experience ; 
            job.skill = skill ; 
            job.profession = profession ; 
            

            keywords = match_manager.loadKeyWords() ;
            

            var message = "Job : "+profession+' in '+city + ' with '+experience+' years of exp.'+ ' Skills: '+skill+ '\n'
            message += title + '\n\n';

            var users = Meteor.users.find({}).fetch();

            var len = users.length ; 
            console.log('Matching Users:'+len)
            var uid = [] ; 

            for(var u = 0, found=0;u <len ; u++)
            {
                console.log('Searching '+u)
                if( match_user_job(users[u],job) > 0)
                {
                  ++found ;     
                  console.log('Found:'+found)
                      
                  uid.push( users[u]._id ) ; 
                    
                }  
            }


            users =  Meteor.users.find({_id:{$in:uid}},{sort:{ 'profile.city' : -1} }).fetch();

            var len = users.length ; 
            console.log('Found Users:'+len)
            
            for(var u = 0, found=1;u <len ; u++, found++)
            {
                var uop = users[u].profile ; 
                message = message + found +'. '+uop.firstname ; 
                if( showemail )
                  message = message + ' ('+users[u].emails[0].address+')' ; 
                message = message + ' ' +uop.experience+' years exp. in '+uop.city+ ' [ID:' + users[u]._id +']'+'\n' ; 
                message = message + '       '+uop.profession + '. ' + uop.skill + '. ' ; 
                if( showlinkedin )
                  message = message + uop.linkedin ; 
                message = message + '\n\n' ; 
            }
            


            // if( event_id )
            //    message = email_matched_event( user, job_id, event_id, searchValue, limit, company_id ) ;
            // else
            // {
            //   var events = Events.find({}).fetch()  ;
            //   for( e=0;e<events.length;e++)
            //   {
            //       message += email_matched_event( user, job_id, events[e]._id, searchValue, limit, company_id ) ;
            //   }

            // }

            email_matched_list(user,message) ;

            return found ;

        },
        'email_matched' : function(user, job_id, event_id, searchValue, limit, company_id)
        {
            console.log('Server.email_matched') ;
            console.log('Event Id:'+event_id+' Company Id:'+company_id+' Job Id:'+job_id+' Search Value:'+searchValue) ;

            keywords = match_manager.loadKeyWords() ;
            //console.log('Keywords:'+keywords.length ) ;

            var message = "" ;

            if( event_id )
               message = email_matched_event( user, job_id, event_id, searchValue, limit, company_id ) ;
            else
            {
              var events = Events.find({}).fetch()  ;
              for( e=0;e<events.length;e++)
              {
                  message += email_matched_event( user, job_id, events[e]._id, searchValue, limit, company_id ) ;
              }

            }

            email_matched_list(user,message) ;

        },
        'notification_event_update': function(event_id){
            if (Meteor.isServer)
              sendEventUpdateNotification(event_id)
        },
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
        resetpassword : function (user_id,pass,email)
        {
          if(pass.length > 1)
          {
            Accounts.setPassword(user_id, pass);
          }
          try{
            if(email && email.length > 1){
              Meteor.users.update({_id : user_id},{ $set: {'emails.0.address': email }});
            }
          }catch(e){
            console.log(e)
            throw new Meteor.Error(400,'Please check provided email already present.');
          }

          // else
          // {
          //   Meteor.users.update({_id : user_id},{$set:{"profile.pic":pic}});
          // }
        },
        update_attendee : function (user_id,data)
        {
          console.log('update_attendee:'+user_id) ;

          Meteor.users.update(
          {_id : user_id},
          {$set: {
                  "profile.firstname":data.firstname,
                  "profile.experience":data.experience,
                  "profile.skill":data.skill,
                  "profile.lookingfor":data.lookingfor,
                  "profile.profession":data.profession,
                  "profile.pic":data.pic,
                  "profile.cv":data.cv,
                  "profile.linkedin":data.linkedin,
                  "profile.city":data.city
                  }
          });
        },
        update_attendee_priority : function (user_id)
        {
          console.log('update_attendee_priority:'+user_id) ;          
          Meteor.users.update( {_id : user_id}, {$set: { "profile.premium":1  } });
        },
        resetpasswordByEmail : function (email)
        {
          console.log('resetpasswordByEmail:'+email) ;

          var user = Meteor.users.findOne({'emails.address': {$regex:email,$options:'i'}});
          if(user)
          {
              console.log('user found:'+user._id) ;
            pass = guid()
            Accounts.setPassword(user._id, pass);
            userPasswordReset(user,pass)
            return false ;
          }

          return true ;

        },
        authenticate : function(code)
        {
          this.unblock();
          return authenticate(code)
        },
        insert_attendee : function(data,event_id)
        {
          user =  Meteor.users.findOne({"email":data.email});

          if(user)
          {
            user_id = user._id
          }
          else
          {
            user_id = Accounts.createUser(
            {
              username: data.name,
              email : data.email,
              password : "welcome",
              profile  :
              {
                  firstname : data.name,
                  skill : data.skill,
                  experience:data.experience,
                  lookingfor: data.lookingfor,
                  created_at:new Date(),
                  pic: data.pic
              }
            });
          }

        //  attendee_id = Attendees.insert(data)
          event_id = event_id
          joined_on= new Date();
          ticket_no = guid();
          EventAttendee.insert({attendee_id:user_id,event_id:event_id,joined_on:joined_on,ticket_no:ticket_no,created_at:new Date()});
        },
        insert_company : function(data,event_id)
        {
          company =  Company.findOne({"name":data.name});
          if(company){
            company_id = company._id
          }else{
            company_id = Company.insert(data);
          }
          event_id = event_id
          if(event_id){
            joined_on= new Date();
            EventCompany.insert({event_id:event_id,company_id:company_id,joined_on:new Date(),created_at:new Date()})
          }
        },
        insert_Job: function(data)
        {
          console.log(data)
          Job.insert(data)
        },
        delete_job:function(id){
          Job.remove({_id:id});
        },
        current_user_envent_state : function(event_id,user_id){
          console.log(user_id+" : "+event_id);
          event_attendee = EventAttendee.find({attendee_id:user_id,event_id:event_id}).fetch()
          console.log(event_attendee)
          return event_attendee;
        },
        create_request_for_event_attendee : function(event_id,user_id,checkout_item){
          console.log(user_id+" : "+event_id);
          ticket_no = guid();
          checkout_item.desc = checkout_item.desc +"\n"+ticket_no;
          Checkout.insert(checkout_item);
          EventAttendee.insert({attendee_id:user_id,event_id:event_id,ticket_no:ticket_no,joined_on:new Date(),created_at:new Date()});
          event = Events.findOne({_id:event_id});
          user = Meteor.users.findOne({_id:user_id});
          request_for_join_event(user,event);
          send_ticket_details(event,user,ticket_no)

          return true;
        },
        connect_request : function(data)
        {
          ConnectRequest.insert({request_type:data.request_type, message:data.message, user_id:data.user_id,
            requested_on: new Date(), created_at:new Date(),company_id:data.company_id,job_id:data.job_id,
            event_id:data.event_id,attendee_id:"",pic:data.pic});
            event = Events.findOne({_id:data.event_id});
            user = Meteor.users.findOne({_id:data.user_id});
            company = Company.findOne({_id:data.company_id});
            job = Job.findOne({_id:data.job_id})

            if(data.request_type =="job_apply")
            {
              request_for_apply_job(user,company,job)
              console.log("request is send")
            }
            if(data.request_type =="job_meet")
            {
              request_for_meet_job(user,company,job)
              console.log("request is send")
            }
          console.log("request is send")
        },
        connect_request_candidate: function(data)
        {
          console.log('')
          ConnectRequest.insert(
            { request_type:data.request_type, message:data.message,user_id:data.user_id,requested_on: new Date(),
            created_at:new Date(),company_id:"",job_id:"",event_id:data.event_id,attendee_id:data.attendee_id,
            pic:data.pic});

            user = Meteor.users.findOne({_id:data.user_id});
            attendee = Meteor.users.findOne({_id:data.attendee_id});

            if(data.request_type =="meet_candidate")
            {
              request_for_meet_candidate(user,attendee,data.message)
              console.log("request is send")
            }
        },
        upload_attandee : function(fileContent,event_id)
        {
             console.log("start insert");
             import_attandee_files(fileContent,event_id);
             console.log("completed");
             return true
        },
        upload_all_attandee: function(fileContent){
          console.log("start insert");
          import_all_attandee_files(fileContent);
          console.log("completed");
          return true
        },
        upload_all_attandee_dynamic: function(attendeeList)
        {
          
          len = attendeeList.length ; 
          console.log("upload_all_attandee_dynamic"+len);


          for(i=0;i<len;i++)
          {

             console.log('Checking Row :'+i) ; 

            try
            {

// import_one_attendee = function ( email , fname , exp, skill, lookingfor, profession, pic, cv, linkedin, city, eventbright_id, event_name, ecity, dataObj )
            
            import_one_attendee( attendeeList[i].email , attendeeList[i].firstname , attendeeList[i].experience, 
              attendeeList[i].skills, attendeeList[i].lookingfor, attendeeList[i].profession, attendeeList[i].pic, 
              attendeeList[i].cv, attendeeList[i].linkedin, attendeeList[i].city, attendeeList[i].eventid, 
              attendeeList[i].eventname, attendeeList[i].city, attendeeList[i].orderdate ) ; 

            }
            catch ( e )
            {
              console.log(e);
            }

          }  
          console.log("completed");
          return true
        },
        checkout_item:function(data){
          Checkout.insert(data);
        },
        remove_checkout_item:function(item_id)
        {
          cart_item = Checkout.findOne({_id:item_id})
          if(cart_item.item_type == "ticket"){
            EventAttendee.remove({attendee_id:cart_item.user_id,event_id:cart_item.item_id});
          }
          Checkout.remove({_id:item_id});
          return true;
        },
        remove_connect_item:function(item_id)
        {
          ConnectRequest.remove({_id:item_id});
          return true;
        },
        pay_now_email : function(user_id,cart)
        {
            user = Meteor.users.findOne({_id:user_id});

            var res = request_2pay_now(user,cart) ;

           console.log("pay now request is send")
           return res ;
        },
        get_candidate_cv: function(data)
        {
          ConnectRequest.insert(
            { request_type:data.request_type, message:data.message,user_id:data.user_id,requested_on: new Date(),
            created_at:new Date(),company_id:"",job_id:"",event_id:data.event_id,attendee_id:data.attendee_id,
            pic:data.pic});

            user = Meteor.users.findOne({_id:data.user_id});
            attendee = Meteor.users.findOne({_id:data.attendee_id});

            if(data.request_type =="candidate_cv")
            {
              email_get_candidate_cv(user,attendee) ;
            }
        },
        organise_candidate_call: function(data)
        {
          ConnectRequest.insert(
            { request_type:data.request_type, message:data.message,user_id:data.user_id,requested_on: new Date(),
            created_at:new Date(),company_id:"",job_id:"",event_id:data.event_id,attendee_id:data.attendee_id,
            pic:data.pic});

            user = Meteor.users.findOne({_id:data.user_id});
            attendee = Meteor.users.findOne({_id:data.attendee_id});

            if(data.request_type =="candidate_call")
            {
              email_organise_candidate_call(user,attendee) ;
            }
        },
        delete_company : function(company_id){
          Job.remove({company_id:company_id});
          Company.remove({_id:company_id});
        },
        delete_event_company : function(company_id){
          Job.remove({company_id:company_id});
          EventCompany.remove({company_id:company_id});
        },
        notification_company_update : function(company_id){
          if(Meteor.isServer){
            company = Company.findOne({_id:company_id});
            if(company.city){
              users = Meteor.users.find({"profile.city":{$regex : new RegExp(company.city, "i") }}).fetch();
              for(var u = 0;u < users.length; u++){
                email = getUserEmail(users[u])
                console.log(email)
                if(email != false){
                  send_company_add_notification(company,users[u],email)
                }
              }
            }
          }
        },
        notification_event_add: function(event_id){
          if(Meteor.isServer){
            event = Events.findOne({_id:event_id});
            if(event.city){
              users = Meteor.users.find({"profile.city":{$regex : new RegExp(event.city, "i") }}).fetch();
              console.log(users) ; 
              for(var u = 0;u < users.length; u++)
              {
                console.log(users[u])
                email = getUserEmail(users[u])
                if(email != false){
                  send_event_add_notification(event,users[u],email)
                }
              }
            }
          }
        },
        notification_job_add : function(job_id){
          if(Meteor.isServer){
            job = Job.findOne({_id:job_id});
            if(job.city){
              users = Meteor.users.find({"profile.city":{$regex : new RegExp(job.city, "i") }}).fetch();
              for(var u = 0;u < users.length; u++){
                email = getUserEmail(users[u])
                if(email != false){
                  send_job_add_notification(job,users[u],email)
                }
              }

            }
          }
        }
    });
}
