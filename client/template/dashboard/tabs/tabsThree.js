
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
      var uniqueCampain =[]
      for(var i=0;i<clicked_report.lenght;i++){
        uniqueCampain.push(clicked_report[i].campaign_id)
      }
      for(var i=0;i<open_report.lenght;i++){
        uniqueCampain.push(open_report[i].campaign_id)
      }
      for(var i=0;i<send_report.lenght;i++){
        uniqueCampain.push(send_report[i].campaign_id)
      }
      uniqueCampain = $.unique(uniqueCampain);
      for(var i= 0;i < uniqueCampain.length;i++){
        var clicked_count = 0;
        var open_count = 0;
        var send_count = 0;

        for(var i=0;i<clicked_report.lenght;i++){
          if(clicked_report[i].campaign_id == uniqueCampain[i] ){
            clicked_count+=1;
          }
        }
        for(var i=0;i<open_report.lenght;i++){
          if(open_report[i].campaign_id == uniqueCampain[i] ){
            open_count+=1;
          }
        }
        for(var i=0;i<send_report.lenght;i++){
          if(send_report[i].campaign_id == uniqueCampain[i]){
            send_count+=1;
          }
        }
        finaldata.push({campain:cc_campaign.find({user_id:Meteor.userId(),id:uniqueCampain[i]}),clicked_count:clicked_count,open_count:open_count,send_count:send_count});
      }
    }else{

    }
    return cc_campaign.find({user_id:Meteor.userId()})
  }
});

Template.tabsThree.events({
  "click #foo": function(event, template){

  }
});
