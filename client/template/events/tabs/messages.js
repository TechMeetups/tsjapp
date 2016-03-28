EVENT_INCREMENT = 10;

Template.messagesTab.created = function () 
{
    console.log('messagesTab.created') ;

    Session.set('message_terms','')
    Session.set("message_limit",EVENT_INCREMENT)

  this.autorun(function () {
    this.subscription = connect_manager.default_subscribe();
  }.bind(this));
};

Template.messagesTab.rendered = function () 
{
  console.log('messagesTab.rendered') ;
  this.autorun(function () {
    if (!this.subscription.ready()) {
      IonLoading.show();
    } else {
      IonLoading.hide();
    }
  }.bind(this));
};


Template.messagesTab.helpers(
{
  pic_exists : function(pic_url)
  {
      console.log("messagesTab'"+pic_url+"'") ; 
      if (!pic_url.trim() || pic_url === '') 
        return false ;
      else
        return true ; 

  },   
    display_request_type:function(connect_type)
  {
    if(connect_type === "job_apply")
    {
      return "icon ion-email";
    }
    else if(connect_type === "job_meet")
    {
      return "icon ion-android-people"  ;
    }
    else
    {
      return "icon ion-person-add"  ; 
    }  

  }, 
  build_path: function(request_type, event_id, company_id, job_id , attendee_id)
  {

    if(request_type === "job_apply")
    {
      return "/tabs/jobs/"+company_id+"/"+job_id;
    }
    else if(request_type === "job_meet")
    {
      return "/tabs/jobs/"+company_id+"/"+job_id;
    }
    else
    {
      return "/tabs/attendees/"+event_id+"/"+attendee_id;
    }  

  },
  build_pic : function(pic)
  {
      if(pic)
        return pic ;
      else
        return "/assets/img/profile.png" ; 
                  
  },
  format_date: function(date){
    return connect_manager.format_data(date);
  },
  messages: function()
  {
    return connect_manager.getList() ; 
  },
  moreTasks:function(){
    {
      return !(connect_manager.getCount() < Session.get("message_limit"));
    }
  },
  validate_current_user: function(_id){
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
    console.log(result_view);
    return result_view;
  }
});

Template.messagesTab.events({
  "click #showMoreResults": function(event, template){
    Session.set("message_limit",Session.get("message_limit") + EVENT_INCREMENT);
  },
  'keyup #search': function (event, template)
  {
    search_terms = $(event.currentTarget).val();
    //Session.get('search_terms')
    connect_manager.search(search_terms)
  },
  'click .remove_item' : function(event, template)
  {
    var obj = $(event.currentTarget) ; 
    var pobj = obj.parent() ; 
    //animateThis(pobj,'zoomOutRight') ;
    var item_id = obj.attr('data');
    connect_manager.remove_connect_item(item_id)
  }
});


