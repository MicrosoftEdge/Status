#Status.Modern.IE
This project contains the source code and data for [status.modern.IE](http://status.modern.IE), a portal for the latest implementation status and future roadmap for interoperable web platform features in Internet Explorer. 

##Using IE Status Data
Status.Modern.IE provides valuable data on the implementation status and future plans for web platform features in Internet Explorer. This data is encouraged to be used for other purposes as licensed by the [Creative Commons Attribution 2.5 License](http://creativecommons.org/licenses/by/2.5/legalcode). This data is provided as a JSON document, served at http://status.modern.IE/features. This data is sent with an "Access-Control-Allow-Origin: *" header, so it may be requested cross-domain.

##Building the Project
### Prequisites
1. Install Node.JS, NPM
2. npm install -g bower
3. npm install -g yo
4. npm install -g grunt-cli

### Build, run, and debug
From the project's root directory

1. npm install
2. grunt build
3. node app.js debug

A Node server will start at http://localhost:9000

###Additional Attributions
Portions of the content in this page from chromestatus.com, used under [Creative Commons Attribution 2.5 License](http://creativecommons.org/licenses/by/2.5/legalcode)

HTML5 Logo and related Technology Class iconography by W3C, used under [Creative Commons Attribution 3.0 License](http://creativecommons.org/licenses/by/3.0/)

JS Logo used under the [WTFPL Licnese](https://github.com/voodootikigod/logo.js/blob/master/LICENSE)

No trademark licenses or rights are provided. All trademarks are the property of their respective owners.
