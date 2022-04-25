const Security = {
    htmlEscapes: {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    },
    escape: (string) => string.replace(/[&<>"']/g, function(match) {
        return this.htmlEscapes[match]
    })
}

module.exports = Security