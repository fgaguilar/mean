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
	console.log("Ingreso a NavCtrl");
	$scope.logout = function(){
		console.log("LOGOUT");
		$http.get('/logout')
		.success(function(){
			$rootScope.currentUser = null;
			$location.url('/home');
		});
	}
}])