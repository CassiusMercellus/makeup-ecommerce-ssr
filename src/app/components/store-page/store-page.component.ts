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

  // Pagination variables
  currentPage = 1;
  pageSize = 30; // Number of products per page

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
    this.currentPage = 1; // Reset to the first page on category change
  }

  isSelected(category: string): boolean {
    return this.selectedCategories.has(category);
  }

  // Get filtered products based on selected categories
  get filteredProducts() {
    let filtered = this.products;
    if (this.selectedCategories.size > 0) {
      filtered = this.products.filter(product => this.selectedCategories.has(product.product_type));
    }
    return filtered;
  }

  // Get products for the current page
  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = this.currentPage * this.pageSize;
    return this.filteredProducts.slice(start, end);
  }

  // Calculate total pages based on filtered products
  get totalPages() {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  // Method to return only a limited range of pages around the current page
  get displayedPages() {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    let startPage = currentPage - 2;
    let endPage = currentPage + 2;

    // Handle edge cases for pages near the start
    if (startPage < 1) {
      endPage = Math.min(endPage + (1 - startPage), totalPages);
      startPage = 1;
    }

    // Handle edge cases for pages near the end
    if (endPage > totalPages) {
      startPage = Math.max(startPage - (endPage - totalPages), 1);
      endPage = totalPages;
    }

    // Generate the page numbers to display
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  formatCategoryName(category: string): string {
    return category.replace(/_/g, ' '); // Replace underscores with spaces
  }

  getSafeDescription(description: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(description);
  }

  truncateDescription(description: string | null): string {
    if (description && description.length > this.maxDescriptionLength) {
      return description.substring(0, this.maxDescriptionLength) + '...';
    }
    return description || ''; // Return an empty string if description is null or undefined
  }
}
