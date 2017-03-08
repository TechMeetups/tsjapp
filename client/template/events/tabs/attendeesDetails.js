Template.attendeesDetails.created = function ()
{
  this.autorun(function ()
  {
    this.subscription = Meteor.subscribe('attendees_details',Router.current().params._id,Router.current().params._attendee_id);
    this.subscription1 = attendee_manager.default_connect_request(Router.current().params._attendee_id)
  }.bind(this));
};

Template.attendeesDetails.rendered = function ()
{
  this.autorun(function ()
  {
    if (!this.subscription.ready() || !this.subscription1.ready())
    {
      IonLoading.show();
    }
    else
    {
      IonLoading.hide();
    }
  }.bind(this));
};

Template.attendeesDetails.helpers(
{

  has_email : function() 
  {
      if( !this.emails )
        return false ; 
      if( !this.emails[0].address )
        return false ; 
      else 
        return this.emails[0].address ;   
  }, 
  not_me : function()
  {
      var curr_user_id = Router.current().params._attendee_id ;

      console.log('Logged in user:'+Meteor.userId()+' curr_user_id:'+curr_user_id) ;

      if(curr_user_id !== Meteor.userId())
        return true ;
      else
        return false ;
  },
  pic_exists : function(pic_url)
  {
      console.log("attendeesTab'"+pic_url+"'") ;
      if (!pic_url.trim() || pic_url === '')
        return false ;
      else
        return true ;

  },
  build_pic : function(pic)
  {
      if(pic)
        return pic ;
      else
        return "/assets/img/profile.png" ;

  },
  format_date : function(date){
    return event_manager.format_data(date)
  },
  connect_request : function ()
  {
    return ConnectRequest.find({},{sort:{created_at : -1 }});
  },
  addIndex : function(obj){
    obj = obj || [];
   _.each(obj, function (object, index) {
     obj[index]["index"] = index;
   });
   console.log(obj)
   return obj;
  },
  add_comma : function(value){
    console.log(value)
    if(value > 1){
      return true
    }else{
      return false
    }
  },
  list_need_to_view: function()
  {
    if(attendee_manager.get_connect_request_count() > 0)
    {
      return true
    }
    else
    {
      return false
    }
  },
  has_cv_linkedin: function(cv, linkedin)
  {
    if(cv || linkedin)
      return true ;
    else
      return false ;
  }
});
Template.attendeesDetails.events(
{
  "click .markPremium" : function(event, template)
  {
      var id = $(event.currentTarget).attr('data') ; 
      if( id )
        attendee_manager.updatePriority(id) ; 
  },   
  'click #email_update' : function(event, template){
    Router.go('/user_profile');
  },
  'click #meet_candidate' : function(event, template)
  {
    attendee_id = Router.current().params._attendee_id;
    event_id = Router.current().params._id;

    user_id = Meteor.userId();
    request_type = "meet_candidate"
    var message = template.find('#message').value;
    template.find('#message').value = "" ;

    // var pic = $('#attendee_pic').attr('src') ;

    var upic = Meteor.user().profile.pic ;
    if(!upic)
      pic = "/assets/img/profile.png" ;
    else
      pic = upic ;

    request ={request_type:request_type,message:message,user_id:user_id,event_id:event_id,
      attendee_id:attendee_id,pic:upic} ;

    console.log(request)
    event_manager.meet_candidate(request);
  },
  'click .jump2Linkedin' : function(URL)
  {
      OpenInNewTab(url) ;
  },
  'click .remove_item' : function(event, template)
  {
    var item_id = $(event.currentTarget).attr('data');
    connect_manager.remove_connect_item(item_id)
  },
  'click #matched_cv' : function(event, template)
  {
    var attendee_name = $(event.currentTarget).attr('data');
    attendee_id = Router.current().params._attendee_id;
    event_id = Router.current().params._id;

    user_id = Meteor.userId();
    request_type = "candidate_cv" ;

    var upic = Meteor.user().profile.pic ;
    if(!upic)
      pic = "/assets/img/cv.png" ;
    else
      pic = upic ;

    request ={request_type:request_type,message:'Get CV',user_id:user_id,event_id:event_id,
      attendee_id:attendee_id,pic:upic} ;

    attendee_manager.candidate_cv(request);


    // event_id = Router.current().params._id
    // user_id = Meteor.userId()
    // var id = Router.current().params._sponsor_id;
    // var sponsor = Sponsor.findOne({_id:id});
    // event = Events.findOne({_id:event_id});

    data = {
      user_id : user_id,
      pic : "/assets/img/cv.png" ,
      item_type:"Get CV",
      desc:'Get CV of ' + attendee_name,
      amount:10,
      paid:"unpaid",
      item_id:attendee_id,
      created_at:new Date()
    }

    checkout_manager.checkout_item(data) ;
//    Router.go('checkout.tab', {_id: event_id});

  },
  'click #matched_call' : function(event, template)
  {
    var attendee_name = $(event.currentTarget).attr('data');

    attendee_id = Router.current().params._attendee_id;
    event_id = Router.current().params._id;

    user_id = Meteor.userId();
    request_type = "candidate_call" ;

    var upic = Meteor.user().profile.pic ;
    if(!upic)
      pic = "/assets/img/call.png" ;
    else
      pic = upic ;

    request ={request_type:request_type,message:'Organise Call',user_id:user_id,event_id:event_id,
      attendee_id:attendee_id,pic:upic} ;

    attendee_manager.candidate_call(request);

    data = {
      user_id : user_id,
      pic : "/assets/img/call.png" ,
      item_type:"Organise Call",
      desc:'Organise Call with ' + attendee_name,
      amount:100,
      paid:"unpaid",
      item_id:attendee_id,
      created_at:new Date()
    }

    checkout_manager.checkout_item(data) ;


  }


});
