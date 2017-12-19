angular.module('poolApp')
.factory('GameService', ['$q', 'RouteService', function ($q, routeService) {
'use strict';

    return {
        updatePlayers: updatePlayers,
        getPlayerByName: getPlayersByName,
        getAllPlayers: getAllPlayers,
        getLeaderboard: getLeaderboard
    };

    function updatePlayers(playerObject) {
        var deferred = $q.defer();

        routeService.updatePlayers({playerObject: playerObject}).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    };	

    function getPlayersByName(playerNameArray) {
        var deferred = $q.defer();

        routeService.getActivePlayers(playerNameArray).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    };	

    function getAllPlayers() {
        var deferred = $q.defer();

        routeService.getAllPlayers().then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    };	

    function getLeaderboard() {
        var deferred = $q.defer();

        routeService.getLeaderboard().then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    };
}]);