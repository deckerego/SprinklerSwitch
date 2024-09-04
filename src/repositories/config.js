require('dotenv').config()
const fs = require('node:fs');

class ConfigRepository {
    config = undefined;
    configFile = process.argv[2] || "/etc/sprinklerswitch/config.json";

    load() {
        const data = fs.readFileSync(this.configFile, 'utf8');
        this.config = JSON.parse(data);
    }
    
    get(key, fallback) {
        if(typeof key != 'string') throw new TypeError("Key is not a string");
        if(! this.config) this.load();
        return this.getEnv(key) || this.config[key] || fallback;
    }

    getEnv(key) {
        const value = process.env[key.toUpperCase()];
        if(! value) return undefined;
        const numeric = Number.parseFloat(value);
        return isNaN(numeric) ? value : numeric;
    }
}

module.exports = new ConfigRepository();