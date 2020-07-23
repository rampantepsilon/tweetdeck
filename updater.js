const vm = require("vm");
const rp = require('request-promise');

module.exports = {
    updater: async () => {
        try {
            let body = await rp('http://rampantepsilon.site/projectResources/tweetdeckVersion.js');
            let script = vm.createScript(body);
            script.runInThisContext();

            // this is the actual dummy method loaded from remote dummy.js
            // now available in this context:
            return tdcv;

        } catch (err) {
            console.log('err', err);
        }
        return null;
    }
};
