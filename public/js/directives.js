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
        require: "?ngModel",        
        scope: true,
        restrict: 'E',
        template: 
            '<button class="btn btn-icon nailBtn" style="text-align: center; padding: 5px;">' +
                '<img class="filledNail" src="../img/Nail-50.png">' +
                '<div class="nailed-msg" style="display:none;">Nailed it!</div>' +
            '</button>',
        link: function(scope, elem) {

            scope.loadNail(scope.post, elem);

            elem.bind('click', function() {
                scope.$apply(function(){
                    scope.nail(scope.post, elem);
                });
            });
        }
    };
})