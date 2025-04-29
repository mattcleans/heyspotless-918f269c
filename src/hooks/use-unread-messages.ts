
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth";
import { supabase } from "@/integrations/supabase/client";

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, userId } = useAuthStore();

  const fetchUnreadMessages = async () => {
    try {
      if (!isAuthenticated) {
        const { count } = await supabase
          .from('support_messages')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'unread')
          .eq('sender_type', 'guest');

        setUnreadCount(count || 0);
      } else if (userId) {
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching unread messages:', error);
    }
  };

  useEffect(() => {
    fetchUnreadMessages();

    const subscription = supabase
      .channel('unread-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_messages'
        },
        () => {
          fetchUnreadMessages();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated, userId]);

  return unreadCount;
};
