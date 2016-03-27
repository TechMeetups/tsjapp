JOB_INCREMENT=10
Template.companyDetails.created = function () {
  Session.set("job_limit",JOB_INCREMENT)
  this.autorun(function () {
    this.subscription = Meteor.subscribe('company_details',Router.current().params._id,Router.current().params._company_id);
    this.subscription_job = job_manager.default_subscribe(Router.current().params._company_id);
  }.bind(this));
};
Template.companyDetails.rendered = function () {
  this.autorun(function () {
    if (!this.subscription.ready() || !this.subscription_job.ready()) {
      IonLoading.show();
    } else {
      IonLoading.hide();
    }
  }.bind(this));
};
Template.companyDetails.helpers({
  format_date : function(date){
    return company_manager.format_data(date)
  },
  jobs_list : function(){
   return job_manager.getList();
  },
  moreTasks  : function()
  {
     return !(job_manager.getCount() < Session.get("job_limit"));
  },
  build_path: function(_id)
  {
    return "/tabs/job/"+Router.current().params._company_id+"/"+_id;
  },
});
Template.companyDetails.events(
{
  'click #showMoreResults' : function(event, template)
  {
    Session.set("job_limit",Session.get("job_limit") + EVENT_INCREMENT);
  }
});
