myapp.controller('TransactionRecordCtrl', function ($scope, $rootScope, $ionicLoading, $timeout) {
  $scope.saveTransaction = function(transactionRecord) {
    console.log(transactionRecord);
    alert('待续．．．');
  }
});
