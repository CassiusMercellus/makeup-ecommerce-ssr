import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService, Cart, Product  } from '../../shared/cart.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartItems$!: Observable<Product[]>; // Declare as a property of the class
  cart: any; // Adjust the type according to your cart structure

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Proper assignment
    this.cartItems$ = this.cartService.getCartItems(); // No error here
    this.cartItems$.subscribe(cart => {
      if (cart) {
        this.cart = cart; // Assuming cart is structured as needed
      } else {
        this.cart = { items: [] }; // Default to an empty cart if null
      }
    });
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId).then(() => {
      console.log('Item removed from cart!');
      // Optionally, you can refresh the cart items here or handle UI updates
    }).catch((error) => {
      console.error('Error removing item from cart:', error);
    });
  }
}