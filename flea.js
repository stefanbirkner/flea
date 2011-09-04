/*
 * Copyright 2011 Stefan Birkner
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var port = 8080,
	documentRoot = "./",
	directoryIndex = "index.html",
	contentTypes = {
		"html" : "text/html",
		"htm" : "text/html"
	};

require('http').createServer(function (req, resp) {
  var file = getFilenameForRequest(req);
	log("Got request for " + file);
	copyFileToResponse(file, resp);
}).listen(port);

log("Server running on port " + port);

function log(text) {
  require('sys').puts(text);
}

function getFilenameForRequest(req) {
	var href = require('url').parse(req.url).href.substring(1),
		file = ((href === "") || (href.substr(-1) === "/")) ? href + directoryIndex : href;
	return documentRoot + file;
}

function copyFileToResponse(file, resp) {
  require('fs').readFile(file, function (err, data) {
    if (err) {
      resp.writeHead(500, wrapContentType('text/plain'));
      resp.write(err.name + " " + err.message);
    } else {
      resp.writeHead(200, getContentTypeForFile(file));
      resp.write(data);
    }
    resp.end();
  });
}

function getContentTypeForFile(file) {
	var suffix = file.split('.').pop();
	if (contentTypes[suffix]) {
		return wrapContentType(contentTypes[suffix]);
	} else {
		return {};
	}
}

function wrapContentType(contentType) {
	return	{"Content-Type" : contentType};
}
