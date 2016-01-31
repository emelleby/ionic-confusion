angular.module('conFusion.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//$scope.$on('$ionicView.enter', function(e) {
	//});

	// Form data for the login modal
	$scope.loginData = {};

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('templates/login.html', {
		scope: $scope
	}).then(function (modal) {
		$scope.modal = modal;
	});

	// Triggered in the login modal to close it
	$scope.closeLogin = function () {
		$scope.modal.hide();
	};

	// Open the login modal
	$scope.login = function () {
		$scope.modal.show();
	};

	// Perform the login action when the user submits the login form
	$scope.doLogin = function () {
		console.log('Doing login', $scope.loginData);

		// Simulate a login delay. Remove this and replace with your login
		// code if using a login system
		$timeout(function () {
			$scope.closeLogin();
		}, 1000);
	};

	// Object to hold the reservation data
	$scope.reservation = {};

	// Create the reserve modal that we will use later
	$ionicModal.fromTemplateUrl('templates/reserve.html', {
		scope: $scope
	}).then(function (modal) {
		$scope.reserveform = modal;
	});

	// Triggered in the reserve modal to close it
	$scope.closeReserve = function () {
		$scope.reserveform.hide();
	};

	// Open the reserve modal
	$scope.reserve = function () {
		$scope.reserveform.show();
	};

	// Perform the reserve action when the user submits the reserve form
	$scope.doReserve = function () {
		console.log('Doing reservation', $scope.reservation);

		// Simulate a reservation delay. Remove this and replace with your reservation
		// code if using a server system
		$timeout(function () {
			$scope.closeReserve();
		}, 1000);
	};

})

.controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate',
							   function ($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate) {

	$scope.baseURL = baseURL;
	$scope.tab = 1;
	$scope.filtText = '';
	$scope.showDetails = false;
	$scope.showMenu = false;
	$scope.message = "Loading ...";

	menuFactory.query(
		function(response) {
			$scope.dishes = response;
			$scope.showMenu = true;
		},
		function(response) {
			$scope.message = "Error: "+response.status + " " + response.statusText;
		});


	$scope.select = function(setTab) {
		$scope.tab = setTab;

		if (setTab === 2) {
			$scope.filtText = "appetizer";
		}
		else if (setTab === 3) {
			$scope.filtText = "mains";
		}
		else if (setTab === 4) {
			$scope.filtText = "dessert";
		}

		// Filter for favorites
		else if (setTab === 5) {
			$scope.filtText = "";

		}
		else {
			$scope.filtText = "";
		}
	};

	$scope.isSelected = function (checkTab) {
		return ($scope.tab === checkTab);
	};

	$scope.toggleDetails = function() {
		$scope.showDetails = !$scope.showDetails;
	};

// $scope.favorites = favoriteFactory.getFavorites();

	// Add the dish to favorites via favoriteFactory
    $scope.addFavorite = function (index) {
        console.log("index is " + index);

        favoriteFactory.addToFavorites(index);
        $ionicListDelegate.closeOptionButtons();
    }

	/*$scope.favs = favoriteFactory.getFavs();
 $scope.isFavorites = function(id) {
       return $scope.favorites.indexOf({'id': id}) != -1 || false;
   }
	// Returns whether item exists in the list 'favs'
		  $scope.exists = function (item, list) {
		//	favoriteFactory.getFavorites();
console.log($scope.favs);
			return list.indexOf(item) > -1;
		  };

		$scope.objExists = function (arraytosearch, key, valuetosearch) {
			for (var i = 0; i < arraytosearch.length; i++) { // use forEach arraytosearch.length

				if (arraytosearch[i][key] == valuetosearch) {
					return true;
				}
			}
			return false;
		}*/

}])

.controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) {

    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;

    $scope.favorites = favorites;

    $scope.dishes = dishes;

	/*$ionicLoading.show({
		template: '<ion-spinner></ion-spinner> Loading...'
	});*/

console.log($scope.dishes, $scope.favorites);

    $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log($scope.shouldShowDelete);
    }

	// Delete favorites function with an ion popup for confirmation
    $scope.deleteFavorite = function (index) {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Confirm Delete',
			template: 'Are you sure you want to delete this item?'
		});

		confirmPopup.then(function (res) {
			if (res) {
				console.log('Ok to delete');
				favoriteFactory.deleteFromFavorites(index);
			} else {
				console.log('Canceled delete');
			}
		});

		$scope.shouldShowDelete = false;

	}

}])

.controller('ContactController', ['$scope', function($scope) {

	$scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

	var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

	$scope.channels = channels;
	$scope.invalidChannelSelection = false;

}])

.controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {

	$scope.sendFeedback = function() {

		console.log($scope.feedback);

		if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
			$scope.invalidChannelSelection = true;
			console.log('incorrect');
		}
		else {
			$scope.invalidChannelSelection = false;
			feedbackFactory.save($scope.feedback);
			$scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
			$scope.feedback.mychannel="";
			$scope.feedbackForm.$setPristine();
			console.log($scope.feedback);
		}
	};
}])

.controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal', function ($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal) {

    $scope.baseURL = baseURL;

    $scope.dish = dish;

	/*$scope.showDish = false;
	$scope.message="Loading ...";

	$scope.dish = menuFactory.get({id:parseInt($stateParams.id,10)})
	.$promise.then(
					function(response){
						$scope.dish = response;
						$scope.showDish = true;
					},
					function(response) {
						$scope.message = "Error: "+response.status + " " + response.statusText;
					}
	);*/

	// .fromTemplateUrl() method
	$ionicPopover.fromTemplateUrl('./templates/dish-detail-popover.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.popover = popover;
	});
	$scope.openPopover = function($event) {
		$scope.popover.show($event);
	  };
	  $scope.closePopover = function() {
		$scope.popover.hide();
	  };

	// Add the dish to favorites via favoriteFactory
    $scope.addFavorite = function (index) {
        console.log("Added this to favorites: " + index);

        favoriteFactory.addToFavorites(index);
       // Hide the popover?
		$scope.closePopover();
    }

	// Form data for the comment modal
	$scope.myComment = {rating:5, comment:"", author:"", date:""};

	// Create the comment modal
	$ionicModal.fromTemplateUrl('templates/dish-comment.html', {
		scope: $scope
	}).then(function (modal) {
		$scope.modal = modal;
	});

	// Triggered in the comment modal to close it and when submitting
	$scope.closeComment = function () {
		$scope.modal.hide();
	};

	// Open the comment modal
	$scope.addComment = function () {
		$scope.modal.show();
		// Closing the Popover as modal is shown
		$scope.closePopover();
	};

	// Perform the commenting
	$scope.submitComment = function () {

 				//Step 2: This is how you record the date
                $scope.myComment.date = new Date().toISOString();

console.log($scope.myComment);

                // Step 3: Push your comment into the dish's comment array
                $scope.dish.comments.push($scope.myComment);

				// update/PUT comment to server
				menuFactory.update({id:$scope.dish.id},$scope.dish);

                //Step 4: reset your form to pristine
				//$scope.commentForm.$setPristine();

		$scope.myComment = {rating:5, comment:"", author:"", date:""};

		$scope.closeComment();
	};

			// Readonly set to true and can not be changed use it for comment edit
			$scope.isReadonly = true;
			// logging selected value to console only
			$scope.rateFunction = function(rating) {
console.log('Rating selected: ' + rating);
			};


}])

.controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {

	$scope.myComment = {rating:5, comment:"", author:"", date:""};

	$scope.submitComment = function () {

 				//Step 2: This is how you record the date
                $scope.myComment.date = new Date().toISOString();

console.log($scope.myComment);

                // Step 3: Push your comment into the dish's comment array
                $scope.dish.comments.push($scope.myComment);

				// update/PUT comment to server
				menuFactory.update({id:$scope.dish.id},$scope.dish);

                //Step 4: reset your form to pristine
				$scope.commentForm.$setPristine();


		$scope.myComment = {rating:5, comment:"", author:"", date:""};
	}
}])


.controller('IndexController', ['$scope', 'menuFactory', 'promotionFactory', 'corporateFactory', 'baseURL',
								function ($scope, menuFactory, promotionFactory, corporateFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.leader = corporateFactory.get({ id: 3 });

    $scope.showDish = false;
    $scope.message = "Loading ...";

    $scope.dish = menuFactory.get({
            id: 0
        })
        .$promise.then(
            function (response) {
                $scope.dish = response;
                $scope.showDish = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

    $scope.promotion = promotionFactory.get({
        id: 0
    });

}])

.controller('AboutController', ['$scope', 'corporateFactory', 'baseURL', function($scope, corporateFactory, baseURL) {

	$scope.baseURL = baseURL;
	$scope.leaders = corporateFactory.query();
	console.log($scope.leaders);

}])

// Custom filter for filtering out favorites
.filter('favoriteFilter', function () {
    return function (dishes, favorites) {
        var out = [];
        for (var i = 0; i < favorites.length; i++) {
            for (var j = 0; j < dishes.length; j++) {
                if (dishes[j].id === favorites[i].id)
                    out.push(dishes[j]);
            }
        }
        return out;

    }
});

// Final closing semicolon after last controller
;

// Star rating directive - do not delete.
// Variables in DishDetailController,
angular.module('conFusion').directive('starRating', function () {
	return {
		restrict: 'EA',
		template: '<ul class="star-rating" ng-class="{readonly: readonly}">' +
			'  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
			'    <i class="icon ion-star"></i>' + // or &#9733
			'  </li>' +
			'</ul>',
		scope: {
			ratingValue: '=ngModel',
			max: '=?', // optional (default is 5)
			onRatingSelect: '&?',
			readonly: '=?'
		},

		link: function (scope, element, attributes) {
			if (scope.max === undefined) {
				scope.max = 5;
			}

			function updateStars() {
				scope.stars = [];
				for (var i = 0; i < scope.max; i++) {
					scope.stars.push({
						filled: i < scope.ratingValue
					});
				}
			}

			scope.toggle = function (index) {
				if (scope.readonly === undefined || scope.readonly === false) {
					scope.ratingValue = index + 1;
					scope.onRatingSelect({
						rating: index + 1
					});
				}
			};

			scope.$watch('ratingValue', function (oldValue, newValue) {
				if (newValue) {
					updateStars();
				}
			});
		}
	};
});



