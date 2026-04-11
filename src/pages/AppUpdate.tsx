import { useQuery, useMutation } from "@tanstack/react-query";
import { AppUpdateForm } from "../components/appUpdate/AppUpdateForm";
import { getAppUpdateConfigApi, updateAppUpdateConfigApi } from "../api/appUpdate.api";
import { showToast } from "../ui/Toasters/toast.helper";
import type { AppUpdateConfigType } from "../types/appUpdate.type";

const AppUpdatePage = () => {
  // Fetch current config
  const { data: config, isLoading: isLoadingConfig, error: loadError } = useQuery({
    queryKey: ["appUpdateConfig"],
    queryFn: getAppUpdateConfigApi,
    retry: 3,
  });

  // Update config mutation
  const { mutateAsync: updateConfig, isPending: isUpdating } = useMutation({
    mutationFn: updateAppUpdateConfigApi,
    onSuccess: () => {
      showToast.success("App update configuration saved successfully!");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to save configuration";
      showToast.error(message);
    },
  });

  const handleSubmit = async (data: AppUpdateConfigType) => {
    await updateConfig(data);
  };

  if (isLoadingConfig) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-semibold">Error loading app update configuration</p>
            <p className="text-red-700 text-sm mt-2">{(loadError as any)?.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const defaultConfig: AppUpdateConfigType = config || {
    isEnabled: false,
    minimumVersion: "1.0.0",
    currentVersion: "1.0.0",
    appStoreLink: "",
    playStoreLink: "",
    updateMessage: "Please update the app to continue",
    isForceUpdate: false,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">App Update Management</h1>
          <p className="text-gray-600 mt-2">
            Control when users see app update notifications. Configure update settings and store links.
          </p>
        </div>

        {/* Status Card */}
        <div className={`mb-6 rounded-lg p-4 ${defaultConfig?.isEnabled ? 'bg-green-50 border-l-4 border-green-500' : 'bg-yellow-50 border-l-4 border-yellow-500'}`}>
          <p className={`font-medium ${defaultConfig?.isEnabled ? 'text-green-800' : 'text-yellow-800'}`}>
            {defaultConfig?.isEnabled 
              ? '✅ App update notifications are ENABLED' 
              : '⚠️ App update notifications are DISABLED'}
          </p>
          <p className={`text-sm mt-1 ${defaultConfig?.isEnabled ? 'text-green-700' : 'text-yellow-700'}`}>
            {defaultConfig?.isEnabled 
              ? `Users will see the update dialog when they open the app (v${defaultConfig?.currentVersion || 'X.Y.Z'})` 
              : 'Users will not see any update notifications'}
          </p>
        </div>

        {/* Form */}
        <AppUpdateForm 
          initialData={defaultConfig} 
          onSubmit={handleSubmit} 
          isPending={isUpdating}
        />
      </div>
    </div>
  );
};

export default AppUpdatePage;
