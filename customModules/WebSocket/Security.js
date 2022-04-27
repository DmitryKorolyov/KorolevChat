/**
 * 
 * 
 * 
 */

const Security = {
    regexp: new RegExp(/[&<>"']/, 'g'),
    htmlEscapes: {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        "\\": '&#47;'
    },
    checkEscape: function (string){
        return string.replace(this.regexp, match => this.htmlEscapes[match])
    },
    checkDataObject: function(obj) {
        let checked = {}
        for (let label in obj) {
            if (typeof(obj[label]) == 'string') checked[label] = this.checkEscape(obj[label])
            else checked[label] = obj[label]
        }
        return checked
    },
    handleReq: async function(req, res) {
        return [this.checkDataObject(req), res]
    }
}

module.exports = Security