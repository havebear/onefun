angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $http) {
	$scope.a = function() {alert(1)};
	getProductList();
	function getProductList(){
		$http.get("http://localhost:3000/getCourse").then(function (response) {
			$scope.courses = response.data;
		});
	}
	//收藏图标默认是未收藏
	$scope.isActive = true;
})

.controller('MessageCtrl', function($scope) {
	
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

.controller('TutorialDetailCtrl', function($scope,$state,$stateParams,$ionicViewSwitcher) {
	//接受数据，是否收藏
	$scope.isCollection = true;
	$scope.isFollow = true;
	$scope.collection = function(){
		if($scope.isCollection){
			$scope.isCollection = false;
		}else{
			$scope.isCollection = true;
		}
	}
	$scope.follow = function(){
		if($scope.isFollow){
			$scope.isFollow = false;
		}else{
			$scope.isFollow = true;
		}
	}
	//同级解决次级页面出现底部tab方案
//	$scope.backNav = function() {
//	  console.log($scope.historyBack);
//	  $ionicViewSwitcher.nextDirection('back');
//	  $state.go($stateParams.back);
//	};
})

.controller('TutorialListCtrl', function($scope,$stateParams) {
	var type = $stateParams.type || 0;
	var types = {"hot": "本周热门", "friend": "关注动态", 1: "布艺", 2: "皮艺", 3: "纸艺", 4: "木艺", 5: "饰品", 6: "编织", 7: "模型", 8: "旧物"};
	$scope.pagetitle = types[type];
	
})

.controller('MyFollowCtrl', function($scope, $ionicPopup, $timeout) {
	$scope.showConfirm = function(name,id) {
	   var confirmPopup = $ionicPopup.confirm({
	     title: '一坊',
	     template: '是否取消关注' + name + '?',
	     cancelText:'返回',
	     okText:'确定',
	     okType:'button-dark'
	   });
	
	   confirmPopup.then(function(res) {
	     if(res) {
	       console.log('You are sure');
	     } else {
	       console.log('You are not sure');
	     }
	   });
	 };
})

.controller('MyMessageCtrl', function($scope, $ionicPopup, $timeout) {
	$scope.deleteMessage = function(){
		var confirmPopup = $ionicPopup.confirm({
	     title: '一坊',
	     template: '确认删除',
	     cancelText:'取消',
	     okText:'确定',
	     okType:'button-dark'
	   });
	
	   confirmPopup.then(function(res) {
	     if(res) {
	       console.log('You are sure');
	     } else {
	       console.log('You are not sure');
	     }
	   });
	}
})

.controller('MyCollectionCtrl', function($scope) {
	
})

.controller('MyTutorialDetailCtrl', function($scope, $ionicPopup, $timeout) {
	$scope.collection = function(){
		var confirmPopup = $ionicPopup.confirm({
	     title: '一坊',
	     template: '取消收藏',
	     cancelText:'取消',
	     okText:'确定',
	     okType:'button-dark'
	   });
	
	   confirmPopup.then(function(res) {
	     if(res) {
	       console.log('You are sure');
	     } else {
	       console.log('You are not sure');
	     }
	   });
	}
})

.controller('LoginCtrl', function($scope,$state,Md5) {
	$scope.customer = {
		name: '',
		pwd: ''
	}
	$scope.login = function(){
		console.log(Md5.hex_md5($scope.customer.pwd));
		console.log(00001);
	}
})

.controller('RegCtrl', function($scope) {
	
})

.controller('AddTutorialCtrl', function($scope) {
	$scope.course = {
		course_name: '',
		course_name: '',
		type: '',
		course_material: '',
		steps:[
			{
//				order: 1,
				img: '',
				describe: '我是第一'
			},
			{
//				order: 2,
				img: '',
				describe: '我是第二'
			},
			{
//				order: 3,
				img: '',
				describe: '我是第三'
			}
		]
	};
	//添加一个步骤
	$scope.addStep = function(){
		var nextstep = {
			order: $scope.course.steps.length + 1,
			img: '',
			describe: ''
		}
		$scope.course.steps.push(nextstep);
	}
	//删除当前步骤
	$scope.deleteStep = function(step){
		$scope.course.steps.splice($scope.course.steps.indexOf(step),1);
	}
})

.controller('AddMessageCtrl', function($scope, $ionicPopup, $timeout) {
	$scope.addLiuyan = function(){
		var confirmPopup = $ionicPopup.confirm({
	     title: '一坊',
	     template: '确认发表',
	     cancelText:'取消',
	     okText:'确定',
	     okType:'button-dark'
	   });
	
	   confirmPopup.then(function(res) {
	     if(res) {
	       console.log('You are sure');
	     } else {
	       console.log('You are not sure');
	     }
	   });
	}
	
//	$cordovaToast
//  .show('Here is a message', 'long', 'center')
//  .then(function(success) {
//    console.log('You are sure');
//  }, function (error) {
//    console.log('You are not sure');
//  });
});
