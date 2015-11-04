myapp.controller('TransactionDashboardCtrl', function ($scope, $rootScope, $state, $ionicLoading, $timeout, CategoryService, $ionicActionSheet) {
  // before enter view event
  $scope.$on('$ionicView.beforeEnter', function () {
    $rootScope.hideTabs = false;
  });

  $scope.goToExpenseRecord = function () {
    $state.go('tab.transactionRecord', {'transactionType': 'Expense'});
  };

  $scope.goToIncomeRecord = function () {
    $state.go('tab.transactionRecord', {'transactionType': 'Income'});
  };

});

myapp.controller('TransactionRecordCtrl', function ($scope, $stateParams, $rootScope, $ionicLoading, $timeout, CategoryService, $ionicActionSheet) {
  console.log($stateParams);
  // before enter view event
  $scope.$on('$ionicView.beforeEnter', function () {
    $rootScope.hideTabs = true;
  });

  var transactionType = $stateParams.transactionType;

  $scope.largeCategoryWithSmallCategoriesList = [];

  $scope.transactionRecord = {
    'transactionType': transactionType,
    'amount': '',
    'selectedLargeCategoryId': '',
    'selectedSmallCategoryId': '',
    'transactionDate': new Date(),
    'canReimburse': false,
    'currency': '',
    'memo': ''
  };

  $scope.viewTitle = '';
  if (transactionType === 'Expense') {
    $scope.viewTitle = '支出';
  } else {
    $scope.viewTitle = '收入';
  }

  var getDefaultCurrencyPromise = CategoryService.getLocalDefaultValueByKey('defaultCurrency');
  getDefaultCurrencyPromise.then(function (result) {
    console.log(result);
    $scope.transactionRecord.currency = result;
    if (!$scope.transactionRecord.currency) {
      $scope.transactionRecord.currency = '人民币';
    }
  }).catch(function (err) {
    console.log(err);
    throw err;
  });

  // show large and small category list
  var showExpenseLargeAndSmallCategoryList = function () {
    var getLargeCategoryWithSmallCategoriesListPromise;
    if (transactionType === 'Expense') {
      getLargeCategoryWithSmallCategoriesListPromise = CategoryService.getExpenseLargeWithSmallCategoryList();
    } else {
      getLargeCategoryWithSmallCategoriesListPromise = CategoryService.getIncomeLargeCategoryList();
    }
    getLargeCategoryWithSmallCategoriesListPromise.then(function (result) {
      console.log(result);

      $scope.largeCategoryWithSmallCategoriesList = result;

      //document.getElementById('amount').focus();
    }).catch(function (err) {
      console.log(err);
      throw err;
    });
  };

  //// change clicked button css class
  $scope.setActive = function (clickedLargeCategoryId) {
    $scope.transactionRecord.selectedLargeCategoryId = clickedLargeCategoryId;
  };
  $scope.isActive = function (clickedLargeCategoryId) {
    return clickedLargeCategoryId === $scope.transactionRecord.selectedLargeCategoryId;
  };

  //// show small categories
  $scope.showSmallCategories = function (largeCategoryWithSmallCategoriesItem) {
    console.log(largeCategoryWithSmallCategoriesItem);

    var smallCategories = largeCategoryWithSmallCategoriesItem.small_categories;
    if (smallCategories && smallCategories.length > 0) {
      var buttonsShow = [];
      buttonsShow.push({'text': largeCategoryWithSmallCategoriesItem.name});
      angular.forEach(smallCategories, function (smallCategory, i) {
        buttonsShow.push({'text': largeCategoryWithSmallCategoriesItem.name + ' - ' + smallCategory.name});
      });

      $ionicActionSheet.show({
        buttons: buttonsShow,
        //titleText: '<strong>OPTIONS</strong>',
        //cancelText: 'Cancel',
        //cancel: function () {
        //  //$ionicListDelegate.closeOptionButtons();
        //},
        buttonClicked: function (index) {
          console.log(index);

          switch (index) {
            case 0:
              $scope.transactionRecord.selectedSmallCategoryId = '';
              break;
            default :
              $scope.transactionRecord.selectedSmallCategoryId = largeCategoryWithSmallCategoriesItem.small_categories[index - 1].id;
              break;
          }
          return true;
        }
      });
    }
  };

  //// show currency list
  $scope.showCurrencyList = function () {
    var buttonsShow = [];
    buttonsShow.push({'text': '人民币'});
    buttonsShow.push({'text': '日元'});

    $ionicActionSheet.show({
      buttons: buttonsShow,
      //titleText: '<strong>OPTIONS</strong>',
      //cancelText: 'Cancel',
      //cancel: function () {
      //  //$ionicListDelegate.closeOptionButtons();
      //},
      buttonClicked: function (index) {
        console.log(index);

        switch (index) {
          case 0:
            $scope.transactionRecord.currency = '人民币';
            break;
          case 1:
            $scope.transactionRecord.currency = '日元';
            break;
          default :
            $scope.transactionRecord.currency = '人民币';
            break;
        }

        var setDefaultCurrencyPromise = CategoryService.setLocalDefaultValue('defaultCurrency', $scope.transactionRecord.currency);
        setDefaultCurrencyPromise.then(function (result) {
          console.log(result);
        }).catch(function (err) {
          console.log(err);
          throw err;
        });

        return true;
      }
    });
  };

  // date picker
  $scope.transactionDatePickerObject = {
    titleLabel: '',  //Optional
    todayLabel: '今天',  //Optional
    closeLabel: '关闭',  //Optional
    setLabel: '设定',  //Optional
    //setButtonType : 'button-assertive',  //Optional
    //todayButtonType : 'button-assertive',  //Optional
    //closeButtonType : 'button-assertive',  //Optional
    inputDate: $scope.transactionRecord.transactionDate,    //Optional
    mondayFirst: true,    //Optional
    //disabledDates: disabledDates, //Optional
    weekDaysList: ['日', '一', '二', '三', '四', '五', '六'],   //Optional
    monthList: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'], //Optional
    templateType: 'popup', //Optional
    //showTodayButton: 'true', //Optional
    //modalHeaderColor: 'bar-positive', //Optional
    //modalFooterColor: 'bar-positive', //Optional
    //from: new Date(2012, 8, 2),   //Optional
    //to: new Date(2018, 8, 25),    //Optional
    callback: function (val) {    //Mandatory
      if (typeof(val) === 'undefined') {
        console.log('No date selected');
      } else {
        console.log('Selected date is : ', val);
        $scope.transactionDatePickerObject.inputDate = val;
        $scope.transactionRecord.transactionDate = val;
      }
    }
  };

  // show expense large and small category list
  showExpenseLargeAndSmallCategoryList();

  $scope.saveTransaction = function () {
    console.log($scope.transactionRecord);
    alert(JSON.stringify($scope.transactionRecord, null, 2));
  };

});
