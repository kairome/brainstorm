export interface BoardItem {
  _id: string,
  title: string,
  customThumbnail: boolean,
  author: string,
  createdAt: string,
  updatedAt: string,
  modifiedBy: string,
  isFavorite: boolean,
}

export interface BoardFiltersPayload {
  search?: string,
  isFavorite?: boolean,
  board?: 'my' | 'shared',
}