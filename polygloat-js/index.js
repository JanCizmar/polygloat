'use strict';

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/polygloat.prod.min.umd.js');
} else {
    module.exports = require('./dist/polygloat.js');
}
