Template.matchedTab.helpers(
{
  match_count : function()
  {
      return attendee_manager.getCount()-1 ; 
  },   
  pic_exists : function(pic_url)
  {
      if (!pic_url.trim() || pic_url === '') 
        return false ;
      else
        return true ; 

  },   
  build_path: function(_id)
  {
    return "/tabs/attendees/"+Router.current().params._id+"/"+_id;
  },
  format_date: function(date)
  {
    return attendee_manager.format_data(date);
  },
  attendees: function()
  {
    return attendee_manager.getList()
  },
  image_src : function(provider_label)
  {
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
    if(Meteor.userId() != _id)
      return true ; 
  
     var job_id = Router.current().params._job_id

      if(job_id)
      {
          var job = Job.findOne({_id : job_id}) ; 
          if(job)
          {
              if( match_user_job(Meteor.user(),job) > 0)
                return true ;
              else
                return false ;    

          }
                  
      } 
    
      return false ;  

  }   
});

Template.matchedTab.events(
{
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
  "click #emailMatched": function(event, template)
  {
      var job_id = Router.current().params._job_id ; 
      var event_id = Router.current().params._id ; 

      IonLoading.show(
      {
        customTemplate: "Emailing matched list",
        duration: 2000
      });

      var searchValue = $("#search").val();
      match_manager.email_matched(job_id,event_id,searchValue,Router.current().params._company_id) ; 

      //IonLoading.hide();      
  }
});

EVENT_INCREMENT = 10;
Template.matchedTab.created = function ()
{
  Session.set('attendee_terms','')
  Session.set("attendee_limit",0)
  this.autorun(function () 
  {
    this.subscription = attendee_manager.matched_subscribe(Router.current().params._id, 
      Router.current().params._job_id);
  }.bind(this));
};
