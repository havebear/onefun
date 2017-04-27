angular.module('starter.controllers', [])

	.controller('HomeCtrl', function($scope, $http) {
		$scope.a = function() {
			alert(1)
		};
		getCourse();

		function getCourse() {
			$http.get("http://localhost:3000/getCourse").then(function(response) {
				$scope.courses = response.data;
			});
		}
		//收藏图标默认是未收藏
		$scope.isActive = true;
	})

	.controller('MessageCtrl', function($scope, $http, $ionicLoading) {
		$scope.show = function() {
		    $ionicLoading.show({
		      template: '加载中',
		      duration: 3000
		    }).then(function(){
		       console.log("The loading indicator is now displayed");
		    });
		  };
		  $scope.hide = function(){
		    $ionicLoading.hide().then(function(){
		       console.log("The loading indicator is now hidden");
		    });
		  };
		$scope.show({showBackdrop: false,});
		$http.get(server.domain + "/message/getmessageshow").then(function(response) {
			$scope.messages = response.data.data;
			$scope.hide();
		});
		$scope.parseInt = parseInt;
		function parseInt(str){
			str = parseInt(str, 10);
			return str;
		}
	})

	.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
		$scope.chat = Chats.get($stateParams.chatId);
	})

	.controller('PersonalCtrl', function($scope, $rootScope, $state,$ionicPopup, $timeout, Userinfo) {
		Userinfo.isLogin();
		$scope.user = {
			User_ID: '',
			User_NiclkName: ''
		};

		if($rootScope.isLogin) {
			$scope.content = "修改昵称";
			$scope.user.User_NiclkName = Userinfo.getName();
			$scope.user.User_ID = Userinfo.getId();
			console.log($rootScope.isLogin);
		} else {
			console.log($rootScope.isLogin);
		}
		$scope.settings = {
			enableFriends: true
		};

		$scope.quitlogin = function() {
			if(!$rootScope.isLogin){
				return true;
			}
			var confirmPopup = $ionicPopup.confirm({
				title: '一坊',
				template: '是否退出账号',
				cancelText: '取消',
				okText: '确定',
				okType: 'button-dark'
			});

			confirmPopup.then(function(res) {
				if(res) {
					Userinfo.quitlogin();
					console.log($rootScope.isLogin);
					//	location.replace('#/tab/personal');
				} else {
					return true;
				}
			});
		}

		$scope.goEL = function() {
			if($rootScope.isLogin) {
				console.log(11111111111111111);
			} else {
				$state.go("tab.login");
			}
		}
	})

	.controller('TutorialDetailCtrl', function($scope, $state, $stateParams, $ionicViewSwitcher) {
		//接受数据，是否收藏
		$scope.isCollection = true;
		$scope.isFollow = true;
		$scope.collection = function() {
			if($scope.isCollection) {
				$scope.isCollection = false;
			} else {
				$scope.isCollection = true;
			}
		}
		$scope.follow = function() {
			if($scope.isFollow) {
				$scope.isFollow = false;
			} else {
				$scope.isFollow = true;
			}
		}
		location.replace('#/tab/personal');
	})

	.controller('TutorialListCtrl', function($scope, $stateParams) {
		var type = $stateParams.type || 0;
		var types = {
			"hot": "本周热门",
			"friend": "关注动态",
			1: "布艺",
			2: "皮艺",
			3: "纸艺",
			4: "木艺",
			5: "饰品",
			6: "编织",
			7: "模型",
			8: "旧物"
		};
		$scope.pagetitle = types[type];

	})

	.controller('MyFollowCtrl', function($scope, $ionicPopup, $timeout) {
		$scope.showConfirm = function(name, id) {
			var confirmPopup = $ionicPopup.confirm({
				title: '一坊',
				template: '是否取消关注' + name + '?',
				cancelText: '返回',
				okText: '确定',
				okType: 'button-dark'
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

	.controller('MyMessageCtrl', function($scope, $http, $ionicPopup, $timeout, $ionicLoading, Userinfo) {
		$scope.show = function() {
		    $ionicLoading.show({
		      template: '加载中',
		      duration: 3000
		    }).then(function(){
		       console.log("The loading indicator is now displayed");
		    });
		  };
		  $scope.hide = function(){
		    $ionicLoading.hide().then(function(){
		       console.log("The loading indicator is now hidden");
		    });
		  };
		 
		$scope.posttext = {
			token: Userinfo.getToken(),
			//number:  //获取条数
		};
		
		getMeMessage();
		
		function getMeMessage(){
			$scope.show();
			$http({
				url: server.domain + '/message/getmemessageshow',
				method: 'post',
				data: $scope.posttext,
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function(response) {
				$scope.messages = response.data.data;
				$scope.hide();
			});
		}
		
		$scope.deleteMessage = function(id){
			$scope.delposttext = {
				token: Userinfo.getToken(),
				message_id: id
			}
			var confirmPopup = $ionicPopup.confirm({
				title: '一坊',
				template: '删除留言',
				cancelText: '取消',
				okText: '确定',
				okType: 'button-dark'
			});
			console.log($scope.posttext);
			confirmPopup.then(function(res) {
				if(res) {
					$http({
						url: server.domain + '/message/deletemessage',
						method: 'post',
						data: $scope.delposttext,
						headers: {
							'Content-Type': 'application/json'
						}
					}).then(function(response) {
						if(response.status){
							getMeMessage();
						}
					});
				} else {
					return true;
				}
			});
		}
	})

	.controller('MyCollectionCtrl', function($scope) {

	})

	.controller('MyTutorialDetailCtrl', function($scope, $ionicPopup, $timeout) {
		$scope.collection = function() {
			var confirmPopup = $ionicPopup.confirm({
				title: '一坊',
				template: '取消收藏',
				cancelText: '取消',
				okText: '确定',
				okType: 'button-dark'
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

	.controller('LoginCtrl', function($scope, $http, $state, $ionicHistory, $rootScope, Md5, Userinfo) {
		$scope.originalpwd = '';
		$scope.formData = {
			user_accountnumber: '',
			password: ''
		};
		$scope.login = function() {
			var $this = this;
			$scope.formData.password = Md5.hex_md5($scope.originalpwd);
			console.log($scope.formData);
			$http({
				url: server.domain + '/user/login',
				method: 'post',
				data: $scope.formData,
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function(response) {
				$scope.data = response.data.data;
				Userinfo.setToken($scope.data.token);
				Userinfo.setId($scope.data.User_ID);
				Userinfo.setName($scope.data.User_NiclkName);
				console.log(response);
				$state.go("tab.personal");
				$rootScope.isLogin = true;
				//$ionicHistory.goBack();
				$state.go("tab.personal");
			});
		}
	})

	.controller('RegCtrl', function($scope, $http, Md5, $state, jsonToStr) {
		$scope.originalpwd = '';
		$scope.formData = {
			user_nickname: '',
			user_accountnumber: '',
			password: ''
		};
		$scope.reg = function() {
			$scope.formData.password = Md5.hex_md5($scope.originalpwd);
			console.log(jsonToStr.transform($scope.formData));
			$http({
				url: server.domain + '/user/register',
				method: 'post',
				data: $scope.formData,
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function(response) {
				$state.go("tab.login");
			});
		};

		function toUnicode(s) {
			return s.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, function() {
				return "\\u" + RegExp["$1"].charCodeAt(0).toString(16);
			});
		}
	})

	.controller('AddTutorialCtrl', function($scope, $http, jsonToStr) {
		$scope.course = {
			course_name: '',
			course_name: '',
			type: '',
			course_material: '',
			steps: [{
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
		$scope.addStep = function() {
			var nextstep = {
				order: $scope.course.steps.length + 1,
				img: '',
				describe: ''
			}
			$scope.course.steps.push(nextstep);
		}
		//删除当前步骤
		$scope.deleteStep = function(step) {
			$scope.course.steps.splice($scope.course.steps.indexOf(step), 1);
		}
		$scope.submit = function() {
			console.log(jsonToStr.transform($scope.course));
			$http({
				url: 'http://localhost:3000/reg',
				method: 'post',
				data: $scope.course,
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function(response) {
				alert(response);
			}, function(response) {
				alert(response);
			});
		}
	})

	.controller('AddMessageCtrl', function($scope, $http, $ionicPopup, $timeout, $ionicHistory, Userinfo) {
		console.log(Userinfo.getToken());
		$scope.message = {
			token: Userinfo.getToken(),
			message_content: ''
		};
		$scope.addMessage = function() {
			var confirmPopup = $ionicPopup.confirm({
				title: '一坊',
				template: '确认发布',
				cancelText: '取消',
				okText: '确定',
				okType: 'button-dark'
			});

			confirmPopup.then(function(res) {
				if(res) {
					$http({
						url: server.domain + '/message/add',
						method: 'post',
						data: $scope.message,
						headers: {
							'Content-Type': 'application/json'
						}
					}).then(function(response) {
						$ionicHistory.goBack();
					});
				} else {
					return true;
				}
			});
		}
	});