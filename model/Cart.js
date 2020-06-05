module.exports = function Cart (oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.qty || 0;
    this.totalPrice = oldCart.price || 0;

    this.add = (item, id) =>{
        var storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.precio * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.precio;
        // console.log("Agregado al carrito");
        // console.log("precio" + storedItem.item.precio);
        // console.log("cantidad" + storedItem.qty);
        // console.log("item" + storedItem);
        // console.log(this.items[id]);
    }

    this.generateArray = () =>{
        var arr = [];
        for ( var id in this.items ){
            arr.push(this.items[id]);            
        }
        return arr;
    }
}