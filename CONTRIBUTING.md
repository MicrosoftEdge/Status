# Contributing to status.modern.IE

There are many ways you can contribute to status.modern.IE:

## Adding New Features
The web platform is vast and ever-changing, so we often get requests to add new features to the site. In the spirit of tracking the modern interoperable web platform, we generally only add features that meet at least the following criteria:

1.	Exposes new, significant, and useful capabilities that web developers can adopt in sites
2.	Likely to be eventually implemented by the majority of browsers 
3.	Currently lacking support in at least one major browser

Over time, it's expected (and desired!) that features will become fully interoperable, meaning they no longer meet the third requirement above. We don't currently have a plan to remove such features from the site, but may do so at a future date. Not all requests to add features will be accepted as there is a high maintenance cost to keep interoperability, documentation, and standards statuses up to date.  

## Updating Features
Feature data on status.modern.IE is merged from both app/static/ie-status.json and also the [Chromium Dashboard](https://github.com/GoogleChrome/chromium-dashboard). While it is possible to override data from the Chromium Dashboard, it is preferred that this data be updated upstream in the Chromium Dashboard project. This allows both sites to reflect accurate information.

When requesting to change the implementation status of a browser or the standardization status, please include a citation in your pull request to where the change in status can be validated. Microsoft believes the W3C is the best place for developing interoperable open web standards. Therefore, please use W3C specifications in pull requests, when available.

## Reporting bugs in the website 
Bugs happen so if you find one please open an issue. 

# Using Pull Requests
If you want to contribute to the repo, please use a GitHub pull request. There are just a couple things to keep in mind:
- Make sure there is an issue open for your PR. If there isn't you can create one!
- The commit message should reference the issue and hopefully fix it (you can use "fixes #issueNumber" or "ref #issueNumber" if it doesn't fix it completely). 
- If you are modifying code, please add a description of what you did. If you are adding or modifying a feature add the links to the documentation to verify your changes are valid.
- Separate PR for separate issues. If you are updating several feature please do a PR for each one.

 Thank you for contributing to status.modern.IE!
