Messages = new Mongo.Collection("messages");
Events = new Mongo.Collection("events");
// Attendees = new Mongo.Collection("attendees");
EventAttendee = new Mongo.Collection("event_attendee");
Company = new Mongo.Collection("company");
Job = new Mongo.Collection("job");
EventCompany = new Mongo.Collection("event_company");
ConnectRequest = new Mongo.Collection("connect_request");
Sponsor = new Mongo.Collection("sponsor");
KeywordMap = new Mongo.Collection("keyword_map");

Checkout = new Mongo.Collection("checkout");
Checkout.before.insert(function (userId, doc) {
  doc.created_at = new Date();
});

Sponsor.before.insert(function (userId, doc) {
  doc.created_at = new Date();
});
ConnectRequest.before.insert(function (userId, doc) {
  doc.created_at = new Date();
});
Events.before.insert(function (userId, doc) {
  doc.created_at = new Date();
});
Messages.before.insert(function (userId, doc) {
  doc.created_at = new Date();
});
EventAttendee.before.insert(function (userId, doc) {
  doc.created_at = new Date();
});
Company.before.insert(function (userId, doc) {
  doc.created_at = new Date();
});
EventCompany.before.insert(function (userId, doc) {
  doc.created_at = new Date();
});
Job.before.insert(function (userId, doc) {
  doc.created_at = new Date();
});
Checkout.attachSchema(new SimpleSchema({
  user_id :{
   type: String,
   label: 'user_id'
 },
 pic:{
   type: String,
   label: 'pic'
 },
 item_type:{
   type: String,
   label: 'item_type'
 },
 created_at:{
   type: Date,
   label: 'created_at'
 },
 amount:{
   type: String,
   optional: true,
   label: 'amount'
 },
 desc:{
   type: String,
   optional: true,
   label: 'amount'
 },
 paid:{
   type: String,
   optional: true,
   label: 'amount'
 },
 item_id:{
   type: String,
   optional: true,
   label: 'amount'
 }
}));
Sponsor.attachSchema(new SimpleSchema({
  name :{
   type: String,
   label: 'name'
 },
 pic:{
   type: String,
   label: 'pic'
 },
 type:{
   type: String,
   label: 'type'
 },
 description:{
   type: String,
   label: 'description'
 },
  created_at:{
   type: Date,
   label: 'created_at'
 },
 amount:{
   type: String,
   optional: true,
   label: 'amount'
 }
}));
ConnectRequest.attachSchema(new SimpleSchema({
  request_type :{
   type: String,
   label: 'request_type'
 },
 message :{
   type: String,
   optional: true,
   label: 'message'
 },
  user_id:{
   type: String,
   label: 'user_id'
 },
  requested_on:{
   type: Date,
   label: 'requested_on'
 },
  created_at:{
   type: Date,
   label: 'created_at'
 },
  company_id:{
   type: String,
   optional: true,
   label: 'company_id'
 },
  job_id:{
   type: String,
   optional: true,
   label: 'job_id'
 },
  event_id:{
   type: String,
   optional: true,
   label: 'event_id'
 },
 attendee_id:{
   type: String,
   optional: true,
   label: 'attendee_id'
 },
  pic:{
   type: String,
   optional: true,
   label: 'pic'
 }
}));

Job.attachSchema(new SimpleSchema({
  company_id:{
   type: String,
   label: 'company_id',
   autoform: {
     'label-type': 'stacked',
     placeholder: 'company_id'
   }
  },
  title:{
   type: String,
   label: 'title',
   autoform: {
     'label-type': 'stacked',
     placeholder: 'title'
   }
 },
 desc : {
  type: String,
  label: 'desc',
  autoform: {
    'label-type': 'stacked',
    placeholder: 'desc'
  }
},
city : {
 type: String,
 label: 'City',
 autoform: {
   'label-type': 'stacked',
   placeholder: 'City'
 }
},
skill : {
 type: String,
 label: 'Skill',
 optional: true,
 autoform: {
   'label-type': 'stacked',
   placeholder: 'Skill'
 }
},
profession : {
 type: String,
 label: 'Profession',
 optional: true,
 autoform: {
   'label-type': 'stacked',
   placeholder: 'Profession'
 }
},
experience : {
 type: String,
 label: 'Experience',
 optional: true,
 autoform: {
   'label-type': 'stacked',
   placeholder: 'Experience'
 }
},
pic : {
 type: String,
 label: 'Pic URL',
  optional: true,

 autoform: {
   'label-type': 'stacked',
   placeholder: 'Pic for Job'
 }
},
  created_at : {
   type: Date,
   label: 'created_at'
  }
}));
EventCompany.attachSchema(new SimpleSchema({
  event_id:{
   type: String,
   label: 'event',
   autoform: {
     'label-type': 'stacked',
     placeholder: 'event'
   }
  },
  company_id:{
   type: String,
   label: 'company',
   autoform: {
     'label-type': 'stacked',
     placeholder: 'company'
   }
 },
 joined_on : {
  type: Date,
  label: 'joined on',
  autoform: {
    'label-type': 'stacked',
    placeholder: 'joined on'
  }
},
  created_at : {
   type: Date,
   label: 'created_at'
  }
}));
Company.attachSchema(new SimpleSchema({
  name:{
   type: String,
   label: 'name',
   autoform: {
     'label-type': 'stacked',
     placeholder: 'name'
   }
  },
  pic:{
   type: String,
   label: 'pic',
   autoform: {
     'label-type': 'stacked',
     placeholder: 'pic'
   }
  }
  ,
  city:{
   type: String,
   label: 'city',
   autoform: {
     'label-type': 'stacked',
     placeholder: 'city'
   }
  },
  desc:{
   type: String,
   label: 'desc',
   autoform: {
     'label-type': 'stacked',
     placeholder: 'desc'
   }
  },
  created_at : {
   type: Date,
   label: 'created_at'
  }
}));

EventAttendee.attachSchema(new SimpleSchema({
  event_id:{
   type: String,
   label: 'event_id',
   autoform: {
     'label-type': 'event_id',
     placeholder: 'event_id'
   }
  },
  attendee_id:{
   type: String,
   label: 'attendee_id',
   autoform: {
     'label-type': 'attendee_id',
     placeholder: 'attendee_id'
   }
  },
  ticket_no :{
    type: String,
    label: 'ticket_no'
  },
  joined_on:{
   type: Date,
   label: 'joined_on',
   autoform: {
     'label-type': 'stacked',
     placeholder: 'joined_on'
   }
  },
  created_at : {
   type: Date,
   label: 'created_at'
  }
}));
Events.attachSchema(new SimpleSchema({
   name: {
    type: String,
    label: 'Name',
    autoform: {
      'label-type': 'stacked',
      placeholder: 'Location'
    }
  },
  start: {
   type: Date,
   optional: true,
   label: 'Start Date',
   autoform: {
     'label-type': 'stacked',
     placeholder: 'Start Date'
   }
 },
  end : {
   type: Date,
   optional: true,
   label: 'End Date',
   autoform: {
     'label-type': 'stacked',
      placeholder: 'End Date'
   }
 },
 desc : {
  type: String,
  optional: true,
  label: 'Descriptions',
  autoform: {
    rows: 10,
    'label-type': 'stacked',
    placeholder: 'Descriptions'
  }
},
address : {
 type: String,
 label: 'address',
 optional: true,
 autoform: {
   'label-type': 'stacked',
   placeholder: 'Address'
 }
},
created_at : {
 type: Date,
 label: 'created_at'
},
  pic: {
     type: String,
     optional: true,
     autoform: {
       'label-type': 'stacked',
       placeholder: 'Enter image url'
     }
  },
  eventbright_id: {
     type: String,
     optional: true,
     autoform: {
       'label-type': 'stacked',
       placeholder: 'Enter eventbright id'
     }
  }
}));

Messages.attachSchema(new SimpleSchema(
{
  user_id:{
   type: String,
   label: 'user_id'
 },
  attendee_id:{
   type: String,
   optional: true,
   label: 'attendee_id'
 },
 created_at:{
   type: Date,
   label: 'created_at'
 },
  message:{
   type: String,
   optional: false,
   label: 'message'
 },
  event_id:{
   type: String,
   optional: true,
   label: 'event_id'
 }

}));

KeywordMap.attachSchema(new SimpleSchema(
{
  keyword:{
   type: String,
   label: 'Keyword'
 },
  word:{
   type: String,
   label: 'Mapped Word'
 },
  class:{
   type: String,
   label: 'Class'
 },
 created_at:{
   type: Date,
   label: 'created_at'
 }

}));

KeywordMap.allow({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    }
});

Events.allow({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    }
});
Sponsor.allow({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    }
});
