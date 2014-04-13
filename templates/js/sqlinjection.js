if(!window.localStorage) {
  alert('크롬이나 Firefox 또는 최신버젼의 브라우저를 사용해주세요!');
}
function MemberController($scope) {
  $scope.logginedUser = {username: '', password:''};
  $scope.users = JSON.parse(localStorage.getItem('users')) || [];
  $scope.user = {};
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
}