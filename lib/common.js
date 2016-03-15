job_manager ={
  count : 0,
  list : [],
  getList : function (event_id)
  {
      return Job.find({}) ;
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
    Meteor.call('insert_Job',data);
  },
  update: function(data){
    // Meteor.call('EventUpdate',data) ;
  },
  default_subscribe : function(company_id){
    console.log(company_id)
    return Meteor.subscribe('jobs',Session.get("job_limit"),company_id);
  },
  format_data : function(date){
    return moment(date).format("MM/DD/YYYY");
  },
  apply_to_job : function(data){
    IonLoading.show({
      customTemplate: "Your Request for applying job is sending",
      duration: 3000
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
  meet_for_job : function(data){
    IonLoading.show({
      customTemplate: "Your Request for meet is sending",
      duration: 3000
    });
    Meteor.call("connect_request",data,function(error, result){
      if(error){
        console.log("error : "+ error)
      }
      if(result){
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
      return Company.find({'name': {'$regex': new RegExp(Session.get('company_terms'), "i")}});
      }
      return Company.find({}) ;
      //return this.list ;
  },
  getCount : function ()
  {
      this.count = Company.find().count();
      return this.count ;
  },
  add : function(data,event_id)
  {
    Meteor.call('insert_company',data,event_id);
  },
  update: function(data){
    // Meteor.call('EventUpdate',data) ;
  },
  search : function(search_terms){
    Session.set('company_terms',search_terms)
  },
  default_subscribe : function(event_id){
    console.log(event_id)
    return Meteor.subscribe('company',Session.get("company_limit"),Session.get('company_terms'),event_id);
  },
  format_data : function(date){
    return moment(date).format("MM/DD/YYYY");
  }
}
attendee_manager = {
  count : 0,
  list : [],
  getList : function (event_id)
  {
    if (Session.get('attendee_terms')) {
      return Meteor.users.find({'profile.firstname': {'$regex': new RegExp(Session.get('attendee_terms'), "i")}});
      }
      return Meteor.users.find({}) ;
      //return this.list ;
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
  update: function(data){
    // Meteor.call('EventUpdate',data) ;
  },
  search : function(search_terms){
    Session.set('attendee_terms',search_terms)
  },
  default_subscribe : function(event_id){
    console.log(event_id)
    return Meteor.subscribe('attendees',Session.get("attendee_limit"),Session.get('attendee_terms'),event_id);
  },
  format_data : function(date){
    return moment(date).format("MM/DD/YYYY");
  }
}
event_manager =
{
    count : 0,
    list : [],
    getList : function ()
    {
      if (Session.get('search_terms')) {
        return Events.find({'name': {'$regex': new RegExp(Session.get('search_terms'), "i")}});
        }
        return Events.find({}) ;
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
    default_subscribe : function(){
      return Meteor.subscribe('events',Session.get("eventLimit"),Session.get('search_terms'));
    },
    format_data : function(date){
      return moment(date).format("MM/DD/YYYY");
    },
    current_user_envent_state : function (event_id,user_id){
      Meteor.call("current_user_envent_state", event_id,user_id,function(error, result){
        if(error){
          Session.set('current_user_envent_state', null);
        }
        if(result){
          console.log(result);
          Session.set('current_user_envent_state', result);
        }
      });
    },
    create_request_for_event_attendee : function (event_id,user_id){
      Meteor.call("create_request_for_event_attendee", event_id,user_id,function(error, result){
        if(error){
          console.log("error : "+error)
        }
        if(result){
          console.log(result);
          console.log("response back");
          event_manager.current_user_envent_state(event_id,user_id);
        }
      });
    },
    meet_candidate : function(data){
      IonLoading.show({
        customTemplate: "Your Request for meet Attendee is sending",
        duration: 3000
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
