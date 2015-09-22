angular.module('starter.services', [])

  .factory('Favorites', function () {
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
      getHasMoreItems: function() {
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
  });
