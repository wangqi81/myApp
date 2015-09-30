angular.module('starter.services', [])

  .factory('FavoritesService', function () {
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
      getMoreItems: function() {
        console.log('[Service Favorites getMoreItems] Start');
        if (pageNumber === 10) {
          hasMoreItems = false;
          return [];
        }
        pageNumber = pageNumber + 1;
        console.log("[Service Favorites getMoreItems] pageNumber:" + pageNumber);
        return items.slice((pageNumber - 1) * 10, pageNumber * 10);
      },
      hasMoreItems: function() {
        return hasMoreItems;
      }
    };
  })

  .factory('Chats', function () {
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
  })

  .factory('AuthService', function ($q) {
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
      angular.forEach(_users, function(tmpUser) {
        if (user.username === tmpUser.username && user.password === tmpUser.password ) {
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
        return $q.when(_db.allDocs({ include_docs: true}))
          .then(function(docs) {

            // Each row has a .doc object and we just want to send an
            // array of user objects back to the calling controller,
            // so let's map the array to contain just the .doc objects.
            _users = docs.rows.map(function(row) {
              // Dates are not automatically converted from a string.
              row.doc.Date = new Date(row.doc.Date);
              return row.doc;
            });

            // Listen for changes on the database.
            _db.changes({ live: true, since: 'now', include_docs: true})
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
