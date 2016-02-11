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

 // Take picture and upload picture
  $ionicPlatform.ready(function() {
        var options = {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 100,
          targetHeight: 100,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };
        $scope.takePicture = function() {
          $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
          }, function (err) {
            console.log(err);
          });

          $scope.registerform.show();
        };

          var optionsSel = {
            maximumImagesCount: 1,
            width: 100,
            height: 100,
            quality: 50
          };
          $scope.selectPicture = function() {
            $cordovaImagePicker.getPictures(optionsSel).then(function (results) {
              for (var i = 0; i < results.length; i++) {
                console.log('Image URI: ' + results[i]);
                $scope.registration.imgSrc = results[i];
              }
            }, function (error) {
              console.log(error);
            });

            $scope.registerform.show();
          };

      });
