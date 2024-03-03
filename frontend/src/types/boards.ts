export interface PublicBoardPermissions {
  anonUsers: {
    canEdit: boolean,
    canView: boolean,
  },
  registeredUsers: {
    canEdit: boolean,
    canView: boolean,
  },
}

export interface BoardItem {
  _id: string,
  title: string,
  customThumbnail: boolean,
  author: string,
  createdAt: string,
  updatedAt: string,
  modifiedBy: string,
  isFavorite: boolean,
  publicId: string,
  publicPermissions: PublicBoardPermissions,
}

export interface PublicBoardItem {
  _id: string,
  title: string,
  publicId: string,
  publicPermissions: PublicBoardPermissions,
}

export interface BoardFiltersPayload {
  search?: string,
  isFavorite?: boolean,
  board?: 'my' | 'shared',
}