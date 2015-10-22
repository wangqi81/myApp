myapp.controller('IncomeCatagoryListCtrl', function ($scope, $rootScope, $ionicLoading, $timeout) {

});

myapp.controller('ExpenseCatagoryListCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, CategoryService) {

  $scope.initialCatagory = function() {
    CategoryService.initialCategory();
  }
});
