/* 
	Future options:
		1. default expiration date in options, check before returning each time
		2. autoclean on interval before return
		3. lastModified maybe?
*/

class Memoization {
	constructor() {
		// this.weakCache = new WeakMap();
		this.instance = null;
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
            throw new Error('>> Error: maxCacheSize must be a positive number');
		}
	}

	get maxAge() {
		return this.options.maxAge;
	}

	set maxAge(num) {
		if (Math.sign(num) === 1) {
			this.options.maxAge = num;
		} else {
            throw new Error('>> Error: maxAge must be a positive number');
		}
	}

    getCache() {
        return this.cache;
    }

	clearCache() {
		this.cache.clear();
	}

	setCache(fn, args) {
		//check for promise
		//await fn
		//if promise, resolve promise.resolve(fn(args))
		// fn(args).then(result => {
		// 	this.cache.set(args, {
		// 		data: Promise.resolve(result),
		// 		maxAge: this.maxAge ? Date.now() + this.maxAge : Infinity,
		// 	});
		// });
        if (fn(args).then) {
            fn(args).then((result) => {
		this.cache.set(args, {
                    data: result,
                    maxAge: this.maxAge ? Date.now() + this.maxAge * 1000 : Infinity,
                });
                console.log(this.cache.get(args));
            });
        } else {
            console.log(fn, args);
            this.cache.set(args, {
			data: fn(args),
                maxAge: this.maxAge ? Date.now() + this.maxAge * 1000 : Infinity,
		});
	}
    }

	dataCheckedForAge(fn, args) {
		let data;
		if (this.cache.get(args).maxAge < Date.now()) {
			this.cache.delete(args);
			this.setCache(fn, ...args);
			data = this.cache.get(args).data;
		} else {
			data = this.cache.get(args).data;
		}
		return data;
	}
	
	removeOldest() {
		let oldestValue = null;
		let dataKey = null;
		const currentDate = Date.now();
		for (const [key, value] of this.cache) {
			if (!oldestValue) {
				oldestValue = currentDate - value.maxAge
				dataKey = key;
			}
			const currentValue = currentDate - value.maxAge;
			if (currentValue < oldestValue) {
				oldestValue = currentValue
				dataKey = key;
			}
		}
		this.cache.delete(dataKey);
	}

	memoize(fn, {
		maxAge = Infinity,
		maxCacheSize = Infinity
	} = {}) {
		this.maxAge = maxAge;
		this.maxCacheSize = maxCacheSize;
		
		return (...args) => {
			if (this.cache.has(...args)) {
				return this.dataCheckedForAge(fn, ...args);
			}
			if (this.cacheSize >= maxCacheSize) {
				this.removeOldest();
			}
			this.setCache(fn, ...args);
			return this.cache.get(...args).data;
		};
	}
	
	// static getInstance() {
	// 	if(!this.instance) {
	// 		this.instance = new Memoization();
	// 	}
	// 	return this.instance;
	// }
}

module.exports = Memoization;
