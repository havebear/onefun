// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
	$ionicConfigProvider.platform.android.tabs.style('standard');
	$ionicConfigProvider.platform.android.tabs.position('bottom');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('tab.liuyan', {
      url: '/liuyan',
      views: {
        'tab-liuyan': {
          templateUrl: 'templates/tab-liuyan.html',
          controller: 'LiuYanCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.personal', {
    url: '/personal',
    views: {
      'tab-personal': {
        templateUrl: 'templates/tab-personal.html',
        controller: 'PersonalCtrl'
      }
    }
  })
  
  //同级解决次级页面出现底部tab方案
//.state('detail', {
//  url: '/detail?id&back',
//  templateUrl: 'templates/detail.html',
//  controller: 'DetailCtrl'
//});

//隐藏次级底部tab方案
 .state('tab.detail', {
    url: '/detail/:id',
    views: {
      'tab-home': {
        templateUrl: 'templates/detail.html',
        controller: 'DetailCtrl'
      }
    }
  })
 
 .state('tab.tutorial-list', {
    url: '/tutorial-list/:type',
    views: {
      'tab-home': {
        templateUrl: 'templates/tutorial-list.html',
        controller: 'TutorialListCtrl'
      }
    }
  })
 
 .state('tab.my-guanzhu', {
    url: '/my-guanzhu',
    views: {
      'tab-personal': {
        templateUrl: 'templates/my-guanzhu.html',
        controller: 'MyGuanZhuCtrl'
      }
    }
  })
 
 .state('tab.my-liuyan', {
    url: '/my-liuyan',
    views: {
      'tab-personal': {
        templateUrl: 'templates/my-liuyan.html',
        controller: 'MyLiuYanCtrl'
      }
    }
  })
 
 .state('tab.my-shoucang', {
    url: '/my-shoucang',
    views: {
      'tab-personal': {
        templateUrl: 'templates/my-shoucang.html',
        controller: 'MyShouCangCtrl'
      }
    }
  })
 
.state('tab.my-tutorial-detail', {
    url: '/my-tutorial-detail/:id',
    views: {
      'tab-personal': {
        templateUrl: 'templates/my-tutorial-detail.html',
        controller: 'MyTDetailCtrl'
      }
    }
  })
 
 .state('tab.add-tutorial', {
    url: '/add-tutorial',
    views: {
      'tab-personal': {
        templateUrl: 'templates/add-tutorial.html',
        controller: 'AddTutorialCtrl'
      }
    }
})
 
.state('tab.add-liuyan', {
    url: '/add-liuyan',
    views: {
      'tab-personal': {
        templateUrl: 'templates/add-liuyan.html',
        controller: 'AddLiuyanCtrl'
      }
    }
})

.state('tab.login', {
    url: '/login',
    views: {
      'tab-personal': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
})

.state('tab.reg', {
    url: '/reg',
//  abstract: true,
   views: {
      'tab-personal': {
        templateUrl: 'templates/reg.html',
        controller: 'RegCtrl'
      }
    }
});

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

})

