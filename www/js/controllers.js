angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, $ionicLoading, $timeout) {
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
    $scope.refreshItems = getItemsByPage(page);

    $scope.doRefresh = function() {
      // show loading spinner
      //$ionicLoading.show();
      // simulate ajax event
      $timeout(function(){
        if (page === 10) {
          // hide loading spinner
          //$ionicLoading.hide();
          // $broadcast the 'scroll.refreshComplete' event.
          $scope.$broadcast('scroll.refreshComplete');
          return;
        }
        page = page + 1;
        $scope.refreshItems = getItemsByPage(page);
        // hide loading spinner
        //$ionicLoading.hide();
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

  })

  .controller('SlidesCtrl', function ($scope, Chats) {
    // nothing
  })

  .controller('FavoritesCtrl', function ($scope, $ionicLoading, $timeout, FavoritesService) {

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

        // 初期表示で infinite-scroll が有効になってしまうので、数秒まつ
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
    $ionicLoading.show();
    // 初期表示
    $scope.loadMore();
  })

  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  })

  .controller('MyAccountCtrl', function ($scope, $state, $stateParams, $ionicPopup) {
    //$scope.chat = Chats.get($stateParams.chatId);
    console.log('【Controller】MyAccountCtrl Start');
    console.log($scope);
    console.log($state);
    console.log($stateParams);

    $scope.appVersion = appVersion;

    $scope.goAuth = function () {
      $state.go('tab.auth');
    };

  })

  .controller('AuthCtrl', function($scope, $state) {
    $scope.authorization = {
      username: '',
      password : ''
    };
    $scope.signIn = function(form) {
      if(form.$valid) {
        $state.go('tab.dash');
      }
    };
  })
;
