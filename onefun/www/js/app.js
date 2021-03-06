// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'ionicLazyLoad'])

	.run(function($ionicPlatform, $location, $rootScope, $ionicHistory, $state, $cordovaToast, $timeout) {
		$ionicPlatform.ready(function() {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
//			console.log("1111111111111111111111111111111111111111");
			if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);

			}
			if(window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}
			
			var needLoginView = ["tab.add-tutorial", "tab.my-follow", "tab.my-collection", "tab.my-message"]; //需要登录的页面state
			$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
//				console.log($rootScope.isLogin);
				if(needLoginView.indexOf(toState.name) >= 0 && !$rootScope.isLogin) { //判断当前是否登录
					console.log($rootScope.isLogin);
					$state.go("tab.login"); //跳转到登录页
					event.preventDefault(); //阻止默认事件，即原本页面的加载
				}
			});
			$cordovaPlugin.someFunction().then(success, error);
		});

		/********************双击退出start********************/
		//双击退出  
		$ionicPlatform.registerBackButtonAction(function(e) {
			//判断处于哪个页面时双击退出  
			if($location.path() == '/tab/home' || $location.path() == '/tab/message' || $location.path() == '/tab/personal') {
				if($rootScope.backButtonPressedOnceToExit) {
					ionic.Platform.exitApp();
				} else {
					$rootScope.backButtonPressedOnceToExit = true;
					$cordovaToast.showShortTop('再按一次退出APP');
					setTimeout(function() {
						$rootScope.backButtonPressedOnceToExit = false;
					}, 2000);
				}
				console.log("-----------------------2");
			} else if($ionicHistory.backView()) {
				console.log("-----------------------3");
				$ionicHistory.goBack();

			} else {
				$rootScope.backButtonPressedOnceToExit = true;
				$cordovaToast.showShortTop('再按一次退出系统');
				setTimeout(function() {
					$rootScope.backButtonPressedOnceToExit = false;
				}, 2000);
				console.log("-----------------------4");
			}
			e.preventDefault();
			return false;
		}, 101);
	})

	.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
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
//				cache: 'false',
				views: {
					'tab-home': {
						templateUrl: 'templates/tab-home.html',
						controller: 'HomeCtrl'
					}
				}
			})

			.state('tab.message', {
				url: '/message',
				cache: 'false',
				views: {
					'tab-message': {
						templateUrl: 'templates/tab-message.html',
						controller: 'MessageCtrl'
					}
				}
			})

			.state('tab.personal', {
				url: '/personal',
				cache: 'false',
				views: {
					'tab-personal': {
						templateUrl: 'templates/tab-personal.html',
						controller: 'PersonalCtrl'
					}
				}
			})

			//隐藏次级底部tab方案
			.state('tab.tutorial-detail', {
				url: '/tutorial-detail/:id',
				views: {
					'tab-home': {
						templateUrl: 'templates/tutorial-detail.html',
						controller: 'TutorialDetailCtrl'
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

			.state('tab.my-follow', {
				url: '/my-follow',
				views: {
					'tab-personal': {
						templateUrl: 'templates/my-follow.html',
						controller: 'MyFollowCtrl'
					}
				}
			})

			.state('tab.my-message', {
				url: '/my-message',
				cache: 'false',
				views: {
					'tab-personal': {
						templateUrl: 'templates/my-message.html',
						controller: 'MyMessageCtrl'
					}
				}
			})

			.state('tab.my-collection', {
				url: '/my-collection',
				views: {
					'tab-personal': {
						templateUrl: 'templates/my-collection.html',
						controller: 'MyCollectionCtrl'
					}
				}
			})

			.state('tab.my-tutorial-detail', {
				url: '/my-tutorial-detail/:id',
				views: {
					'tab-personal': {
						templateUrl: 'templates/my-tutorial-detail.html',
						controller: 'MyTutorialDetailCtrl'
					}
				}
			})

			.state('tab.my-collection-detail', {
				url: '/my-collection-detail/:id',
				views: {
					'tab-personal': {
						templateUrl: 'templates/my-collection-detail.html',
						controller: 'MyCollectionDetailCtrl'
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

			.state('tab.add-message', {
				url: '/add-message',
				views: {
					'tab-personal': {
						templateUrl: 'templates/add-message.html',
						controller: 'AddMessageCtrl'
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
			})
			
			.state('tab.editname', {
				params:{"name": null},
				url: '/editname',
				views: {
					'tab-personal': {
						templateUrl: 'templates/editname.html',
						controller: 'EditNameCtrl'
					}
				}
			});

		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/tab/home');

	})