export interface ProductModel {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
}

export interface CartItemModel extends ProductModel {
  product_id: number;
  quantity: number;
}
