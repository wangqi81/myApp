myapp.controller('IncomeCatagoryListCtrl', function ($scope, $rootScope, $ionicLoading, $timeout) {

});

myapp.controller('ExpenseCatagoryListCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, CategoryService) {
  $scope.largeCategoryList = [];

  // show loading spinner
  $ionicLoading.show({
    noBackdrop: true,
    template: 'Loading...'
  });

  var getLargeCategoryPromise = CategoryService.getLargeCategoryList();
  getLargeCategoryPromise.then(function (result) {
    console.log(result);

    $scope.largeCategoryList = result;
    console.log($scope.largeCategoryList);

    // hide loading spinner
    $ionicLoading.hide();
  }).catch(function (err) {
    console.log(err);
    // hide loading spinner
    $ionicLoading.hide();
    throw err;
  });

  // category initialize button click
  $scope.initialCategory = function () {
    // show loading spinner
    $ionicLoading.show({
      noBackdrop: true,
      template: 'Loading...'
    });

    CategoryService.initialCategory().then(function () {
      var getLargeCategoryPromise = CategoryService.getLargeCategoryList();

      return getLargeCategoryPromise;
    }).then(function (result) {
      console.log(result);

      $scope.largeCategoryList = result;
      console.log($scope.largeCategoryList);

      // hide loading spinner
      $ionicLoading.hide();
    }).catch(function (err) {
      console.log(err);
      // hide loading spinner
      $ionicLoading.hide();
      throw err;
    });
  }
});
