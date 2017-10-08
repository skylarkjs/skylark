define([
    "skylarkjs"
], function(skylarkjs) {
    var spa = skylarkjs.spa,
    	noder = skylarkjs.noder,
        $ = skylarkjs.query;

    return spa.PluginController.inherit({
        klassName: "AppController",
        _showProcessing : function() {
            if (!this._throbber) {
                this._throbber = noder.throb(document.body);                
            }

        },
        _hideProcessing : function() {
            if (this._throbber) {
                this._throbber.remove();
                this._throbber = null;               
            }
        },

        starting(e) {
            this._showProcessing();
        },
        started(e) {
            this._hideProcessing();
        }
    });
});
