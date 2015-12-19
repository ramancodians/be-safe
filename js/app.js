// init angular -> <body ng-app="app-name">
var app = angular.module('app', ['ui.router', 'firebase']);


// Routes CONFIG
app.config(function ($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/login");
    //
    // Now set up the states
    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "pages/login.html"
        })
        .state('dashboard', {
            url: "/dashboard",
            templateUrl : 'pages/dashboard.html'
        })
        //Logged template
        .state('dashboard.home', {
            url: "/home",
            templateUrl: "pages/logged/home.html"
        })
        .state('dashboard.forum', {
            url: "/forum",
            templateUrl: "pages/logged/forum.html"
        })
        .state('dashboard.organisations', {
            url: "/organisations",
            templateUrl: "pages/logged/organisations.html"
        })
        // Logged Temp

    .state('registration', {
        url: "/registration",
        templateUrl: "pages/registration.html"
    });
});




//SERVICES
app.factory('Auth', function ($firebaseArray, $firebaseAuth) {
    var url = "https://be-safe.firebaseio.com";

    var ref = new Firebase(url);
    return $firebaseAuth(ref);

});


// SIDENAV CONTROLLERS
// later convert it to Directive
app.controller('SidenavCtrl', function ($scope) {
    $scope.sidenavToggle = false;
});

// EMERGENCY CONTROLLER
app.controller('EmergencyCtrl', function ($scope) {
    $scope.cardDropDownToggle = false;

});

//LOGIN CONTROLLER
app.controller('LoginCtrl', function ($scope, Auth) {
    // debuging
    console.log("Login Page");
    //login with email and password
    $scope.login = function () {
            //calling firebase Auth
            Auth.$authWithPassword({
                email: $scope.email,
                password: $scope.magicWord
            }).then(function (AuthData) {
                //success
                console.log(AuthData);
            }).catch(function (error) {
                // failed
                console.log(error);
            });
        } // login function
});


//Registration Ctrl

app.controller('RegistrationCtrl', function ($scope, Auth) {
    console.log("Registration Page");
    $scope.register = function () {
        Auth.$createUser({
            email: $scope.email,
            name: $scope.userName,
            password: $scope.magicWord
        }).then(function (userData) {
            //user created
            console.log(userData);
        }).catch(function (error) {
            // failed
            console.log(error);
        });
    }

});



//FILTERS