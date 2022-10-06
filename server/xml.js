var xml2js = require('xml2js');
var builder = new xml2js.Builder();

exports("xmlToTable", async (anyXml) => {
    return await xml2js.parseStringPromise(anyXml);
})

exports("tableToXml", (obj) => {
    return builder.buildObject(obj);
})