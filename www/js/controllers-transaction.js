myapp.controller('TransactionRecordCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, CategoryService, $ionicSlideBoxDelegate) {
  $scope.largeCategoryWithSmallCategoriesList = [];

  $scope.transactionRecord = {};
  $scope.transactionRecord.date = new Date();

  $scope.saveTransaction = function () {
    console.log($scope.transactionRecord);
    alert('待续．．．');
  };


  // show large and small category list
  var showExpenseLargeAndSmallCategoryList = function () {
    var getExpenseLargeAndSmallCategoryListPromise = CategoryService.getExpenseLargeWithSmallCategoryList();
    getExpenseLargeAndSmallCategoryListPromise.then(function (result) {
      console.log(result);

      $scope.largeCategoryWithSmallCategoriesList = result;
      $ionicSlideBoxDelegate.update();

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
