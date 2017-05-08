angular.module('starter.controllers', [])

	.controller('HomeCtrl', function($scope, $http, $rootScope, $ionicLoading, Userinfo) {
		Userinfo.isLogin();
		$scope.show = function() {
			$ionicLoading.show({
				template: '加载中',
				animation: 'fade-in',
				showBackdrop: true,
			}).then(function() {});
		};

		$scope.hide = function() {
			$ionicLoading.hide({
				noBackdrop: true,
			}).then(function() {});
		};

		$rootScope.url = server.url;

		getCourse();

		function getCourse() {
			var apiurl = "";
			if($rootScope.isLogin) {
				apiurl = server.domain + "/course/gettop20?token=" + Userinfo.getToken();
			} else {
				apiurl = server.domain + "/course/gettop20";
			}
			$http.get(apiurl).then(function(response) {
				$scope.courses = response.data.data;
				//				$scope.hide();
			});
		};
	})

	.controller('MessageCtrl', function($scope, $http, $ionicLoading, $timeout, $rootScope, Userinfo, Toast) {
		//		Userinfo.isLogin();
		$scope.show = function() {
			$ionicLoading.show({
				template: '加载中',
				animation: 'fade-in',
				showBackdrop: true,
			}).then(function() {});
		};

		$scope.hide = function() {
			$ionicLoading.hide({
				noBackdrop: true,
			}).then(function() {});
		};

		$scope.hasmore = true;

		var run = false; //模拟线程锁机制  防止多次请求 含义：是否正在请求。请注意，此处并非加入到了就绪队列，而是直接跳过不执行

		var posttext = {
			number: 20,
			index: 0,
		};

		var apiurl = "";

		init(1);

		function init(state) {
			if($rootScope.isLogin) {
				apiurl = server.domain + "/message/getmessageshow?number=" + posttext.number + "&index=" + posttext.index + "&token=" + Userinfo.getToken();
			} else {
				apiurl = server.domain + "/message/getmessageshow?number=" + posttext.number + "&index=" + posttext.index;
			}
			if(!run) {
				run = true;
				$http.get(apiurl).then(function(response) {
					run = false;
					if(state == 3) {
						$scope.messages = $scope.messages.concat(response.data.data);
						if(response.data.data == null || response.data.data.length == 0) {
							console.log("结束");
							$scope.hasmore = false;
						} else {
							posttext.index++;
						}
					} else {
						$scope.messages = response.data.data;
						posttext.index = 1;
						//						if(state == 1) {
						//							$scope.hide();
						//						}
					}
				});
			}

		};

		$scope.doRefresh = function() {
			posttext.index = 0;
			init(2);
			$scope.hasmore = true;
			$scope.$broadcast('scroll.refreshComplete');
		};

		$scope.loadMore = function() {
			init(3);
			$scope.$broadcast('scroll.infiniteScrollComplete');
		};

		$scope.thumbsup = function(message) {
			if(!$rootScope.isLogin) {
				Toast.toast("请登录后在点赞~");
			} else {
				var posttext2 = {
					token: Userinfo.getToken(),
					message_id: message.Message_ID,
				}
				if(message.is_thumbsup) {
					message.is_thumbsup = false;
					message.ThumbsUp_count--;
					apiurl = server.domain + '/message/thumbsdown';
				} else {
					message.is_thumbsup = true;
					message.ThumbsUp_count++;
					apiurl = server.domain + '/message/thumbsup';
				}
				$http({
					url: apiurl,
					method: 'post',
					data: posttext2,
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(function successCallback(response) {
					message.ThumbsUp_count = response.data.data.Count_ThumbsUp;
					if(message.is_thumbsup) {
						message.is_thumbsup = true;
						Toast.toast("已点赞");
					} else {
						message.is_thumbsup = false;
						Toast.toast("已取消点赞");
					}
				}, function errorCallback(response) {
					console.log("网络原因，点赞失败");
				});
			}
		};
	})

	.controller('PersonalCtrl', function($scope, $http, $rootScope, $state, $ionicPopup, $timeout, $ionicModal, Userinfo, Toast) {
		$scope.show = function() {
			$ionicLoading.show({
				template: '加载中',
				animation: 'fade-in',
				showBackdrop: true,
			}).then(function() {});
		};

		$scope.hide = function() {
			$ionicLoading.hide({
				noBackdrop: true,
			}).then(function() {});
		};

		$scope.user = {
			User_ID: '',
			User_NiclkName: ''
		};

		$scope.settings = {
			enableFriends: true
		};

		init();

		function init() {
			//			Userinfo.isLogin();
			if($rootScope.isLogin) {
				$scope.content = "修改昵称";
				$scope.user.user_nickname = Userinfo.getName();
				$scope.user.User_ID = Userinfo.getId();
				getUser();
				getMyCourse();
			} else {
				return true;
			}
		};

		function getUser() {
			$http({
				url: server.domain + "/user/getmyinfo",
				method: 'post',
				data: {
					"token": Userinfo.getToken(),
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function successCallback(response) {
				$scope.user = response.data.message;
			}, function errorCallback(response) {
				Toast.toast("请检查你的网络连接");
			});
		}

		function getMyCourse() {
			$http({
				url: server.domain + "/course/getmebuildcourse",
				method: 'post',
				data: {
					token: Userinfo.getToken(),
					index: 0,
					number: 20,
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function successCallback(response) {
				$scope.courses = response.data.data;
			}, function errorCallback(response) {
				Toast.toast("请检查你的网络连接");
			});
		}

		$scope.quitlogin = function() {
			if(!$rootScope.isLogin) {
				return true;
			}
			var confirmPopup = $ionicPopup.confirm({
				title: '来自OneFun的消息',
				template: '是否退出登录？',
				cancelText: '取消',
				okText: '确定',
				okType: 'button-dark'
			});

			confirmPopup.then(function(res) {
				if(res) {
					$scope.user = null;
					$scope.courses = null;
					Userinfo.quitlogin();
					Toast.toast("已退出登录");
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

	.controller('TutorialDetailCtrl', function($scope, $http, $state, $stateParams, $ionicViewSwitcher, $rootScope, Userinfo, Toast) {
		//Userinfo.isLogin();
		//$scope.url = server.url;

		var apiurl = "";

		init();

		function init() {
			if($rootScope.isLogin) {
				apiurl = server.domain + "/course/getcourseinfo?course_id=" + $stateParams.id + "&token=" + Userinfo.getToken();
			} else {
				apiurl = server.domain + "/course/getcourseinfo?course_id=" + $stateParams.id;
			}
			$http.get(apiurl).then(function(response) {
				$scope.course = response.data.data;
				$scope.steps = response.data.data.step;
				console.log($scope.steps);
			});
		};

		$scope.collection = function(course) {
			if(course.is_collection) {
				apiurl = server.domain + "/course/delectcollection";
			} else {
				apiurl = server.domain + "/course/addcollection";
			}
			if($rootScope.isLogin) {
				var posttext = {
					token: Userinfo.getToken(),
					Course_ID: $stateParams.id,
				};
				$http({
					url: apiurl,
					method: 'post',
					data: posttext,
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(function successCallback(response) {
					if(course.is_collection) {
						course.is_collection = false;
						Toast.toast("已取消收藏");
					} else {
						course.is_collection = true;
						Toast.toast("已收藏");
					}
				}, function errorCallback(response) {
					Toast.toast("请检查网络连接");
				});
			} else {
				Toast.toast("你还没有登录");
			}
		}

		$scope.follow = function(course) {
			if(course.is_follow) {
				apiurl = server.domain + "/follow/del";
			} else {
				apiurl = server.domain + "/follow/add";
			}
			if($rootScope.isLogin) {
				var posttext = {
					token: Userinfo.getToken(),
					Follow_User_ID: course.author_id
				};
				$http({
					url: apiurl,
					method: 'post',
					data: posttext,
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(function successCallback(response) {
					if(course.is_follow) {
						course.is_follow = false;
						Toast.toast("已取消关注");
					} else {
						course.is_follow = true;
						Toast.toast("已关注");
					}
				}, function errorCallback(response) {
					Toast.toast("请检查网络连接");
				});
			} else {
				Toast.toast("你还没有登录");
			}
		};
	})

	.controller('TutorialListCtrl', function($scope, $state, $stateParams, $ionicHistory, $ionicLoading, $http, $rootScope, Userinfo, Toast) {
		//		$scope.url = server.url;
		$scope.show = function() {
			$ionicLoading.show({
				template: '加载中',
				animation: 'fade-in',
				showBackdrop: true,
			}).then(function() {});
		};

		$scope.hide = function() {
			$ionicLoading.hide({
				noBackdrop: true,
			}).then(function() {});
		};

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

		getCourse();

		function getCourse() {
			var apiurl = "";
			if($rootScope.isLogin) {
				if($stateParams.type == "hot") {
					apiurl = server.domain + "/course/getweekhotcourse?token=" + Userinfo.getToken();
				} else if($stateParams.type == "friend") {
					getMyFollowCourseList();
				} else {
					apiurl = server.domain + "/course/getcoursetypeshow?typeid=" + $stateParams.type + "&token=" + Userinfo.getToken();
				}
			} else {
				if($stateParams.type == "hot") {
					apiurl = server.domain + "/course/getweekhotcourse";
				} else if($stateParams.type == "friend") {
					alert("因为你没有登录,所以不给你看，其实是不知道怎么做，后面再想吧");
					return true;
				} else {
					apiurl = server.domain + "/course/getcoursetypeshow?typeid=" + $stateParams.type;
				}
			}
			$http.get(apiurl).then(function(response) {
				$scope.courses = response.data.data;
			});
		}

		function getMyFollowCourseList() {
			$http({
				url: server.domain + "/course/getfollowcourse",
				method: 'post',
				data: {
					"token": Userinfo.getToken()
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function successCallback(response) {
				$scope.courses = response.data.data;
			}, function errorCallback(response) {
				Toast.toast("请检查你的网络连接~");
			});
		}
	})

	.controller('MyFollowCtrl', function($scope, $http, $rootScope, $ionicPopup, $timeout, $ionicHistory, Userinfo, Toast) {
		//		Userinfo.isLogin();
		$scope.show = function() {
			$ionicLoading.show({
				template: '加载中',
				animation: 'fade-in',
				showBackdrop: true,
			}).then(function() {});
		};

		$scope.hide = function() {
			$ionicLoading.hide({
				noBackdrop: true,
			}).then(function() {});
		};
		init();

		function init() {
			if($rootScope.isLogin) {
				getMyFollowUserList();
			} else {
				Toast.toast(" ╮(๑•́ ₃•̀๑)╭  初始化失败了~");
			}
		};

		function getMyFollowUserList() {
			$http({
				url: server.domain + "/follow/getfollowlist",
				method: 'post',
				data: {
					"token": Userinfo.getToken(),
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function successCallback(response) {
				$scope.users = response.data.data;
			}, function errorCallback(response) {
				Toast.toast("请检查你的网络连接");
			});
		}

		$scope.delfollow = function(user) {
			var confirmPopup = $ionicPopup.confirm({
				title: '一坊',
				template: '是否取消关注' + user.Follow_User_Nickname,
				cancelText: '取消',
				okText: '确定',
				okType: 'button-dark'
			});
			confirmPopup.then(function(res) {
				if(res) {
					if($rootScope.isLogin) {
						var posttext = {
							token: Userinfo.getToken(),
							Follow_User_ID: user.Follow_User_ID
						};
						$http({
							url: server.domain + "/follow/del",
							method: 'post',
							data: posttext,
							headers: {
								'Content-Type': 'application/json'
							}
						}).then(function successCallback(response) {
							if(response.data.status) {
								console.log("已取消关注");
								$scope.users;
								$scope.users.splice($scope.users.indexOf(user), 1);
							} else {
								Toast.toast("网络好像有点小问题");
							}
						}, function errorCallback(response) {
							Toast.toast("网络好像有点小问题");
						});
					} else {
						Toast.toast("你还没有登录");
					}
				} else {
					Toast.toast('网络好像有点小问题');
				}
			});
		};
	})

	.controller('MyMessageCtrl', function($scope, $http, $ionicPopup, $timeout, $ionicLoading, Userinfo, Toast) {
		$scope.show = function() {
			$ionicLoading.show({
				template: '加载中',
				animation: 'fade-in',
				showBackdrop: true,
			}).then(function() {});
		};

		$scope.hide = function() {
			$ionicLoading.hide({
				noBackdrop: true,
			}).then(function() {});
		};

		getMeMessage();

		function getMeMessage() {
			var posttext = {
				token: Userinfo.getToken(),
				index: 0,
				number: 20
			};
			$http({
				url: server.domain + '/message/getmemessageshow',
				method: 'post',
				data: posttext,
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function(response) {
				$scope.messages = response.data.data;
				//				$scope.hide();
			});
		}

		$scope.deleteMessage = function(message) {
			console.log(message);
			console.log($scope.messages.indexOf(message));
			var confirmPopup = $ionicPopup.confirm({
				title: '一坊',
				template: '删除留言',
				cancelText: '取消',
				okText: '确定',
				okType: 'button-dark'
			});
			confirmPopup.then(function(res) {
				if(res) {
					var posttext = {
						token: Userinfo.getToken(),
						message_id: message.Message_ID,
					}
					$http({
						url: server.domain + '/message/deletemessage',
						method: 'post',
						data: posttext,
						headers: {
							'Content-Type': 'application/json'
						}
					}).then(function(response) {
						if(response.status) {
							console.log($scope.messages.length);
							$scope.messages.splice($scope.messages.indexOf(message), 1);
							Toast.toast("删除成功");
						}
					});
				} else {
					return true;
				}
			});
		}
	})

	.controller('MyCollectionCtrl', function($scope, $http, $rootScope, $ionicPopup, $timeout, Userinfo, Toast) {
		//		$scope.url = server.url;
		//		Userinfo.isLogin();
		$scope.show = function() {
			$ionicLoading.show({
				template: '加载中',
				animation: 'fade-in',
				showBackdrop: true,
			}).then(function() {});
		};

		$scope.hide = function() {
			$ionicLoading.hide({
				noBackdrop: true,
			}).then(function() {});
		};

		init();

		function init() {
			if($rootScope.isLogin) {
				getMyCollectionCourseList();
			} else {
				Toast.toast(" ╮(๑•́ ₃•̀๑)╭  初始化失败了~");
				return true;
			}
		}

		function getMyCollectionCourseList() {
			$http({
				url: server.domain + "/course/getcollectioncourse",
				method: 'post',
				data: {
					"token": Userinfo.getToken()
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function successCallback(response) {
				$scope.courses = response.data.data;
			}, function errorCallback(response) {
				Toast.toast("请检查你的网络连接");
			});
		}
	})

	.controller('MyCollectionDetailCtrl', function($scope, $http, $state, $stateParams, $ionicViewSwitcher, $rootScope, Userinfo, Toast) {
		//Userinfo.isLogin();
		//$scope.url = server.url;

		var apiurl = "";

		init();

		function init() {
			if($rootScope.isLogin) {
				apiurl = server.domain + "/course/getcourseinfo?course_id=" + $stateParams.id + "&token=" + Userinfo.getToken();
			} else {
				apiurl = server.domain + "/course/getcourseinfo?course_id=" + $stateParams.id;
			}
			$http.get(apiurl).then(function(response) {
				$scope.course = response.data.data;
				$scope.steps = response.data.data.step;
				console.log($scope.steps);
			});
		};

		$scope.collection = function(course) {
			if(course.is_collection) {
				apiurl = server.domain + "/course/delectcollection";
			} else {
				apiurl = server.domain + "/course/addcollection";
			}
			if($rootScope.isLogin) {
				var posttext = {
					token: Userinfo.getToken(),
					Course_ID: $stateParams.id,
				};
				$http({
					url: apiurl,
					method: 'post',
					data: posttext,
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(function successCallback(response) {
					if(course.is_collection) {
						course.is_collection = false;
						Toast.toast("已取消收藏");
					} else {
						course.is_collection = true;
						Toast.toast("已收藏");
					}
				}, function errorCallback(response) {
					Toast.toast("请检查网络连接");
				});
			} else {
				Toast.toast("你还没有登录");
			}
		}

		$scope.follow = function(course) {
			if(course.is_follow) {
				apiurl = server.domain + "/follow/del";
			} else {
				apiurl = server.domain + "/follow/add";
			}
			if($rootScope.isLogin) {
				var posttext = {
					token: Userinfo.getToken(),
					Follow_User_ID: course.author_id
				};
				$http({
					url: apiurl,
					method: 'post',
					data: posttext,
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(function successCallback(response) {
					if(course.is_follow) {
						course.is_follow = false;
						Toast.toast("已取消关注");
					} else {
						course.is_follow = true;
						Toast.toast("已关注");
					}
				}, function errorCallback(response) {
					Toast.toast("请检查网络连接");
				});
			} else {
				Toast.toast("你还没有登录");
			}
		};
	})

	.controller('MyTutorialDetailCtrl', function($scope, $http, $state, $ionicPopup, $stateParams, $ionicViewSwitcher, $rootScope, $ionicHistory, Userinfo, Toast) {
		//		Userinfo.isLogin();
		//		$scope.url = server.url;
		$scope.show = function() {
			$ionicLoading.show({
				template: '加载中',
				animation: 'fade-in',
				showBackdrop: true,
			}).then(function() {});
		};

		$scope.hide = function() {
			$ionicLoading.hide({
				noBackdrop: true,
			}).then(function() {});
		};
		init();

		function init() {
			var apiurl = "";
			if($rootScope.isLogin) {
				apiurl = server.domain + "/course/getcourseinfo?course_id=" + $stateParams.id + "&token=" + Userinfo.getToken();
			} else {
				apiurl = server.domain + "/course/getcourseinfo?course_id=" + $stateParams.id;
			}
			$http.get(apiurl).then(function(response) {
				$scope.course = response.data.data;
				$scope.steps = response.data.data.step;
				//				console.log($scope.steps);
			});
		}

		$scope.collection = function(course) {
			var apiurl = "";
			if(course.is_collection) {
				apiurl = server.domain + "/course/delectcollection";
			} else {
				apiurl = server.domain + "/course/addcollection";
			}
			if($rootScope.isLogin) {
				var posttext = {
					token: Userinfo.getToken(),
					Course_ID: $stateParams.id
				};
				$http({
					url: apiurl,
					method: 'post',
					data: posttext,
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(function successCallback(response) {
					if(course.is_collection) {
						course.is_collection = false;
						Toast.toast("已取消收藏");
					} else {
						course.is_collection = true;
						Toast.toast("已收藏");
					}
				}, function errorCallback(response) {
					Toast.toast("请检查网络连接");
				});
			} else {
				Toast.toast("你还没有登录");
			}
		}

		$scope.follow = function(course) {
			var apiurl = "";
			if(course.is_follow) {
				apiurl = server.domain + "/follow/del";
			} else {
				apiurl = server.domain + "/follow/add";
			}
			if($rootScope.isLogin) {
				var posttext = {
					token: Userinfo.getToken(),
					Follow_User_ID: course.author_id
				};
				$http({
					url: apiurl,
					method: 'post',
					data: posttext,
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(function successCallback(response) {
					if(course.is_follow) {
						course.is_follow = false;
						Toast.toast("已取消关注");
					} else {
						course.is_follow = true;
						Toast.toast("已关注");
					}
				}, function errorCallback(response) {
					Toast.toast("请检查网络连接");
				});
			} else {
				Toast.toast("你还没有登录");
			}
		}
		$scope.deletecourse = function() {
			var confirmPopup = $ionicPopup.confirm({
				title: '一坊',
				template: '删除留言',
				cancelText: '取消',
				okText: '确定',
				okType: 'button-dark'
			});
			confirmPopup.then(function(res) {
				if(res) {
					var apiurl = "";
					apiurl = server.domain + "/course/deletmecourse";
					if($rootScope.isLogin) {
						var posttext = {
							token: Userinfo.getToken(),
							Course_ID: $stateParams.id,
						};
						$http({
							url: apiurl,
							method: 'post',
							data: posttext,
							headers: {
								'Content-Type': 'application/json'
							}
						}).then(function successCallback(response) {
							Toast.toast("删除成功");
							$ionicHistory.goBack();
						}, function errorCallback(response) {
							Toast.toast("请检查网络连接");
						});
					} else {
						Toast.toast("你还没有登录");
					}
				} else {
					return true;
				}
			});
		}
	})

	.controller('LoginCtrl', function($scope, $http, $state, $ionicHistory, $rootScope, Md5, Userinfo, Toast) {
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
				$state.go("tab.personal");
				$rootScope.isLogin = true;
				Toast.toast("登录成功~");
				//$ionicHistory.goBack();
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

	.controller('AddTutorialCtrl', function($scope, $http, $ionicPopup, $timeout, $ionicHistory, $cordovaImagePicker, $cordovaCamera, $ionicActionSheet, $cordovaFileTransfer, Userinfo, jsonToStr, Toast) {
		$scope.course = {
			Sy_img: '',
			Course_Name: '',
			Material_Tool: '',
			type_id: '1',
			step: [{
					step_order: '',
					step_img: '',
					step_describes: ''
				},
				{
					step_order: '',
					step_img: '',
					step_describes: ''
				},
				{
					step_order: '3',
					step_img: '',
					step_describes: ''
				}
			]
		};
		//添加一个步骤
		$scope.addStep = function() {
			var nextstep = {
				step_order: '',
				step_img: '',
				step_describes: ''
			}
			$scope.course.step.push(nextstep);
		}
		//删除当前步骤
		$scope.deleteStep = function(step) {
			$scope.course.step.splice($scope.course.step.indexOf(step), 1);
		}

		$scope.images_list = [];

		$scope.addimg = function(obj) {
			$ionicActionSheet.show({
				buttons: [{
						text: '相机'
					},
					{
						text: '图库'
					}
				],
				cancelText: '关闭',
				cancel: function() {
					return true;
				},
				buttonClicked: function(index) {
					switch(index) {
						case 0:
							takePhoto(obj);
							break;
						case 1:
							pickImage(obj);
							break;
						default:
							break;
					}
					return true;
				}
			});
		};

		var pickImage = function(obj) {
			var options = {
				maximumImagesCount: 1,
				width: 720,
				//					height: 0,
				quality: 80
			};

			$cordovaImagePicker.getPictures(options)
				.then(function(results) {
					$scope.images_list.push(results[0]);
					upImage(results[0], obj);
					console.log(results[0]);
					obj.locaimg = results[0];
					//					$scope.imgurl = results[0];
				}, function(error) {
					// error getting photos
				});
		}

		var takePhoto = function(obj) {
			var options = {
				//这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
				quality: 80, //相片质量0-100
				destinationType: Camera.DestinationType.FILE_URI, //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
				sourceType: Camera.PictureSourceType.CAMERA, //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
				allowEdit: false, //在选择之前允许修改截图
				encodingType: Camera.EncodingType.JPEG, //保存的图片格式： JPEG = 0, PNG = 1
				targetWidth: 720, //照片宽度
				targetHeight: 0, //照片高度
				mediaType: 0, //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
				cameraDirection: 0, //枪后摄像头类型：Back= 0,Front-facing = 1
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: true //保存进手机相册
			};
			$cordovaCamera.getPicture(options).then(function(imageData) {

				CommonJs.AlertPopup(imageData);
				obj.locaimg = imageData;
				upImage(imageData, obj);
				//image.src = "data:image/jpeg;base64," + imageData;
			}, function(err) {
				// error
				CommonJs.AlertPopup(err.message);
			});

		}

		//图片上传upImage（图片路径）
		//http://ngcordova.com/docs/plugins/fileTransfer/  资料地址
		var upImage = function(imageUrl, obj) {
			document.addEventListener('deviceready', function() {
				var url = server.domain + "/course/doupload";
				var options = new FileUploadOptions();
				options.fileKey = "img";
				//				options.headers = {'Content-Type': 'application/json'};
				var params = {};
				params.token = Userinfo.getToken();
				options.params = params;
				console.log(options.params);
				$cordovaFileTransfer.upload(url, imageUrl, options)
					.then(function(result) {
						var res = JSON.parse(result.response);
						console.log(res.data);
						if(obj.type_id) {
							$scope.course.Sy_img = res.data;
						} else {
							obj.step_img = res.data;
						}
						Toast.toast("图片上传成功");
						$scope.images_list.splice(0, $scope.images_list.length);
					}, function(err) {
						console.log(err);
						console.log(options);
						alert("网络原因上传失败~");
					}, function(progress) {
						// constant progress updates
					});

			}, false);
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

			delete $scope.course.locaimg;
			for(var i = 0; i < $scope.course.step.length; i++) {
				$scope.course.step[i].step_order = i + 1;
				delete $scope.course.step[i].locaimg;
			}

			confirmPopup.then(function(res) {
				if(res) {
					$http({
						url: server.domain + "/course/add",
						method: 'post',
						data: $scope.course,
						headers: {
							'Content-Type': 'application/json'
						}
					}).then(function successCallback(response) {
						console.log($scope.course);
						Toast.toast("教程发布成功成功");
						$ionicHistory.goBack();
					}, function errorCallback(response) {
						Toast.toast("发布失败，请检查网络连接");
					});
				} else {
					return true;
				}
			});
		};

	})

	.controller('AddMessageCtrl', function($scope, $http, $ionicPopup, $ionicHistory, $timeout, Userinfo, Toast) {
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
						Toast.toast("留言发布成功");
						$ionicHistory.goBack();
					});
				} else {
					return true;
				}
			});
		}
	});