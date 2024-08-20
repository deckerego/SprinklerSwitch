const fs = require('node:fs');

class ConfigRepository {
    config = undefined;
    configFile = process.argv[2] || "/etc/sprinklerswitch/config.json";

    load() {
        const data = fs.readFileSync(this.configFile, 'utf8');
        this.config = JSON.parse(data);
    }
    
    get(key, fallback) {
        if(! this.config) this.load();
        return this.config[key] || fallback;
    }
}

module.exports = new ConfigRepository();