App.info({
	id: 'com.TechStartupJobs',		
    name: 'TechStartupJobs',
    description: 'TechStartupJobs - Join.Connect.Meet.Apply',
    version: '0.0.1', 
    author: 'TechStartupJobs.com',
    email: 'admin@techstartupjobs.com',
    website: 'http://techstartupjobs.com'
});

App.launchScreens({
// iOS
  'iphone': 'public/assets/img/Happy-Team.jpg',
  'iphone_2x': 'public/assets/img/Happy-Team.jpg',
  'iphone5': 'public/assets/img/Happy-Team.jpg',
  'iphone6': 'public/assets/img/Happy-Team.jpg',
  'iphone6p_portrait': 'public/assets/img/Happy-Team.jpg',
  'iphone6p_landscape': 'public/assets/img/Happy-Team.jpg',

  'ipad_portrait': 'public/assets/img/Happy-Team.jpg',
  'ipad_portrait_2x': 'public/assets/img/Happy-Team.jpg',
  'ipad_landscape': 'public/assets/img/Happy-Team.jpg',
  'ipad_landscape_2x': 'public/assets/img/Happy-Team.jpg',

  // Android
  'android_ldpi_portrait': 'public/assets/img/Happy-Team.jpg',
  'android_ldpi_landscape': 'public/assets/img/Happy-Team.jpg',
  'android_mdpi_portrait': 'public/assets/img/Happy-Team.jpg',
  'android_mdpi_landscape': 'public/assets/img/Happy-Team.jpg',
  'android_hdpi_portrait': 'public/assets/img/Happy-Team.jpg',
  'android_hdpi_landscape': 'public/assets/img/Happy-Team.jpg',
  'android_xhdpi_portrait': 'public/assets/img/Happy-Team.jpg',
  'android_xhdpi_landscape': 'public/assets/img/Happy-Team.jpg'
});

App.icons({
    'android_ldpi': 'public/assets/img/tsjfair_logo.png',
    'android_mdpi': 'public/assets/img/tsjfair_logo.png',
    'android_hdpi': 'public/assets/img/tsjfair_logo.png',
    'android_xhdpi': 'public/assets/img/tsjfair_logo.png'
});
App.accessRule("*");
