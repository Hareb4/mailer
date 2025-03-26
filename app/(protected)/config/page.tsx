"use client";

import { Suspense, lazy } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { encrypt } from "@/utils/crypt";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Config, ConfigFormData } from "@/types/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Paperclip, Image, FilePlus, Plus, Mail } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Lazy load the form component since it's not needed immediately
const ConfigForm = lazy(() => import("@/components/config/ConfigForm"));

// Optimized ConfigList with virtualization for large lists
function ConfigList2({
  configs,
  onEdit,
  onDelete,
}: {
  configs: Config[];
  onEdit: (config: Config) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">
        <span className="inline-block">Saved Configs</span>
      </h2>
      {configs.map((config) => (
        <Card
          key={config._id}
          className="transform transition-transform hover:scale-[1.01]"
        >
          <CardContent className="p-4">
            {/* Prioritize loading of important content */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{config.name}</h3>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Email:</span> {config.from_email}
              </p>
              {/* Defer less important content */}
              <div className="text-sm text-gray-500">
                <p>SMTP Server: {config.smtp_server}</p>
                <p>SMTP Port: {config.smtp_port}</p>
                <p>SMTP Email: {config.smtp_email}</p>
              </div>
            </div>
            <div className="mt-4 space-x-2">
              <button
                onClick={() => onEdit(config)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(config._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ConfigList({
  configs,
  onEdit,
  onDelete,
}: {
  configs: Config[];
  onEdit: (config: Config) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-medium mb-4">Saved Configurations</h2>

      {configs.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          No configurations saved yet
        </div>
      ) : (
        configs.map((config) => (
          <div key={config._id} className="config-card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-medium">{config.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {config.from_email}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                <div>
                  <span className="text-gray-400">SMTP Server</span>
                  <p className="text-gray-600 truncate">{config.smtp_server}</p>
                </div>
                <div>
                  <span className="text-gray-400">Port</span>
                  <p className="text-gray-600">{config.smtp_port}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400">SMTP Email</span>
                  <p className="text-gray-600 truncate">{config.smtp_email}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => onEdit(config)}
                className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-600 dark:text-white rounded-full hover:bg-blue-100 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(config._id)}
                className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 dark:bg-red-600 dark:text-white rounded-full hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Optimized loading skeleton
function ConfigListLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-32" /> {/* Title skeleton */}
      {[1, 2].map((i) => (
        <div key={i} className="border rounded-lg p-4 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <div className="mt-4 space-x-2">
            <Skeleton className="h-8 w-16 inline-block" />
            <Skeleton className="h-8 w-16 inline-block" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Error boundary component
function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div
      role="alert"
      className="text-red-500 p-4 border border-red-300 rounded"
    >
      <h2 className="text-lg font-bold">Error Occurred</h2>
      <p>Message: {error.message}</p>
      <p>Stack: {error.stack}</p>
    </div>
  );
}

// Main page component with performance optimizations
export default function ConfigPage() {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [editingConfig, setEditingConfig] = useState<Config | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<string | null>(null);

  // Optimized data fetching
  useEffect(() => {
    let isMounted = true;
    const source = axios.CancelToken.source();

    const fetchConfigs = async () => {
      try {
        const { data } = await axios.get("/api/configs", {
          cancelToken: source.token,
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        if (isMounted) {
          setConfigs(data);
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request was canceled", err.message);
          // Optionally, you can choose to not set an error state for cancellations
          return;
        }

        if (isMounted) {
          console.error("Fetch configs error:", err);
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to fetch configurations")
          );
        }
      }
    };

    fetchConfigs();

    return () => {
      isMounted = false;
      source.cancel("Component unmounted or dependencies changed");
    };
  }, []); // Empty dependency array means this runs once on mount

  const handleSubmit = async (formData: ConfigFormData) => {
    try {
      if (editingConfig) {
        await axios.put(`/api/configs/${editingConfig._id}`, formData);
      } else {
        const encryptedData = {
          ...formData,
          smtp_password: encrypt(formData.smtp_password),
        };
        await axios.post("/api/configs", encryptedData);
      }

      // Optimistic update
      const updatedConfigs = editingConfig
        ? configs.map((c) =>
            c._id === editingConfig._id ? { ...c, ...formData } : c
          )
        : [
            ...configs,
            { ...formData, _id: Date.now().toString(), user_id: "temp" },
          ];

      setConfigs(updatedConfigs);
      setEditingConfig(null);
      setIsFormVisible(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    }
  };

  // Function to show delete confirmation modal
  const showDeleteModal = (id: string) => {
    setConfigToDelete(id);
    setIsDeleteModalVisible(true);
  };

  // Function to handle actual deletion
  const confirmDelete = async () => {
    if (!configToDelete) return;

    try {
      // Optimistic delete
      setConfigs(configs.filter((c) => c._id !== configToDelete));
      await axios.delete(`/api/configs/${configToDelete}`);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
      // Revert on error
      const { data } = await axios.get("/api/configs");
      setConfigs(data);
    } finally {
      setIsDeleteModalVisible(false);
      setConfigToDelete(null);
      toast.success("Configuration deleted successfully");
    }
  };

  if (error) {
    return <ErrorBoundary error={error} />;
  }

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto rounded-2xl shadow-sm">
        {/* Header with action button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-medium ">Email Configurations</h1>

          {!isFormVisible && (
            <button
              onClick={() => setIsFormVisible(true)}
              className="flex items-center gap-2 h-10 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              <span className="text-sm font-medium">Add Configuration</span>
            </button>
          )}
        </div>

        {/* Main content area */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Config List */}
          <div className="overflow-hidden">
            <Suspense fallback={<ConfigListLoading />}>
              <ConfigList
                configs={configs}
                onEdit={(config) => {
                  setEditingConfig(config);
                  setIsFormVisible(true);
                }}
                onDelete={showDeleteModal}
              />
            </Suspense>
          </div>

          {/* Config Form */}
          <div className="p-6 rounded-2xl">
            <Suspense
              fallback={
                <div className="animate-pulse space-y-4">
                  <div className="h-5 bg-gray-200 rounded-full w-1/3"></div>
                  <div className="h-32 bg-gray-200 rounded-lg"></div>
                  <div className="h-8 bg-gray-200 rounded-full w-1/2"></div>
                </div>
              }
            >
              {isFormVisible ? (
                <>
                  <h2 className="text-lg font-medium mb-6 ">
                    {editingConfig ? "Edit Configuration" : "New Configuration"}
                  </h2>
                  <ConfigForm
                    onSubmit={handleSubmit}
                    editingConfig={editingConfig}
                    onCancel={() => {
                      setEditingConfig(null);
                      setIsFormVisible(false);
                    }}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <div className="w-16 h-16 mb-4 bg-gray-100 dark:bg-[#18181B] rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-center text-sm">
                    Select a configuration to edit or create a new one
                  </p>
                </div>
              )}
            </Suspense>
          </div>
        </div>

        {/* Status messages */}
        <div className="mt-6">
          {statusMessage && (
            <div
              className={`p-4 rounded-full text-sm ${statusMessage.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
            >
              {statusMessage.message}
            </div>
          )}
        </div>
      </div>

      {/* Modal component for confirmation */}

      <AlertDialog open={isDeleteModalVisible}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this configuration?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteModalVisible(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
