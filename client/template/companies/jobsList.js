JOB_INCREMENT=10
Template.jobsList.created = function ()
{
  Session.set("job_limit",JOB_INCREMENT)
  this.autorun(function ()
  {
    this.subscription = Meteor.subscribe('company_details_without_event',Router.current().params._id);
    this.subscription_job = job_manager.default_subscribe(null,Router.current().params._id);
  }.bind(this));
};

Template.jobsList.rendered = function ()
{
  this.autorun(function () {
    if (!this.subscription.ready() || !this.subscription_job.ready())
    {
      IonLoading.show();
    }
    else
    {
      IonLoading.hide();
    }
  }.bind(this));
};

Template.jobsList.helpers(
{
  format_date : function(date)
  {
    return company_manager.format_data(date)
  },

  jobs_list : function()
  {
   return job_manager.getList();
  },
  moreTasks  : function()
  {
     return !(job_manager.getCount() < Session.get("job_limit"));
  },
  build_path: function(_id)
  {
    return "/tabs/job/"+Router.current().params._id+"/"+_id+"/no-event";
  }
});

Template.jobsList.events(
{
  'click #showMoreResults' : function(event, template)
  {
    Session.set("job_limit",Session.get("job_limit") + EVENT_INCREMENT);
  },
  "click #company_match": function(event, template)
  {
      animateThis($(event.currentTarget),'tada') ;
      match_manager.email_matched(null,Router.current().params._id,null,Router.current().params._company_id) ;
  }
});
