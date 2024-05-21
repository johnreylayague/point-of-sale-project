export type Shapes = {
  _id: string;
  Shape: string;
  Default: boolean;
  RecordStatusType_ReferenceId: string;
  __v: number;
  CreatorId: string;
  RepresentationId: string;
  id: string;
};

export type ShapesResponseData = {
  message: string;
  total: number;
  data: Shapes[];
};

export type ShapesResponse = {
  response: ShapesResponseData;
  status: 200;
};

export type FetchShapesResponse = ShapesResponse | undefined;
