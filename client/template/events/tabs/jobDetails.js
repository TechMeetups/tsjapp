Template.jobDetails.created = function () {
  Session.set("job_limit",JOB_INCREMENT)
  this.autorun(function () {
    this.subscription = Meteor.subscribe('job_details',Router.current().params._company_id,Router.current().params._job_id);
    this.subscription1=  job_manager.default_connect_request(Meteor.userId(),Router.current().params._job_id)
  }.bind(this));
};
Template.jobDetails.rendered = function () {
  this.autorun(function () {
    if (!this.subscription.ready()) {
      IonLoading.show();
    } else {
      IonLoading.hide();
    }
  }.bind(this));
};
Template.jobDetails.helpers({
  format_date : function(date){
    return company_manager.format_data(date)
  },
  connect_request: function(){
    return ConnectRequest.find({});
  },
  list_need_to_view: function(){
    if(job_manager.get_connect_request_count() > 0){
      return true
      }
      else
      {
        return false
      }
  },
  display_request_type:function(connect_type){
    if(connect_type == "job_meet"){
      return "Applied"
    }else{
      return "Meeting Request";
    }

  }
});
Template.jobDetails.events(
{
  'click #job_meet' : function(event, template)
  {
    company_id = Router.current().params._company_id;
    job_id = Router.current().params._job_id;
    event_id = Router.current().params._id;
    user_id = Meteor.userId();
    request_type = "job_meet"
    request ={request_type:request_type,user_id:user_id,company_id:company_id,job_id:job_id,event_id:event_id}
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
    request ={request_type:request_type,user_id:user_id,company_id:company_id,job_id:job_id,event_id:event_id}
    job_manager.apply_to_job(request);
  }
});
