export type Colors = {
  _id: string;
  Color: string;
  Default: boolean;
  RecordStatusType_ReferenceId: string;
  CreatorId: string;
  RepresentationId: string;
  id: string;
};

export type ColorsResponseData = {
  message: string;
  total: number;
  data: Colors[];
};

export type ColorsResponse = {
  response: ColorsResponseData;
  status: 200;
};

export type FetchColorsResponse = ColorsResponse | undefined;
