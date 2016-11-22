var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('query', function($http){
    return{
            get: function (url, callback) {
                $http.get(url).success(callback);
            },
            post: function (url, data, callback) {
                $http.post(url, data).success(callback);
            },
            delete: function (url, callback) {
                $http.delete(url).success(callback);
            },
            put: function (url, data, callback) {
                $http.put(url, data).success(callback);
            }
    }
})

mp4Services.factory('CommonData', function(){
    var data = "";
    return{
        getData : function(){
            return data;
        },
        setData : function(newData){
            data = newData;
        }
    }
});

mp4Services.factory('Llamas', function($http, $window) {
    return {
        get : function() {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl+'/api/llamas');
        }
    }
});
