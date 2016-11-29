angular.module('hammer.directives', [])

.directive('loading', function () {
      return {
        restrict: 'E',
        replace:true,
        template: '<div class="loading"><img src="~/img/loading.gif"/>LOADING...</div>',
        link: function (scope, element, attr) {
              scope.$watch('loading', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
        }
      }
  })

.directive('buttonNailedIt', function() {
    return {
        scope: true,
        restrict: 'E',
        template: '<button class="btn btn-icon" id="nailBtn">' +
            '<span id="nailSpan" class="nailed-it" ng-class="{active: item.nail}" ng-click="nail()">' +
            '<img ng-show="isNailed" id="filledNail" src="../img/Nail%20Filled-50.png">' +
            '<img ng-show="!isNailed" id="unfilledNail" src="../img/Nail-50.png">' +
            '</span>' +
            '</button>',
        link: function(scope, elem) {
            elem.bind('click', function() {
                scope.$apply(function(){
                    scope.item.nail = !scope.item.nail;

                });
            });
        }
    };
})