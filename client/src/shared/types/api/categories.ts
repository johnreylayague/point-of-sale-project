type CategoriesPathErrors = "Name" | "ColorId";

export type Category = {
  _id: string;
  Name: string;
  RecordStatusType_ReferenceId: string;
  CreatorId: string;
  ColorId: string;
  ProductsCount: number;
  __v: number;
  id: string;
};

export type CategoriesParam = {
  categoryId: string;
};

export type CategoriesForm = {
  Name: string;
  ColorId: string;
  RecordStatusType_ReferenceId: string;
};

export type CategoriesResponseSuccess = {
  message: string;
  data: Category[];
};

export type CategoriesResponseError = {
  message: string;
  errors: {
    type: string;
    value: string;
    msg: string;
    path: CategoriesPathErrors;
    location: string;
  }[];
};

export type GetCategoriesResponseSuccess = {
  message: string;
  total: number;
  data: Category[];
};

export type CategoriesResponseNotFound = {
  message: string;
};

export type DeleteCategoriesResponseSuccess = {
  message: string;
  data: Category;
};

export type GetCategoriesResponse = {
  response: GetCategoriesResponseSuccess;
  status: 200;
};

export type DeleteCategoriesResponse = {
  response:
    | DeleteCategoriesResponseSuccess
    | CategoriesResponseError
    | CategoriesResponseNotFound;
  status: 422 | 404 | 200;
};

export type UpdateCategoriesResponse = {
  response:
    | CategoriesResponseSuccess
    | CategoriesResponseError
    | CategoriesResponseNotFound;
  status: 422 | 404 | 200;
};

export type CreateCategoriesResponse = {
  response: CategoriesResponseSuccess | CategoriesResponseError;
  status: 422 | 201;
};

export type UpdateCategoriesFunction = UpdateCategoriesResponse | undefined;
export type DeleteCategoriesFunction = DeleteCategoriesResponse | undefined;
export type fetchCategoriesFunction = GetCategoriesResponse | undefined;
export type CreateCategoriesFunction = CreateCategoriesResponse | undefined;
