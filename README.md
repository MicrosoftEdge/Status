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
2. bower install
3. grunt build
4. node app.js debug

A Node server will start at http://localhost:9000

## Contributing
### Adding New Features
The web platform is vast and ever-changing, so we often get requests to add new features to the site. In the spirit of tracking the modern interoperable web platform, we generally only add features that meet at least the following criteria:
1.	Exposes new, significant, and useful capabilities that web developers can adopt in sites
2.	Likely to be eventually implemented by the majority of browsers 
3.	Currently lacking support in at least one major browser

Over time, it's expected (and desired!) that features will become fully interoperable, meaning they no longer meet the third requirement above. We don't currently have a plan to remove such features from the site, but may do so at a future date. Not all requests to add features will be accepted as there is a high maintenance cost to keep interoperability, documentation, and standards statuses up to date.  

### Updating Features
Feature data on status.modern.IE is merged from both app/static/ie-status.json and also the [Chromium Dashboard](https://github.com/GoogleChrome/chromium-dashboard). While it is possible to override data from the Chromium Dashboard, it is preferred that this data be updated upstream in the Chromium Dashboard project. This allows both sites to reflect accurate information.

When requesting to change the implementation status of a browser or the standardization status, please include a citation in your pull request to where the change in status can be validated. Microsoft believes the W3C is the best place for developing interoperable open web standards. Therefore, please use W3C specifications in pull requests, when available.

###Additional Attributions
Portions of the content in this page from chromestatus.com, used under [Creative Commons Attribution 2.5 License](http://creativecommons.org/licenses/by/2.5/legalcode)

HTML5 Logo and related Technology Class iconography by W3C, used under [Creative Commons Attribution 3.0 License](http://creativecommons.org/licenses/by/3.0/legalcode)

JS Logo used under the [WTFPL Licnese](https://github.com/voodootikigod/logo.js/blob/master/LICENSE)

No trademark licenses or rights are provided. All trademarks are the property of their respective owners.
