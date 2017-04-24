angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope) {
	$scope.a = function() {alert(1)};
})

//.controller('LiuYanCtrl', function($scope, LiuYan) {
	.controller('LiuYanCtrl', function($scope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

//$scope.liuyans = LiuYans.all();
//$scope.remove = function(liuyan) {
//  Chats.remove(liuyan);
//};
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('PersonalCtrl', function($scope, $state) {
  $scope.settings = {
    enableFriends: true
  };
	$scope.GoLogin = GoLogin;
	function GoLogin(){
		$state.go("tab.login");
	};
})

.controller('DetailCtrl', function($scope,$state,$stateParams,$ionicViewSwitcher) {
	//同级解决次级页面出现底部tab方案
//	$scope.backNav = function() {
//	  console.log($scope.historyBack);
//	  $ionicViewSwitcher.nextDirection('back');
//	  $state.go($stateParams.back);
//	};
})

.controller('TutorialListCtrl', function($scope,$stateParams) {
	var type = $stateParams.type || 0;
	var types = {"hot": "本周热门", "friend": "关注动态", "buyi": "布艺", "piyi": "皮艺", "zhiyi": "纸艺", "muyi": "木艺", "shipin": "饰品", "bianzhi": "编织", "moxing": "模型", "jiuwu": "旧物"};
	$scope.pagetitle = types[type];
})

.controller('MyGuanZhuCtrl', function($scope) {
	
})

.controller('MyLiuYanCtrl', function($scope) {
	
})

.controller('MyShouCangCtrl', function($scope) {
	
})

.controller('MyTDetailCtrl', function($scope) {
	
})

.controller('LoginCtrl', function($scope,$state) {
	
})

.controller('RegCtrl', function($scope) {
	
})

.controller('AddTutorialCtrl', function($scope) {
	
})

.controller('AddLiuyanCtrl', function($scope) {
	
});
