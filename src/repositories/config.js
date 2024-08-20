const fs = require('node:fs');

class ConfigRepository {
    configFile = process.argv[2] || "etc/sprinklerswitch/config.json";
    
    read() {
        if(! configFile) {
            console.error("sprinkler.js [CONFIGFILE]");
            return;
        }

        const data = fs.readFileSync(configFile, 'utf8');
        return JSON.parse(data);
    }
}

module.exports = new ConfigRepository();