export type Images = {
  _id: string;
  Images: string;
  Default: boolean;
  RecordStatusType_ReferenceId: string;
  CreatorId: string;
  RepresentationId: string;
  id: string;
};

export type ImagesResponseData = {
  message: string;
  total: number;
  data: Images[];
};

export type ImagesResponse = {
  response: ImagesResponseData;
  status: 200;
};

export type FetchImagesResponse = ImagesResponse | undefined;
