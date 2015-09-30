angular.module('starter.controllers', [])
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  .controller('DashCtrl', function ($scope, $rootScope, $ionicLoading, $timeout) {
    // before enter view event
    $scope.$on('$ionicView.beforeEnter', function() {
      $rootScope.hideTabs = false;
    });

    $scope.items = [];
    for (var i = 0; i < 100; i++) {
      var item = {};

      item.imgURL = './img/ionic.png';
      item.title = 'news' + (i + 1);
      item.content = 'news content' + (i + 1);

      $scope.items.push(item);
    }

    var getItemsByPage = function(pagenumber) {
      return $scope.items.slice((pagenumber - 1) * 10, pagenumber * 10);
    };
    var page = 1;

    $scope.doRefresh = function() {
      // when page is loaded first time, show spinner.
      if (page === 1) {
        // show loading spinner
        $ionicLoading.show({
          noBackdrop: true,
          template: 'Loading...'
        });
      }
      // simulate ajax event
      $timeout(function(){
        if (page === 10) {
          // hide loading spinner
          //$ionicLoading.hide();
          // $broadcast the 'scroll.refreshComplete' event.
          $scope.$broadcast('scroll.refreshComplete');
          return;
        }
        $scope.refreshItems = getItemsByPage(page);
        page = page + 1;
        // hide loading spinner
        $ionicLoading.hide();
        // When refreshing is complete, $broadcast the 'scroll.refreshComplete' event.
        $scope.$broadcast('scroll.refreshComplete');
      }.bind(this), 2000);

      //$http.get('/new-items')
      //  .success(function(newItems) {
      //    $scope.items = newItems;
      //  })
      //  .finally(function() {
      //    // Stop the ion-refresher from spinning
      //    $scope.$broadcast('scroll.refreshComplete');
      //  });
    };

    $scope.loadMore = function() {
      if (page === 10) {
        return;
      }
      page = page + 1;
      $scope.moreItems = getItemsByPage(page);
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.doRefresh();

  })
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  .controller('SlidesCtrl', function ($scope, $rootScope, Chats) {
    // before enter view event
    $scope.$on('$ionicView.beforeEnter', function() {
      $rootScope.hideTabs = false;
    });
  })
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  .controller('FavoritesCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, FavoritesService) {
    // before enter view event
    $scope.$on('$ionicView.beforeEnter', function() {
      $rootScope.hideTabs = false;
    });

    var hasMoreItemsFlg = false;
    $scope.moreItems = [];

    // infinite-scroll called function
    $scope.loadMore = function () {
      console.log('[Controller FavoritesCtrl loadMore] Start');
      if(!FavoritesService.hasMoreItems()) {
        console.log('[Controller FavoritesCtrl loadMore] no more items return.');
        $scope.$broadcast('scroll.infiniteScrollComplete');
        return;
      }

      $timeout(function () {
        // 既存の内容に結合
        $scope.moreItems = $scope.moreItems.concat(FavoritesService.getMoreItems());
        console.log('[Controller FavoritesCtrl loadMore] $scope.moreItems set end');

        // whether if having more items
        hasMoreItemsFlg = FavoritesService.hasMoreItems();

        // hide loading spinner
        $ionicLoading.hide();

        // When refreshing is complete, $broadcast the 'scroll.infiniteScrollComplete' event.
        $scope.$broadcast('scroll.infiniteScrollComplete');
        console.log('[Controller FavoritesCtrl loadMore] broadcast scroll.infiniteScrollComplete end');
      }.bind(this), 2000);
    };

    $scope.canGetMoreItems = function () {
      return hasMoreItemsFlg;
    };
    // when loading data first time, show the Loading spinner.
    $ionicLoading.show({
      noBackdrop: true,
      template: 'Loading...'
    });
    // 初期表示
    $scope.loadMore();
  })
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  .controller('ChatsCtrl', function ($scope, $rootScope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    // before enter view event
    $scope.$on('$ionicView.beforeEnter', function() {
      $rootScope.hideTabs = false;
    });

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $rootScope, $stateParams, Chats) {
    // before enter view event
    $scope.$on('$ionicView.beforeEnter', function() {
      $rootScope.hideTabs = true;
    });

    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope, $rootScope) {
    // before enter view event
    $scope.$on('$ionicView.beforeEnter', function() {
      $rootScope.hideTabs = false;
    });

    $scope.settings = {
      enableFriends: true
    };
  })
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  .controller('MyAccountCtrl', function ($scope, $rootScope, $state, $stateParams, $ionicPopup, AuthService) {
    // before enter view event
    $scope.$on('$ionicView.beforeEnter', function() {
      $rootScope.hideTabs = false;
    });

    //$scope.chat = Chats.get($stateParams.chatId);
    console.log('【Controller】MyAccountCtrl Start');
    console.log($scope);
    console.log($state);
    console.log($stateParams);
    $rootScope.$on('MyAccountCtrl:loginStatusChanged', function() {
      $scope.loginFlg = AuthService.getLoginFlg();
    });
    // login flag
    $scope.loginFlg = AuthService.getLoginFlg();

    $scope.appVersion = appVersion;

    $scope.goAuth = function () {
      $state.go('tab.auth');
    };

    $scope.logout = function() {
      $scope.loginFlg = AuthService.setLoginFlg(false);
    }
  })
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  .controller('AuthCtrl', function($scope, $rootScope, $ionicPlatform, $state, AuthService, $ionicPopup, $ionicHistory) {
    // before enter view event
    $scope.$on('$ionicView.beforeEnter', function() {
      $rootScope.hideTabs = true;
    });

    $ionicPlatform.ready(function() {
      AuthService.initDB();

      // Get all birthday records from the database.
      AuthService.getAllUsers().then(function(users) {
        $scope.allUsers = users;
      });
    });

    $scope.user = {
      username: '',
      password : ''
    };

    $scope.signIn = function(form) {
      console.log($scope.user);
      if(form.$valid) {
        if(AuthService.validUser($scope.user) === true) {
          var alertPopup = $ionicPopup.alert({
            template: '登陆成功。'
          });
          alertPopup.then(function(res) {
            console.log('登陆成功。');
            $state.go('tab.myAccount', {}, {location: "replace", reload: true});
            $scope.$emit('MyAccountCtrl:loginStatusChanged');
          });
        } else {
          var alertPopup = $ionicPopup.alert({
            template: '用户名或密码不正确。'
          });
          alertPopup.then(function(res) {
            console.log('登陆失败。');
          });
        }
      }
    };
  })
;
