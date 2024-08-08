import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartItemModel } from '../../models/product/product.model';
import { CartService } from '../../services/cart/cart.service';
import { OrderService } from '../../services/order/order.service';
import { AuthService } from '../../services/auth/auth.service';
import { OrderRequest } from '../../models/order/order.model';

interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItemModel[] = [];
  shippingInfo: ShippingInfo = {
    fullName: '',
    address: '',
    city: '',
    country: '',
    zipCode: ''
  };
  orderPlaced = false;
  orderError = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
    });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  onSubmit() {
    if (this.isFormValid()) {
      if (!this.authService.isLoggedIn()) {
        this.orderError = 'You must be logged in to place an order.';
        return;
      }

      const currentUser = this.authService.currentUserValue;
      if (!currentUser) {
        this.orderError = 'Unable to retrieve user information. Please try logging in again.';
        return;
      }

      const orderRequest: OrderRequest = {
        items: this.cartItems,
        total: this.getTotalPrice(),
        shipping_address: `${this.shippingInfo.fullName}, ${this.shippingInfo.address}, ${this.shippingInfo.city}, ${this.shippingInfo.country}, ${this.shippingInfo.zipCode}`
      };

      this.orderService.placeOrder(orderRequest).subscribe({
        next: (order) => {
          this.orderPlaced = true;
          this.cartService.clearCart();
          console.log('Order placed successfully:', order);
        },
        error: (error) => {
          console.error('Error placing order', error);
          this.orderError = 'There was an error placing your order. Please try again.';
        }
      });
    } else {
      this.orderError = 'Please fill in all required fields.';
    }
  }

  isFormValid(): boolean {
    return Object.values(this.shippingInfo).every(value => value.trim() !== '');
  }
}
