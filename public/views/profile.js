app.controller('ProfileCtrl', ['$scope', '$http', function ($scope,$http) {
	$http.get('/rest/user')
	.success(function(users){
		$scope.users = users;
	});
}])