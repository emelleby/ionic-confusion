'use strict';

angular.module('conFusion.services', ['ngResource'])

	.constant("baseURL","http://192.168.1.101:3000/") // 192.168.1.104 , localhost

	.factory('menuFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

		return $resource(baseURL + "dishes/:id", null, {
			'update': {
				method: 'PUT'
			}
		});

	}])

	.factory('promotionFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

		return $resource(baseURL + "promotions/:id");

	}])

	.factory('corporateFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

		return $resource(baseURL + "leadership/:id");

	}])

	.factory('feedbackFactory', ['$resource', 'baseURL', function($resource,baseURL) {

		return $resource(baseURL+"feedback/:id");

	}])

	.factory('favoriteFactory', ['$resource', 'baseURL', '$localStorage', function ($resource, baseURL, $localStorage) {
		var favFac = {};

		// Get favorites from $localStorage or empty Javascript array
		var favorites = $localStorage.getObject('favorites', '[]');

		// var favs = [];

		favFac.addToFavorites = function (index) {
			for (var i = 0; i < favorites.length; i++) {
				if (favorites[i].id == index)
					return;
			}
			favorites.push({id: index});

			// Save favorites to $localStorage - name is arbitrary
			$localStorage.storeObject('favorites', favorites);

			// Extra array
			// favs.push(index);

// console.log(favs);
console.log(favFac);
		};

		favFac.deleteFromFavorites = function (index) {
			for (var i = 0; i < favorites.length; i++) {
				if (favorites[i].id == index) {
					favorites.splice(i, 1);

					// Update favorites in $localStorage
					$localStorage.storeObject('favorites', favorites);
				}

				// Adding the index to favs
				/*if (favs.indexOf(i)) {
					favs.splice(i, 1);
				}*/
			}
		}

		favFac.getFavorites = function ($localStorage) {
			return favorites;
		};

		// Extra function
		/*favFac.getFavs = function () {
			return favs;
		};*/

		return favFac;
	}])

	.factory('$localStorage', ['$window', function($window) {
	  return {
		store: function(key, value) {
		  $window.localStorage[key] = value;
		},
		get: function(key, defaultValue) {
		  return $window.localStorage[key] || defaultValue;
		},
		storeObject: function(key, value) {
		  $window.localStorage[key] = JSON.stringify(value);
		},
		getObject: function(key,defaultValue) {
		  return JSON.parse($window.localStorage[key] || defaultValue);
		}
	  }
	}])


;
