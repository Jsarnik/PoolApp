angular.module('poolApp')
.factory('RouteService', ['BaseHttpService', function (baseHttpService) {
'use strict';

    return {
        getAllPlayers: baseHttpService.get.bind(this, '../api/getAllPlayers'),
        updatePlayers: baseHttpService.post.bind(this, '../api/updatePlayers')
    };
}]);