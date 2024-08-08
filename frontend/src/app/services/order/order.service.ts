import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderModel, OrderRequest } from '../../models/order/order.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {
  }

  placeOrder(orderRequest: OrderRequest): Observable<OrderModel> {
    return this.http.post<OrderModel>(this.apiUrl, orderRequest);
  }

  getOrders(): Observable<OrderModel[]> {
    return this.http.get<OrderModel[]>(this.apiUrl);
  }

  getOrder(id: number): Observable<OrderModel> {
    return this.http.get<OrderModel>(`${this.apiUrl}/${id}`);
  }

  // You can add more methods here as needed, such as:
  // updateOrderStatus, cancelOrder, etc.
}
