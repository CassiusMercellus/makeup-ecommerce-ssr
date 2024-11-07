import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../shared/cart.service'; // Import CartService

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  product: any;

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient,
    private cartService: CartService // Inject CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.http.get<any[]>(`https://makeup-api.herokuapp.com/api/v1/products.json`).subscribe(
      data => {
        this.product = data.find(p => p.id.toString() === productId);
      },
      error => {
        console.error('Error fetching product:', error);
      }
    );
  }

  // Method to add the product to the cart
  addToCart(productId: string) {
    this.cartService.addToCart(productId).then(() => {
      console.log('Item added to cart!');
      alert('Item added to cart!');
    }).catch((error) => {
      console.error('Error adding item to cart:', error);
    });
  }
  
}
