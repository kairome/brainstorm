import React, { useMemo, useState } from 'react';
import commonS from 'css/common.module.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchMembers, removeMember } from 'api/members';
import Loader from 'ui/Loader/Loader';
import _ from 'lodash';
import Card from 'ui/Card/Card';
import { IoTrashOutline, IoChevronDownOutline } from 'react-icons/io5';
import { BoardMember } from 'types/members';
import ConfirmationModal from 'ui/Modal/ConfirmationModal';
import { useNotify } from 'store/alert';
import { AxiosError } from 'axios';
import { getApiErrors } from 'utils/apiErrors';
import MemberBoardsModal from 'pages/Members/MemberBoardsModal';
import SearchInput from 'ui/Input/SearchInput';

import s from './Members.module.css';

const MembersPages: React.FC = () => {
  const notify = useNotify();
  const { data, isLoading, isFetched, refetch: loadMembers } = useQuery({
    queryKey: [fetchMembers.name],
    queryFn: fetchMembers.request,
  });

  const [showMemberBoards, setShowMemberBoards] = useState(false);
  const [currentMember, setCurrentMember] = useState<BoardMember | null>(null);

  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);

  const [memberSearchText, setMemberSearchText] = useState('');

  const { mutate: removeMemberRequest, isPending: removeLoading, isSuccess: removeSuccess } = useMutation({
    mutationFn: removeMember.request,
    onSuccess: () => {
      notify({
        type: 'success',
        message: 'Member removed!',
      });
      loadMembers();
    },
    onError: (err: AxiosError) => {
      const errorMsg = getApiErrors(err);
      notify({
        type: 'error',
        message: typeof errorMsg === 'string' ? errorMsg : 'Failed to remove the member',
      });
    },
  });

  const members = useMemo(() => {
    if (!memberSearchText.trim()) {
      return data;
    }

    return _.filter(data, (member) => {
      const { name, email } = member;
      const searchTerm = memberSearchText.toLowerCase();

      const searchText = name ? `${name} ${email}` : email;

      return _.includes(searchText.toLowerCase(), searchTerm);
    });
  }, [data, memberSearchText]);

  const handleShowMemberBoards = (member: BoardMember) => {
    setShowMemberBoards(true);
    setCurrentMember(member);
  };

  const handleCloseMemberBoards = () => {
    setShowMemberBoards(false);
    setCurrentMember(null);
  };

  const handleShowRemoveMember = (member: BoardMember) => {
    setShowRemoveConfirmation(true);
    setCurrentMember(member);
  };

  const handleCloseRemoveMember = () => {
    setShowRemoveConfirmation(false);
    setCurrentMember(null);
  };

  const handleRemoveMember = () => {
    if (!currentMember) {
      return;
    }

    removeMemberRequest({
      email: currentMember.email,
    });
  };

  const renderMembers = () => {
    if (isLoading) {
      return (
        <div className={s.loader}>
          <Loader />
        </div>
      );
    }

    if (_.isEmpty(data) && isFetched) {
      return (
        <div>
          You didn't invite any members yet :(
        </div>
      );
    }

    const list = _.map(members, (member) => {
      const { name, email, boards } = member;
      const firstLetter = name ? name[0] : email[0];
      const emailBlock = name ? (<div className={s.email}>{email}</div>) : null;
      const boardsLen = boards.length;
      return (
        <div key={member.email} className={s.member}>
          <div className={s.memberNameBlock}>
            <div className={s.memberIcon}>{firstLetter}</div>
            <div>
              <div className={s.name}>{name ?? email}</div>
              {emailBlock}
            </div>
          </div>
          <div>
            <div className={s.columnName}>boards</div>
            <div className={s.memberBoards} onClick={() => handleShowMemberBoards(member)}>
              {boardsLen} {boardsLen === 1 ? 'board' : 'boards'}
              <IoChevronDownOutline />
            </div>
          </div>
          <div className={s.removeMember} onClick={() => handleShowRemoveMember(member)}>
            <IoTrashOutline /> Remove member
          </div>
        </div>
      );
    });

    return (
      <Card className={s.membersList}>
        <SearchInput
          label="Search"
          placeholder="Search by name, email"
          className={s.membersSearch}
          onChange={setMemberSearchText}
          delay={700}
        />
        {_.isEmpty(list) && memberSearchText ? 'Nothing found' : list}
      </Card>
    );
  };

  return (
    <>
      <h1 className={commonS.pageTitle}>Members</h1>
      {renderMembers()}
      <MemberBoardsModal
        member={currentMember}
        show={showMemberBoards}
        onClose={handleCloseMemberBoards}
        loadMembers={loadMembers}
      />
      <ConfirmationModal
        title={currentMember ? `Remove ${currentMember.name ?? currentMember.email}` : 'Remove member'}
        text="Are you sure you want to remove this member from all boards? This action cannot be undone."
        show={showRemoveConfirmation}
        onClose={handleCloseRemoveMember}
        onConfirm={handleRemoveMember}
        isLoading={removeLoading}
        isSuccess={removeSuccess}
      />
    </>
  );
};

export default MembersPages;