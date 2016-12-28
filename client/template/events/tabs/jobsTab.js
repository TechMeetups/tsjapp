Template.jobsTab.helpers(
{
  build_path: function(company_id, _id)
  {
    return "/tabs/job/"+company_id+"/"+_id+"/no-event";
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
      if (!pic_url.trim() || pic_url === '' || pic_url.length < 1)
        return false ;
      else
        return true ;

  },
  check_image:function(image){
    company = Company.findOne({});

    if(image && image.length > 1){
      return image;
    }else if(company.logo && company.logo.length > 1){
      return company.logo;
    }
    else if(company.pic && company.pic.length > 1){
      return company.pic;
    }
  }
});

Template.jobsTab.events(
{
  'click .delete_job': function(event, template){
    var jobid = $(event.currentTarget).attr('data-id') ;
    job_manager.delete(jobid);
  },
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
