if(!window.localStorage) {
  alert('크롬이나 Firefox 또는 최신버젼의 브라우저를 사용해주세요!');
}
function MemberController($scope) {
  $scope.users = JSON.parse(localStorage.getItem('users')) || [];
  $scope.reset = function() {
    $scope.form.$setPristine();
    $scope.user = {};
  };
  $scope.signup = function(user) {
    $scope.users.push(user);
    $scope.reset();
    localStorage.setItem('users', JSON.stringify($scope.users));
  };
  $scope.login = function(user) {
    $scope.reset();
  }
}