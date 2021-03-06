Template.attendeesTab.helpers(
{
  attendee_count : function(pic_url)
  {
    return attendee_manager.getCount() ; 
  } , 
  pic_exists : function(pic_url)
  {
      if(!pic_url)
        return false ; 
      
      if (!pic_url.trim() || pic_url === '') 
        return false ;
      else
        return true ; 
  },   
  build_path: function(_id)
  {
    return "/tabs/attendees/"+Router.current().params._id+"/"+_id;
  },
  format_date: function(date){
    return attendee_manager.format_data(date);
  },
  attendees: function()
  {
    return attendee_manager.getList()
  },image_src : function(provider_label){
    if(provider_label && provider_label == "freeagent"){
      return "http://freeagent-assets.s3.amazonaws.com/website-2014/images/logo.svg"
    }else{
      return "/assets/img/constant-contact-share-logo.gif"
    }
  },
  moreTasks:function(){
    {
      return false ;
      //return !(attendee_manager.getCount() < Session.get("attendee_limit"));
    }
  },
  validate_current_user: function(_id)
  {
    result_view = true
    if(Meteor.userId() == _id){
      current_user_envent_state = Session.get('current_user_envent_state');
      if(current_user_envent_state.length > 0){
        result_view = true
      }else{
        result_view = false
      }
    }else{
      result_view =true
    }
    return result_view;
  }
});

Template.attendeesTab.events(
{
  "click .markPremium" : function(event, template)
  {
      var id = $(event.currentTarget).attr('data') ; 
      if( id )
        attendee_manager.updatePriority(id) ; 
        
  },   
  "click #showMoreResults": function(event, template)
  {
    Session.set("attendee_limit",Session.get("attendee_limit") + EVENT_INCREMENT);
  },
  'keyup #search': function (event, template)
  {
    search_terms = $(event.currentTarget).val();
    //Session.get('search_terms')
    attendee_manager.search(search_terms)
  },
});

EVENT_INCREMENT = 10;
Template.attendeesTab.created = function ()
{
  Session.set('attendee_terms','')
  Session.set("attendee_limit",0)
  this.autorun(function () 
  {
    this.subscription = attendee_manager.default_subscribe(Router.current().params._id);
  }.bind(this));
};
