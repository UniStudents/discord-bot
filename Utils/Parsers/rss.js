"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rss_parser_1 = __importDefault(require("rss-parser"));
const Utils_1 = __importDefault(require("./Utils"));
class rssParser {
    /**
     This function finds the RSS fields that are not
     contained in the requested_fields array and returns
     a new array that contains the corrected names of the
     fields.
     *
     * @returns {Promise<[]>}
     * @param fields
     **/
    static generateRenamedFields(fields) {
        return __awaiter(this, void 0, void 0, function* () {
            let array = [];
            fields.forEach((value, key) => {
                if (this.requested_fields.some(item => item === key)) {
                    array.push([key, value]);
                }
            });
            return array;
        });
    }
    /**
     *
     Takes a url as argument an the number,
     of announcements. and an optional map
     that is be able to change some fields from rss.
     As a result of these operations, a json is returned
     which contains all the necessary data that they we
     will use.
     *
     * @param url
     * @param amount
     * @param renameFields
     */
    static rssParser(url, amount = 10, renameFields = new Map()) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataJson = {}; // there is where the returned data are stored.
            let customFieldsKeys = yield Array.from(renameFields.keys());
            let parser = yield this.generateParser(renameFields);
            return yield parser.parseURL(url).then(feed => {
                let count = 0;
                feed.items.forEach(item => {
                    // @ts-ignore
                    //Initializing json object
                    dataJson[count] = {};
                    //Skipping all the renamed fields
                    this.requested_fields.forEach(field => {
                        if (customFieldsKeys.some(item => item === field))
                            return;
                        //@ts-ignore
                        dataJson[count][field] = item[field] ? Utils_1.default.htmlStrip(item[field]) : null;
                    });
                    //Adds all the renamed fields as renamed on the result json
                    customFieldsKeys.forEach(customField => {
                        //@ts-ignore
                        dataJson[count][renameFields.get(customField)] = item[customField] ? Utils_1.default.htmlStrip(item[customField]) : null;
                    });
                    count++;
                });
                return dataJson;
            }).catch(e => {

            });
        });
    }
    /**
     * Creates the parser object
     * that is able to parse
     * given rss data
     *
     * @param renameFields
     * @private
     */
    static generateParser(renameFields) {
        return __awaiter(this, void 0, void 0, function* () {
            let customFields = yield this.generateRenamedFields(renameFields);
            return new rss_parser_1.default({
                // define the request headers.
                timeout: this.parser_timout,
                headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0' },
                // define requests options.
                requestOptions: {
                    rejectUnauthorized: false
                },
                // a few custom fields.
                customFields: {
                    item: customFields
                }
            });
        });
    }
    /**
     * Returns an array of articles based on rssParser function results
     * @param url The url that will be used for parsing
     * @param amount The amount of articles that wil be returned
     * @param renameFields
     * @return Array<Article> The articles.
     */
    /**
     * Function that returns object without specified fields
     * @param target
     * @param source
     * @private
     */
    static unAssign(target, source) {
        source.forEach((key) => {
            delete target[key];
        });
        return target;
    }
    ;
}
exports.default = rssParser;
rssParser.requested_fields = ["title", "link", "content", "pubDate"];
rssParser.parser_timout = 5000;
