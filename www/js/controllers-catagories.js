myapp.controller('IncomeCategoryListCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, CategoryService) {
  // before enter view event
  $scope.$on('$ionicView.beforeEnter', function () {
    $rootScope.hideTabs = true;
  });

  $scope.largeCategoryList = [];

  // show large category list
  var showIncomeLargeCategoryList = function () {
    var getIncomeLargeCategoryListPromise = CategoryService.getIncomeLargeCategoryList();
    getIncomeLargeCategoryListPromise.then(function (result) {
      console.log(result);

      $scope.largeCategoryList = result;

      // hide loading spinner
      $ionicLoading.hide();
    }).catch(function (err) {
      console.log(err);
      // hide loading spinner
      $ionicLoading.hide();
      throw err;
    });
  };

  // show loading spinner
  $ionicLoading.show({
    //noBackdrop: true,
    template: 'Loading...'
  });

  // show expense large and small category list
  showIncomeLargeCategoryList();
});

myapp.controller('ExpenseCategoryListCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, CategoryService) {
  // before enter view event
  $scope.$on('$ionicView.beforeEnter', function () {
    $rootScope.hideTabs = true;
  });

  $scope.largeCategoryWithSmallCategoriesList = [];

  // show large and small category list
  var showExpenseLargeAndSmallCategoryList = function () {
    var getExpenseLargeAndSmallCategoryListPromise = CategoryService.getExpenseLargeWithSmallCategoryList();
    getExpenseLargeAndSmallCategoryListPromise.then(function (result) {
      console.log(result);

      $scope.largeCategoryWithSmallCategoriesList = result;

      // hide loading spinner
      $ionicLoading.hide();
    }).catch(function (err) {
      console.log(err);
      // hide loading spinner
      $ionicLoading.hide();
      throw err;
    });
  };

  // show loading spinner
  $ionicLoading.show({
    //noBackdrop: true,
    template: 'Loading...'
  });

  // show expense large and small category list
  showExpenseLargeAndSmallCategoryList();

});
