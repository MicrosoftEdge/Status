# Status [![Build Status](https://travis-ci.org/MicrosoftEdge/Status.svg)](https://travis-ci.org/MicrosoftEdge/Status)

This project contains the data for [`status.microsoftedge.com`](https://status.microsoftedge.com), a portal for the latest implementation status and future roadmap for interoperable web platform features in Microsoft Edge and other browsers, including Internet Explorer.


## Using Status Data

This repository provides valuable data on the implementation status and future plans for web platform features in Microsoft Edge. This data is encouraged to be used for other purposes as licensed by the [Creative Commons Attribution 2.5 License](https://creativecommons.org/licenses/by/2.5/legalcode), being provided as a JSON document served at https://developer.microsoft.com/en-us/microsoft-edge/api/platform/status/ with an `Access-Control-Allow-Origin: *` header, so it may be requested cross-domain.


## Contributing

Want to contribute to this project? We'd love to have your help! Take a look at the [Contributing Guidelines](.github/CONTRIBUTING.md) before you dive in. For many features, support data for browsers other than Internet Explorer and Microsoft Edge comes from the [Chromium Dashboard](https://www.chromestatus.com) and bugs against that data can be filed [here](https://github.com/GoogleChrome/chromium-dashboard/issues).

When adding a new feature, add it to the very end and increment your new status item's `"statusid"` value by 1 (eg: If the status item's `statusid` before yours is 350, make your `statusid` value 351).

Note that this GitHub project is *not* for making feature requests for or reporting bugs in Internet Explorer or Microsoft Edge. Browser feedback can be provided through the [issue tracker](https://developer.microsoft.com/microsoft-edge/platform/issues/) and on [UserVoice](https://wpdev.uservoice.com/forums/257854-microsoft-edge-developer).


## Additional Attributions

Portions of the content in this page are from [chromestatus.com](https://www.chromestatus.com), used under [Creative Commons Attribution 2.5 License](https://creativecommons.org/licenses/by/2.5/legalcode).

No trademark licenses or rights are provided. All trademarks are the property of their respective owners.

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
