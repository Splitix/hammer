angular.module('hammer.controllers', [])

.controller('DashCtrl', function($scope, $state){
    
    // Some mockup posts
    $scope.posts = [
    {body: "We'll throw some old gray clouds in here just sneaking around and having fun. Tree trunks grow however makes them happy. That's what painting is all about. It should make you feel good when you paint. Just pretend you are a whisper floating across a mountain. We need dark in order to show light. With something so strong, a little bit can go a long way.",
    author: "Bob Ross", imageUri : "http://www.bobrosslipsum.com/images/bob-ross-cutout.png"},
    {body: "Hammer is super cool.", author: "Joshua Galindo", imageUri : "http://placekitten.com/200/200/"},
    {body: "Testing out this user post.", author: "Blake Bordovsky", imageUri : "http://placekitten.com/200/200/"},
    {body: "If you didn't have baby clouds, you wouldn't have big clouds. Don't fiddle with it all day. Just go out and talk to a tree. Make friends with it. It looks so good, I might as well not stop. Let's put some happy trees and bushes back in here.",
    author: "Bob Ross", imageUri : "http://www.bobrosslipsum.com/images/bob-ross-cutout.png"},
    {body: "San Marcos is flooding super bad right now!", author: "Blake Bordovsky", imageUri : "http://placekitten.com/200/200/"},
    {body: "Project Hammer is using the MEAN stack.", author: "Joshua Galindo", imageUri : "http://placekitten.com/200/200/"}];
})

.controller('SignInCtrl', function($scope, $state){
    
})
.controller('ProfileCtrl', function($scope, $state){
    // Set values of variables used in the view
    $scope.FirstName = "Blake";
    $scope.LastName = "Bordovsky";
    $scope.ImageUri = "http://placekitten.com/200/200/";
});