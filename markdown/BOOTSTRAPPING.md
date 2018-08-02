[About](../../../) - [Download](DOWNLOAD.md) - Bootstrapping - [Configure](CONFIGURE.md) - [Develop](DEVELOP.md) - [Messaging](MESSAGING.md)  - [Fullstack](FULLSTACK.md) - [Components](COMPONENTS.md)

# UI Boostrapping

**URL loading begins: `index.html`**

- loads module loader `require.js`
- require loads `main.js`
	- you will find all require configuration in this file
		- performs version check (version information is typically injected by Dev Ops tools like Jenkins/Maven etc.)
		- sets UI default configuration to Local Storage
		- sets global values for browser, mobile mode etc.
		- checks the URL request to identify if the page requires bootstrapping
			- if URL request indicates page does not need authentication (ex: Login, Config page etc.) - redirects the page
			- if URL request indicates page requires authentication, `bootstrap.js` module is loaded and initialized
	- bootstrapping starts
		- `bootstrap.js` module performs User Check by loading load
        - `userManager.js` module
			- if authentication fails
				- redirects to a static page `access.html` indicating business access error message
			- if authentication succeeds
				- `userManager.js` module loads `serviceManager.js` module and obtains user preferences
				- applies preferences for styles/themes
				- loads several framework modules and initializes them
					- loads several styles
					- `windowManager.js`
						- initializes name of window
						- adds window events
					- `layoutManager.js`
						- initializes page mode (console vs. viewer)
						- renders layout (loads layout state from preferences if any)
						- adds layout events
					- `gadgetManager.js`
						- initializes page mode (console vs. viewer)
						- renders gadget menus 
						- adds gadget events
					- `pageManager.js`
						- loads `page.js` - this would be `index.js` as the requested URL was index.html
						- executes `index.js` modules init method
						- page life cycle begins
							- this typically loads markup from handlebars template
							- loads data specific to page
							- loads gadgets (loads gadget state from preferences if any, otherwise default gadgets are loaded)
							- binds events etc.
							- resolves a promise on `windowManager.js` module to inform windowManager that page has now loaded
						- page life cycle ends
					- `pageManager.js` module execution ends
				- frame modules load ends
			- authentication process ends
		- `bootstrap.js` module load ends
	- bootstrapping ends

**URL loading ends**