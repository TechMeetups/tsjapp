
 // Start of Business Objects

 sponsor_manager ={
   count : 0,
   list : [],
   getList : function (event_id)
   {
       return Sponsor.find({}) ;
       //return this.list ;
   },
   getCount : function ()
   {
       this.count = Sponsor.find().count();
       return this.count ;
   },
   default_subscribe : function(){
     return Meteor.subscribe('sponsor_list');
   },
   format_data : function(date){
     return moment(date).format("DD/MM/YYYY");
   }
 };

job_manager =
{
  count : 0,
  list : [],
  getList : function (event_id)
  {
      if (Session.get('job_terms'))
      {
        return Job.find(
        {
          $or:
            [
              { 'title': {'$regex': new RegExp(Session.get('job_terms'), "i")} } ,
              { 'desc': {'$regex': new RegExp(Session.get('job_terms'), "i")} } ,
              { 'city': {'$regex': new RegExp(Session.get('job_terms'), "i")} } ,
            ]
        },{sort:{ created_at:-1}});
      }
      else
        return Job.find({},{sort:{ created_at:-1}}) ;

      //return this.list ;
  },
  getCount : function ()
  {
      this.count = Job.find().count();
      return this.count ;
  },
  add : function(data)
  {
    console.log(data)
    Meteor.call('insert_Job',data,function(e){
      if(e){
        alert(e)
      }else{
        IonModal.close();
      }
    });
  },
  update: function(data)
  {
    // Meteor.call('EventUpdate',data) ;
  },
  default_subscribe : function(event_id,company_id)
  {
    return Meteor.subscribe('jobs',Session.get("job_limit"),event_id,company_id,Session.get('job_terms'));
  },
  format_data : function(date)
  {
    return moment(date).format("DD/MM/YYYY");
  },
  apply_to_job : function(data)
  {
    IonLoading.show({
      customTemplate: "Job application being sent...",
      duration: 2000
    });
    Meteor.call("connect_request",data,function(error, result){
      if(error){
        console.log("error : "+ error)
      }
      if(result){
        console.log(result);
      }
    });
  },
  meet_for_job : function(data)
  {
    IonLoading.show({
      customTemplate: "Meeting Request being sent...",
      duration: 2000
    });
    Meteor.call("connect_request",data,function(error, result){
      if(error){
        console.log("error : "+ error)
      }
      if(result){
        console.log(result);
      }
    });
  },
  default_connect_request : function(user_id,job_id)
  {
    return Meteor.subscribe('connect_request_for_job',user_id,job_id);
  },
  get_connect_request_count:function()
  {
    return ConnectRequest.find({}).count();
  },
  search : function(search_terms)
  {
    Session.set('job_terms',search_terms)
  },
  change_exp : function (jobid,exp)
  {
      var job = Job.findOne({_id:jobid}) ;
      if(!job)
          return ;

       return Job.update({_id:jobid},{$set:{experience:exp}})
  },
  change_profession : function (jobid,prof)
  {
      var job = Job.findOne({_id:jobid}) ;
      if(!job)
          return ;

       return Job.update({_id:jobid},{$set:{profession:prof}})
  },
  change_skill : function (jobid,skill)
  {
      var job = Job.findOne({_id:jobid}) ;
      if(!job)
          return ;

       return Job.update({_id:jobid},{$set:{skill:skill}})
  }


}

checkout_manager =
{
  getList : function (event_id)
  {
      return Checkout.find({}) ;
  },
  getCart : function (event_id)
  {
      return Checkout.find({}).fetch() ;
  },
  getCount : function ()
  {
      this.count = Checkout.find().count();
      return this.count ;
  },
  default_subscribe : function()
  {
    return Meteor.subscribe('checkout_item',Meteor.userId());
  },
  format_data : function(date){
    return moment(date).format("DD/MM/YYYY");
  },
  checkout_item : function(data)
  {
    IonLoading.show({
      customTemplate: "Adding item to cart...",
      duration: 2000
    });


    Meteor.call("checkout_item",data,function(error, result){
      if(error){
        console.log("error : "+ error)
      }
      if(result){
        console.log(result);
      }
    });
  },
  getTotal:function()
  {
    var items = [] ;
    items = Checkout.find({}).fetch();
    console.log(items);
    var total_amount = 0 ;
    for(var i =0 ;i <items.length;i++)
    {
      total_amount = total_amount + eval(isNumber(items[i].amount));
    }
    return total_amount.toFixed(2);
  },
  remove_checkout_item : function(item_id)
  {

    Meteor.call("remove_checkout_item",item_id,function(error, result){
      if(error){
        console.log("error : "+ error)
      }
      if(result){
        console.log(result);
      }
    });
  },
  pay_now : function()
  {
    IonLoading.show(
    {
      customTemplate: "Someone from our team will be in touch. Thank You!",
      duration: 3000
    });
    user_id = Meteor.userId();

    var cartitems = checkout_manager.getCart() ;
    //var cart = cartitems.map(JSON.parse) ;

    Meteor.call("pay_now_email",user_id,cartitems, function(error,result)
    {
      if(error)
      {
        console.log("error : "+ error)
      }
      else
      {
        console.log(result);
      }
    });
  }
}
company_manager = {
  count : 0,
  list : [],
  getList : function (event_id)
  {
    if (Session.get('company_terms')) {
      return Company.find({'name': {'$regex': new RegExp(Session.get('company_terms'), "i")}},
        {sort:{ created_at:-1}});
      }
      return Company.find({},{sort:{ created_at:-1}}) ;
      //return this.list ;
  },
  getCount : function ()
  {
      this.count = Company.find().count();
      return this.count ;
  },
  add : function(data,event_id)
  {
    Meteor.call('insert_company',data,event_id,function(e){
      if(e){
        alert(e)
      }else{
        IonModal.close();
      }
    });
  },
  update: function(data){
    // Meteor.call('EventUpdate',data) ;
  },
  search : function(search_terms){
    Session.set('company_terms',search_terms)
  },
  default_subscribe : function(event_id)
  {
    // return Meteor.subscribe('company',10,Session.get('company_terms'),event_id);
    return Meteor.subscribe('company',Session.get("company_limit"),Session.get('company_terms'),event_id);
  },
  default_company_list_subscribe : function()
  {
    return Meteor.subscribe('company_list',Session.get("company_limit"),Session.get('company_terms'));
  },
  format_data : function(date){
    return moment(date).format("DD/MM/YYYY");
  }
}

attendee_manager =
{
  count : 0,
  list : [],
  getList : function (event_id)
  {
    var searchValue = Session.get('attendee_terms') ;
    if ( searchValue )
    {
        return Meteor.users.find(
          {
            $or :
            [
              { 'profile.firstname':{'$regex': new RegExp(searchValue, "i")} } ,
              { 'profile.skill':{'$regex': new RegExp(searchValue, "i")} } ,
              { 'profile.profession':{'$regex': new RegExp(searchValue, "i")} } ,
              { 'profile.lookingfor':{'$regex': new RegExp(searchValue, "i")} } ,
              { 'profile.city':{'$regex': new RegExp(searchValue, "i")} } ,
            ]
          });
    }
    else
    {
        return Meteor.users.find({}) ;
    }

  },
  getCount : function ()
  {
      this.count = Meteor.users.find().count();
      return this.count ;
  },
  add : function(data,event_id)
  {
    Meteor.call('insert_attendee',data,event_id);
  },
  update: function(user_id,data)
  {
    return Meteor.call('update_attendee',user_id,data);
  },
  search : function(search_terms)
  {
    Session.set('attendee_terms',search_terms)
  },
  default_subscribe : function(event_id)
  {
    return Meteor.subscribe('attendees',Session.get("attendee_limit"),Session.get('attendee_terms'),event_id);
  },
  matched_subscribe : function(event_id,job_id)
  {
    return Meteor.subscribe('attendees',Session.get("attendee_limit"),Session.get('attendee_terms'),event_id,job_id);
  },
  format_data : function(date)
  {
    return moment(date).format("DD/MM/YYYY");
  },
  default_connect_request: function(attendee_id)
  {
    return Meteor.subscribe('connect_request_for_attendees',Meteor.userId(),attendee_id);
  },
  get_connect_request_count:function()
  {
    return ConnectRequest.find({}).count();
  },
  matched_candidate_count : function()
  {
    return 1 ;
      //    this.count = Meteor.users.find().count();
      // return this.count ;

  },
  matched_candidate_list : function()
  {
      var searchValue = Session.get('attendee_terms') ;

        console.log('matched_candidate_list:'+searchValue) ;

        if(searchValue)
        {
            return Meteor.users.find({'profile.skill': {'$regex': new RegExp(searchValue, "i")}});
        }
  },
  candidate_cv : function(data)
    {
      IonLoading.show({
        customTemplate: "CV is being sent...",
        duration: 2000
      });

      Meteor.call("get_candidate_cv",data,function(error, result)
      {
        if(error){
          console.log("error : "+ error)
        }
        if(result){
          console.log(result);
        }
      });
    },
    candidate_call : function(data)
    {
      IonLoading.show({
        customTemplate: "Call is being organised...",
        duration: 2000
      });

      Meteor.call("organise_candidate_call",data,function(error, result)
      {
        if(error){
          console.log("error : "+ error)
        }
        if(result){
          console.log(result);
        }
      });
    },


}



match_manager =
{
    keywords : [],
    keycount : 0 ,
    default_subscribe : function()
    {
      return Meteor.subscribe('keyword_map');
    },
    getList : function ()
    {
        return KeywordMap.find({}) ;
    },
    getCount : function()
    {
        return attendee_manager.getCount() ;
    },
    loadKeyWords : function()
    {
        match_manager.keywords = KeywordMap.find({}).fetch() ;
        match_manager.keycount = match_manager.keywords.length ;

        // console.log('match_manager.keycount:'+match_manager.keycount) ;

        // for(al=0;al<match_manager.keycount;al++)
        //   console.log(match_manager.keywords[al]) ;

        return match_manager.keywords ;
    },
    match_keyword: function(word,class_type)
    {
        console.log('match_keyword.Keywords:'+keywords.length ) ;

        for(i=0;i<keywords.length;i++)
        {
            console.log('match_manager.match_keyword:'+keywords[i].keyword) ;

            if( word === keywords[i].keyword && keywords[i].class === class_type)
              return keywords[i].word ;
        }
        return null ;
    } ,
    email_matched : function(job_id,event_id, searchValue, company_id)
    {
        // match_manager.loadKeyWords() ;

        var usr = Meteor.user() ;

         IonLoading.show(
        {
          customTemplate: "Emaling match report...",
          duration: 2000
        });

        Meteor.call("email_matched",usr, job_id, event_id, searchValue, 0, company_id, function(error)
        {
          if(error)
          {
            console.log("error : "+ error)
          }

        });

    }
}

event_manager =
{
    count : 0,
    list : [],
    getList : function (  )
    {
      var sortorder = 1 ;

        if( Session.get("showPastEvents") )
            sortorder = -1 ;

        if (Session.get('search_terms'))
        return Events.find(
          {
            $or :
            [
              { 'name': {'$regex': new RegExp(Session.get('search_terms'), "i")}},{sort:{ start:sortorder} } ,
              { 'desc': {'$regex': new RegExp(Session.get('search_terms'), "i")}},{sort:{ start:sortorder} } ,
              { 'address': {'$regex': new RegExp(Session.get('search_terms'), "i")}},{sort:{ start:sortorder} }
            ]
          });
      else
        return Events.find({},{sort:{ start:sortorder}}) ;
        //return this.list ;
    },
    getCount : function ()
    {
        this.count = Events.find().count() ;
        return this.count ;
    },
    add : function(data)
    {
      //Meteor.call('EventInsert',data) ;
    },
    update: function(data){
      //Meteor.call('EventUpdate',data) ;
    },
    search : function(search_terms){
      Session.set('search_terms',search_terms)
    },
    default_subscribe : function()
    {
      return Meteor.subscribe('events',Session.get("eventLimit"),Session.get('search_terms'),
        Session.get('showPastEvents'));
    },
    format_data : function(date){
      return moment(date).format("llll");
    },
    current_user_envent_state : function (event_id,user_id){
      Meteor.call("current_user_envent_state", event_id,user_id,function(error, result){
        if(error){
          Session.set('current_user_envent_state', null);
        }
        if(result){

          Session.set('current_user_envent_state', result);
        }
      });
    },
    create_request_for_event_attendee : function (event_id,user_id,checkout_item){
      Meteor.call("create_request_for_event_attendee", event_id,user_id,checkout_item,function(error, result){
        if(error){
          console.log("error : "+error)
          IonLoading.hide();
        }
        if(result){
          console.log(result);
          console.log("response back");
          IonLoading.hide();
          event_manager.current_user_envent_state(event_id,user_id);
        }
      });
    },
    meet_candidate : function(data)
    {
      IonLoading.show({
        customTemplate: "Message is being sent...",
        duration: 2000
      });
      Meteor.call("connect_request_candidate",data,function(error, result){
        if(error){
          console.log("error : "+ error)
        }
        if(result){
          console.log(result);
        }
      });
    }

}


connect_manager =
{
  remove_connect_item : function(item_id)
  {

    Meteor.call("remove_connect_item",item_id,function(error, result)
    {
      if(error)
      {
        console.log("error : "+ error)
      }
      if(result)
      {
        console.log(result);
      }
    });
  },
  default_subscribe : function()
  {
    console.log('connect_manager.default_subscribe:'+Meteor.userId()) ;
    return Meteor.subscribe('connect_request_for_user',Meteor.userId());
  },
  getList : function()
  {
      if (Session.get('message_terms'))
      {
        return ConnectRequest.find(
        {
          $or:
            [
              { 'message': {'$regex': new RegExp(Session.get('message_terms'), "i")} } ,
            ]
        },{sort: {created_at:-1}});
      }
      else
        return ConnectRequest.find({},{sort: {created_at:-1}}) ;
  },
 format_data : function(date)
 {
   return moment(date).format("llll");
  },
  getCount : function ()
  {
      this.count = ConnectRequest.find().count() ;
      return this.count ;
  },
  search : function(search_terms)
  {
    Session.set('message_terms',search_terms)
  }


}


// End of Business Objects

// Start of Common Functions

readFile = function(f,onLoadCallback)
 {
 //When the file is loaded the callback is called with the contents as a string
 var reader = new FileReader();
 reader.onload = function (e){
   var contents=e.target.result
   onLoadCallback(contents);
 }
 reader.readAsText(f);
 };



isNumber = function (n) {
    if(!isNaN(parseFloat(n)) && isFinite(n)){
        return n;
    }else{
        return 0;
    }
}
guid = function() {
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}
trimInput = function(value) {
    return value.replace(/^\s*|\s*$/g, '');
};

isNotEmpty = function(value) {
    if (value && value !== ''){
        return true;
    }
    console.log('Please fill in all required fields.');
    return false;
};
isNotEmptyValue = function(value) {
    if (value && value !== ''){
        return value;
    }
    return "";
};
isEmail = function(value) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(value)) {
        return true;
    }
    console.log('Please enter a valid email address.');
    return false;
};

isValidPassword = function(password) {
    if (password.length < 6) {
        console.log('Your password should be 6 characters or longer.');
        return false;
    }
    return true;
};

areValidPasswords = function(password, confirm) {
    if (!isValidPassword(password)) {
        return false;
    }
    if (password !== confirm) {
        console.log('Your two passwords are not equivalent.');
        return false;
    }
    return true;
};

OpenInNewTab = function (url)
{
  var win = window.open(url, '_blank');
  win.focus();
}

animateThis = function(object,type)
{
    object.addClass('animated '+type) ;

    setTimeout(function()
    {
          object.removeClass('animated '+type) ;

    }, 1000);

}

match_user_job = function(usr,job)
{
  var user_skill = [] , jobskill = [] ;
  var user_profession = null , jobprofession = null ;
  var skill = prof = exp = 0 ;

  //console.log('match_user_job') ;

  // console.log('match_user_job') ;
  // console.log(usr) ;

    if( job.experience )
    {
        if( parseInt( usr.profile.experience) < parseInt(job.experience))
          return 0 ;
    }

    exp = 1 ;


    if( ! usr.profile.skill && ! usr.profile.profession)
      return 0 ;

    if( usr.profile.skill )
        user_skill = usr.profile.skill.toLowerCase().split(/[\s,]+/) ;

    if( usr.profile.profession )
        user_profession = usr.profile.profession.toLowerCase().split(/[\s,]+/) ;

    if( job.skill)
        jobskill = job.skill.toLowerCase();

    if( job.profession)
        jobprofession = job.profession.toLowerCase();


    if( jobskill && usr.profile.skill )
    {
        for(x=0;x<user_skill.length;x++)
        {
            var uskill = user_skill[x].trim() ;

            if( uskill )
                if( wordInString(jobskill,uskill) )
                  ++skill ;
        }
    }
    else
      skill = 1 ;


    if( jobskill && usr.profile.profession )
    {
        for(x=0;x<user_profession.length;x++)
        {
            var uprof = user_profession[x].trim() ;

            if( uprof )
                if( wordInString(jobskill,uprof) )
                  ++skill ;
        }

    }

    if(job.title && usr.profile.skill)
      skill += match_user_job_deep(job.title,user_skill) ;

    if( jobprofession && usr.profile.profession )
    {
        for(x=0;x<user_profession.length;x++)
        {
            var uprof = user_profession[x].trim() ;

            if( uprof )
                if( wordInString(jobprofession,uprof) )
                  ++prof ;
        }
    }
    else
      prof = 1 ;


    if( jobprofession && usr.profile.skill )
    {
        for(x=0;x<user_skill.length;x++)
        {
            var uskill = user_skill[x].trim() ;

            if( uskill )
                if( wordInString(jobprofession,uskill) )
                  ++prof ;
        }

    }

    if(job.title && usr.profile.profession)
      prof += match_user_job_deep(job.title,user_profession) ;


    if(skill > 0 && prof > 0 && exp >= 0)
      return skill + prof + 1 ;
    else
      return 0 ;
}


match_user_job_deep = function(str, key_words)
{
var count = 0 ;

  return 0 ; // chek later

  if(!str)
    return 0;

  if(key_words.length<=0)
    return 0;

    for(dx=0;dx<key_words.length;dx++)
    {
      if( wordInString(str,key_words[dx].trim()) )
      {
          ++count ;
          console.log('match_user_job_deep FOUND !!') ;
          console.log('str:'+str+'\n'+'Keywords:') ;
              for(dx=0;dx<key_words.length;dx++)
                {
                  console.log(key_words[dx].trim()) ;
                }

      }

    }

    console.log('count:'+count) ;
    return count ;
}



function wordInString(s, word)
{
  word = word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  return new RegExp( ".*\\b"+word+"\\b.*" ).test(s);
}
