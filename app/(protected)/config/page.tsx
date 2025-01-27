"use client";

import { Suspense, lazy } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { encrypt } from "@/utils/crypt";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Config, ConfigFormData } from "@/types/types";

// Lazy load the form component since it's not needed immediately
const ConfigForm = lazy(() => import("@/components/config/ConfigForm"));

// Optimized ConfigList with virtualization for large lists
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
              <p className="text-sm text-gray-600">
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
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this configuration?")) return;

    try {
      // Optimistic delete
      setConfigs(configs.filter((c) => c._id !== id));
      await axios.delete(`/api/configs/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
      // Revert on error
      const { data } = await axios.get("/api/configs");
      setConfigs(data);
    }
  };

  if (error) {
    return <ErrorBoundary error={error} />;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        <span className="inline-block">Email Configurations</span>
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Config List with Suspense */}
        <Suspense fallback={<ConfigListLoading />}>
          <ConfigList
            configs={configs}
            onEdit={(config) => {
              setEditingConfig(config);
              setIsFormVisible(true);
            }}
            onDelete={handleDelete}
          />
        </Suspense>

        {/* Lazy load the form */}
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          {isFormVisible && (
            <ConfigForm
              onSubmit={handleSubmit}
              editingConfig={editingConfig}
              onCancel={() => {
                setEditingConfig(null);
                setIsFormVisible(false);
              }}
            />
          )}
        </Suspense>

        {/* Add New Config Button */}
        {!isFormVisible && (
          <button
            onClick={() => setIsFormVisible(true)}
            className="h-12 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add New Configuration
          </button>
        )}
      </div>
    </div>
  );
}
