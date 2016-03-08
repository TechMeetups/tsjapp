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
      this.count = Meteor.users.count() ;
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
