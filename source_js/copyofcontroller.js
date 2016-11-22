var mp4Controllers = angular.module('mp4Controllers', []);

app.controller('userlistController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    $scope.refreshuser = function(){
      $http.get('http://www.uiucwp.com:4000/api/users').success(function(response){
          $scope.info=response.data;
      });
    }
    $scope.refreshuser();
//    $scope.info = query.get('http://www.uiucwp.com:4000/api/users');
    $scope.deleteuser = function(id){
      url = 'http://www.uiucwp.com:4000/api/users/' + id;
      console.log(url);
//      query.delete(url);
      $http.delete(url).success(function(response){
        alert("User successfully deleted!");
        }).error(function(response){
        alert("User not deleted!");
      })
      $scope.refreshuser();
    }
}]);

app.controller('adduserController', ['$scope', '$http', function($scope, $http){
    $scope.user = {};
    $scope.adduser = function(){
      $http.get('http://www.uiucwp.com:4000/api/users?where={\"email\": \"' + $scope.user.email + '\"}').success(function(response){
        if(!$scope.user.name){
          alert("A name is required!");
        }
        else if(!$scope.user.email){
          alert("An email is required!");
        }
        else if(response.data.length>0){
          alert("Email already exists!");
        }
        else{
          $http({
            method: 'POST',
            url: 'http://www.uiucwp.com:4000/api/users',
            data: $scope.user
          }).success(function(response){
            alert("User info successfully submitted!");
          })
        }
      })
    }
}]);

app.controller('userdetailController', ['$scope', '$http','$routeParams', function($scope, $http, $routeParams){
    $http.get('http://www.uiucwp.com:4000/api/users?where={\"_id\": \"' + $routeParams._id + '\"}').success(function(response){
        $scope.info=response.data;
    });
    $http.get('http://www.uiucwp.com:4000/api/tasks?where={\"assignedUser\": \"' + $routeParams._id + '\", \"completed\": false}').success(function(response){
        $scope.pendingtasks=response.data;
    });
    $http.get('http://www.uiucwp.com:4000/api/tasks?where={\"assignedUser\": \"' + $routeParams._id + '\", \"completed\": true}').success(function(response){
        $scope.completedtasks=response.data;
    });
    $scope.taskcompleted = function(taskId){
      url = 'http://www.uiucwp.com:4000/api/tasks/' + taskId;
      var taskdata;
      $http.get('http://www.uiucwp.com:4000/api/tasks?where={\"_id\": \"' + taskId + '\"}').success(function(response){
        taskdata = {
          name: response.data[0].name,
          description: response.data[0].description,
          deadline: Date(response.data[0].deadline),
          completed: true,
          assignedUser: response.data[0].assignedUser,
          assignedUserName: response.data[0].assignedUserName,
          dateCreated: response.data[0].dateCreated
        }
        console.log(taskdata)
        console.log(url)
      })
      $http.put(url,taskdata).error(function(response){
        console.log(response)
      })
    }
}]);

app.controller('tasklistController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
  if(!$scope.start){
    $scope.start=0;
  }
  urlpart1 = "where={\"completed\": false}&"
  sortby = "dateCreated";
  ascending = -1;
  var url = 'http://www.uiucwp.com:4000/api/tasks?where={"completed": false}&sort={"dateCreated": -1}&skip=0&limit=10'
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
    url = 'http://www.uiucwp.com:4000/api/tasks?' + urlpart1 + 'sort={\"' + sortby + '\": ' + ascending + '}&skip='+ $scope.start +'&limit=10'
    $http.get(url).success(function(response){
      if(response.data.length==0){
        $scope.start -= 10;
      }
      else{
        $scope.task=response.data;
      }
    });
  }
  $scope.gettask(0);
  $scope.deletetask = function(id){
    url = 'http://www.uiucwp.com:4000/api/tasks/' + id;
    // $http.get(url).success(function(response){
    //   if(!response.data.assignedUser){
    //     $
    //   }
    // })
    $http.delete(url).success(function(response){
      console.log(response)
      console.log($("#check"))
      document.getElementById("checktask").innerHTML = "Task successfully deleted!";
    })
    .error(function(response){
      document.getElementById("checktask").innerHTML = "Task not deleted!";
    })
  }
}]);

app.controller('taskdetailController', ['$scope', '$http','$routeParams', function($scope, $http, $routeParams){
    $http.get('http://www.uiucwp.com:4000/api/tasks?where={\"_id\": \"' + $routeParams._id + '\"}').success(function(response){
        console.log(response.data)
        // if(!response.data[0].assignedUserName){
        //   response.data[0].assignedUserName = "Unassigned";
        // }
        $scope.info=response.data[0];
    });
}]);
//edit task part
app.controller('edittaskController', ['$scope', '$http','$routeParams', function($scope, $http, $routeParams){
    $http.get('http://www.uiucwp.com:4000/api/tasks?where={\"_id\": \"' + $routeParams._id + '\"}').success(function(response){
        $scope.task=response.data[0];
    });
    $http.get('http://www.uiucwp.com:4000/api/users').success(function(response){
        $scope.users=response.data;
    });
    $scope.edittask = function(id){
      url = 'http://www.uiucwp.com:4000/api/tasks/' + id;
      console.log($scope.task)
      $http.put(url,$scope.task).success(function(response){
        console.log(response)
        console.log(url)
        document.getElementById("checkupdate").innerHTML = "Task successfully updated!";
      })
    }
}]);
//add task part
app.controller('addtaskController', ['$scope', '$http', function($scope, $http){
    $scope.task = {};

    $http.get('http://www.uiucwp.com:4000/api/users').success(function(response){
        $scope.users=response.data;
    });
    $scope.addtask = function(){
      if(!$scope.task.name){
        alert("A name is required!")
      }
      else if(!$scope.task.deadline){
        alert("A deadline is needed!")
      }
      $http({
        method: 'POST',
        url: 'http://www.uiucwp.com:4000/api/tasks',
        data: $scope.task
      }).success(function(response){
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
