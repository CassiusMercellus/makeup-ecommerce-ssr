import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-store-page',
  templateUrl: './store-page.component.html',
  styleUrls: ['./store-page.component.css']
})
export class StorePageComponent implements OnInit {
  products: any[] = [];
  categories: string[] = [];
  selectedCategories: Set<string> = new Set();
  maxDescriptionLength = 100; // Set your desired max length here

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.http.get<any[]>('https://makeup-api.herokuapp.com/api/v1/products.json').subscribe((data) => {
      this.products = data;
      this.categories = [...new Set(data.map(product => product.product_type))]; // Unique categories
      
    });
  }
  

  toggleCategory(category: string) {
    if (this.selectedCategories.has(category)) {
      this.selectedCategories.delete(category);
      
    } else {
      this.selectedCategories.add(category);
      
    }
  }
  

  isSelected(category: string): boolean {
    return this.selectedCategories.has(category);
  }

  get filteredProducts() {
    if (this.selectedCategories.size === 0) {
      return this.products;
    }
    return this.products.filter(product => this.selectedCategories.has(product.product_type));
  }

  formatCategoryName(category: string): string {
    return category.replace(/_/g, ' '); // Replace underscores with spaces
  }

  // Function to sanitize and return safe HTML
  getSafeDescription(description: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(description);
  }

  // Function to truncate the description
  truncateDescription(description: string | null): string {
    if (description && description.length > this.maxDescriptionLength) {
      return description.substring(0, this.maxDescriptionLength) + '...';
    }
    return description || ''; // Return an empty string if description is null or undefined
  }
  
}
