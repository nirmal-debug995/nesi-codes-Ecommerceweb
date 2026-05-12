import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Product } from "../common/product";
import { map, Observable } from "rxjs";
import { ProductCategory } from "../common/product-category";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // Backend API URLs
  private baseUrl = `${environment.apiUrl}/products`;

  private categoryUrl = `${environment.apiUrl}/product-category`;

  // injecting httpClient
  constructor(private httpClient: HttpClient) { }

  // get products by category
  getProductList(theCategoryId: number): Observable<Product[]> {

    const searchUrl =
      `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  // paginate products
  getProductListPaginate(
    thePage: number,
    thePageSize: number,
    theCategoryId: number
  ): Observable<GetResponseProducts> {

    const searchUrl =
      `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  // get categories
  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  // search products
  searchProducts(theKeyword: string): Observable<Product[]> {

    const searchUrl =
      `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  // search products with pagination
  searchProductsPaginate(
    thePage: number,
    thePageSize: number,
    theKeyword: string
  ): Observable<GetResponseProducts> {

    const searchUrl =
      `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  // get single product
  getProduct(theProductId: number): Observable<Product> {

    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  // helper method
  private getProducts(searchUrl: string): Observable<Product[]> {

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

// unwrap products response
interface GetResponseProducts {

  _embedded: {
    products: Product[];
  },

  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

// unwrap categories response
interface GetResponseProductCategory {

  _embedded: {
    productCategory: ProductCategory[];
  }
}
