import { Button, Input, Spinner } from "../../ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { AppUpdateConfigType } from "../../types/appUpdate.type";

const appUpdateSchema = z.object({
  isEnabled: z.boolean(),
  minimumVersion: z.string().regex(/^\d+\.\d+\.\d+$/, "Format: X.Y.Z (e.g., 1.0.0)"),
  currentVersion: z.string().regex(/^\d+\.\d+\.\d+$/, "Format: X.Y.Z (e.g., 1.0.5)"),
  appStoreLink: z.string().url("Must be a valid URL").or(z.literal("")),
  playStoreLink: z.string().url("Must be a valid URL").or(z.literal("")),
  updateMessage: z.string().min(5, "Message must be at least 5 characters").max(200, "Message must be less than 200 characters"),
  isForceUpdate: z.boolean(),
});

type AppUpdateFormValues = z.infer<typeof appUpdateSchema>;

type AppUpdateFormProps = {
  initialData: AppUpdateConfigType;
  onSubmit: (data: AppUpdateConfigType) => void;
  isPending: boolean;
};

export const AppUpdateForm = ({ initialData, onSubmit, isPending }: AppUpdateFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AppUpdateFormValues>({
    resolver: zodResolver(appUpdateSchema),
    defaultValues: initialData,
  });

  const isForceUpdate = watch("isForceUpdate");

  return (
    <form className="space-y-8" onSubmit={handleSubmit((data) => onSubmit(data))}>
      {/* Enable Update Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Update Notification Settings</h3>
        
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            {...register("isEnabled")}
            className="w-5 h-5 text-blue-600 rounded cursor-pointer"
          />
          <label className="flex-1 text-gray-700 font-medium cursor-pointer">
            Enable Update Notification
          </label>
          <span className="text-sm text-gray-500">Users will see the update dialog on app startup</span>
        </div>
      </div>

      {/* Version Information Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Version Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Minimum Version (Current Users Have)"
            placeholder="e.g., 1.0.0"
            {...register("minimumVersion")}
            error={errors.minimumVersion?.message}
            helper="Oldest version still supported"
          />

          <Input
            label="Current Version (Latest Available)"
            placeholder="e.g., 1.0.5"
            {...register("currentVersion")}
            error={errors.currentVersion?.message}
            helper="New version users will update to"
          />
        </div>
      </div>

      {/* Store Links Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">App Store Links</h3>
        
        <Input
          label="iOS App Store Link"
          type="url"
          placeholder="https://apps.apple.com/app/fidha/id..."
          {...register("appStoreLink")}
          error={errors.appStoreLink?.message}
          helper="URL to your app on iOS App Store"
        />

        <Input
          label="Android Play Store Link"
          type="url"
          placeholder="https://play.google.com/store/apps/details?id=..."
          {...register("playStoreLink")}
          error={errors.playStoreLink?.message}
          helper="URL to your app on Google Play Store"
        />
      </div>

      {/* Update Message Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Update Message</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Shown to Users
          </label>
          <textarea
            {...register("updateMessage")}
            placeholder="e.g., Great new features available! Please update to continue."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          {errors.updateMessage && (
            <p className="text-red-500 text-sm mt-1">{errors.updateMessage.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">Keep it concise and informative</p>
        </div>
      </div>

      {/* Force Update Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Update Policy</h3>
        
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              {...register("isForceUpdate")}
              className="w-5 h-5 text-red-600 rounded cursor-pointer mt-1"
            />
            <div className="flex-1">
              <label className="text-gray-900 font-medium cursor-pointer block">
                Force Update
              </label>
              <p className="text-sm text-gray-600 mt-1">
                If enabled, users CANNOT dismiss the dialog and must update. Use only for critical updates.
              </p>
            </div>
          </div>

          {isForceUpdate && (
            <div className="p-3 bg-red-50 border border-red-200 rounded mt-2">
              <p className="text-sm text-red-700 font-medium">
                ⚠️ Warning: Force updates will prevent users from using older versions. Use with caution!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
        
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 text-center space-y-3">
          <div className="text-3xl">⬆️</div>
          <h4 className="font-bold text-gray-900">App Update Available</h4>
          <p className="text-gray-600 text-sm">{watch("updateMessage") || "Update message will appear here"}</p>
          <p className="text-xs text-gray-500">
            Current: {watch("minimumVersion") || "X.Y.Z"} → New: {watch("currentVersion") || "X.Y.Z"}
          </p>
          <div className="flex gap-2 justify-center pt-2">
            {!isForceUpdate && <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded">Later</button>}
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">Update Now</button>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <Button type="submit" variant="action" className="flex-1">
          {isPending ? <Spinner /> : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
