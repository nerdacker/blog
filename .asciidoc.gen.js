const asciidoctor = require('asciidoctor')();
const asciidoctorHtml5s = require("asciidoctor-html5s");
const prismExtension = require('asciidoctor-prism-extension');
const nunjucks  = require('nunjucks');

asciidoctorHtml5s.register();
asciidoctor.SyntaxHighlighter.register('prism', prismExtension);

const defaultOptions = {
  safe: "unsafe",
  attributes: {
	  sectanchors: true,
	  idprefix: ""
  }
}

module.exports = function (eleventyConfig) {
  var nunjucksEnv = new nunjucks.Environment();
  filters = eleventyConfig.nunjucksFilters;
  for (var filterName in filters) {
    if (filters.hasOwnProperty(filterName)) {
		nunjucksEnv.addFilter(filterName, filters[filterName]);
    }
  }

  return {
    read: true,
    getData: true,
    getInstanceFromInputPath: function(inputPath) {
		return ""
    },
    init: async function() {
    },
    compile: (str, inputPath) => (data) => {
	  var renderNunjucks = function (str, data) {
		return nunjucksEnv.renderString(str, data);
	  }
	  if(typeof str === "string" && str.split(/\r\n|\r|\n/).length == 1) { //test if string is nunjucks
		return typeof str === "function" ? str(data) : renderNunjucks(str,data);
	  } else {
		return "<div class=\"adoc\">" + asciidoctor.convert(str, defaultOptions) +  "</div>";  
	  }	  
	}
  }
}

