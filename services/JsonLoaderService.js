"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');

class JsonLoaderService {
    GetJson(filePath, doneFn){
        var parsedJson = {};
        if (fs.existsSync(filePath)) {
            fs.readFile(filePath, function read(err, data) {
                try {
                    parsedJson = JSON.parse(data);
                }
                catch (e) {
                    console.log(e);
                }
                doneFn(null, parsedJson);
            });

        } else {
            doneFn("File " + filePath + " was not found!");
        }
    }

    WriteJson(filePath, content, doneFn){
        fs.writeFile(filePath, JSON.stringify(content), 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }

           doneFn(err, content);
        });
    }
}
exports.JsonLoaderService = new JsonLoaderService();
