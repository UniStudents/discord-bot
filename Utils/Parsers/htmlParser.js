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
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const https_1 = __importDefault(require("https"));
const Utils_1 = __importDefault(require("./Utils"));
const httpsAgent = new https_1.default.Agent({ rejectUnauthorized: false });


class HtmlParser {
    static request(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let options = {
                    method: 'get',
                    url: url,
                    httpsAgent: httpsAgent
                };
                axios_1.default(options).then((result) => {
                    resolve(result);
                }).catch((e) => {
                    reject(e);
                });
            });
        });
    }

    /**
     * This method returns an object that contains
     * the requested attributes.
     *
     * @param location The location  ( depth ) in the html content we are currently on.
     * @param dataStoredAt From which point should we get the data.
     * @param attributesArr The array that contains the information that helps to get the appropriate attributes.
     * @param endPoint
     */
    static attributes(location,
                      dataStoredAt,
                      attributesArr,
                      endPoint) {

        let obj = {};

        if (Utils_1.default.htmlStrip(location.find(dataStoredAt).text()) === '') return null;

        if (attributesArr.includes("value")) {
            if (attributesArr.includes("href")) {
                obj = {
                    attribute: endPoint+location.find(dataStoredAt).attr(attributesArr[attributesArr.length - 1]),
                    value: Utils_1.default.htmlStrip(location.find(dataStoredAt).text())
                };
            }
            else {
                obj = {
                    attribute: location.find(dataStoredAt).attr(attributesArr[attributesArr.length - 1]),
                    value: Utils_1.default.htmlStrip(location.find(dataStoredAt).text())
                };
            }

        }
        else {
            if (attributesArr.includes("href")) {
                obj = {
                    attribute: location.find(dataStoredAt).attr(attributesArr[attributesArr.length - 1])
                };
            }
            else {
                obj = {
                    attribute: endPoint+location.find(dataStoredAt).attr(attributesArr[attributesArr.length - 1])
                };
            }

        }
        return obj;
    }

    /**
     * This method goes step by step inside to a point in the
     * given html content, and tries to get the information
     * found in that point.
     *
     * @param instructions The instructions that helped to find how deep we will go into html.
     * @param htmlContent The html content we received from cheerio.
     * @param currArticle The article we are currently accessing.
     * @param htmlClass The css class that takes us as close as possible to the piece we want.
     * @param multiple Indicates whether the parser should get more than one item ( e.g link ) from the article we access.
     * @param hasAttributes Indicates whether we should take any attributes from the article.
     * @param attributesArr The array that contains the information that helps to get the appropriate attributes.
     * @param endPoint
     * @private
     */
    static findMultiple(instructions,
                        htmlContent,
                        currArticle,
                        htmlClass,
                        multiple = false,
                        hasAttributes = false,
                        attributesArr,
                        endPoint) {

        let results = new Array();
        let tmpElement = htmlContent(currArticle).find(htmlClass);
        let tmpArray;
        let finalLocation;
        let finalData;
        let dataStoredAt;
        if (multiple) {
            // save the point where the data is stored.
            dataStoredAt = instructions[instructions.length - 1];
            tmpArray = instructions.slice(0, instructions.length - 1);
        }
        else {
            tmpArray = instructions;
        }
        // going deeper into the html content.
        tmpArray.forEach((value) => {
            tmpElement = htmlContent(tmpElement).find(value);
        });
        // We are at the location of the information we want.
        finalLocation = htmlContent(tmpElement);
        if (multiple) {
            // In case we want to get more than one piece of information.
            // We get all the information. ( e.g each link of the article ).
            finalLocation.each((index, element) => {
                // We upload the information ( e.g the link of the article ).
                finalData = htmlContent(element);
                if (!hasAttributes) {
                    // If we do not want to get the attributes, then we just get the information found in the location stored in the variable dataStoredAt.
                    results.push(Utils_1.default.htmlStrip(finalData.find(dataStoredAt).text()));
                }
                else {
                    let tmp = HtmlParser.attributes(finalData, dataStoredAt, attributesArr, endPoint);
                    if (tmp) results.push(tmp);
                }
            });
        }
        else {
            // If it is to get only one piece of information, then we simply take the text from the point where we are ( which will be the point where the information is ).
            results.push(Utils_1.default.htmlStrip(finalLocation.text()));
        }

        return results.length > 1 ? results : results.pop()
    }

    /**
     * This method analyzes the content of an html
     * page and returns a map containing the requested
     * announcements.
     */
    static parse(url,
                 scrapeOptions,
                 elementSelector,
                 endPoint,
                 amount = 10) {

        return __awaiter(this, void 0, void 0, function* () {
            let parsedArticles = [];

            yield HtmlParser.request(url)
                .then((response) => {
                    const cheerioLoad = cheerio_1.default.load(response.data);
                    // for each article.
                    cheerioLoad(elementSelector).each((index, element) => {
                        if (index === amount)
                            return;
                        let articleData = {};
                        let tmpObj = {};
                        let basicData = ["title", "pubDate", "content"]; // Exp. If you remove the title, then the title is going to be on the extra information of each article.
                        let options = scrapeOptions;
                        // for each option. The options provided by instructions.
                        for (let item in options) {
                            //@ts-ignore
                            if (options.hasOwnProperty(item) && options[item].find) {
                                //@ts-ignore
                                if (!options[item].attributes) {
                                    //@ts-ignore
                                    articleData[options[item].name] = HtmlParser.findMultiple(options[item].find, cheerioLoad, element, item, options[item].multiple);
                                }
                                else {
                                    //@ts-ignore
                                    articleData[options[item].name] = HtmlParser.findMultiple(options[item].find, cheerioLoad, element, item, options[item].multiple, true, options[item].attributes, endPoint);
                                }
                            }
                            else {
                                //@ts-ignore
                                articleData[options[item].name] = Utils_1.default.htmlStrip(cheerioLoad(element).find(item).text());
                            }
                        }
                        // It stores the article data to an instance of Article class.
                        tmpObj.title = (articleData.title) ? articleData.title : '';
                        tmpObj.pubDate = (articleData.pubDate) ? articleData.pubDate : '';
                        tmpObj.content = (articleData.description) ? articleData.description : '';
                        tmpObj.extras = {};

                        // for each extra data. Data that are not described in the baseData variable.
                        for (let extra in articleData) {
                            if (basicData.indexOf(extra) === -1) {
                                if (articleData[extra] === '')
                                    continue;

                                tmpObj.extras[extra] = articleData[extra];
                            }
                        }
                        if (tmpObj.title === '')
                            return;
                        parsedArticles.push(tmpObj);
                    });
                });
            return parsedArticles;
        });
    }
}

exports.default = HtmlParser;
