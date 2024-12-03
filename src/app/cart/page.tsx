import React from 'react';

const CartPage: React.FC = () => (
  <div style={{ borderLeft: '2px solid #000', borderRight: '2px solid #000', padding: '20px' }}>
    <h1>Your Shopping Cart</h1>
    <p>This is the cart page. You can display the cart items here.</p>

    <ul>
      <li>Item 1 - $10</li>
      <li>Item 2 - $20</li>
      <li>Item 3 - $30</li>
    </ul>

    <div>
      <h3>Total: $60</h3>
      <button type="button">Proceed to Checkout</button>
    </div>
  </div>
);

export default CartPage;
