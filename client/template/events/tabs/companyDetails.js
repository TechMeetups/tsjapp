JOB_INCREMENT=10
Template.companyDetails.created = function ()
{
  Session.set("job_limit",JOB_INCREMENT)
  this.autorun(function ()
  {
    this.subscription = Meteor.subscribe('company_details',Router.current().params._id,Router.current().params._company_id);
    this.subscription_job = job_manager.default_subscribe(null,Router.current().params._company_id);
  }.bind(this));
};

Template.companyDetails.rendered = function ()
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

Template.companyDetails.helpers(
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
    return "/tabs/job/"+Router.current().params._company_id+"/"+_id+'/'+Router.current().params._id;
  },
});

Template.companyDetails.events(
{
  'click .delete_job': function(event, template){
    var jobid = $(event.currentTarget).attr('data-id') ;
    job_manager.delete(jobid);
  },
  'click #showMoreResults' : function(event, template)
  {
    Session.set("job_limit",Session.get("job_limit") + EVENT_INCREMENT);
  },
  "click #company_match": function(event, template)
  {
      animateThis($(event.currentTarget),'tada') ;
      match_manager.email_matched(null,Router.current().params._id,null,Router.current().params._company_id) ;
  },
  "click #btn_update_notification" : function(e,t){
    IonPopup.confirm({
       title: 'confirm notification?',
       template: 'Please press ok to notify all attendees for company notification.',
       onOk: function() {
         console.log(Router.current().params._id)
         Meteor.call("notification_company_update", Router.current().params._company_id, function(error, result){
           if(error){
             console.log("error", error);
           }
           if(result){

           }
         });
       },
       onCancel: function() {

       }
     });
  }
});
