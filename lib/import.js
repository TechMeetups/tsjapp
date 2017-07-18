// 0 - firstname, 1 - email, 2 - exp years, 3 - skills, 4 - date joined, 5 looking for, 6 - profession , 7 - pic, 8 - cv, 9 - linkedin, 10 - city, 11 - event name, 12 EB id

      import_one_attendee = function ( email , fname , exp, skill, lookingfor, profession, pic, cv, linkedin, city, eventbright_id, event_name, ecity, dataObj )
      {

        console.log('import_one_attendee')
        console.log(arguments);

      var user = Meteor.users.findOne({"emails.address" : email});
      var user_id=''

      var profile  =
      {
              firstname : fname,
              experience: exp,
              skill : skill, 
              lookingfor: lookingfor,
              profession: profession,
              pic: pic,
              cv: cv,
              linkedin : linkedin,
              city : city
      } ;


            if(user)
            {
              user_id = user._id
              console.log("User Already Registered In System : "+ email +' Updating') ; 
              attendee_manager.update(user_id,profile) ;
            }
            else
            {
              profile.created_at = new Date() ; 
              profile.auto_created = true ; 

              user_id = Accounts.createUser(
              {
                  username: fname,
                  email : fname,
                  password : fname,
                  profile  : profile 
              });

              console.log("User created In System : "+ email)
            }

            var event = Events.findOne({eventbright_id:eventbright_id});
             
             if(event)
             {
                event_id = event._id;
             }
             else
             {
               event_id =  Events.insert({name:event_name,eventbright_id:eventbright_id,created_at:new Date(), city : ecity });
             }
             console.log('import_attandee_files.event_id'+event_id)

            ticket_no = guid();
            event_attendee = EventAttendee.findOne({attendee_id:user_id,event_id:event_id});

            if(event_attendee)
            {
              console.log("User " + user_id + " already Registered In An Event : "+ event_attendee.event_id)
            }
            else
            {
               EventAttendee.insert({attendee_id:user_id,event_id:event_id,joined_on:dataObj,ticket_no:ticket_no,created_at:new Date()});
               console.log("User " + user_id + " has been Registered to : "+ event_id)
            }


      }