# Pull Request Stats for Azure DevOps
This custom extension for Azure DevOps displays pull request statistics.

- [Primary Source](https://git.ebacher-skemp.com/azure-devops/pull-request-stats)
- [Azure DevOps Mirror](https://dev.azure.com/jamesrskemp/azure-devops-extensions/_git/pull-request-stats)

## Install
Install from Visual Studio Marketplace: https://marketplace.visualstudio.com/items?itemName=JamesSkemp.pull-request-stats

## Support
Issues and feature requests can be submitted via [GitHub issues](https://github.com/JamesSkemp/pull-request-stats/issues).

## Build
`npm run build` automatically increments the version and creates a new *.vsix file in the root directory.

Publish to https://marketplace.visualstudio.com/manage/publishers

### Development Build
`npm run build:dev` and upload once as a new extension. Share with instances that should support the dev instance.

Run `npx webpack serve`, navigate to https://localhost:3000/dist/Hub/Hub.html and accept the SSL cert, to then load the dev extension and develop locally.

> Edge seems to work best when doing the above.

## Icons
- [Pull icon CC BY 3.0](https://game-icons.net/1x1/delapouite/pull.html).
