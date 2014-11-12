
var ItemFactory = function(para) {
	var _numberOfItems = 0;

	if (this instanceof ItemFactory) {
		;
	}
	else {
		return new ItemFactory(para)
	}
	this.create = function(obj) {
		_numberOfItems++;
		if (obj) {
			obj.itemId = _numberOfItems;
			return obj;
		}
		else {
			return {itemId:_numberOfItems}
		}
	}
};





module.exports = ItemFactory;

