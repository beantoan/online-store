import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductModel } from '../../models/product/product.model';
import { ProductService } from '../../services/product/product.service';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: ProductModel[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data: ProductModel[]) => {
        this.products = data;
      },
      error: (error) => {
        console.error('Error fetching products', error);
        // Here you might want to set an error flag to display a message in the template
      }
    });
  }

  addToCart(product: ProductModel) {
    this.cartService.addToCart(product);
    // Optionally, you could add some feedback here, like setting a 'added to cart' flag
  }
}
