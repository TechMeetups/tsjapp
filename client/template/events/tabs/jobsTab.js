Template.jobsTab.helpers(
{
  build_path: function(company_id, _id)
  {
    return "/tabs/job/"+company_id+"/"+_id;
  },
  format_date: function(date)
  {
    return attendee_manager.format_data(date);
  },
  job: function()
  {
    return job_manager.getList()
  },
  moreTasks:function()
  {
      return !(job_manager.getCount() < Session.get("job_limit"));
  },
  pic_exists : function(pic_url)
  {
      if (!pic_url.trim() || pic_url === '')
        return false ;
      else
        return true ;

  },
});

Template.jobsTab.events(
{
  "click #showMoreResults": function(event, template)
  {
    Session.set("job_limit",Session.get("job_limit") + EVENT_INCREMENT);
  },
  'click #btn_search': function (event, template)
  {
    search_terms = $('#search_terms').val();
    //Session.get('search_terms')
    job_manager.search(search_terms)
  }
});

EVENT_INCREMENT = 10;
Template.jobsTab.created = function ()
{
  Session.set('job_terms','')
  Session.set("job_limit",EVENT_INCREMENT)
  this.autorun(function ()
  {
    this.subscription = job_manager.default_subscribe(Router.current().params._id);
  }.bind(this));
};
