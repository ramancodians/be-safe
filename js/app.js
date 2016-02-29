// init angular -> <body ng-app="app-name">
var app = angular.module('app', ['ui.router', 'firebase', 'angularRipple']);


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
            templateUrl: 'pages/dashboard.html'
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
        .state('dashboard.addQuery', {
            url: "/addQuery",
            templateUrl: "pages/logged/addQuery.html"
        })
        .state('dashboard.profile', {
            url: "/profile",
            templateUrl: "pages/logged/profile.html"
        })
        .state('dashboard.search', {
            url: "/search",
            templateUrl: "pages/logged/search.html"
        })
        .state('dashboard.settings', {
            url: "/settings",
            templateUrl: "pages/logged/setting.html"
        })
    .state('dashboard.settings', {
            url: "/settings",
            templateUrl: "pages/logged/settings/import-contacts.html"
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

app.factory('Queries', function ($firebaseArray) {
    var url = "https://be-safe.firebaseio.com/queries";
    var ref = new Firebase(url);
    return $firebaseArray(ref);
});

app.run(function ($rootScope) {
    $rootScope.Title = 'Be Safe';
    $rootScope.SearchIcon = true;
    $rootScope.backBtn = false;
});


// SIDENAV CONTROLLERS
// later convert it to Directive
app.controller('SidenavCtrl', function ($scope) {
    $scope.sidenavToggle = false;
});

app.controller('SettingsCtrl', function ($scope, $rootScope) {
    $rootScope.Title = "Settings"

});

app.controller('DashboardCtrl', function ($scope, $rootScope, Auth) {
    $rootScope.Title = "Settings";
    $rootScope.backBtn = false;
});

app.controller('SearchCtrl', function ($scope, $rootScope,Queries) {
    // hide the search icon from title bar
    $rootScope.SearchIcon = false;
    $rootScope.backBtn = true;

    // set title to search
    $rootScope.Title = "Search";
    $scope.queries = Queries;

    
    $scope.queries.$loaded().then(function () {
        $scope.QueryLoaded = true;
    });
    
});


app.controller('HomeCtrl', function ($scope, $rootScope, Auth, Queries) {
    console.log("Home Page");
    $scope.step2 = false;
    $scope.emer = [1,0,0,0];
    
     $scope.tabHandler = function (i) {
        //find the tab with true and 
        //setting it false
        $scope.emer[$scope.emer.lastIndexOf(true)] = false;
        $scope.emer[i] = true;
         $scope.step2 = true;
         console.log("called with " + i);

    }
    
    //show seach icon
    $rootScope.SearchIcon = true;
    $scope.cardDropDownToggle = false;
    $rootScope.Title = "Home";
    $scope.queries = Queries;
    console.log($scope.queries);

    $scope.queries.$loaded().then(function () {
        $scope.QueryLoaded = true;
    });

    $scope.upVote = function (id) {

    }

});

app.controller('AddQ', function ($scope, $rootScope, Queries) {
    $rootScope.Title = "Add Query";
    $scope.data = Queries;
    $scope.added = false;
    $scope.loading = false;

    $scope.addItem = function () {
        //console.log(data);
        $scope.loading = true;
        $scope.data.$add({
            "question": $scope.questionM,
            "description": $scope.descM,
            "upVote": 0,
            "downVote": 0,
            "username": 'Raman Choudhary',
            "userId": null,
            "type": 'question',
            "media": null
        }).then(function () {
            $scope.loading = false;
            $scope.added = true;
            console.log("data successfully added!");
        });
    }
});

app.controller('ForumCtrl', function ($scope, $rootScope) {
    console.log("Forum Page");
    //show seach icon
    $rootScope.SearchIcon = true;

    $rootScope.Title = "Forum";
});

app.controller('ProfileCtrl', function ($scope, $rootScope) {
    console.log("Profile Page");
    $rootScope.Title = "Username";

});

//LOGIN CONTROLLER
app.controller('LoginCtrl', function ($scope, $location, Auth) {
    // debuging
    console.log("Login Page");

    $scope.loginForm = false;
    $scope.loading = false;

    //login with email and password
    $scope.login = function () {
            //calling firebase Auth
            $scope.loading = true;
            Auth.$authWithPassword({
                email: $scope.email,
                password: $scope.magicWord
            }).then(function (AuthData) {
                //success
                console.log(AuthData);
                $location.path('/dashboard/home');

            }).catch(function (error) {
                // failed
                if (error) {
                    $scope.loading = false;
                    $scope.loginForm = true;
                }
                console.log(error);
            });
        } // login function
}); // LOGIN CTRL *************************************************


//Registration Ctrl
app.controller('RegistrationCtrl', function ($scope, $location, Auth) {
    console.log("Registration Page");
    $scope.register = function () {
        Auth.$createUser({
            email: $scope.email,
            name: $scope.userName,
            password: $scope.magicWord
        }).then(function (userData) {
            //user created
            console.log(userData);
            $location.path('/login');
        }).catch(function (error) {
            // failed
            console.log(error);
        });
    }

});
//REGISTRATION CTRL *********************************************