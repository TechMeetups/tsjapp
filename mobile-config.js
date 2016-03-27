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
  'iphone': 'public/assets/img/tsjapp-splash.png',
  'iphone_2x': 'public/assets/img/tsjapp-splash.png',
  'iphone5': 'public/assets/img/tsjapp-splash.png',
  'iphone6': 'public/assets/img/tsjapp-splash.png',
  'iphone6p_portrait': 'public/assets/img/tsjapp-splash.png',
  'iphone6p_landscape': 'public/assets/img/tsjapp-splash.png',

  'ipad_portrait': 'public/assets/img/tsjapp-splash.png',
  'ipad_portrait_2x': 'public/assets/img/tsjapp-splash.png',
  'ipad_landscape': 'public/assets/img/tsjapp-splash.png',
  'ipad_landscape_2x': 'public/assets/img/tsjapp-splash.png',

  // Android
  'android_ldpi_portrait': 'public/assets/img/tsjapp-splash.png',
  'android_ldpi_landscape': 'public/assets/img/tsjapp-splash.png',
  'android_mdpi_portrait': 'public/assets/img/tsjapp-splash.png',
  'android_mdpi_landscape': 'public/assets/img/tsjapp-splash.png',
  'android_hdpi_portrait': 'public/assets/img/tsjapp-splash.png',
  'android_hdpi_landscape': 'public/assets/img/tsjapp-splash.png',
  'android_xhdpi_portrait': 'public/assets/img/tsjapp-splash.png',
  'android_xhdpi_landscape': 'public/assets/img/tsjapp-splash.jpg'
});

App.icons({
    'android_ldpi': 'public/assets/img/tsjfair_logo.png',
    'android_mdpi': 'public/assets/img/tsjfair_logo.png',
    'android_hdpi': 'public/assets/img/tsjfair_logo.png',
    'android_xhdpi': 'public/assets/img/tsjfair_logo.png'
});
App.accessRule("*");
