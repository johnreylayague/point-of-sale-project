export type Product = {
  _id: string;
  CategoryId: string;
  ColorId: string;
  ShapeId: string;
  Price: { $numberDecimal: string };
  Cost: { $numberDecimal: string };
  SoldByOptionId: string;
  CreatorId: string;
  RepresentationId: string;
  RecordStatusType_ReferenceId: string;
  __v: number;
  Name: string;
  SKU: string;
  BarCode: number;
  Description: string;
  Image: string;
  TrackStock: boolean;
  InStock: number;
  LowStock: number;
  isChecked: boolean;
  id: string;
};

export type ProductForm = {
  Name: string;
  Description: string;
  SKU: string;
  BarCode: number | "";
  TrackStock: boolean;
  InStock: number | "";
  LowStock: number | "";
  Price: string;
  Cost: string;
  SoldByOptionId: string;
  CategoryId: string;
  ShapeId: string;
  ColorId: string;
  Image: string;
  RepresentationId: string;
};

export type CreateProductResponseSuccess = {
  message: string;
  data: Product;
};

export type UpdateProductResponseSuccess = {
  message: string;
  data: Product;
};

export type UpdateProductCategoryResponseSuccess = {
  message: string;
  data: Product;
};

export type DeleteProductResponseSuccess = {
  message: string;
  total: number;
  data: Product;
};

export type DeleteGroupProductResponseSuccess = {
  message: string;
  total: number;
  data: Product[];
};

export type GetProductResponseSuccess = {
  message: string;
  total: number;
  data: Product[];
};

type ProductsPathErrors =
  | "Name"
  | "Description"
  | "SKU"
  | "BarCode"
  | "TrackStock"
  | "InStock"
  | "LowStock"
  | "Price"
  | "Cost"
  | "SoldByOptionId"
  | "ShapeId"
  | "ColorId"
  | "Image"
  | "CategoryId";

export type ProductsResponseError = {
  message: string;
  errors: {
    type: string;
    value: string;
    msg: string;
    path: ProductsPathErrors;
  }[];
};

export type CreateProductResponse = {
  response: CreateProductResponseSuccess | ProductsResponseError;
  status: 422 | 201;
};

export type UpdateProductResponse = {
  response: UpdateProductResponseSuccess | ProductsResponseError;
  status: 200 | 422 | 404;
};

export type UpdateProductCategoryResponse = {
  response: UpdateProductCategoryResponseSuccess | ProductsResponseError;
  status: 200 | 422 | 404;
};

export type GetProductResponse = {
  response: GetProductResponseSuccess | ProductsResponseError;
  status: 200;
};

export type DeleteProductResponse = {
  response: DeleteProductResponseSuccess | ProductsResponseError;
  status: 200 | 422 | 404;
};

export type DeleteGroupProductResponse = {
  response: DeleteGroupProductResponseSuccess | ProductsResponseError;
  status: 200 | 422;
};

export type CreateProductFunction = CreateProductResponse | undefined;
export type FetchProductFunction = GetProductResponse | undefined;
export type DeleteProductFunction = DeleteProductResponse | undefined;
export type UpdateProductFunction = UpdateProductResponse | undefined;
export type UpdateProductCategoryFunction =
  | UpdateProductCategoryResponse
  | undefined;

export type DeleteGroupProductFunction = DeleteGroupProductResponse | undefined;
