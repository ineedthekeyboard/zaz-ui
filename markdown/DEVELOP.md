[About](../../../) - [Download](DOWNLOAD.md) - [Bootstrapping](BOOTSTRAPPING.md) - [Configure](CONFIGURE.md) - Develop - [Messaging](MESSAGING.md)  - [Fullstack](FULLSTACK.md) - [Components](COMPONENTS.md)

# Build a Gadget

## About Gadgets
`Zaz UI platform` uses the `jQuery UI Widget Factory` to create gadgets and widgets.
The widget factory defines how to create and destroy widgets, get and set options, invoke methods, and listen to events triggered by the widget. By using the widget factory to build your `stateful plugins`, you are `automatically conforming to a defined standard`, making it easier for new users to start using your plugins. In addition to defining the interface, the widget factory also implements much of this functionality for you. If you're not familiar with the API provided by the widget factory, you should read [How jQuery UI Works.](https://learn.jquery.com/jquery-ui/how-jquery-ui-works/)

### Review the following links below for documentation.

> [Widget Factory](https://api.jqueryui.com/jquery.widget/)

> [How to use the Widget Factory](https://learn.jquery.com/jquery-ui/widget-factory/how-to-use-the-widget-factory/)

## Initialize Local DEV Server
Ensure your local development server for Zaz UI is up and runnnig first. Run the following command

    $ grunt --proxy heroku

Now ensure we see login page for Zaz UI [locally](http://localhost:5001/login.html).

## Goals
Let's create a gadget that can load a data into predfined HTML template by making a service call.

1. Add metadata for exampleGadget
2. Create an example gadget
3. Add _create Widget Factory method
4. Create a simple handlebars template
5. Inject markup from template into gadget
6. Create mock data as JSON file
7. Create a stub for loading data
8. Add metadata for REST Service
9. Load the mock data by making a service call
10. Render the data to markup
11. View the gadget with Zaz UI web app

## Step 1: Add metadata for exampleGadget
Let's open /settings/gadgets.js file and add the following object that defines the behaviour of exampleGadget. The gadget will be load by the platform only if it is defined here first. Notice the `viewers` key - this key defines where the gadget is allowed to load. In our case we have defined it to be opened only in main CONSOLE page. 

    ...
    exampleGadget: {
        title: 'Example',
        viewers: [globals.CONSOLE]
    },
    ...

## Step 2: Create an exampleGadget
Create a new directory `/web/gadgets/exampleGadget`. Create a new file named exampleGadget.js in that directory and define an AMD module that will return a widget constructor. Notice the naming convention. The folder and file names follow the name of the gadgets, allowing platform to automatically pick them up by their pet name.

    ...
    define([
        'framework/framework',
        'css!gadgets/exampleGadget/exampleGadget'
    ], function (
        framework
    ) {
        return $.widget('zaz.exampleGadget', framework.baseGadget, {

            //this is where we will store some data
            data: null,

            _create: function () { 
                this._super(); 
            }
        });
    });
    ...

## Step 3: Add _create Widget Factory method
Note that `_create` is built in to the widget lifecycle, so we need to call `this._super()` to make sure the inherited method runs in addition to our methods,  otherwise it would override it. 

The `_create` method gets invoked immediately any time a widget is instantiated. Here, we'll call the methods we just stubbed out to get this gadget ready to use.

    ...
    _create: function () {
        //this will call baseGadget's super method in turn  call widget factory's super method
        this._super(); 

        //in this custom method we will load HTML handlebars template 
        this._renderLayout(); 

        //in this method we will bind events to DOM elements in this gadget
        this._bindListeners(); 
    },

    //stub for method
    _renderLayout: function () {},

    //stub for method
    _bindListeners: function () {}
    ...

## Step 4: Create a handlebars template and SCSS style file
Let's create a Handlebars template for your Gadget. In your exampleGadget directory. Create a file called `exampleGadget.hbs` and paste the following code:

    ...
    <div class="container zaz-effect zaz-effect-bar-top">
        <div class="controls">
            <div class="controls-bar">
                <div class="message">
                    Demostrates simple workflow with live updates
                </div>
            </div>
        </div>
        <div class="content">
            <div class="address">
                <div class="fname"></div>
                <div class="lname"></div>
                <div class="city"></div>
            </div>
        </div>
    </div>
    ...

This template defines a control bar and a content region.  

Handlebars compiles all .hbs files in the web/ directory into functions that accept a data parameter and return a string of HTML. These functions are stored on the global `HBS` object under property names matching the template file path relative to web/. The templates are recompiled by a grunt watch task that runs as long as the grunt server task is running. To compile manually, open a new terminal and run:

    $ grunt handlebars

Additionally let's create a SCSS file to manage styles for this gadget. Create a file called `exampleGadget.scss` and paste the following code:

    ...
    .gadget {
        &.exampleGadget {
            .container {
                overflow: hidden;
            }
            .controls {
                padding: 0;
                .message {
                    color: RGB(var(--theme-color));
                    line-height: 22px;
                }
                .controls-bar {
                    justify-content: space-between;
                    flex-wrap: wrap;
                    &:first-of-type {
                        display: flex;
                        border-bottom: 1px solid #ccc;
                        padding: 5px;
                    }
                }
            }
            .content {
                flex: 1;
                border-top: 1px solid #aaa;
                padding: 10px 0 10px 10px;
                overflow: auto;
                .address {
                    div {
                        padding: 5px;
                        background-color: #ccc;
                        display: inline-block;
                    }
                }
            }
        }
    }
    ...

SCSS file will get a corresponding CSS file.

## Step 5: Inject markup from template into gadget
Now we can implement `_renderLayout` using the template. Every widget gets a reference to its jQuery-wrapped element as `this.element`, so updating the element with the template is simple.

    ...
    _renderLayout: function () {
        var strTemplate = HBS['gadgets/exampleGadget/exampleGadget']();

        this.element.html(strTemplate);
    },
    ...

We should have a gadget that can be viewed [locally](http://localhost:5001/harness.html#exampleGadget).

## Step 6: Create mock data as JSON file
Let's create a file named exampleGadget_data.json and add the following JSON content. We will load this in lieu of a real REST service call using serviceManager API in the next steps. 

    ...
    {
        "data": {
            "fname": "John",
            "lname": "Doe",
            "city": "New York"
        }
    }
    ...

## Step 7: Create a stub for loading data
We will add a call to `_loadData` method in `_create` method. Let's add the stub method which we will define in next step.

    ...
    _create: function () {

        ...
        this._loadData();
    },
    ...

## Step 8: Add metadata for REST Service
Let's open /settings/services.js file and add the following object that defines the structure of REST Service call.

    ...
    exampleGadget: {
        get: 'gadgets/exampleGadget/exampleGadget_data.json'
    },
    ...

## Step 9: Load the mock data by making a service call
Let's create `_loadData` method, and add serviceManager API to make an Ajax call to get data. Notice the success and error responses.

    ...
    _loadData: function () {
        var context = this;

         function success(response) {
            response = (typeof response === 'string') ? JSON.parse(response) : response;
            context.data = (response && response.data) ? response.data : [];
        }

        function error(response) {
            //handle errors here
        }

        framework.serviceManager.exec({
            service: 'exampleGadget.get',
            success: success,
            error: error
        });
    }
    ...

## Step 10: Render the data to markup
Let's create `_renderData` method which will use the data recieved and render within HTLM markup. Update the _loadData method and call this new method. We will define in the next step.

    ...
    _loadData: function () {
        var context = this;

        function success(response) {
            response = (typeof response === 'string') ? JSON.parse(response) : response;
            context.data = (response && response.data) ? response.data : [];
            context._renderData();
        }

        //let's load values from data into DOM elements
        _renderData: function () {
            var $address = this.element.find('.content .address');
            $address.find('.fname').html(this.data.fname);
            $address.find('.lname').html(this.data.lname);
            $address.find('.city').html(this.data.city);
        }
    }
    ...

We should have a gadget that now fetches data as a REST Service and renders within the gadget. let's view [locally](http://localhost:5001/harness.html#gadget=exampleGadget).

 ## Step 11: View the gadget with Zaz UI web app
 Now that we know the gadget loads well within developer harness, it's time to experience the gadget with Zaz UI. 
 
 Stop and restart local DEV server 

     $ grunt --proxy heroku

Let's launch the [Zaz UI](http://localhost:5001/login.html) and load the gadget by accessing this new gadget from gadgets menu.