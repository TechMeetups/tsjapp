
Template.tabsOne.helpers({
  create: function(){

  },
  rendered: function(){

  },
  destroyed: function(){

  },image_src : function(provider_label){
    if(provider_label && provider_label == "freeagent"){
      return "http://freeagent-assets.s3.amazonaws.com/website-2014/images/logo.svg"
    }else{
      return "/assets/img/constant-contact-share-logo.gif"
    }
  }
});

Template.tabsOne.events({
  "click #btn": function(event, template){

  }
});
