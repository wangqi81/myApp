// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var appVersion = "0.0.0";

var myApp = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngMessages'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }
      cordova.getAppVersion(function(version) {
        appVersion = version;
      });
    });
  })

  .config(function($ionicConfigProvider) {
    // Android defaults to top and iOS defaults to bottom
    $ionicConfigProvider.tabs.position('bottom');

    // Android defaults to left and IOS defaults to center
    $ionicConfigProvider.navBar.alignTitle('center');
  })

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:
      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl'
          }
        }
      })
      .state('tab.slides', {
        url: '/slides',
        views: {
          'tab-slides': {
            templateUrl: 'templates/tab-slides.html',
            controller: 'SlidesCtrl'
          }
        }
      })
      .state('tab.favorites', {
        url: '/favorites',
        views: {
          'tab-favorites': {
            templateUrl: 'templates/tab-favorites.html',
            controller: 'FavoritesCtrl'
          }
        }
      })
      .state('tab.chats', {
        url: '/chats',
        views: {
          'tab-chats': {
            templateUrl: 'templates/tab-chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })
      .state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
          'tab-chats': {
            templateUrl: 'templates/chat-detail.html',
            controller: 'ChatDetailCtrl'
          }
        }
      })
      .state('tab.account', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'AccountCtrl'
          }
        }
      })
      .state('tab.myAccount', {
        url: '/myAccount',
        views: {
          'tab-myAccount': {
            templateUrl: 'templates/tab-myAccount.html',
            controller: 'MyAccountCtrl'
          }
        }
      })

      .state('tab.auth', {
        url: '/auth',
        views: {
          'tab-myAccount': {
            templateUrl: 'templates/auth.html',
            controller: 'AuthCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');
    //$urlRouterProvider.otherwise('/auth');

  });
