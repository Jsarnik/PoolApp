"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var async = require('async');
var jsonLoaderService = require('./JsonLoaderService');
var appCacheService = require('./AppCacheService');
var path = require('path');

const modelsDir = '../models/';
var PlayersModel;

class GameService {
    UpdatePlayer(newPlayerObject, doneFn){
        this.GetAllPlayers(function(err, response){
            if(!err){
                PlayersModel = response;
            }
            appCacheService.AppCache.Invalidate('players', function(err, response){
                PlayersModel[newPlayerObject.displayName] = newPlayerObject;
                jsonLoaderService.JsonLoaderService.WriteJson(path.join(__dirname, modelsDir, "players.json"), newPlayerObject, function(err, playersObject){
                    if(!err){
                        appCacheService.AppCache.Set('players', PlayersModel, 1800, function(cacheErr, playersCache){
                            if(!cacheErr){
                                doneFn(null, PlayersModel);
                            }
                        });
                    }
                });
            });
        });
    };

    GetAllPlayers(next){
        if(PlayersModel) {return next(null, PlayersModel)};
    
        appCacheService.AppCache.Get('players', function(err, playersCache){
            if(!err && playersCache){
                return next(null, playersCache);
            }
            else{
                jsonLoaderService.JsonLoaderService.GetJson(path.join(__dirname, modelsDir, "players.json"), function(err, playersObject){
                    if(!err){
                        return next(null, playersObject);
                    }else{
                        return next(err, {});
                    }
                });
            }
        });
    };
}
exports.GameService = new GameService();