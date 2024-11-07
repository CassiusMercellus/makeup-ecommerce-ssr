import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, take, map } from 'rxjs/operators'; // Ensure all necessary operators are imported
import { of, Observable, from } from 'rxjs'; // Import Observable here
import { arrayUnion, arrayRemove } from 'firebase/firestore';
import { HttpClient } from '@angular/common/http';

export interface Cart {
  items: string[];
}
export interface Product {
  id: string;
  name: string;
  api_featured_image: string;
  price: number; // Add other necessary fields as per your API response
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private http: HttpClient
  ) {}

  // Add item to user's cart
  addToCart(itemId: string): Promise<void> {
    return this.auth.user.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          const cartDoc: AngularFirestoreDocument<any> = this.firestore.doc(`carts/${user.uid}`);
          return cartDoc.set({ items: arrayUnion(itemId) }, { merge: true });
        } else {
          return Promise.reject('User not authenticated');
        }
      })
    ).toPromise();
  }

  getCartItems() {
    return this.auth.user.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc<Cart>(`carts/${user.uid}`).valueChanges().pipe(
            switchMap(cart => {
              console.log('Cart:', cart); // Log the cart data
              if (cart && cart.items) {
                return this.http.get<Product[]>(`https://makeup-api.herokuapp.com/api/v1/products.json`).pipe(
                  map(products => {
                    console.log('Products:', products); // Log the fetched products
                    const filteredProducts = products.filter(product => 
                      cart.items.includes(product.id) // Compare directly as numbers
                    );
                    console.log('Filtered Products:', filteredProducts); // Log the filtered products
                    return filteredProducts; 
                  })
                );
              } else {
                return of([]);
              }
            })
          );
        } else {
          return of([]);
        }
      })
    );
  } 

  removeFromCart(itemId: string): Promise<void> {
    return this.auth.user.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          const cartDoc: AngularFirestoreDocument<any> = this.firestore.doc(`carts/${user.uid}`);
          return cartDoc.set({ items: arrayRemove(itemId) }, { merge: true });
        } else {
          return Promise.reject('User not authenticated');
        }
      })
    ).toPromise();
  }
  

}
