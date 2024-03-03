export interface User {
  _id: string,
  name: string,
  email: string,
  invitedBoards: { boardId: string, canEdit: boolean }[],
}