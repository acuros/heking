if(!window.openDatabase) {
  alert('크롬이나 Firefox 또는 최신버젼의 브라우저를 사용해주세요!');
}
 var UserManager = {
  initialize: function() {
    this.db = openDatabase("sqlinjection", "1.0", "sqlinjection", "5*1024*1024");
    this.db.transaction(function(tx) {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS users(id integer primary key AUTOINCREMENT, ' +
          'username, password, email);'
      );
      tx.executeSql(
        'SELECT count(*) FROM users',
        [],
        function(tx, results) {
          if(results.rows.item(0)['count(*)'] == 0)
            UserManager.createUser({username: 'admin', password:'test123', email:'admin@site.co.kr'});
        }
      );
    }, function(err) {
      console.log(err);
    }, function() {
      UserManager.getUsers();
    });
  },
  getUsers: function() {
    this.db.transaction(function(tx){
      tx.executeSql("SELECT id, username, password, email FROM users", [],
      function(tx, results) {
        var rows = results.rows;
        var users = [];
        for(var i=0; i<rows.length; ++i)
        {
          users.push(rows.item(i));
        }
        var scope = angular.element($('#login-form')).scope();
        this.users = users;
        scope.$apply(function() {
          scope.users = users;
        });
      });
    });
  },
  createUser: function(user) {
    this.db.transaction(function(tx) {
      tx.executeSql(
        "INSERT INTO users (username, password, email) values (?, ?, ?)",
        [user.username, user.password, user.email]
      );
    });
  }
};


var app = angular.module('heking', []);

app.controller('MemberController', ['$scope',function($scope) {
  $scope.logginedUser = {username: '', password:''};
  $scope.users = [];
  $scope.user = {};
  $scope.clickedUser = {};
  $scope.reset = function() {
    $scope.form.$setPristine();
    $scope.user = {};
  };
  $scope.signup = function(user) {
    $scope.users.push(user);
    $scope.reset();
    localStorage.setItem('users', JSON.stringify($scope.users));
  };
  $scope.clickTr = function(user) {
    if($scope.clickedUser.username == user.username)
      $scope.clickedUser = {};
    else
      $scope.clickedUser = angular.copy(user);
  };
  $scope.colorClassByQueryValidation = function(user) {
    var query = "아이디가 '" + user.username +"' 이면서 비밀번호가 '"+ user.password + "'";
    query = query.split('무시')[0];
    var isValid = (query.split("'").length - 1) % 2 == 0;
    if(!isValid) return 'invalid';
  };
  $scope.getClass = function(user) {
    return {selected: user.username == $scope.logginedUser.username &&
                     user.password == $scope.logginedUser.password};
  };
  $scope.login = function(user) {
    $scope.logginedUser = angular.copy(user);
    $scope.reset();
  }
}]);

$(function()
{
  UserManager.initialize();
});