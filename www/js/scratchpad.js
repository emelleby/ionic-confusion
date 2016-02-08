 .factory('favoriteFactory', ['$resource', '$localStorage', function ($resource, $localStorage) {
    var favFac = {};
    var favorites = [];

    favFac.addToFavorites = function (index) {
      for (var i = 0; i < favorites.length; i++) {
        if (favorites[i].id == index)
          return;
      }
      favorites.push({id: index});
      $localStorage.storeObject('favorites', favorites);
    };

    favFac.deleteFromFavorites = function (index) {
      for (var i = 0; i < favorites.length; i++) {
        if (favorites[i].id == index) {
          favorites.splice(i, 1);
        }
      }
      $localStorage.storeObject('favorites', favorites);
    };

    favFac.getFavorites = function () {
      if (favorites.length == 0) {
        favorites = $localStorage.getObject('favorites', []);
      }
      return favorites;
    };

    return favFac;
  }])

  .factory('$localStorage', ['$window', function ($window) {
    return {
      store: function (key, value) { $window.localStorage[key] = value; },
      get: function (key, defaultValue) { return $window.localStorage[key] || defaultValue; },
      storeObject: function (key, value) { $window.localStorage[key] = JSON.stringify(value); },
      getObject: function (key, defaultValue) {
        var returnValue = $window.localStorage[key];
        if (returnValue == undefined) {
          returnValue = defaultValue;
        } else {
          returnValue = JSON.parse(returnValue);
        }
        return returnValue; //JSON.parse($window.localStorage[key] || defaultValue);
      }
    }
  }])
