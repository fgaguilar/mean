app.controller('LoginCtrl', ['$scope','$http', '$rootScope','$location', function ($scope,$http,$rootScope,$location) {
	$scope.login = function(user){
		console.log(user);
		$http.post('/login', user)
		.success(function(user){
			console.log(user);
			$rootScope.currentUser = user;
			$location.url('/profile');
		});
	}
}]);

app.controller('NavCtrl', ['$scope', '$http','$location','$rootScope', function ($scope,$http,$location,$rootScope) {
	$scope.logout = function(){
		$http.post('/logout')
		.success(function(){
			$rootScope.currentUser = null;
			$location.url('/home');
		});
	}
}])