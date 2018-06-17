const o876 = require('../../src');
const Rainbow = o876.Rainbow;

function _buildGradient() {
    return Rainbow.gradient({
        0: '#dec673',
        40: '#efd69c',
        48: '#d6a563',
        50: '#572507',
        55: '#d2a638',
        75: '#b97735',
        99: '#efce8c'
    })
        .map(x => Rainbow.parse(x))
        .map(x => x.r | x.g << 8 | x.b << 16 | 0xFF000000);
}

module.exports = _buildGradient();