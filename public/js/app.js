var app = angular.module('Passport', ['ngRoute']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'views/home.html',
		})
		.when('/login', {
			templateUrl: 'views/login/login.html',
			controller: 'LoginCtrl'
		})
		.when('/logout', {
			templateUrl: 'views/home.html',
			controller: 'NavCtrl'
		})		
		.when('/register', {
			templateUrl: 'views/register/register.html',
			controller: 'RegisterCtrl'
		})
		.when('/profile', {
			templateUrl: 'views/profile.html',
			controller: 'ProfileCtrl',
			resolve: {
				loggedin: checkLoggedin
			}
		})
		.otherwise({
			redirectTo: '/home' 
		})
});

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
	var deferred = $q.defer();

	$http.get('/loggedin').success(function(user){
		$rootScope.errorMessage = null;
		// User is Authenticated
		if (user != '0')
		{
			$rootScope.currentUser = user;
			deferred.resolve();
		}
		// User is not Authenticated
		else {
			$rootScope.errorMessage = 'You need to login in';
			deferred.reject();
			$location.url('/login');
		}
	});

	return deferred.promise;
}