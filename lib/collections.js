Events = new Mongo.Collection("events");
// Attendees = new Mongo.Collection("attendees");
EventAttendee = new Mongo.Collection("event_attendee");
Company = new Mongo.Collection("company");

EventCompany = new Mongo.Collection("event_company");
Events.before.insert(function (userId, doc) {
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
   label: 'Start Date',
   autoform: {
     'label-type': 'stacked',
     placeholder: 'Start Date'
   }
 },
  end : {
   type: Date,
   label: 'End Date',
   autoform: {
     'label-type': 'stacked',
      placeholder: 'End Date'
   }
 },
 desc : {
  type: String,
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
  }
}));
Events.allow({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    },
    remove: function () {
        return true;
    }
});
