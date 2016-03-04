Events = new Mongo.Collection("events");
Events.before.insert(function (userId, doc) {
  doc.created_at = new Date();
});

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
