angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope) {
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
      if (page === 10) {
        return;
      }
      page = page + 1;
      $scope.refreshItems = getItemsByPage(page);
      $scope.$broadcast('scroll.refreshComplete');

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

    $scope.$on('$stateChangeSuccess', function() {
      $scope.loadMore();
    });

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

  .controller('MyAccountCtrl', function ($scope, $state, $stateParams) {
    //$scope.chat = Chats.get($stateParams.chatId);
    console.log('【Controller】MyAccountCtrl Start');
    console.log($scope);
    console.log($state);
    console.log($stateParams);

    $scope.goAuth = function () {
      $state.go('auth');
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
