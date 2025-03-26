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
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1.5">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="config-form-input"
              placeholder="Configuration name"
              required
            />
          </div>

          <div>
            <label className="block text-sm  mb-1.5">From Email</label>
            <input
              type="email"
              value={formData.from_email}
              onChange={(e) =>
                setFormData({ ...formData, from_email: e.target.value })
              }
              className="config-form-input"
              placeholder="sender@example.com"
              required
            />
          </div>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase mb-3">
              SMTP Settings
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm  mb-1.5">SMTP Server</label>
                <input
                  type="text"
                  value={formData.smtp_server}
                  onChange={(e) =>
                    setFormData({ ...formData, smtp_server: e.target.value })
                  }
                  className="config-form-input"
                  placeholder="smtp.example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm  mb-1.5">SMTP Port</label>
                <input
                  type="number"
                  value={formData.smtp_port}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      smtp_port: Number(e.target.value),
                    })
                  }
                  className="config-config-form-input"
                  placeholder="587"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm  mb-1.5">SMTP Email</label>
              <input
                type="email"
                value={formData.smtp_email}
                onChange={(e) =>
                  setFormData({ ...formData, smtp_email: e.target.value })
                }
                className="config-form-input"
                placeholder="username@example.com"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm  mb-1.5">SMTP Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.smtp_password}
                  onChange={(e) =>
                    setFormData({ ...formData, smtp_password: e.target.value })
                  }
                  className="config-form-input"
                  placeholder="•••••••••••"
                  required
                />
                {/* Optional: Add a show/hide password button */}
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    /* Toggle password visibility */
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end space-x-3">
          {editingConfig && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
          >
            {editingConfig ? "Update" : "Add"} Configuration
          </button>
        </div>

        {/* Optional: Test connection button */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => {
              /* Add test connection logic */
              const testSMTPConnection = async () => {
                try {
                  const response = await fetch(
                    `/api/test-smtp?smtpServer=${formData.smtp_server}&smtpPort=${formData.smtp_port}&smtpEmail=${formData.smtp_email}&smtpPassword=${formData.smtp_password}`
                  );
                  console.log("response", response);
                  if (!response.ok) {
                    throw new Error("Failed to test SMTP connection");
                  }
                  const data = await response.json();
                  if (data.success) {
                    alert("SMTP connection test successful!");
                  } else {
                    throw new Error(data.message);
                  }
                } catch (error: any) {
                  alert(`Error testing SMTP connection: ${error.message}`);
                }
              };
              testSMTPConnection();
            }}
            className="text-xs text-blue-500 hover:text-blue-700 hover:underline"
          >
            Test connection
          </button>
        </div>
      </form>
    </>
  );
}
