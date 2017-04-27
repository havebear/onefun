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

.controller('PersonalCtrl', function($scope, $rootScope, $state) {
  $scope.user = {
  	User_ID: '',
  	User_NiclkName: '未登录'
  }
  $scope.content = '点击登录';
  $scope.isright = false;
  console.log($rootScope.isLogin);
  if($rootScope.isLogin){
  	$scope.user.User_ID = window.localStorage[cache.userid];
  	$scope.user.User_NiclkName = window.localStorage[cache.niclkname]"
  	$scope.content = "修改昵称";
  	$scope.isright = true;
  }
  $scope.settings = {
    enableFriends: true
  };
  location.replace(location.href);
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

.controller('LoginCtrl', function($scope,$http,$state,$ionicHistory,$rootScope,Md5) {
	$scope.originalpwd = '';
	$scope.formData = {
		user_accountnumber: '',
		password: ''
	};
	$scope.login = function(){
		var $this = this;
		$scope.formData.password = Md5.hex_md5($scope.originalpwd);
		console.log($scope.formData);
		$http({
			url: server.domain + '/user/login',
		    method:'post',  
		    data: $scope.formData,
		    headers: {'Content-Type': 'application/json'}
		}).then(function (response){
			$scope.data = response.data.data;
			window.localStorage[cache.token] = $scope.data.token;
			window.localStorage[cache.userid] = $scope.data.User_ID;
			window.localStorage[cache.niclkname] = $scope.data.User_NiclkName;
			$state.go("tab.personal");
			$rootScope.isLogin = true;
			$ionicHistory.goBack();
//			console.log(window.localStorage[cache.token]);
		});
	}
})

.controller('RegCtrl', function($scope, $http,Md5,$state,jsonToStr) {
	$scope.originalpwd = '';
	$scope.formData = {
		user_nickname: '',
		user_accountnumber: '',
		password: ''
	};
	$scope.reg = function(){
		$scope.formData.password = Md5.hex_md5($scope.originalpwd);
		console.log(jsonToStr.transform($scope.formData));
		$http({  
			url: server.domain + '/user/register',
		    method:'post',  
		    data: $scope.formData,
		    headers: {'Content-Type': 'application/json'}
//		    data: jsonToStr.transform($scope.formData),
//			data: {user_nickname: "132dssdf", accountnumber: "1165465", pwd: "153152"},
//			headers:{'Content-Type': 'application/x-www-form-urlencoded'}
		}).then(function (response) {
			if(response.status){
				$state.go("tab.personal");
			}
		});
	};
	function toUnicode(s){ 
        return s.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g,function(){
          return "\\u" + RegExp["$1"].charCodeAt(0).toString(16);
        });
      }
})

.controller('AddTutorialCtrl', function($scope,$http,jsonToStr) {
	$scope.course = {
		course_name: '',
		course_name: '',
		type: '',
		course_material: '',
		steps:[
			{
				img: '',
				describe: '我是第一'
			},
			{
				img: '',
				describe: '我是第二'
			},
			{
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
	$scope.submit = function(){
		console.log(jsonToStr.transform($scope.course));
		$http({  
			url: 'http://localhost:3000/reg',
		    method:'post',  
		    data: $scope.course,
//			headers:{'Content-Type': 'application/x-www-form-urlencoded'}
			headers: {'Content-Type': 'application/json'}
		}).then(function (response) {
		    alert(response);
		}, function (response) {
		    alert(response);
		});
	}
})

.controller('AddMessageCtrl', function($scope, $ionicPopup, $timeout) {
	$scope.addMessage = function(){
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
});
