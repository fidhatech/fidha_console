import api from "./axios";

export type BroadcastNotificationPayload = {
  title: string;
  message: string;
};

export type BroadcastNotificationResponse = {
  message: string;
  data: {
    successCount: number;
    failureCount: number;
    totalTokens: number;
  };
};

export const sendBroadcastNotificationApi = async (
  payload: BroadcastNotificationPayload,
): Promise<BroadcastNotificationResponse> => {
  const res = await api.post<BroadcastNotificationResponse>("/notifications/broadcast", payload);
  return res.data;
};