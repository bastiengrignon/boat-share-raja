import dayjs from 'dayjs';

export const sortByUpdatedAt =
  <T extends { updatedAt: string | Date }>(direction = 'asc') =>
  (a: T, b: T) =>
    direction === 'asc'
      ? dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf()
      : dayjs(a.updatedAt).valueOf() - dayjs(b.updatedAt).valueOf();
