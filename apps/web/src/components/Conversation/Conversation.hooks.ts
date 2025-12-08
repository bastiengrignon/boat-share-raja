import type { Conversation, Message, QueryConversationId } from '@boat-share-raja/shared-types';
import { isNotEmpty, type TransformedValues, useForm } from '@mantine/form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TFunction } from 'i18next';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';

import { MESSAGE_TYPES } from '../../constants/string';
import { sortByUpdatedAt } from '../../lib/functional';
import { useAuthSession } from '../../lib/useSession';
import { routes } from '../../router';
import { conversationService } from '../../services/conversation';

const queryConversation = 'conversation';

interface ConversationInputHooks {
  t: TFunction;
}

export const useConversationHooks = ({ t }: ConversationInputHooks) => {
  const queryClient = useQueryClient();
  const { conversationId } = useParams<QueryConversationId>();
  const { user } = useAuthSession();
  const navigate = useNavigate();
  const viewPortRef = useRef<HTMLDivElement | null>(null);

  const sendMessageForm = useForm({
    initialValues: {
      message: '',
    },
    validateInputOnBlur: true,
    validate: {
      message: isNotEmpty(t('')),
    },
    transformValues: ({ message }) => ({
      content: message,
      // biome-ignore lint/style/noNonNullAssertion: user is always defined
      senderId: user?.id!,
      conversationId: conversationId as string,
      type: MESSAGE_TYPES.TEXT,
    }),
  });

  const { data: conversationData, isPending: conversationLoading } = useQuery({
    enabled: !!conversationId,
    queryKey: [queryConversation, conversationId],
    // biome-ignore lint/style/noNonNullAssertion: queryEnabled only if conversationId exists
    queryFn: () => conversationService.getConversationInformation({ conversationId: conversationId! }),
  });

  const { data: messagesData, isPending: messagesLoading } = useQuery({
    enabled: !!conversationId,
    queryKey: [queryConversation, 'messages', conversationId],
    // biome-ignore lint/style/noNonNullAssertion: queryEnabled only if conversationId exists
    queryFn: () => conversationService.getConversationMessages({ conversationId: conversationId! }),
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  const { mutate: sendMessageMutation, isPending: sendMessageLoading } = useMutation({
    mutationKey: [queryConversation, conversationId],
    mutationFn: conversationService.sendMessage,
    onSuccess: async () => {
      sendMessageForm.reset();
      await queryClient.invalidateQueries({ queryKey: [queryConversation, 'messages'] });
    },
  });

  const { mutate: markAsReadMutation } = useMutation({
    mutationKey: [queryConversation, conversationId, 'read'],
    mutationFn: conversationService.markConversationAsRead,
  });

  const messages = useMemo<Message[]>(
    () => (messagesData?.data?.messages || []).sort(sortByUpdatedAt<Message>('desc')),
    [messagesData?.data?.messages]
  );

  const conversation = useMemo<Conversation>(
    () => conversationData?.data?.conversation,
    [conversationData?.data?.conversation]
  );

  const formattedTitle = useMemo(() => {
    const otherParticipant = (conversation?.participants || []).find((participant) => participant.userId !== user?.id);
    return conversation?.title || otherParticipant?.user.name || 'Anonymous user';
  }, [conversation?.participants, conversation?.title, user?.id]);

  const backToConversations = useCallback(() => navigate(routes.messages.home), [navigate]);

  const handleSubmitMessage = useCallback(
    (values: TransformedValues<typeof sendMessageForm>) => sendMessageMutation(values),
    [sendMessageMutation]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: no Mantine form
  const handleSendMessageOnKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        // TODO: fix send not working
        // sendMessageForm.onSubmit(handleSubmitMessage)();
      }
    },
    [handleSubmitMessage]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: update scroll position on messages change
  useEffect(() => {
    const viewport = viewPortRef.current;
    if (!viewport) return;

    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages.length]);

  useEffect(() => {
    if (!conversationId || !user?.id) return;
    if (messages.length === 0) return;
    markAsReadMutation({ conversationId, userId: user.id });
  }, [conversationId, user?.id, messages.length, markAsReadMutation]);

  return {
    viewPortRef,
    formattedTitle,
    messages,
    sendMessageForm,
    messagesLoading,
    conversationLoading,
    sendMessageLoading,
    backToConversations,
    handleSubmitMessage,
    handleSendMessageOnKeyDown,
  };
};
