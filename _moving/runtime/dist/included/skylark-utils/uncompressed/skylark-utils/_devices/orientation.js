define([
    "../langx"
], function(langx) {

    // setup
    if ( window.DeviceOrientationEvent ) {
        
        // Listen for the deviceorientation event and handle the raw data
        window.addEventListener( 'deviceorientation', function( eventData ) {
            
            var data = {
                lr: eventData.gamma, // gamma is the left-to-right tilt in degrees, where right is positive
                fb: eventData.beta, // beta is the front-to-back tilt in degrees, where front is positive
                dir: eventData.alpha, // alpha is the compass direction the device is facing in degrees
                grav: null
            };
            
            //ps.publish( data );
            
        }, false);
        
    } else if ( window.OrientationEvent ) {
        
        window.addEventListener('MozOrientation', function( eventData ) {
            
            var data = {
                lr: eventData.x * 90, // x is the left-to-right tilt from -1 to +1, so we need to convert to degrees
                fb: eventData.y * -90, // y is the front-to-back tilt from -1 to +1, so we need to convert to degrees
                            // We also need to invert the value so tilting the device towards us (forward) 
                            // results in a positive value. 
                dir: null, 
                grav: eventData.z // z is the vertical acceleration of the device
            };
            
            //ps.publish( data );
            
        }, false);
    }

    function orientation() {
        return orientation;
    }

    langx.mixin(orientation, {
        isSupported : function(){
            return !!(window.DeviceOrientationEvent || window.OrientationEvent);
        },

        on : function(duration) {
            navigator.vibrate(duration);
        },

        off : function() {
            navigator.vibrate(0);
        }
    });


    return  orientation;
});
