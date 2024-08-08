import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { CartItemModel, ProductModel } from '../../models/product/product.model';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItemModel[] = [];
  private cartSubject: BehaviorSubject<CartItemModel[]> = new BehaviorSubject<CartItemModel[]>([]);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = `${environment.apiUrl}/cart`; // In case you need to interact with a backend for cart operations

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cartItems = JSON.parse(savedCart);
        this.cartSubject.next(this.cartItems);
      }
    }
  }

  getCart(): Observable<CartItemModel[]> {
    return this.cartSubject.asObservable();
  }

  addToCart(product: ProductModel, quantity: number = 1) {
    const existingItem = this.cartItems.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const item = {...product, quantity, product_id: product.id};
      this.cartItems.push(item);
    }
    this.updateCart();
  }

  removeFromCart(productId: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.updateCart();
  }

  updateQuantity(productId: number, quantity: number) {
    const item = this.cartItems.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      this.updateCart();
    }
  }

  clearCart() {
    this.cartItems = [];
    this.updateCart();
  }

  private updateCart() {
    this.cartSubject.next(this.cartItems);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
  }

  // If you need to sync the cart with a backend, you can add methods like:
  // syncCartWithBackend() {
  //   // Logic to send cart data to backend
  // }
}
