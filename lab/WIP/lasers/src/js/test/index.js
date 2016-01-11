var module_test = require('./module-test.js');
var B = require('../libs/burno-0.3.js');

module_test();
var App = B.Core.Abstract.extend(
    {
        construct : function()
        {
            console.log('construct');
        }
    }
);

var app = new App();
