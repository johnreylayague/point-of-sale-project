export type soldByOptions = {
  _id: string;
  Name: string;
  Default: true;
  RecordStatusType_ReferenceId: string;
  CreatorId: string;
  id: string;
};

export type SoldByOptionsResponseData = {
  message: string;
  total: number;
  data: soldByOptions[];
};

export type SoldByOptionsResponse = {
  response: SoldByOptionsResponseData;
  status: 200;
};

export type FetchSoldByOptionsResponse = SoldByOptionsResponse | undefined;
