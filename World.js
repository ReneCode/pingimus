var Tile = require('./Tile.js');

var World = function(para) {
	var _self = this;
	var _width = para.width || 10000;
	var _height = para.height || 10000;
	var _cntTileX = para.tileCount ||  100;
	var _cntTileY = para.tileCount || 100;
	var _tileWidth = Math.floor(_width / _cntTileX)
	var _tileHeight = Math.floor(_height / _cntTileY)
	var _tiles = {};

	if (this instanceof World) {
		;
	}
	else {
		return new World(para)
	}

	// private method


	function getOrCreateTile(tileId) {
		if (_tiles.hasOwnProperty(tileId)) {
			return _tiles[tileId];
		}
		else {
			var tile = new Tile(tileId);
			_tiles[tileId] = tile;
			return tile;
		}

	}

	// privileged methods
	this.getParameters = function() {
		return { width:_width, height:_height, tileCount:_cntTileX, 
			tileWidth:_tileWidth, tileHeight:_tileHeight};
	}

	this.coordFromTileId = function(tileId) {
		var aTile = tileId.split(':')
		return {x:aTile[0] * _tileWidth, y:aTile[1] * _tileHeight};
	}

	this.tileIdFromItem = function(item) {
		var nx = Math.floor( item.x / _tileWidth );
		var ny = Math.floor( item.y / _tileHeight );
		return  nx + ":" + ny;
	}

	this.addItem = function(item) {
		var tileId = this.tileIdFromItem(item);
		var tile = getOrCreateTile(tileId);
		tile.addItem(item);
		return tile;
	}	

};







World.prototype.getTile = function(tileId) {
	
};


module.exports = World;



