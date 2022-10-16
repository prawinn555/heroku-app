

function parseLog(content, regexStr) {
    let res = [];
    let arr = content.split('\n');
    let item;
    let regex = new RegExp(regexStr);
    let i=0;
    for( v of arr) {
        if(!v) {
          // ignore
        } else if(isNewLogLine(v, regex)) {
            if(item) {
                res.push(item);
            }
            item = { lineNo: i+1, subelements : []};
            item.subelements.push(v);
        } else {
            if(!item) {
                item = { lineNo: i+1, subelements : []};
            }
            item.subelements.push(v);
        }
        i++;
    }
    if(item) {
        res.push(item);
    }
    return res;
}

function isNewLogLine(line, regex) {
    return line.match(regex);
}



Vue.component('log-line', {
    template: '#log-line',
    props : ['line'],
    data: function () {
        return {
        };
    },
    computed: {
        linePreview: function() {
            return this.line.subelements[0];
        },
        buttonText : function() {
            if(this.line.subelements.length<=1) {
                return false;
            } else if( containXml(this.line)) {
                return "xml";
            } else if( containJson(this.line)) {
                return "json";   
            } else if( containException(this.line)) {
                return "trace";   
            } else {
                this.line.type ='other';
                return "other ";
            }
        }
    },
    methods: {
        openInConsole: function () {
            let line = this.line;
            try {
                if(line.type==='json') {
                    console.info(line.type, JSON.parse(line.jsonData));
                } else if(line.type==='xml' ) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(line.xmlData, "application/xml");
                    console.info(line.type, doc);
                } else {
                    console.info(line.type, line);
                }
            } catch(e) {
                console.info('unableToFormatLine', line, e);
            }
        }
    }
});

const jsonRegex = /\{.*\:.*\}/g;


function containXml(line) {
  if(line.type ) {
        return line.type==='xml';
  } 
  let d = line.subelements.join('\n');
  let m = /<[A-Za-z\-]*>/.exec(d);
  if(m &&  d.match(new RegExp('</[A-Za-z\-]*>')) ) {
    line.xmlData = d.substring(m.index, d.length);
    line.type = 'xml';
    return true;
  }   
}

function containJson(line) {
    if(line.type ) {
        return line.type==='json';
    } 
    let d = line.subelements.join(' ');
    let jsonData = d.match(jsonRegex);
    if(jsonData && jsonData[0] ) {
        line.jsonData = jsonData[0];
        line.type = 'json';
        return true;
    }
}


function containException(line) {
    if(line.type ) {
        return line.type==='exception';
    } 
    let d = line.subelements.join('\n');
    let m = (d.match(/Exception/g) || d.match(/Error/g)) && d.match(/at /g) ;
    if(m) {
        line.type = 'trace';
        return true;
    }
}


window.addEventListener('DOMContentLoaded', (event) => {
    var app = new Vue({
        el: '#vue-app'
    });
});



