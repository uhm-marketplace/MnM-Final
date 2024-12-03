/* eslint-disable import/extensions */
import { Product } from '@prisma/client';
import ProductCard from '@/components/ProductCard';
import { prisma } from '@/lib/prisma';
import { ProductCardData } from '@/lib/ProductCardData';

const ProductCardHelper = async ({ product }: { product: Product }) => {
  const owner = await prisma.product.findUnique({
    where: { id: product.id },
  });
  const productData: ProductCardData = {
    name: product.name,
    picture: product.picture,
    price: product.price,
    description: product.description,
    reviews: productReviews,
    owner: owner?.name || '',
  };
  return <ProductCard product={productData} />;
};

export default ProductCardHelper;
