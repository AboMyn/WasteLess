import { products } from '../data/products';

export function getStoredProducts() {
  const saved = localStorage.getItem('products');

  if (!saved) {
    localStorage.setItem('products', JSON.stringify(products));
    return products;
  }

  return JSON.parse(saved);
}

export function saveStoredProducts(updatedProducts: any[]) {
  localStorage.setItem('products', JSON.stringify(updatedProducts));
}

export function reserveProduct(productId: string) {
  const currentProducts = getStoredProducts();

  const updatedProducts = currentProducts.map((product: any) => {
    if (product.id === productId && product.quantity > 0) {
      return {
        ...product,
        quantity: product.quantity - 1,
      };
    }

    return product;
  });

  saveStoredProducts(updatedProducts);

  return updatedProducts.find((product: any) => product.id === productId);
}