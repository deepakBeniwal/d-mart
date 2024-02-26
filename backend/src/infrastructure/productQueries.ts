// productQueries.ts

import prisma from "../presentation/utils/prisma/client";

export const addProduct = async (
  name: string,
  description: string,
  price: number,
  categoryName: string,
  categoryDescription: string
): Promise<any> => {
  let category = await prisma.category.findUnique({
    where: {
      name: categoryName,
    },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: categoryName,
        description: categoryDescription,
      },
    });
  }

  const newProduct = await prisma.product.create({
    data: {
      name: name,
      description: description,
      price: price,
      categoryId: category.id,
    },
  });

  return newProduct;
};

export const getAllProducts = async (
  page: number,
  pageSize: number
): Promise<any> => {
  const skip = (page - 1) * pageSize;

  const totalCount = await prisma.product.count();
  const totalPages = Math.ceil(totalCount / pageSize);

  const products = await prisma.product.findMany({
    skip,
    take: pageSize,
  });

  return {
    products,
    page: page,
    pageSize: pageSize,
    totalCount,
    totalPages,
  };
};

export const getProductsByCategory = async (
  categoryId: number
): Promise<any> => {
  return await prisma.product.findMany({
    where: {
      categoryId: categoryId,
    },
    include: {
      category: true,
    },
  });
};

export const getProductById = async (id: number): Promise<any> => {
  return await prisma.product.findUnique({
    where: {
      id: id,
    },
    include: {
      category: true,
    },
  });
};

export const getCategories = async (): Promise<any> => {
  return await prisma.category.findMany();
};
