import React, { useContext, useState } from 'react';
import classes from './Cart.module.css';
import Modal from '../UI/Modal';
import CartItem from './CartItem';
import CartContext from '../../store/cart-context.js';
import Checkout from './Checkout';

const Cart = props => {
  const cartCtx = useContext(CartContext);
  const [isCheckout, setIsCheckout] = useState(false)

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = id => {
    cartCtx.removeItem(id);
  };
  const cartItemAddHandler = item => {
    cartCtx.addItem({ ...item, amount: 1 }); //вызываем ф-ю, в к-ю передаем наш обьект)
  };

    const submitOrderHandler=(userData)=>{
        fetch("https://react-http-53159-default-rtdb.firebaseio.com/orders.json", {
            method: 'POST',
            body: JSON.stringify({
                user:userData,
                orderedItems: cartCtx.items
            })
        })
    }

  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map(item => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={() => {
            cartItemRemoveHandler(item.id);
          }}
          onAdd={() => {
            cartItemAddHandler(item);
          }}
        />
      ))}
    </ul>
  );



    const orderHandler=()=>{
        setIsCheckout(true)
    }


  const modalActions = <div className={classes.actions}>
      <button className={classes['button--alt']} onClick={props.onClose}>
          Close
      </button>
      {hasItems && (<button className={classes.button} onClick={orderHandler}>Order</button>)}
  </div>




  return (
    <Modal onClose={props.onClose}>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
        {isCheckout && <Checkout onSubmit={submitOrderHandler} onCancel={props.onClose}/>}
        {!isCheckout && modalActions}

    </Modal>
  );
};

export default Cart;

//onRemove={cartItemRemoveHandler.bind(null, item.id)}
//                           onAdd={cartItemAddHandler.bind(null, item)}
