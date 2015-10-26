var myapp = angular.module('starter.services', []);

myapp.factory('FavoritesService', function () {
  // Might use a resource here that returns a JSON array

  // Some testing data
  var items = [];
  for (var i = 0; i < 100; i++) {
    var item = {};

    item.imgURL = './img/ionic.png';
    item.title = 'news' + (i + 1);
    item.content = 'news content' + (i + 1);

    items.push(item);
  }

  var pageNumber = 0;
  var hasMoreItems = true;
  return {
    getMoreItems: function () {
      console.log('[Service Favorites getMoreItems] Start');
      if (pageNumber === 10) {
        hasMoreItems = false;
        return [];
      }
      pageNumber = pageNumber + 1;
      console.log("[Service Favorites getMoreItems] pageNumber:" + pageNumber);
      return items.slice((pageNumber - 1) * 10, pageNumber * 10);
    },
    hasMoreItems: function () {
      return hasMoreItems;
    }
  };
});

myapp.factory('Chats', function () {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function () {
      return chats;
    },
    remove: function (chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function (chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});

myapp.factory('AuthService', function ($q) {
  var _db;

  // We'll need this later.
  var _users;
  var _loginFlg = false;

  return {
    initDB: initDB,

    // We'll add these later.
    getAllUsers: getAllUsers,
    addUser: addUser,
    validUser: validUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getLoginFlg: getLoginFlg,
    setLoginFlg: setLoginFlg
  };

  function initDB() {
    // Creates the database or opens if it already exists
    _db = new PouchDB('users', {adapter: 'websql'});
    addUser({username: 'admin', password: 'admin'});
  }

  function addUser(user) {
    return $q.when(_db.post(user));
  }

  function validUser(user) {
    _loginFlg = false;
    angular.forEach(_users, function (tmpUser) {
      if (user.username === tmpUser.username && user.password === tmpUser.password) {
        _loginFlg = true;
      }
    });
    return getLoginFlg();
  }

  function getLoginFlg() {
    return _loginFlg;
  }

  function setLoginFlg(loginFlg) {
    _loginFlg = loginFlg;
    return _loginFlg
  }

  function updateUser(user) {
    return $q.when(_db.put(user));
  }

  function deleteUser(user) {
    return $q.when(_db.remove(user));
  }

  function getAllUsers() {
    if (!_users) {
      return $q.when(_db.allDocs({include_docs: true}))
        .then(function (docs) {

          // Each row has a .doc object and we just want to send an
          // array of user objects back to the calling controller,
          // so let's map the array to contain just the .doc objects.
          _users = docs.rows.map(function (row) {
            // Dates are not automatically converted from a string.
            row.doc.Date = new Date(row.doc.Date);
            return row.doc;
          });

          // Listen for changes on the database.
          _db.changes({live: true, since: 'now', include_docs: true})
            .on('change', onDatabaseChange);

          return _users;
        });
    } else {
      // Return cached data as a promise
      return $q.when(_users);
    }
  }

  // This function allows you to update the _birthdays array whenever there is a change on your database.
  function onDatabaseChange(change) {
    var index = findIndex(_users, change.id);
    var user = _users[index];

    if (change.deleted) {
      if (user) {
        _users.splice(index, 1); // delete
      }
    } else {
      if (user && user._id === change.id) {
        _users[index] = change.doc; // update
      } else {
        _users.splice(index, 0, change.doc); // insert
      }
    }
  }

  // Binary search, the array is by default sorted by _id.
  function findIndex(array, id) {
    var low = 0, high = array.length, mid;
    while (low < high) {
      mid = (low + high) >>> 1;
      array[mid]._id < id ? low = mid + 1 : high = mid
    }
    return low;
  }
});

myapp.factory('CategoryService', function ($q) {
  var local_db_name = 'FamilyMoneyTracker';
  var remote_db_name = 'http://localhost:5984/FamilyMoneyTracker';

  //PouchDB.debug.enable('*');

  var local_db = new PouchDB(local_db_name);
  var remote_db = new PouchDB(remote_db_name);

  //local_db.sync(remote_db, {live: true});

  return {
    initialCategory: initialCategory,
    getExpenseLargeAndSmallCategoryList: getExpenseLargeAndSmallCategoryList,
    getExpenseLargeCategoryList: getExpenseLargeCategoryList

    // We'll add these later.
    //getAllUsers: getAllUsers,
    //addUser: addUser,
    //validUser: validUser,
    //updateUser: updateUser,
    //deleteUser: deleteUser,
    //getLoginFlg: getLoginFlg,
    //setLoginFlg: setLoginFlg
  };

  function getExpenseLargeAndSmallCategoryList() {
    console.log('[Service CategoryService getLargeAndSmallCategoryList] start');

    return local_db.query('categoryDoc/expense_category_large_small').then(function (response) {
      var largeCategory = response.rows.map(function (response) {
        return response.value;
      });
      return $q.when(largeCategory);
    }).then(function (results) {
      console.log('[Service CategoryService getLargeAndSmallCategoryList]get large and small category list Success.');
      return $q.when(results);
    }).catch(function (err) {
      console.log('[Service CategoryService getLargeAndSmallCategoryList]get large and small category list Error.');
      console.log(err);
      return $q.when('');
    });
  }

  function getExpenseLargeCategoryList() {
    console.log('[Service CategoryService getExpenseLargeCategoryList] start');

    return local_db.query('categoryDoc/expense_category_large').then(function (response) {
      var largeCategory = response.rows.map(function (response) {
        return response.value;
      });
      return $q.when(largeCategory);
    }).then(function (results) {
      console.log('[Service CategoryService getExpenseLargeCategoryList]get large category list Success.');
      return $q.when(results);
    }).catch(function (err) {
      console.log('[Service CategoryService getExpenseLargeCategoryList]get large category list Error.');
      console.log(err);
      return $q.when('');
    });
  }

  function initialCategory() {
    // delete large category data
    return deleteLargeCategoryRecords().then(function () {
      // delete category design doc
      return deleteCategoryDesignDoc();
    }).then(function () {
      // initialize category data
      return initializeCategoryData();
    }).then(function () {
      // add category design doc
      return createCategoryDesignDoc();
    }).catch(function (err) {
      console.log(err);
      throw err;
    });
  }

  /**
   * Expense Large Category:
   *   id: 100, 101, 102
   *   expense_or_income: Expense
   *
   * Expense Small Category:
   *   id:
   *   large_category_id: 100
   *
   * Income Large Category:
   *   id: 200, 201, 202
   *   expense_or_income: Income
   *
   * Income Small Category:
   *   id:
   *   large_category_id: 100
   *
   *
   * @returns {promise}
   */
  function initializeCategoryData() {
    console.log('[Service CategoryService initializeCategoryData] start');

    var initialExpenseLargeCategoryNameArray = ['餐饮', '交通', '购物', '娱乐', '医教', '居家', '投资', '人情', '生意'];
    var initialExpenseSmallCategoryNameArrayObject = {
      '餐饮': ["早餐", "午餐", "晚餐", "饮料水果", "零食", "买菜原料", "夜宵", "油盐酱醋", "餐饮其他"],
      '交通': ["打车", "公交", "加油", "停车费", "地铁", "火车", "长途汽车", "过路过桥", "保养维修", "飞机", "车款车贷", "罚款赔偿", "车险", "自行车", "船舶", "驾照费用", "交通其他"]
    };

    var expenseCategoryDocArray = [];

    angular.forEach(initialExpenseLargeCategoryNameArray, function (value, i) {
      var expenseLargeCategoryDoc = getExpenseLargeCategorySchema();

      expenseLargeCategoryDoc.id = (100 + i) + '';
      expenseLargeCategoryDoc.name = value;
      expenseLargeCategoryDoc.order = expenseLargeCategoryDoc.id;

      // sort by type, large category order, large category id
      expenseLargeCategoryDoc._id = pouchCollate.toIndexableString([expenseLargeCategoryDoc.type, expenseLargeCategoryDoc.id]);
      expenseCategoryDocArray.push(expenseLargeCategoryDoc);

      var initialExpenseSmallCategoryNameArray = initialExpenseSmallCategoryNameArrayObject[value];
      if (initialExpenseSmallCategoryNameArray) {
        angular.forEach(initialExpenseSmallCategoryNameArray, function (initialExpenseSmallCategoryName, j) {
          var expenseSmallCategoryDoc = getExpenseSmallCategorySchema();

          expenseSmallCategoryDoc.large_category_id = expenseLargeCategoryDoc._id;
          expenseSmallCategoryDoc.id = ('00' + j).slice(-2);
          expenseSmallCategoryDoc.name = initialExpenseSmallCategoryName;
          expenseSmallCategoryDoc.order = expenseSmallCategoryDoc.id;

          // sort by type, large category order, large category id
          expenseSmallCategoryDoc._id = pouchCollate.toIndexableString([expenseSmallCategoryDoc.type, expenseSmallCategoryDoc.id]);
          expenseCategoryDocArray.push(expenseSmallCategoryDoc);
        });
      }

    });

    return local_db.bulkDocs(expenseCategoryDocArray).then(function (results) {
      console.log('[Service CategoryService initializeCategoryData] bulkDocs finished');
    }).catch(function () {
      console.log(err);
      throw err;
    });

  }

  function getExpenseLargeCategorySchema() {
    var expenseLargeCategorySchema = {
      'type': 'expense_category_large',
      '_id': '',
      'id': '',
      'name': '',
      'order': '',
      'create_user': '',
      'create_date': new Date().toJSON(),
      'update_user': '',
      'update_date': ''
    };

    return expenseLargeCategorySchema;
  }

  function getExpenseSmallCategorySchema() {
    var expenseSmallCategorySchema = {
      'type': 'expense_category_small',
      '_id': '',
      'large_category_id': '',
      'id': '',
      'name': '',
      'order': '',
      'create_user': '',
      'create_date': new Date().toJSON(),
      'update_user': '',
      'update_date': ''
    };

    return expenseSmallCategorySchema;
  }

  function createCategoryDesignDoc() {
    console.log('[Service CategoryService createCategoryDesignDoc] start');
    // create a design doc
    var designDocCategory = {
      _id: '_design/categoryDoc',
      views: {
        'expense_category_large': {
          map: function (doc) {
            if (doc.type === 'expense_category_large') {
              emit([doc._id], doc);
            }
          }.toString()
        },
        'expense_category_small': {
          map: function (doc) {
            if (doc.type === 'expense_category_small') {
              emit([doc._id], doc);
            }
          }.toString()
        },
        'expense_category_large_small': {
          map: function (doc) {
            if (doc.type === 'expense_category_large') {
              emit([doc._id, 0, doc.order], doc);
            } else if (doc.type === 'expense_category_small') {
              emit([doc.large_category_id, 1, doc.order], doc);
            }
          }.toString()
        }
      }
    };

    return local_db.put(designDocCategory).then(function () {
      console.log('[Service CategoryService createCategoryDesignDoc]createCategoryDesignDoc finished.');
    }).catch(function (err) {
      console.log(err);
      throw err;
    });
  }

  function deleteCategoryDesignDoc() {
    console.log('[Service CategoryService deleteCategoryDesignDoc] start');

    return local_db.get('_design/categoryDoc').then(function (doc) {
      return local_db.remove(doc);
    }).then(function (result) {
      console.log('[Service CategoryService deleteCategoryDesignDoc]remove design doc finished.');
      console.log(result);
    }).catch(function (err) {
      console.log(err);
      return $q.when('');
    });
  }

  function deleteLargeCategoryRecords() {
    console.log('[Service CategoryService deleteLargeCategoryRecords] start');

    return local_db.query('categoryDoc/expense_category_large_small').then(function (response) {
      return Promise.all(response.rows.map(function (row) {
        return local_db.remove(row.value);
      }));
    }).then(function (results) {
      console.log('[Service CategoryService deleteLargeCategoryRecords]remove all category_large view recoreds finished');
    }).catch(function (err) {
      console.log(err);
      return $q.when('');
    });
  }

});
