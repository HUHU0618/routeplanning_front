export interface BookListItem {
  key: number;
  name: string;
  num: number;
  price: number;
  category: string;
  author: string;
  publisher: string;
  desc: string;
  // disabled?: boolean;
  // href: string;
  // avatar: string;
  // title: string;
  // owner: string;
  // status: number;
  // updatedAt: Date;
  // createdAt: Date;
  // progress: number;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter?: string;
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
}
