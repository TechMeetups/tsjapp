Template.jobDetails.created = function () 
{
  Session.set("job_limit",JOB_INCREMENT)
  this.autorun(function () 
  {
    this.subscription = Meteor.subscribe('job_details',Router.current().params._company_id,Router.current().params._job_id);
    this.subscription1=  job_manager.default_connect_request(Meteor.userId(),Router.current().params._job_id)
  }.bind(this));
};

Template.jobDetails.rendered = function () 
{
  Session.set('matched_candidates',false) ;

  this.autorun(function () 
  {
    if (!this.subscription.ready()) 
    {
      IonLoading.show();
    } 
    else 
    {
      IonLoading.hide();
    }
  }.bind(this));
};

Template.jobDetails.helpers(
{
  changing_profession : function()
  {
      return Session.get('changing_profession') ; 
  } ,  
  changing_skill : function()
  {
      return Session.get('changing_skill') ; 
  } ,  
  match_count : function()
  {
      return '' 
      // return attendee_manager.getCount()-1 ; 
  }, 
  build_match_path: function(_id)
  {
    return "/tabs/matched/"+Router.current().params._company_id+"/"+Router.current().params._job_id+'/'+
    Router.current().params._id;
  },  
  // build_path: function(_id)
  // {
  //   return "/tabs/attendees/"+Router.current().params._id+"/"+_id;
  // },
    pic_exists : function(pic_url)
  {
      console.log("attendeesTab'"+pic_url+"'") ; 
      if (!pic_url.trim() || pic_url === '') 
        return false ;
      else
        return true ; 

  },     
  format_date : function(date)
  {
    return company_manager.format_data(date)
  },
  connect_request: function()
  {
    return ConnectRequest.find({},{sort:{created_at : -1 }});
  },
  list_need_to_view: function()
  {
    if(job_manager.get_connect_request_count() > 0)
    {
      return true
    }
    else
    {
      return false
    }
  },
  display_request_type:function(connect_type)
  {
    if(connect_type === "job_apply")
    {
      return "icon ion-email";
    }
    else
    {
      return "icon ion-android-people"  ;
    }

  },
  matched_candidates : function()
  {
      return true ; 

      // return Session.get('matched_candidates') ;

    // if(attendee_manager.matched_candidate_count() > 0)
    // {
    //   return true
    // }
    // else
    // {
    //   return false
    // }
  },
  matched_candidate_list : function()
  {
      return attendee_manager.matched_candidate_list() ; 
  }
});

Template.jobDetails.events(
{
  'click #updt_skill' : function(event, template)  
  {
    var jobid = $(event.currentTarget).attr('jobid') ; 
    var skill = $('#new_skill').val() ; 

    job_manager.change_skill(jobid,skill) ;

    Session.set('changing_skill',false ) 
  },
  'click #cancel_skill' : function(event, template)  
  {
    Session.set('changing_skill',false ) 
  }, 
  'click #skill_edit' : function(event, template)
  {
     Session.set('changing_skill',true ) 
  }, 
  'click #updt_profession' : function(event, template)  
  {
    var jobid = $(event.currentTarget).attr('jobid') ; 
    var prof = $('#new_prof').val() ; 

    job_manager.change_profession(jobid,prof) ;

    Session.set('changing_profession',false ) 
  },
  'click #cancel_profession' : function(event, template)  
  {
    Session.set('changing_profession',false ) 
  }, 
  'click #prof_edit' : function(event, template)
  {
    Session.set('changing_profession',true ) 
  },   
  'click #exp_up' : function(event, template)
  {
    animateThis($(event.currentTarget),'bounce') ;
    var jobid = $(event.currentTarget).attr('jobid') ; 
    var exp = $(event.currentTarget).attr('exp') ;

    if(!exp)
      exp = 0 ; 

    exp = eval(exp)+1 ; 
    job_manager.change_exp(jobid,exp) ; 
  },   
  'click #exp_down' : function(event, template)
  {
    animateThis($(event.currentTarget),'bounce') ;
    var jobid = $(event.currentTarget).attr('jobid') ; 
    var exp = $(event.currentTarget).attr('exp') ;

    if(!exp)
      exp = 0 ; 

    exp = eval(exp-1) ; 
    if(exp<0)
      exp = 0 ; 
    job_manager.change_exp(jobid,exp) ; 
  }, 
  'click #job_meet' : function(event, template)
  {
    company_id = Router.current().params._company_id;
    job_id = Router.current().params._job_id;
    event_id = Router.current().params._id;
    user_id = Meteor.userId();
    request_type = "job_meet"
    var message = template.find('#message').value;
    template.find('#message').value = "" ;
    var pic = $('#job_pic').attr('src') ; 

    request ={request_type:request_type,message:message,user_id:user_id,company_id:company_id,job_id:
      job_id,event_id:event_id,pic:pic}
    console.log(request)
    job_manager.meet_for_job(request);
  },
  'click #job_apply' : function(event, template)
  {
    company_id = Router.current().params._company_id;
    job_id = Router.current().params._job_id;
    event_id = Router.current().params._id;
    user_id = Meteor.userId();
    request_type = "job_apply"
    var message = template.find('#message').value;
    template.find('#message').value = "" ;
    var pic = $('#job_pic').attr('src') ; 

    request ={request_type:request_type,message:message,user_id:user_id,company_id:company_id,job_id:job_id,
      event_id:event_id,pic:pic}
    job_manager.apply_to_job(request);
  },
  'click .remove_item' : function(event, template)
  {
    var item_id = $(event.currentTarget).attr('data');
    connect_manager.remove_connect_item(item_id)
  },
  'click #match_making' : function(event, template)
  {
       animateThis($(event.currentTarget),'tada') ;
  },

});
