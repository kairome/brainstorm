export interface MemberBoard {
  id: string,
  title: string,
  canEdit: boolean,
}

export interface BoardMember {
  userId: string | null,
  email: string,
  name: string,
  boards: MemberBoard[],
}