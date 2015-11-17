
Template.tabsThree.helpers({
  create: function(){

  },
  rendered: function(){

  },
  destroyed: function(){

  },
  cc_send_report_helper: function(){
    var id = window.location.pathname.split("/")[3];
    var data = contacts.findOne({_id:id});
    return cc_send_report.find({user_id:Meteor.userId(),email_address:data.email})
  },
  campaign: function(id){
    return cc_campaign.findOne({id:id}).name;
  },
  campaigns : function(){
    var id = window.location.pathname.split("/")[3];
    var data = contacts.findOne({_id:id});
    var finaldata = []
    if(data){
      var clicked_report = cc_clicked.find({user_id:Meteor.userId(),email_address:data.email}).fetch()
      var open_report = cc_opened_report.find({user_id:Meteor.userId(),email_address:data.email}).fetch()
      var send_report = cc_send_report.find({user_id:Meteor.userId(),email_address:data.email}).fetch()
      console.log(clicked_report);
      console.log(open_report);
      console.log(send_report);
      var uniqueCampain =[]
      for(var i=0;i < clicked_report.length;i++){
        console.log(clicked_report[i].campaign_id);
        uniqueCampain.push(clicked_report[i].campaign_id)
      }
      for(var i=0;i<open_report.length;i++){
        uniqueCampain.push(open_report[i].campaign_id)
      }
      for(var i=0;i<send_report.length;i++){
        uniqueCampain.push(send_report[i].campaign_id)
      }
      console.log(uniqueCampain);
      uniqueCampain = $.unique(uniqueCampain);
      console.log(uniqueCampain);
      for(var j= 0;j < uniqueCampain.length;j++){
        var clicked_count = 0;
        var open_count = 0;
        var send_count = 0;

        for(var i=0;i<clicked_report.length;i++){
          if(clicked_report[i].campaign_id == uniqueCampain[j] ){
            clicked_count+=1;
          }
        }
        for(var i=0;i<open_report.length;i++){
          if(open_report[i].campaign_id == uniqueCampain[j] ){
            open_count+=1;
          }
        }
        for(var i=0;i<send_report.length;i++){
          if(send_report[i].campaign_id == uniqueCampain[j]){
            send_count+=1;
          }
        }
        console.log(uniqueCampain[j]);
        var campain = cc_campaign.findOne({user_id:Meteor.userId(),id:uniqueCampain[j]});
        campain["clicked_count"] = clicked_count;
        campain["open_count"] = open_count;
        campain["send_count"] = send_count;
        finaldata.push(campain);
        console.log(finaldata)
      }
    }
    return finaldata;
  }
});

Template.tabsThree.events({
  "click #foo": function(event, template){

  }
});
