var mp4Controllers = angular.module('mp4Controllers', []);

app.controller('userlistController', ['$scope', '$http','query','$window','$routeParams', function($scope, $http,query,$window, $routeParams){
    $scope.refreshuser = function(){
      query.get($window.sessionStorage.baseurl+'/api/users', function(data){
        $scope.info = data.data;
      })
    }
    $scope.refreshuser();
//    $scope.info = query.get('http://www.uiucwp.com:4000/api/users');
    $scope.deleteuser = function(id){
      url = $window.sessionStorage.baseurl+'/api/users' + id;
      console.log(url);
//      query.delete(url);
      query.delete(url,function(data){
        alert("User successfully deleted!");
        $scope.refreshuser();
      })
    }
}]);

app.controller('adduserController', ['$scope', '$http', 'query','$window', function($scope, $http, query,$window){
    $scope.user = {};
    $scope.adduser = function(){
      query.get($window.sessionStorage.baseurl+'/api/users'+'?where={\"email\": \"' + $scope.user.email + '\"}', function(data){
          if(!$scope.user.name){
            alert("A name is required!");
          }
          else if(!$scope.user.email){
            alert("An email is required!");
          }
          else if(data.data.length>0){
            alert("Email already exists!");
          }
          else{
            query.post($window.sessionStorage.baseurl+'/api/users',$scope.user,function(){
              alert("User info successfully submitted!");
            })
        }
      })
    }
}]);

app.controller('userdetailController', ['$scope', '$http','$routeParams', 'query','$window', function($scope, $http, $routeParams,query,$window){
    query.get($window.sessionStorage.baseurl+'/api/users'+'?where={\"_id\": \"' + $routeParams._id + '\"}',function(data){
      $scope.info = data.data;
    });
    query.get($window.sessionStorage.baseurl+'/api/tasks'+'?where={\"assignedUser\": \"' + $routeParams._id + '\", \"completed\": false}',function(data){
      $scope.pendingtasks = data.data;
    });
    query.get($window.sessionStorage.baseurl+'/api/tasks'+'?where={\"assignedUser\": \"' + $routeParams._id + '\", \"completed\": true}',function(data){
      $scope.completedtasks = data.data;
    });
    $scope.taskcompleted = function(taskId){
      url = $window.sessionStorage.baseurl+'/api/tasks/' + taskId;
      var taskdata;
      query.get($window.sessionStorage.baseurl+'/api/tasks'+'?where={\"_id\": \"' + taskId + '\"}',function(data){
          taskdata = {
          name: data.data[0].name,
          description: data.data[0].description,
          deadline: Date(data.data[0].deadline),
          completed: true,
          assignedUser: data.data[0].assignedUser,
          assignedUserName: data.data[0].assignedUserName,
          dateCreated: data.data[0].dateCreated
        }
        console.log(taskdata)
        console.log(url)
      })
      query.put(url,taskdata,function(data){
        alert("Task has been set to completed!");
      })
    }
}]);

app.controller('tasklistController', ['$scope', '$http', '$routeParams','query','$window', function($scope, $http, $routeParams,query,$window){
  if(!$scope.start){
    $scope.start=0;
  }
  urlpart1 = "where={\"completed\": false}&"
  sortby = "dateCreated";
  ascending = -1;
  var url = $window.sessionStorage.baseurl+'/api/tasks'+'?where={"completed": false}&sort={"dateCreated": -1}&skip=0&limit=10'
  $scope.orderbywhat = function(){
      sortby = $scope.orderby;
      $scope.gettask(0);
    }
  $scope.completed = function(flag){
    if(flag==0){
      urlpart1 = "where={\"completed\": true}&"
    }
    else if(flag==1){
      urlpart1 = "where={\"completed\": false}&"
    }
    else{
      urlpart1 = ""
    }
    $scope.gettask(0);
    console.log(flag);
  }
  $scope.ascend = function(num){
    ascending = num;
    $scope.gettask(0);
  }
  $scope.skip10=function(skip){
    $scope.start += skip;
    if($scope.start<0){
      $scope.start=0;
    }
    console.log(url)
    $scope.gettask(0);
  }
  $scope.gettask = function(){
    url = $window.sessionStorage.baseurl+'/api/tasks?' + urlpart1 + 'sort={\"' + sortby + '\": ' + ascending + '}&skip='+ $scope.start +'&limit=10'
    query.get(url,function(data){
      if(data.data.length==0){
        $scope.start -= 10;
      }
      else{
        $scope.task=data.data;
      }
    })
  }
  $scope.gettask(0);
  $scope.deletetask = function(id){
    url = $window.sessionStorage.baseurl+'/api/tasks/' + id;
    query.delete(url,function(data){
      alert("Task successfully deleted!");
      $scope.gettask(0)
    })
  }
}]);

app.controller('taskdetailController', ['$scope', '$http','$routeParams','query','$window', function($scope, $http, $routeParams,query,$window){
    query.get($window.sessionStorage.baseurl+'/api/tasks?'+'where={\"_id\": \"' + $routeParams._id + '\"}',function(data){
        console.log(data.data)
        $scope.info=data.data[0];
    })
}]);
//edit task part
app.controller('edittaskController', ['$scope', '$http','$routeParams','query','$window', function($scope, $http, $routeParams,query,$window){
    query.get($window.sessionStorage.baseurl+'/api/tasks?'+'where={\"_id\": \"' + $routeParams._id + '\"}',function(data){
      $scope.task=data.data[0];
    })
    query.get($window.sessionStorage.baseurl+'/api/users', function(data){
      $scope.users=data.data;
    })
    $scope.edittask = function(id){
      url = $window.sessionStorage.baseurl+'/api/tasks/' + id;
      console.log($scope.task)
      query.put(url,$scope.task,function(data){
        console.log(url)
        alert("Task successfully updated!");
      })
    }
}]);
//add task part
app.controller('addtaskController', ['$scope', '$http','query','$window', function($scope, $http,query,$window){
    $scope.task = {};

    query.get($window.sessionStorage.baseurl+'/api/users',function(data){
      $scope.users=data.data;
    })
    $scope.addtask = function(){
      if(!$scope.task.name){
        alert("A name is required!")
      }
      else if(!$scope.task.deadline){
        alert("A deadline is needed!")
      }
      query.post($window.sessionStorage.baseurl+'/api/tasks',$scope.task,function(data){
        alert("Task successfully submitted!")
      })
    }
}]);

mp4Controllers.controller('settingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";

  };

}]);
