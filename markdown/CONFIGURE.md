[About](../../../) - [Download](DOWNLOAD.md) - [Bootstrapping](BOOTSTRAPPING.md) - Configure - [Develop](DEVELOP.md) - [Messaging](MESSAGING.md)  - [Fullstack](FULLSTACK.md) - [Components](COMPONENTS.md)

# Configuring Zaz UI

## Settings Folder
`Zaz UI platform` stores all forms of settings under the `/web/settings` folders.

## Goals
Let's review each file where we can configure settings.

1. Settings for Globals
2. Settings for Layout
3. Settings for Gadgets
4. Settings for Services
5. Settings for Preferences
6. Settings for Messages

## Step 1: Settings for Globals
> Open /settings/globals.js file and review the JSON structure. Set namespace for your app in small case. Set also your namespace for main page called console. Additionally this is where you will set REST endpoing root, typically as a relative URI.

    ...
    {
        NAMESPACE: 'myapp', //example: a short name for your app, say Weather Mgmt. System, the namespace could be set as 'wms'
        CONSOLE: 'wmsconsole',
        REST: '/rest/api'
    }
    ...

## Step 2: Settings for Layout
> Open /settings/gadgets.js file and review the JSON structure. If this definition is not found the platform will not be able to load the gadget into specificed viewer.

    ...
    var layouts = {
        maxZoneDepth: 3,
        multiWindow: true,
        autoClose: true        
    };
    ...

## Step 3: Settings for Gadgets
> Open /settings/gadgets.js file and review the JSON structure. If this definition is not found the platform will not be able to load the gadget into specificed viewer.

    ...
    exampleGadget: {
        title: 'Exmaple Gadget',
        viewers: [globals.CONSOLE]  
        zone: 'main',
        closeable: true,
        pinnable: false,
        pinned: false,
        cloneable: false,
        persistable: false,
        autoFocus: true,
        showCount: false
    },
    ...

## Step 4: Settings for Services
> Open /settings/services.js file and review the JSON structure. If this definition is not found the platform will not be able to make a service call.

    ...
    nameOfGadget: {
        get: 'gadgets/exampleGadget/exampleGadget_data.json'
    },
    ...

> You could also structure this to have sub categories in case there are mulitple get calls as shown below

    ...
    nameOfGadget: {
        get: {
            config: 'gadgets/exampleGadget/exampleGadget_config.json',
            data:'gadgets/exampleGadget/exampleGadget_data.json',
    },
    ...

## Step 5: Settings for Preferences
> Open /settings/preferences.js file and review the JSON structure. If this definition is not found the platform will not be able to save the preferences.

    ...
        //standard gadget preferences - follow format PREFERENCE-gadgetName-key;
        'PREFERENCE-news-settings': 'PREFERENCE for general settings of gadget',
        

        //standard feature preferences - follow format PREFERENCE-featureName-key;
        
        'PREFERENCE-user-theme': 'PREFERENCE for application wide color theme',
        'PREFERENCE-user-language': 'PREFERENCE for language',
    ...

## Step 3: Settings for Messages
> Open /settings/messages.js file and review the JSON structure. If this definition is not found the platform will not be able to send and recieve messages.

    ...
        //standard gadget framework messages - follow format MESSAGE-gadget-action
        'MESSAGE-gadget-open': 'Message sent before a gadget is opened',
        'MESSAGE-gadget-touched': 'Message sent after gadget is flipped/moved in DOM',

        //uer gadget framework messages - follow format MESSAGE-gadget-action
        'MESSAGE-grid-data': 'Message sent by Grid Gadget',

        //feature messages - follow format MESSAGE-gadget-action
        'MESSAGE-preference-changed': 'MESSAGE when a preference is saved'
    ...