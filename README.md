# Starter Template for Azure DevOps
This is a starter template for creating an Azure DevOps extension.

## Customizing
1. Search for and replace all instances of `starter-template`.
	- `azure-devops-extension.json`
	- `package.json`
2. Update the repository URLs.
	- `azure-devops-extension.json`
	- `package.json`
3. Update the Azure DevOps publisher.
	- `azure-devops-extension.json`
4. Update/add extension links.
	- `azure-devops-extension.json`
5. Install packages and update `package-lock.json`.
	- Run `npm install` from repo root.
6. Develop extension and update overview.
	- Change `logo.png` to match extension.
	- Update `overview.md`.
	- Update code in `src` directory.
	- Update `azure-devops-extension.json` as needed.

## Build
`npm run build` automatically increments the version and creates a new *.vsix file in the root directory.

Publish to https://marketplace.visualstudio.com/manage/publishers

## Useful Links
- [Extensions overview](https://learn.microsoft.com/en-us/azure/devops/extend/overview?view=azure-devops)
	- [Develop a web extension](https://learn.microsoft.com/en-us/azure/devops/extend/get-started/node?view=azure-devops)
	- [Extension manifest reference](https://learn.microsoft.com/en-us/azure/devops/extend/develop/manifest?view=azure-devops)
- [Formula Design System](https://developer.microsoft.com/en-us/azure-devops)
- [azure-devops-extension-sample](https://github.com/microsoft/azure-devops-extension-sample)

## Icons
- [Sprout icon CC BY 3.0](https://game-icons.net/1x1/lorc/sprout.html).
