import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendBroadcastNotificationApi } from "../api/notification.api";
import { Button, Input, confirmAlert } from "../ui";
import { toastPromise } from "../ui/Toasters/toast.helper";

const NotificationsPage = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [gender, setGender] = useState<'all' | 'male' | 'female'>('all');
  const [lastResult, setLastResult] = useState<null | {
    successCount: number;
    failureCount: number;
    totalTokens: number;
  }>(null);

  const trimmedTitle = title.trim();
  const trimmedMessage = message.trim();

  const estimatedRecipients = useMemo(() => {
    if (!lastResult) {
      if (gender === 'male') return "Will send to all male users with a registered push token.";
      if (gender === 'female') return "Will send to all female users with a registered push token.";
      return "Will send to every app user with a registered push token.";
    }
    return `Last send reached ${lastResult.successCount} devices, failed on ${lastResult.failureCount}, total targeted ${lastResult.totalTokens}.`;
  }, [lastResult, gender]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: sendBroadcastNotificationApi,
    onSuccess: (response) => {
      setLastResult(response.data);
      setTitle("");
      setMessage("");
    },
  });

  const genderLabel = gender === 'male' ? 'male users only' : gender === 'female' ? 'female users only' : 'all app users';

  const handleSend = async () => {
    if (!trimmedTitle || !trimmedMessage) {
      return;
    }

    const confirmed = await confirmAlert({
      title: "Send push notification?",
      text: `This will send the notification to ${genderLabel} who currently have a registered FCM token.`,
      confirmText: "Send now",
    });

    if (!confirmed) {
      return;
    }

    await toastPromise(
      mutateAsync({
        title: trimmedTitle,
        message: trimmedMessage,
        ...(gender !== 'all' && { gender }),
      }),
      {
        pending: "Sending notification...",
        success: "Notification sent successfully",
        error: "Failed to send notification",
      },
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-gray-900">Push Notifications</h1>
          <p className="text-sm text-gray-600">
            Write a title and message here. When you send it, the selected audience with a saved FCM token will receive a push notification.
          </p>
        </div>

        <div className="grid gap-5">
          <Input
            label="Notification Title"
            value={title}
            maxLength={80}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Example: New weekend offer is live"
          />

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Notification Message</label>
            <textarea
              value={message}
              maxLength={240}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write the message users should see in the push notification."
              className="min-h-36 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{estimatedRecipients}</span>
              <span>{message.length}/240</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Send To</label>
            <div className="flex gap-2">
              {(['all', 'male', 'female'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setGender(option)}
                  className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium capitalize transition ${
                    gender === option
                      ? option === 'male'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : option === 'female'
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-800 bg-gray-800 text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {option === 'all' ? 'All Users' : option === 'male' ? 'Male Only' : 'Female Only'}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
            Only users who have already opened the app and registered an FCM token can receive this notification.
          </div>

          {lastResult && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              Last broadcast result: {lastResult.successCount} sent, {lastResult.failureCount} failed, {lastResult.totalTokens} targeted.
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              disabled={isPending || (!trimmedTitle && !trimmedMessage)}
              onClick={() => {
                setTitle("");
                setMessage("");
              }}
            >
              Clear
            </Button>
            <Button
              variant="primary"
              loading={isPending}
              disabled={!trimmedTitle || !trimmedMessage}
              onClick={handleSend}
              className="min-w-36"
            >
              Send Notification
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;