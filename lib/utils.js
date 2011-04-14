exports.Utils = {
    randomInt: function(to, from) {
        from = from || 0;
        return Math.floor(Math.random()*to+from);
    }
};