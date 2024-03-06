import { DateTime } from 'luxon';

export const getFormattedDate = (dateString: string) => {
  const dateAt = DateTime.fromISO(dateString);
  const dateCutOff = DateTime.now().minus({ day: 1 });
  return dateCutOff < dateAt ?
    DateTime.now().plus(dateAt.diffNow()).toRelative() :
    dateAt.toFormat('dd.MM.yyyy HH:mm');
};