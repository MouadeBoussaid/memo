class Memoization {
    constructor() {
        // this.weakCache = new WeakMap();
        this.cache = new Map();
        this.options = {
            maxAge: Infinity,
            maxCacheSize: Infinity,
        };
    }

    get cacheSize() {
        return this.cache.size;
    }

    get maxCacheSize() {
        return this.options.maxCacheSize;
    }

    set maxCacheSize(num) {
        if (Math.sign(num) === 1) {
            this.options.maxCacheSize = num;
        } else {
            console.error('>> Error: Must be a positive number');
        }
    }

    get maxAge() {
        return this.options.maxAge;
    }

    set maxAge(num) {
        if (Math.sign(num) === 1) {
            this.options.maxAge = num;
        } else {
            console.error('>> Error: Must be a positive number');
        }
    }

    clearCache() {
        // this.weakCache = new WeakMap();
        this.cache.clear();
    }

    dataCheckedForAge(fn, args) {
        let data;
        if (this.cache.get(args).maxAge < Date.now()) {
            this.cache.delete(args);
            this.cache.set(args, {
                data: fn(args),
                maxAge: this.maxAge ? Date.now() + this.maxAge : Infinity,
            });
            data = this.cache.get(args).data;
        } else {
            data = this.cache.get(args).data;
        }
        return data;
    }

    memoize(fn, { maxAge = Infinity, maxCacheSize = Infinity } = {}) {
        this.maxAge = maxAge;
        this.maxCacheSize = maxCacheSize;

        return (...args) => {
            if (this.cache.has(...args)) {
                return this.dataCheckedForAge(fn, ...args);
            }
            this.cache.set(...args, {
                data: fn(...args),
                maxAge: this.maxAge ? Date.now() + this.maxAge : Infinity,
            });
            return this.cache.get(...args).data;
        };
    }
}

module.exports = Memoization;
