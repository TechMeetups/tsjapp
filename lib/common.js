
 readFile = function(f,onLoadCallback) {
 //When the file is loaded the callback is called with the contents as a string
 var reader = new FileReader();
 reader.onload = function (e){
   var contents=e.target.result
   onLoadCallback(contents);
 }
 reader.readAsText(f);
 };
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
    return moment(date).format("DD/MM/YYYY");
  },
  apply_to_job : function(data){
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
  meet_for_job : function(data){
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
  default_connect_request : function(user_id,job_id){
    return Meteor.subscribe('connect_request_for_job',user_id,job_id);
  },
  get_connect_request_count:function(){
    return ConnectRequest.find({}).count();
  }
}
checkout_manager ={
  getList : function (event_id)
  {
      return Checkout.find({}) ;
  },
  getCount : function ()
  {
      this.count = Checkout.find().count();
      return this.count ;
  },default_subscribe : function(){
    return Meteor.subscribe('checkout_item',Meteor.userId());
  },
  format_data : function(date){
    return moment(date).format("DD/MM/YYYY");
  },
  checkout_item : function(data){
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
  getTotal:function(){
    items = Checkout.find({}).fetch();
    console.log(items);
    total_amount = 0
    for(var i =0 ;i <items.length;i++){
      total_amount= total_amount+ eval(items[i].amount);
    }
    return total_amount.toFixed(2);;
  },
  remove_checkout_item : function(item_id){

    Meteor.call("remove_checkout_item",item_id,function(error, result){
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
    return moment(date).format("DD/MM/YYYY");
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
  update: function(user_id,data){
    return Meteor.call('update_attendee',user_id,data);
  },
  search : function(search_terms){
    Session.set('attendee_terms',search_terms)
  },
  default_subscribe : function(event_id){
    console.log(event_id)
    return Meteor.subscribe('attendees',Session.get("attendee_limit"),Session.get('attendee_terms'),event_id);
  },
  format_data : function(date){
    return moment(date).format("DD/MM/YYYY");
  },
  default_connect_request: function(attendee_id){
    return Meteor.subscribe('connect_request_for_attendees',Meteor.userId(),attendee_id);
  },
  get_connect_request_count:function(){
    return ConnectRequest.find({}).count();
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
    meet_candidate : function(data){
      IonLoading.show({
        customTemplate: "Meeting request is being sent...",
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
