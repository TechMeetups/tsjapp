FA_CLIENT_ID_KEY = "cKzxWGuOHl9dOC1dNbLclw";
FA_CLIENT_SECRET_KEY = "PDxv8sDQpYktmUnzsYvDaQ";
FA_AUTH_URL = "http://ccintegration.herokuapp.com/oauth/" ;
CC_CLIENT_ID_KEY = "k87wnk4m37qa3qgrvpb43ybs";
CC_CLIENT_SECRET_KEY = "SAkcXm2hvbGUDGubyKBsZncs";
CC_AUTH_URL = "http://ccintegration.herokuapp.com/cc_oauth/";
is_fa_ccount_active = function(){
  var active = false
  var profile = Meteor.user().profile;
  if(profile){
    if(profile.fa_access_token && profile.fa_auth_code && profile.fa_refresh_token &&
       profile.fa_access_token.length > 1 && profile.fa_auth_code.length > 1 && profile.fa_refresh_token.length > 1){
         active = true
       }
  }
  return active;
}
is_cc_account_active = function(){
  var active = false
  var profile = Meteor.user().profile;
  if(profile){
    if(profile.cc_auth_code && profile.cc_access_token &&
      profile.cc_auth_code.length > 1 && profile.cc_access_token.length > 1){
        active = true
      }
  }
  return active;
}
is_fa_ccount_active_by_user = function(user){
  var active = false
  var profile = user.profile;
  if(profile){
    if(profile.fa_access_token && profile.fa_auth_code && profile.fa_refresh_token &&
       profile.fa_access_token.length > 1 && profile.fa_auth_code.length > 1 && profile.fa_refresh_token.length > 1){
         active = true
       }
  }
  return active;
}
is_cc_account_active_by_user = function(user){
  var active = false
  var profile = user.profile;
  if(profile){
    if(profile.cc_auth_code && profile.cc_access_token &&
      profile.cc_auth_code.length > 1 && profile.cc_access_token.length > 1){
        active = true
      }
  }
  return active;
}
updateUserFaAccess = function (){
  var fa_refresh_token = localStorage.getItem("fa_refresh_token");
  var fa_access_token = localStorage.getItem("fa_access_token");
  var fa_auth_code = localStorage.getItem("fa_auth_code");
  var fa_token_type = localStorage.getItem("fa_token_type");
  Meteor.users.update({_id:Meteor.userId()}, { $set:{"profile.fa_auth_code":fa_auth_code,"profile.fa_refresh_token":fa_refresh_token,
  "profile.fa_access_token":fa_access_token,"profile.fa_token_type":fa_token_type}},function(error){
    if(error){
      console.log("error : "+ error);
    }else{
      console.log("User Update Success");
    }
  });
}
updateUserCCAccess = function (){
  var cc_access_token = localStorage.getItem("cc_access_token");
  var cc_token_type = localStorage.getItem("cc_token_type");
  var cc_auth_code = localStorage.getItem("cc_auth_code");
  Meteor.users.update({_id:Meteor.userId()}, {$set:{"profile.cc_token_type":cc_token_type,"profile.cc_access_token":cc_access_token,
  "profile.cc_auth_code":cc_auth_code}},function(error){
    if(error){
      console.log("error : "+ error);
    }else{
      console.log("User Update Success");
    }
  });
}
refresh_fa_access_token = function(callback){
  var formData = {
       grant_type : "refresh_token",
       refresh_token: localStorage.getItem("fa_refresh_token"),
       client_id : FA_CLIENT_ID_KEY,
       client_secret : FA_CLIENT_SECRET_KEY
   };

   url = "https://api.freeagent.com/v2/token_endpoint";
  $.ajax({
    url : url,
    type: "POST",
    contentType: "application/x-www-form-urlencoded",
    data : formData,
    success: function(data, textStatus, jqXHR)
    {
      console.log(textStatus)
      console.log(data)
      callback(data);
    },
    error: function (jqXHR, textStatus, errorThrown)
    {
      callback(null)
    }
  });
}
getFaAcesstoken = function(auth_code,callback){
  Meteor.call("getFaAcesstoken",auth_code, function(error, result){
    if(error){
      callback(null)
    }else{
      console.log(result.data)
      callback(result.data);
    }
  });
  // var formData = {
  //      grant_type : "authorization_code",
  //      code: auth_code,
  //      client_id : FA_CLIENT_ID_KEY,
  //      client_secret : FA_CLIENT_SECRET_KEY,
  //      redirect_uri : FA_AUTH_URL
  //  };
  //  url = "https://api.freeagent.com/v2/token_endpoint";
  // $.ajax({
  //   url : url,
  //   type: "POST",
  //   contentType: "application/x-www-form-urlencoded",
  //   data : formData,
  //   success: function(data, textStatus, jqXHR)
  //   {
  //     callback(data);
  //   },
  //   error: function (jqXHR, textStatus, errorThrown)
  //   {
  //     callback(null);
  //   }
  // });
}
getfreeagentcontect = function(user){
  IonLoading.show({
    customTemplate :'<i class="fa fa-cog fa-spin font30"></i>'
  });
  Meteor.call("getFreeagentContectFromServer",user, function(error, result){
    if(error){
      console.log("error", error);

    }else{
     IonLoading.hide();
    }
  });
  // url = "https://api.freeagent.com/v2/contacts?page="+page+"&per_page=25";
  // $.ajax({
  //   url : url,
  //   type: "GET",
  //   headers:{ "Authorization" : "Bearer "+access_token+""},
  //   success: function(data, textStatus, jqXHR)
  //   {
  //     var result_count = data.contacts.length
  //     if(result_count > 0){
  //       page = page +1 ;
  //       Meteor.call("fa_contect_insert",data, function(error, result){
  //         if(error){
  //           console.log("error", error);
  //           $('#processingmodelwindow').modal('hide');
  //         }
  //         if(result){
  //           getfreeagentcontect(page,access_token)
  //         }
  //       });
  //     }else{
  //       $('#processingmodelwindow').modal('hide');
  //       IonLoading.hide();
  //     }
  //   },
  //   error: function (jqXHR, textStatus, errorThrown)
  //   {
  //     console.log(textStatus)
  //     $('#processingmodelwindow').modal('hide');
  //   }
  // });
}
createfreeagentcontect = function(json_input,access_token){
  url = "https://api.freeagent.com/v2/contacts";
  Meteor.call("create_fa_contect","POST",url,access_token, json_input,function(error, result){
    if(error){
      console.log("error", error);
      return result;
    }else{
      return result;
    }
  });
}
getCCContact = function(auth_code,url){
  var auth_code =  auth_code;
  var params = "&api_key="+CC_CLIENT_ID_KEY;
  Meteor.call("APICall","GET",url+params,auth_code, function(error, result){
    if(error){
      console.log("error", error);
      $('#processingmodelwindow').modal('hide');
    }else{
      if(result){
         if(result.meta.pagination.next_link){
           var url = "https://api.constantcontact.com"+result.meta.pagination.next_link
           console.log(url)
           getCCContact(auth_code,url);
         }else{
           IonLoading.hide();
         }
      }
    }
  });
}
getCCAccessToken = function(auth_code,callback){
  var formData = {
       grant_type : "authorization_code",
       code: auth_code,
       client_id : CC_CLIENT_ID_KEY,
       client_secret : CC_CLIENT_SECRET_KEY,
       redirect_uri : CC_AUTH_URL
   };
   url = "https://oauth2.constantcontact.com/oauth2/oauth/token";
   Meteor.call("authenticate", auth_code, function(error, result){
     if(error){
       console.log("error", error);
       callback(null)
     }
     if(result){
        console.log(result)
        callback(result)
     }
   });
}
getUrlParameter = function (sParam) {
   var sPageURL = decodeURIComponent(window.location.search.substring(1)),
       sURLVariables = sPageURL.split('&'),
       sParameterName,
       i;

   for (i = 0; i < sURLVariables.length; i++) {
       sParameterName = sURLVariables[i].split('=');


       if (sParameterName[0] === sParam) {
           return sParameterName[1] === undefined ? true : sParameterName[1];
       }
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

var dateFormat = function ()
{
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
    timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
    timezoneClip = /[^-+\dA-Z]/g,

    pad = function (val, len)
    {
        val = String(val);
        len = len || 2;
        while (val.length < len) val = "0" + val;
        return val;
    };

// Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
    var dF = dateFormat;
    // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
    if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
        mask = date;
        date = undefined;
    }

    // Passing date through Date applies Date.parse, if necessary
    date = date ? new Date(date) : new Date;
    if (isNaN(date)) throw SyntaxError("invalid date");

    mask = String(dF.masks[mask] || mask || dF.masks["default"]);

    // Allow setting the utc argument via the mask
    if (mask.slice(0, 4) == "UTC:") {
        mask = mask.slice(4);
        utc = true;
    }
    var _ = utc ? "getUTC" : "get",
        d = date[_ + "Date"](),
        D = date[_ + "Day"](),
        m = date[_ + "Month"](),
        y = date[_ + "FullYear"](),
        H = date[_ + "Hours"](),
        M = date[_ + "Minutes"](),
        s = date[_ + "Seconds"](),
        L = date[_ + "Milliseconds"](),
        o = utc ? 0 : date.getTimezoneOffset(),
        flags = {
            d:    d,
            dd:   pad(d),
            ddd:  dF.i18n.dayNames[D],
            dddd: dF.i18n.dayNames[D + 7],
            m:    m + 1,
            mm:   pad(m + 1),
            mmm:  dF.i18n.monthNames[m],
            mmmm: dF.i18n.monthNames[m + 12],
            yy:   String(y).slice(2),
            yyyy: y,
            h:    H % 12 || 12,
            hh:   pad(H % 12 || 12),
            H:    H,
            HH:   pad(H),
            M:    M,
            MM:   pad(M),
            s:    s,
            ss:   pad(s),
            l:    pad(L, 3),
            L:    pad(L > 99 ? Math.round(L / 10) : L),
            t:    H < 12 ? "a"  : "p",
            tt:   H < 12 ? "am" : "pm",
            T:    H < 12 ? "A"  : "P",
            TT:   H < 12 ? "AM" : "PM",
            Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
            o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
            S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
        };

    return mask.replace(token, function ($0) {
        return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
};
}();

// Some common format strings
dateFormat.masks = {
"default":      "ddd mmm dd yyyy HH:MM:ss",
shortDate:      "m/d/yy",
mediumDate:     "mmm d, yyyy",
longDate:       "mmmm d, yyyy",
fullDate:       "dddd, mmmm d, yyyy",
shortTime:      "h:MM TT",
mediumTime:     "h:MM:ss TT",
longTime:       "h:MM:ss TT Z",
isoDate:        "yyyy-mm-dd",
isoTime:        "HH:MM:ss",
isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
dayNames: [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
],
monthNames: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]
};
