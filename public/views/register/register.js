app.controller('RegisterCtrl', ['$scope','$http','$rootScope','$location', function ($scope,$http,$rootScope,$location) {
	console.log($scope);
	$scope.register = function(user,rol){
		console.log(rol);
		if (rol.admin==true) {
			console.log("Se marco ADMIN a TRUE");
			user.roles=['admin'];
		}
		if (rol.operador1==true) {
			console.log("Se marco OPERADOR1 a TRUE");
			user.roles=['operador1'];
		}
		if (rol.operador2==true) {
			console.log("Se marco OPERADOR2 a TRUE");
			user.roles=['operador2'];
		}
		if ((rol.operador1==true)&&(rol.operador2==true)) {
			console.log("Se marco OPERADOR1 y 2 a TRUE");
			user.roles=['operador1','operador2'];
		}
		if ((rol.admin==true)&&(rol.operador1==true)) {
			console.log("Se marco ADMIN y OPERADOR1 a TRUE");
			user.roles=['admin','operador1'];
		}
		if ((rol.admin==true)&&(rol.operador2==true)) {
			console.log("Se marco ADMIN y OPERADOR2 a TRUE");
			user.roles=['admin','operador2'];
		}

		if ((rol.admin==true)&&(rol.operador1==true)&&(rol.operador2==true)) {
			console.log("Se marco ADMIN, OPERADOR1 y OPERADOR2 a TRUE");
			user.roles=['admin','operador1','operador2'];
		}
		if(user.password==user.password2){
			$http.post('/register', user)
			.success(function(user){
				$rootScope.currentUser = user;
				console.log("Grabo");
				$location.url('/home');
				//console.log(user);
			});
		}
		else {
			alert("Contraseñas no iguales");
		}
	}
}]);