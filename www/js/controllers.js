'use strict';

angular.module('conFusion.controllers', [])

	.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker) {

		// With the new view caching in Ionic, Controllers are only called
		// when they are recreated or on app start, instead of every page change.
		// To listen for when this page is active (for example, to refresh data),
		// listen for the $ionicView.enter event:
		//$scope.$on('$ionicView.enter', function(e) {
		//});

		// Form data for the login modal
		$scope.loginData = $localStorage.getObject('userinfo','{}');

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
			$localStorage.storeObject('userinfo', $scope.loginData);

			// Simulate a login delay. Remove this and replace with your login
			// code if using a login system
			$timeout(function () {
				$scope.closeLogin();
			}, 1000);
		};

		// Form data for the register modal
		$scope.registration = {};

	    // Create the registration modal that we will use later
		$ionicModal.fromTemplateUrl('templates/register.html', {
			scope: $scope
		}).then(function (modal) {
			$scope.registerform = modal;
		});

		// Triggered in the registration modal to close it
		$scope.closeRegister = function () {
			$scope.registerform.hide();
		};

		// Open the registration modal
		$scope.register = function () {
			$scope.registerform.show();
		};

		// Perform the registration action when the user submits the registration form
		$scope.doRegister = function () {
			console.log('Doing registration', $scope.registration);

			// Simulate a registration delay. Remove this and replace with your registration
			// code if using a registration system
			$timeout(function () {
				$scope.closeRegister();
			}, 1000);
		};


	    $ionicPlatform.ready(function() {
			var options = {
				quality: 80,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 100,
				targetHeight: 100,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false,

				// For use with ImagePicker
				/*maximumImagesCount: 1,
   				width: 60,
				height: 0*/
				};
			var options2 = {
				// For use with $cordovaCamera
				destinationType: Camera.DestinationType.FILE_URI,
      			sourceType: Camera.PictureSourceType.CAMERA,
				width: 100
				};

			// Picture from camera
			 $scope.takePicture = function() {

				 var options = {
				quality: 80,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 100,
				targetHeight: 100,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false,
				};

				$cordovaCamera.getPicture(options).then(function(imageData) {
					$scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
					}, function(err) {
						console.log(err);
				});

				$scope.registerform.show();

			}
			 // cordovaCamera working fine on test.
			/* $scope.getPicture = function () {
                  var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 100,
                    targetHeight: 100,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };

                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
						}, function (err) {
							// An error occured. Show a message to the user
							console.log(err);
                    });*/



			// Picture from gallery with ImagePicker
			$scope.getPicture = function() {

				// For use with ImagePicker
				var options = {
					maximumImagesCount: 1,
					width: 100,
					height: 100
				};

				$cordovaImagePicker.getPictures(options).then(function(results) {

					// Loop through acquired images
					for (var i = 0; i < results.length; i++) {
						$scope.registration.imgSrc = results[i];   // We loading only one image so we can use it like this

						// cordova plugin add https://github.com/hazemhagrass/phonegap-base64
						window.plugins.Base64.encodeFile($scope.registration.imgSrc, function(base64){  // Encode URI to Base64 needed for contacts plugin
							$scope.registration.imgSrc = base64;
						});
					}

					console.log('Image URI: ' + results);
				}, function(err) {
					console.log(err);
				});

				$scope.registerform.show();

			}
		});

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

	.controller('MenuController', ['$scope', 'dishes', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
								   function ($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

		$scope.baseURL = baseURL;
		$scope.tab = 1;
		$scope.filtText = '';
		$scope.showDetails = false;
		$scope.showMenu = false;
		$scope.message = "Loading ...";

		$scope.dishes = dishes;


		/*menuFactory.query(
			function(response) {
				$scope.dishes = response;
				$scope.showMenu = true;
			},
			function(response) {
				$scope.message = "Error: "+response.status + " " + response.statusText;
			});*/


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

			$ionicPlatform.ready(function () {
                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: "Added Favorite",
                    text: $scope.dishes[index].name
                }).then(function () {
                    console.log('Added Favorite '+$scope.dishes[index].name);
                },
                function () {
                    console.log('Failed to add Notification ');
                });

                $cordovaToast
                  .show('Added Favorite '+$scope.dishes[index].name, 'long', 'center')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });
        	});
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

	.controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup',
										function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $cordovaVibration) {

		$scope.baseURL = baseURL;
		$scope.shouldShowDelete = false;

		$scope.favorites = favorites;

		$scope.dishes = dishes;

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
					navigator.vibrate(2000);
				} else {
					console.log('Canceled delete');
				}
			});

			$scope.shouldShowDelete = false;

		}

	}])

	.controller('ContactController', ['$scope', '$cordovaGeolocation', '$ionicLoading', '$ionicPlatform', function($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform) {

/*		$scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

		var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

		$scope.channels = channels;
		$scope.invalidChannelSelection = false;*/

		// Geolocation for map.
		$ionicPlatform.ready(function() {

        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
        });

        var posOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        };

        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            var lat  = position.coords.latitude;
            var long = position.coords.longitude;

            var myLatlng = new google.maps.LatLng(lat, long);

            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
console.log(myLatlng);
            var map = new google.maps.Map(document.getElementById("map"), mapOptions);

            $scope.map = map;
            $ionicLoading.hide();
console.log($scope.map);
			}, function(err) {
				$ionicLoading.hide();
				console.log(err);
			});
		});

	}])

	.controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory) {

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

	.controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal',
										 '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
										 function ($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

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



// Notification and Toast
			$ionicPlatform.ready(function () {
                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: "Added Favorite",
                    text: $scope.dish.name
                }).then(function () {
                    console.log('Added Favorite ' + $scope.dish.name);
                },
                function () {
                    console.log('Failed to add Notification ');
                });

                $cordovaToast
                  .show('Added Favorite '+$scope.dish.name, 'long', 'bottom')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
					    console.log('Failed to add Toast ');
                  });
        	});

		};

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


	.controller('IndexController', ['$scope', 'menuFactory', 'promotionFactory', 'corporateFactory', 'baseURL', 'promotion', 'leader', 'dish',
									function ($scope, menuFactory, promotionFactory, corporateFactory, baseURL, promotion, leader, dish) {

		$scope.baseURL = baseURL;
		$scope.leader = leader;
		$scope.dish = dish;
		$scope.promotion = promotion;

	   /* $scope.showDish = false;
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
		});*/

	}])

	.controller('AboutController', ['$scope', 'corporateFactory', 'baseURL', 'leaders', function($scope, corporateFactory, baseURL, leaders) {

		$scope.baseURL = baseURL;
		$scope.leaders = leaders;
		console.log($scope.leaders);

	}])

	.controller('MapController', function($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform) {

		$ionicPlatform.ready(function() {

//			function initialize() {

				var site = new google.maps.LatLng(22.40634956, 114.7095184);
				var goal = new google.maps.LatLng(22.30624956, 114.17095184);

				var mapOptions = {
					streetViewControl: true,
					center: site,
					zoom: 18,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
	console.log(mapOptions);

				$ionicLoading.show({
					template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
					});

					var posOptions = {
						enableHighAccuracy: true,
						timeout: 20000,
						maximumAge: 0
					};

				// Get the users position
				$cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
					var lat = position.coords.latitude;
					var long = position.coords.longitude;

					var myLatlng = new google.maps.LatLng(lat, long);

					// Set the mapOptions
					mapOptions.center = myLatlng;
					/*var mapOptions = {
						streetViewControl:true,
						center: myLatlng,
						zoom: 18,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};*/

					/*var map = new google.maps.Map(document.getElementById("map"), mapOptions);

					$scope.map = map;
					$ionicLoading.hide();      */

				}, function (err) {

					$ionicLoading.hide();
					console.log(err);
				});


				// Define the map
				var map = new google.maps.Map(document.getElementById("map"), mapOptions);

				//Marker + infowindow + angularjs compiled ng-click - need for $compile
				/*var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
				var compiled = $compile(contentString)($scope);

				var infowindow = new google.maps.InfoWindow({
				  content: compiled[0]
				});*/

				var marker = new google.maps.Marker({
					position: mapOptions.center,
					map: map,
					title: 'This place (or default Location)'
				});
	console.log(mapOptions.center);
				var goalRoute = new google.maps.Marker({
					position: goal,
					map: map,
					title: 'Restaurant (conFusion)'
				});

				var infowindow = new google.maps.InfoWindow({
					content: "Your Location"
				});

				infowindow.open(map, marker);

				var goalwindow = new google.maps.InfoWindow({
					content: "Restaurant conFusion"
				});

				goalwindow.open(map, goalRoute);

				google.maps.event.addListener(marker, 'click', function () {
					infowindow.open(map, marker);
				});

				$scope.map = map;


				// Get directions from here to there
				var directionsService = new google.maps.DirectionsService();
				var directionsDisplay = new google.maps.DirectionsRenderer();

				var request = {
					origin: mapOptions.center,
					destination: goal,
					travelMode: google.maps.TravelMode.DRIVING
				};
				directionsService.route(request, function (response, status) {
					if (status == google.maps.DirectionsStatus.OK) {
						directionsDisplay.setDirections(response);
					}
				});

				directionsDisplay.setMap(map);

//			}


			// It all starts here really
			// google.maps.event.addDomListener(window, 'load', initialize);

			// Find me if not found already
			$scope.centerOnMe = function () {
				if (!$scope.map) {
					return;
				}

				$scope.loading = $ionicLoading.show({
					content: 'Getting current location...',
					showBackdrop: false
				});
				navigator.geolocation.getCurrentPosition(function (pos) {
					$scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
					$scope.loading.hide();
				}, function (error) {
					alert('Unable to get location: ' + error.message);
				});
			};

			$scope.clickTest = function () {
				alert('Example of info window with ng-click')
			};
		});
	})

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


	// Final closing semicolon after last controller & filter
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



