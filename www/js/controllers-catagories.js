myapp.controller('IncomeCategoryListCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, CategoryService) {
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
  $scope.largeCategoryWithSmallCategoriesList = [];

  // show large and small category list
  var showExpenseLargeAndSmallCategoryList = function () {
    var getExpenseLargeAndSmallCategoryListPromise = CategoryService.getExpenseLargeAndSmallCategoryList();
    getExpenseLargeAndSmallCategoryListPromise.then(function (result) {
      console.log(result);

      var largeAndSmallCategoryList = result;
      console.log(largeAndSmallCategoryList);

      var largeCategoryWithSmallCategoriesList = [];
      var smallCategoryCntInLargeCategory = 0;
      var largeCategoryWithSmallCategories = {};

      angular.forEach(largeAndSmallCategoryList, function (largeAndSmallCategory, i) {
        // when large category
        if (!largeAndSmallCategory.large_category_id) {
          if (i !== 0) {
            largeCategoryWithSmallCategoriesList.push(largeCategoryWithSmallCategories);
          }
          largeCategoryWithSmallCategories = largeAndSmallCategory;
          largeCategoryWithSmallCategories.small_categories = [];
        } else {
          largeCategoryWithSmallCategories.small_categories.push(largeAndSmallCategory);
        }

        if (i === largeAndSmallCategoryList.length - 1) {
          largeCategoryWithSmallCategoriesList.push(largeCategoryWithSmallCategories);
        }

      });

      $scope.largeCategoryWithSmallCategoriesList = largeCategoryWithSmallCategoriesList;

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
