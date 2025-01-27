import { ConfigFormData } from "@/types/types";
import { Config } from "@/types/types";
import { useState } from "react";

export default function ConfigForm({
  onSubmit,
  editingConfig,
  onCancel,
}: {
  onSubmit: (data: ConfigFormData) => Promise<void>;
  editingConfig: Config | null;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<ConfigFormData>({
    name: editingConfig?.name || "",
    from_email: editingConfig?.from_email || "",
    smtp_server: editingConfig?.smtp_server || "",
    smtp_port: editingConfig?.smtp_port || 587,
    smtp_email: editingConfig?.smtp_email || "",
    smtp_password: editingConfig?.smtp_password || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      {/* Form fields remain the same */}
      <div>
        <label className="block">Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block">From Email:</label>
        <input
          type="text"
          value={formData.from_email}
          onChange={(e) =>
            setFormData({ ...formData, from_email: e.target.value })
          }
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block">SMTP Server:</label>
        <input
          type="text"
          value={formData.smtp_server}
          onChange={(e) =>
            setFormData({ ...formData, smtp_server: e.target.value })
          }
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block">SMTP Port:</label>
        <input
          type="number"
          value={formData.smtp_port}
          onChange={(e) =>
            setFormData({ ...formData, smtp_port: Number(e.target.value) })
          }
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block">SMTP Email:</label>
        <input
          type="email"
          value={formData.smtp_email}
          onChange={(e) =>
            setFormData({ ...formData, smtp_email: e.target.value })
          }
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="block">SMTP Password:</label>
        <input
          type="password"
          value={formData.smtp_password}
          onChange={(e) =>
            setFormData({ ...formData, smtp_password: e.target.value })
          }
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingConfig ? "Update" : "Add"} Configuration
        </button>
        {editingConfig && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
