
if (Meteor.isServer)
{

    Meteor.publish("events", function (limit, searchValue)
    {
      console.log(searchValue)
      console.log(limit)
      if(!limit || limit < 1)
          limit = 10 ;
        if( searchValue &&  searchValue.length > 1)
        {
          console.log(Events.find({'name': {'$regex': new RegExp(searchValue, "i")}}, {sort:{ start:1},limit:limit}).count());
          return Events.find({'name': {'$regex': new RegExp(searchValue, "i")}}, {sort:{ start:1},limit:limit});
        }
        else
        {
          console.log(Events.find({},{sort:{ start:1},limit:limit}).count());
          return Events.find({},{sort:{ start:1},limit:limit});
        }
    });

    Meteor.publish("sponsor_list", function (user_id, attendee_id)
    {
      return Sponsor.find({});
    });

    Meteor.publish("connect_request_for_user", function (user_id)
    {
        console.log('connect_request_for_user:'+user_id);
      return ConnectRequest.find({user_id:user_id})
    });

     Meteor.publish("connect_request_for_attendees", function (user_id, attendee_id)
    {
      return ConnectRequest.find({user_id:user_id,attendee_id:attendee_id,request_type:"meet_candidate"})
    });

    Meteor.publish("connect_request_for_job", function (user_id,job_id)
    {
      return ConnectRequest.find({user_id:user_id,job_id:job_id,request_type:{$in:["job_meet","job_apply"]}})
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

    Meteor.publish("jobs", function (limit,event_id,company_id)
    {
      $set = {} ; 
      
      if(event_id)
        $set['event_id'] = event_id ; 

      if(company_id)
        $set['company_id'] = company_id ; 

      if(!limit || limit < 1)
          limit = 10 ;
            
      return Job.find($set,{limit:limit});
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

    Meteor.publish("company", function (limit, searchValue,event_id)
    {
      company_ids=[]
      console.log(event_id)
      event_company =   EventCompany.find({event_id:event_id}, {sort:{ created_at:-1}},{fields: {'company_id':1}}).fetch()
      console.log(event_company)
      for(i =0; i< event_company.length ;i++){
        company_ids.push(event_company[i].company_id)
      }
      console.log(searchValue);
      if(!limit || limit < 1)
          limit = 10 ;
        if( searchValue &&  searchValue.length > 1){
          console.log(Company.find({_id:{$in:company_ids},'name':{'$regex': new RegExp(searchValue, "i")}},{limit:limit}).count())
          return Company.find({_id:{$in:company_ids},'name':{'$regex': new RegExp(searchValue, "i")}},{limit:limit});
        }else{
          return Company.find({_id:{$in:company_ids}},{limit:limit});
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

    Meteor.startup(function () 
    {

        // By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users asking for help with their account, be sure to set this to an email address that you can receive email at.
        Accounts.emailTemplates.from = 'admin <no-reply@TechStartupJobs.com>';
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
        var toEmail = user.emails[0].address;
        Email.send({
            from: fromEmail,
            to: toEmail,
            replyTo: fromEmail ,
            subject: "TechStartupJobs App Registration",
            text: "Hi "+user.profile.firstname+",\nYour Email: "+user.emails[0].address+" has been registered."+
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
          subject: 'TechStartupJobs App - ' + user.profile.firstname+ " would like to connect with you",
          text: "Hi "+attendee.profile.firstname+"\n\n" +
          "A User '"+user.profile.firstname+"'  ("+user.emails[0].address+") would like to connect with you.\n\n"+
          "Message : "+message+"\n\n"+ 
          "Please check his profile and message or email him if interested."+
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

      var products, tot = 0   ;

      for(i=0;i<cart.length;i++)
      {
        products += cart[i].desc + ' ' + cart[i].amount + '\n' ; 
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
    console.log('import_attandee_files.event_id'+event_id)

     for (var i=1; i < l; i++) 
     {
        try 
        {
           var line = lines[i];
           var line_parts = line.split(new RegExp(',(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))'));
           dataObj = new Date(moment(line_parts[4]));

           exp = line_parts[2];
           skill = line_parts[3].replace(/["']/g, "");
           email = line_parts[1].trim();
           user = Meteor.users.findOne({"emails.address" : email});
           user_id=''

          if(user)
          {
            user_id = user._id
            console.log("User Already Registered In System : "+ line_parts[1])+' Updating'

            var profile  =  
            {
                    firstname : line_parts[0],
                    experience: exp,
                    skill : skill,
                    lookingfor: line_parts[5],
                    profession: line_parts[6],
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
                username: line_parts[0],
                email : line_parts[1],
                password : line_parts[1],
                profile  : 
                {
                    firstname : line_parts[0],
                    experience: exp,
                    skill : skill,
                    lookingfor: line_parts[5],
                    profession: line_parts[6],
                    pic: line_parts[7],
                    cv: line_parts[8],
                    linkedin : line_parts[9], 
                    city : line_parts[10], 
                    created_at:new Date(),
                    auto_created : true
              }
            });
            console.log("User created In System : "+ line_parts[1])
          }

          ticket_no = guid();
          event_attendee = EventAttendee.findOne({attendee_id:user_id,event_id:event_id});
       
          if(event_attendee)
          {
            console.log("Users Already Registered In An Event : "+ line_parts[1])
          }
          else
          {
             EventAttendee.insert({attendee_id:user_id,event_id:event_id,joined_on:dataObj,ticket_no:ticket_no,created_at:new Date()});
             console.log("Users Registered In An Event : "+ line_parts[1])
          }
        
        }catch ( e ) 
        {
          console.log(e);
        }
     }
    };

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
          if(pass.length > 1)
          {
            Accounts.setPassword(user_id, pass);
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
        resetpasswordByEmail : function (email)
        {
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
            company_id = user._id
          }else{
            company_id = Company.insert(data);
          }
          event_id = event_id
          joined_on= new Date();
          EventCompany.insert({event_id:event_id,company_id:company_id,joined_on:new Date(),created_at:new Date()})
        }
        ,
        insert_Job: function(data){
          console.log(data)
          Job.insert(data)
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
        upload_attandee : function(fileContent,event_id){
             console.log("start insert");
             import_attandee_files(fileContent,event_id);
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
    });
}
