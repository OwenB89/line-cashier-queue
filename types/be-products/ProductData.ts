export interface ProductDataResponse {
    productDatas: ProductData[];
    totalData: 1;
}

/**
 * Define the product data type.
 */
export interface ProductData {
    productId: string;
    name: string;
    price: number;
}