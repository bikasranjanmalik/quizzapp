import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<"name" | "password" | null>(null);
  const navigate = useNavigate();

  const demoName = "Bikash Malik";
  const demoPassword = "BikashMalik@123";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    sessionStorage.setItem("adminName", name);
    sessionStorage.setItem("adminPassword", password);

    navigate("/admin");
  };

  const copyToClipboard = (text: string, type: "name" | "password") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const fillDemoCredentials = () => {
    setName(demoName);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-blue-900 mb-3">Demo Credentials (for testing)</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-white rounded px-3 py-2 border border-blue-200">
              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">Admin Name</div>
                <div className="text-sm font-mono text-gray-900">{demoName}</div>
              </div>
              <button
                onClick={() => copyToClipboard(demoName, "name")}
                className="ml-3 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {copied === "name" ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="flex items-center justify-between bg-white rounded px-3 py-2 border border-blue-200">
              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">Password</div>
                <div className="text-sm font-mono text-gray-900">{demoPassword}</div>
              </div>
              <button
                onClick={() => copyToClipboard(demoPassword, "password")}
                className="ml-3 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {copied === "password" ? "Copied!" : "Copy"}
              </button>
            </div>
            <button
              onClick={fillDemoCredentials}
              className="w-full mt-2 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Fill Demo Credentials
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-800 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>

          <div className="mt-4 text-center">
            <a href="/" className="text-sm text-blue-600 hover:text-blue-800">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

