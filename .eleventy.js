const yaml = require("js-yaml");
const _ = require('lodash');
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const crypto = require('crypto');

const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const pluginTOC = require('eleventy-plugin-nesting-toc');

const mdOptions = {
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
}

const mdAnchorOpts = {
  permalink: true,
  permalinkClass: 'anchor',
  permalinkSymbol: '#',
  level: [1, 2, 3, 4]
}

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addCollection("posts_de", function (collection) {
    return collection.getFilteredByGlob(["./src/de/blog/posts/*.md","./src/de/blog/posts/*.adoc","./src/de/blog/posts/*.html"]);
  });

  eleventyConfig.addCollection("posts_en", function (collection) {
    return collection.getFilteredByGlob(["./src/en/blog/posts/*.md","./src/en/blog/posts/*.adoc","./src/blog/en/posts/*.html"]);
  });
  
  eleventyConfig.addFilter("tagFilter", function(tags, tagname) {
    return _.find(tags, { 'name': tagname });;
  });
  
  eleventyConfig.addFilter("sortPostsByDate", function(posts, order) {
	if(order === "desc") {
		return [...posts].reverse();
	}		
    return posts;
  });
  
  eleventyConfig.addFilter("filterPostsByAuthor", function(posts, author) {
	return _.filter(posts, function(post) { return post.data.author == author; });
  });
  
  eleventyConfig.addFilter("filterPostsByTag", function(posts, tag) {
	return _.filter(posts, function(post) { return _.includes(post.data.tags, tag)});
  });
  
  eleventyConfig.addFilter("sortByName", function(authors) {
	return _.sortBy(authors, ['name']);
  });
  
  eleventyConfig.addFilter("toPostHash", function(data) {
	if(data) {
		if(data instanceof Array)
			data = data.join("-");
		if(data instanceof Date)
			data = data.toISOString();
		return crypto.createHash("sha256").update(data).digest("hex").substring(0, 12);
	}
	return "";
  });
  
  
  
  eleventyConfig.addFilter("dateToPath", function(date) {
	formatDate = function(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) 
			month = '0' + month;
		if (day.length < 2) 
			day = '0' + day;

		return [year, month, day].join('/');
	}
	if(date)
		return formatDate(date);
	return null;
  });

  eleventyConfig.addFilter("getLanguageMatch", function(items, page_url, language_code, page_postHash) {
	let result = "/" + language_code + "/";
	for (let item of items) {
		let data = item.data;
		if(data && data.page && data.page.url && data.locale) {
			if(data.locale == language_code) {
				if(data.page.url.length >= 4) {
					if (data.page.url.substring(3) == page_url.substring(3)) {
						result = data.page.url;
						break;
					}					
				}
				if(page_postHash && data.postHash) {
					if(data.postHash == page_postHash) {
						result = data.page.url;
						break;			
					}
				}
			}
		}
	}
	return result;
  }); 
  
  eleventyConfig.setLibrary(
    'md',
    markdownIt(mdOptions)
      .use(markdownItAnchor, mdAnchorOpts)
      // .use(markdownItHighlightJS)
  );

  eleventyConfig.addPlugin(pluginTOC, {
    tags: ['h2', 'h3', 'h4'],
    wrapper: 'div',
	ignoredElements: ['a']
  });


  // date filter (localized)
  eleventyConfig.addNunjucksFilter("localizedDate", function (date, localeRegion) {
    localeRegion = localeRegion ? localeRegion : "de-DE";
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const result = new Date(date).toLocaleDateString(localeRegion, options);
    // console.log('Processing Date', result);
    return result;
  });

  eleventyConfig.addNunjucksFilter("getLocalizedTag", function (tag, categories, locale) {
    const matchingCats = categories.filter(cat => {
      return cat.name === tag;
    });
    if (matchingCats.length === 0) {
      return tag;
    }
    return matchingCats[0][locale];
  });

  eleventyConfig.addFilter("filterCategory", function (postlist, name) {
    return postlist.filter(post => post.data.tags.includes(name));
  });

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) =>
    yaml.safeLoad(contents)
  );

  // Add Tailwind Output CSS as Watch Target
  eleventyConfig.addWatchTarget("./_tmp/static/css/style.css");

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./_tmp/static/css/style.css": "./static/css/style.css",
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/alpine.js": "./static/js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css":
      "./static/css/prism-tomorrow.css",
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });
  
  eleventyConfig.addTemplateFormats("adoc");

  eleventyConfig.addExtension("adoc", require('./.asciidoc.gen.js')(eleventyConfig));

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
