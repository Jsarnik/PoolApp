angular.module('poolApp')
.controller('mainCtrl', MainCtrl);

MainCtrl.$inject = ['$rootScope','$scope','$timeout', 'GameService', '$filter'];

function MainCtrl($rootScope, $scope, $timeout, gameService, $filter) {

    var m = $scope.m = {
       availablePlayers: {},
       activePlayersModel: {},
       leaderBoard: [],
       selectedPlayerIndex: null,
       gameObject: null,
       gameInSession: false,
       playersReady: false,
       order: 'highScore'
    }

    $scope.addPlayer = addPlayer;
    $scope.selectPlayer = selectPlayer;
    $scope.choosePlayer = choosePlayer;
    $scope.removePlayer = removePlayer;
    $scope.startNewGame = startNewGame;
    $scope.setOrder = setOrder;

    initialize();

    function initialize(){
        updateAvailablePlayers();
    }

    function updateAvailablePlayers(){
        gameService.getAllPlayers().then(function(response){
            m.availablePlayers = response;
        });
    }

    function addPlayer(){

        if(m.availablePlayers[m.newPlayer]){
            return m.warningMessage = "Please enter a unique player name.";
        };

        var newPlayerObj = {
            displayName: m.newPlayer,
            highScore: 0,
            gamesPlayed: 0,
            totalPointsScored: 0,
            avgScore: 0
        }

        if(!m.newPlayer){
            return m.warningMessage = "Please enter a player name";
        }

        gameService.updatePlayers(newPlayerObj).then(function(response){
            m.availablePlayers = response;
            m.newPlayer = null;
        });
    }

    function selectPlayer($index){
        m.selectedPlayerIndex = $index;
    }

    function choosePlayer(playerName){
        if(m.playersReady){
            return;
        }
    
        m.playersReady = false;
        m.activePlayersModel[playerName] = {
            scoreTracker: [],
            score: 0
        }

        var ObjKeys = Object.keys(m.activePlayersModel);
        if(ObjKeys.length > 1){
            m.playersReady = true;
        }
        newGame();
    }

    function removePlayer(playerName){
        if(m.gameInSession){return;}
        if(m.activePlayersModel[playerName]){
            delete m.activePlayersModel[playerName];
            m.playersReady = false;
        }  
    }

    function newGame(){
        m.gameObject = {
            ballsArray: [],
            ballsRemainingObject: {},
            gameOver: false,
            gameProgressionArray: [],
            activePlayers: m.activePlayersModel,
            keyIndices: Object.keys(m.activePlayersModel)
        }

        for (var i=1; i < 16; i++){
            m.gameObject.ballsArray.push(i);
            m.gameObject.ballsRemainingObject[i] = i;
        }
    }

    function startNewGame(){
        $timeout(function(){
            playRound(Math.floor(Math.random() * 1));
            m.gameInSession = true;
        },100)
    }

    function playRound(playerIndex){
        if(m.gameObject.gameOver) {return;}

        var playerName = m.gameObject.keyIndices[playerIndex];
        var selectedBall = Math.floor(Math.random() * 15) + 1;

        if(!m.gameObject.ballsRemainingObject[selectedBall]){
            //if miss other players turn
            m.gameObject.activePlayers[playerName].scoreTracker.push('Miss!');
            playerIndex = playerIndex === 0 ? 1 : 0;
            $timeout(function(){
                playRound(playerIndex);
            },500)
        }else{
            delete m.gameObject.ballsRemainingObject[selectedBall];
            m.gameObject.activePlayers[playerName].scoreTracker.push('Sunk ' + selectedBall + ' ball!');
            m.gameObject.activePlayers[playerName].score += selectedBall;

            var ballsRemainingKeys = Object.keys(m.gameObject.ballsRemainingObject);
            if(ballsRemainingKeys.length < 1){
                m.gameObject.gameOver = true;
                getWinningResults();
                return;
            }
            $timeout(function(){
                playRound(playerIndex);
            },500)
        }
    }

    function getWinningResults(){
        var player1 = {
            name: m.gameObject.keyIndices[0],
            score: m.gameObject.activePlayers[m.gameObject.keyIndices[0]].score
        }
        var player2 = {
            name: m.gameObject.keyIndices[1],
            score: m.gameObject.activePlayers[m.gameObject.keyIndices[1]].score
        }

        m.gameObject.activePlayers[player1.name].scoreTracker.push('Final Score: ' + player1.score);
        m.gameObject.activePlayers[player2.name].scoreTracker.push('Final Score: ' + player2.score);

        if(player1.score > player2.score){
            m.gameObject.activePlayers[player1.name].scoreTracker.push('Win!');
            m.gameObject.activePlayers[player2.name].scoreTracker.push('Lose!');
        }else if(player1.score == player2.score){ 
            m.gameObject.activePlayers[player1.name].scoreTracker.push('Tie!');
            m.gameObject.activePlayers[player2.name].scoreTracker.push('Tie!');
        }else{
            m.gameObject.activePlayers[player1.name].scoreTracker.push('Lose!');
            m.gameObject.activePlayers[player2.name].scoreTracker.push('Win!');
        }
        updatePlayerHistory(player1);
        updatePlayerHistory(player2);
        m.gameInSession = false;
    }

    function updatePlayerHistory(playerObject){
        var updatedPlayerObject = m.availablePlayers[playerObject.name];
        updatedPlayerObject.highScore = updatedPlayerObject.highScore > playerObject.score ? updatedPlayerObject.highScore : playerObject.score;
        updatedPlayerObject.gamesPlayed += 1;
        updatedPlayerObject.totalPointsScored += playerObject.score;
        updatedPlayerObject.avgScore = Math.floor(updatedPlayerObject.totalPointsScored / updatedPlayerObject.gamesPlayed);
        
        // send request to update
        gameService.updatePlayers(updatedPlayerObject).then(function(response){
           console.log(response)
        });
    }

    function setOrder(val){
        m.order = val;
    }

};


