export const computeChatId = (userIdA: string, userIdB: string): string =>
  [userIdA, userIdB].sort().join('_');

export const getOtherUserId = (chatId: string, currentUserId: string): string => {
  const parts = chatId.split('_');
  return parts.find((id) => id !== currentUserId) ?? parts[0];
};
