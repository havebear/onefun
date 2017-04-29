angular.module('starter.controllers', [])

	.controller('HomeCtrl', function($scope, $http,$rootScope,Userinfo) {
		Userinfo.isLogin();
		$scope.url = server.url;
		$scope.a = function() {
			alert(1)
		};
		
		$scope.apiurl = server.domain + "/course/gettop20";
		
		getCourse();

		function getCourse() {
			if($rootScope.isLogin){
				$scope.apiurl = server.domain + "/course/gettop20?token=" + Userinfo.getToken();
			}else{
				$scope.apiurl = server.domain + "/course/gettop20";
			}
			console.log($scope.apiurl);
			$http.get($scope.apiurl).then(function(response) {
				$scope.courses = response.data.data;
			});
		}
		//收藏图标默认是未收藏
		$scope.isActive = true;
	})

	.controller('MessageCtrl', function($scope, $http, $ionicLoading, $ionicPopup, $timeout, $rootScope, Userinfo) {
		Userinfo.isLogin();
		$scope.show = function() {
			$ionicLoading.show({
				template: '加载中',
				duration: 3000
			}).then(function() {});
		};

		$scope.hide = function() {
			$ionicLoading.hide().then(function() {});
		};

		$scope.show({
			showBackdrop: false,
		});

		$scope.hasmore = true;
		var run = false; //模拟线程锁机制  防止多次请求 含义：是否正在请求。请注意，此处并非加入到了就绪队列，而是直接跳过不执行
		$scope.posttext = {
			number: 20,
			index: 0,
		};

		var apiurl1 = apiurl1 = server.domain + "/message/getmessageshow?number=" + $scope.posttext.number + "&index=" + $scope.posttext.index;

		init(1);

		function init(state) {
			if($rootScope.isLogin) {
				apiurl1 = server.domain + "/message/getmessageshow?number=" + $scope.posttext.number + "&index=" + $scope.posttext.index + "&token=" + Userinfo.getToken();
			} else {
				apiurl1 = server.domain + "/message/getmessageshow?number=" + $scope.posttext.number + "&index=" + $scope.posttext.index;
			}
			if(!run) {
				run = true;
				$http.get(apiurl1).then(function(response) {
					run = false;
					if(state == 3) {
						$scope.messages = $scope.messages.concat(response.data.data);
						if(response.data.data == null || response.data.data.length == 0) {
							console.log("结束");
							$scope.hasmore = false;

						} else {
							$scope.posttext.index++;
						}
					} else {
						$scope.messages = response.data.data;
						if(state == 1) {
							$scope.hide();
						}
					}
				});
			}

		};

		$scope.doRefresh = function() {
			$scope.posttext.index = 0;
			init(2);
			$scope.hasmore = true;
			$scope.$broadcast('scroll.refreshComplete');
		};

		$scope.loadMore = function() {
			init(3);
			$scope.$broadcast('scroll.infiniteScrollComplete');
		};

		$scope.posttext2 = {
			token: '',
			message_id: 0,
		}

		$scope.thumbsup = function(message) {
			$scope.posttext2.token = Userinfo.getToken();
			$scope.posttext2.message_id = message.Message_ID;
			console.log($scope.posttext2);
			var apiurl2 = server.domain + '/message/thumbsup';
			if(message.is_thumbsup) {
				message.is_thumbsup = false;
				console.log(message.is_thumbsup);
				apiurl2 = server.domain + '/message/thumbsdown';
			} else {
				message.is_thumbsup = true;
				console.log(message.is_thumbsup);
				apiurl2 = server.domain + '/message/thumbsup';
			}
			$http({
				url: apiurl2,
				method: 'post',
				data: $scope.posttext2,
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function successCallback(response) {
				message.ThumbsUp_count = response.data.data.Count_ThumbsUp;
				if(message.is_thumbsup) {
//					message.is_thumbsup = false;
//					message.ThumbsUp_count--;
				} else {
//					message.is_thumbsup = true;
//					message.ThumbsUp_count++;
				}
			}, function errorCallback(response) {
				console.log("点赞未成功");
			});
		}
	})

	.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
		$scope.chat = Chats.get($stateParams.chatId);
	})

	.controller('PersonalCtrl', function($scope, $rootScope, $state, $ionicPopup, $timeout, $ionicModal, Userinfo) {
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
			if(!$rootScope.isLogin) {
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
				$scope.openModal();
			} else {
				$state.go("tab.login");
			}
		}

		$ionicModal.fromTemplateUrl('templates/updatename.html', { // modal窗口选项
			scope: $scope,
			animation: 'silde-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
		});

		$scope.openModal = function() {
			$scope.modal.show();
		};

		$scope.closeModal = function() {
			$scope.modal.hide();
		};

		//当我们用完模型时，清除它！
		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});

		// 当隐藏模型时执行动作
		$scope.$on('modal.hide', function() {
		// 执行动作
		});
		// 当移动模型时执行动作
		$scope.$on('modal.removed', function() {
		// 执行动作
		});
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
	})

	.controller('TutorialListCtrl', function($scope, $state,$stateParams, $ionicHistory,$http,$rootScope,Userinfo) {
		$scope.url = server.url;
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
		$scope.apiurl = server.domain + "/course/getcoursetypeshow?typeid=" + $stateParams.type;
		getCourse();

		function getCourse() {
			if($rootScope.isLogin){
				if($stateParams.type == "hot"){
					$scope.apiurl = server.domain + "/course/getweekhotcourse?token=" + Userinfo.getToken();
				}else if($stateParams.type == "friend"){
//					$scope.apiurl = server.domain + "/course/getcoursetypeshow?typeid=" + $stateParams.type + "&token=" + Userinfo.getToken();
				}else{
					$scope.apiurl = server.domain + "/course/getcoursetypeshow?typeid=" + $stateParams.type + "&token=" + Userinfo.getToken();
				}
			}else{
				if($stateParams.type == "hot"){
					$scope.apiurl = server.domain + "/course/getweekhotcourse";
				}else if($stateParams.type == "friend"){
//					$state.go("tab.login");
					alert("因为你没有登录,所以不给你看，其实是不知道怎么做，后面再想吧");
					return true;
				}else{
					$scope.apiurl = server.domain + "/course/getcoursetypeshow?typeid=" + $stateParams.type;
				}
			}
			console.log($scope.apiurl);
			$http.get($scope.apiurl).then(function(response) {
				$scope.courses = response.data.data;
			});
		}
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
			}).then(function() {
				console.log("The loading indicator is now displayed");
			});
		};
		$scope.hide = function() {
			$ionicLoading.hide().then(function() {
				console.log("The loading indicator is now hidden");
			});
		};

		$scope.posttext = {
			token: Userinfo.getToken(),
			index: 0,
			number: 20
		};

		getMeMessage();

		function getMeMessage() {
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

		$scope.deleteMessage = function(id) {
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
						if(response.status) {
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
	})

	.controller('AddTutorialCtrl', function($scope, $http, $ionicPopup, $timeout, $ionicHistory, Userinfo, jsonToStr) {
		$scope.course = {
			course_img: '',
			course_name: '',
			type: '',
			course_material: '',
			steps: [{
					img: '',
					describe: ''
				},
				{
					img: '',
					describe: ''
				},
				{
					img: '',
					describe: ''
				}
			]
		};
		//添加一个步骤
		$scope.addStep = function() {
			var nextstep = {
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
			console.log($scope.course);
			$scope.course.token = Userinfo.getToken();
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
						data: $scope.course,
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