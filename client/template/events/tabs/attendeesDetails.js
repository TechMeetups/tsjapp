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
    pic_exists : function(pic_url)
  {
      console.log("attendeesTab'"+pic_url+"'") ; 
      if (!pic_url.trim() || pic_url === '') 
        return false ;
      else
        return true ; 

  },     
  format_date : function(date){
    return event_manager.format_data(date)
  },
  connect_request : function (){
    return ConnectRequest.find({});
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
  list_need_to_view: function(){
    if(attendee_manager.get_connect_request_count() > 0){
      return true
      }
      else
      {
        return false
      }
  }
});
Template.attendeesDetails.events(
{
  'click #meet_candidate' : function(event, template)
  {
    attendee_id = Router.current().params._attendee_id;
    user_id = Meteor.userId();
    request_type = "meet_candidate"
    request ={request_type:request_type,user_id:user_id,attendee_id:attendee_id}
    console.log(request)
    event_manager.meet_candidate(request);
  }, 
  'click .jump2Linkedin' : function(URL) 
  {
      OpenInNewTab(url) ; 
  }
});
