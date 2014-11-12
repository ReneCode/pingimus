
var Tile = function(id) {
	this.id = id;
	this._items = [];
};


Tile.prototype.getItems = function() {
	return this._items;	
};

Tile.prototype.addItem = function(item) {
	this._items.push(item);
	item.tileId = this.id;
};


module.exports = Tile;
