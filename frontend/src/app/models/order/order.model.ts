import { CartItemModel } from '../product/product.model';

export interface OrderRequest {
  items: CartItemModel[];
  total: number;
  shipping_address: string;
}

export interface OrderModel extends OrderRequest {
  id: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  created_at: Date;
}
