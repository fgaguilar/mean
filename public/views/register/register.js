app.controller('RegisterCtrl', ['$scope','$http','$rootScope', function ($scope,$http,$rootScope) {
	$scope.register = function(user,rol){
		console.log(rol);
		if (rol.admin==true) {
			console.log("Se marco ADMIN a TRUE");
			user.roles=['admin'];
		}
		if (rol.student==true) {
			console.log("Se marco STUDENT a TRUE");
			user.roles=['student'];
		}
		if ((rol.admin==true)&&((rol.student==true))) {
			console.log("Se marco ADMIN y STUDENT a TRUE");
			user.roles=['admin','student'];
		}
		if(user.password==user.password2){
			$http.post('/register', user)
			.success(function(user){
				$rootScope.currentUser = user;
				console.log(user);
			});
		}		
	}
}]);