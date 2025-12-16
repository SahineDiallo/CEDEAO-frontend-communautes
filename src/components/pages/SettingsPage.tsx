const SettingsPage = () => {
  return (
    <div>
    <h2 className="text-xl font-semibold text-gray-800 mb-6">Settings</h2>
    <div className="bg-white rounded-lg shadow p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="My Community Platform"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default User Role
          </label>
          <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>User</option>
            <option>Moderator</option>
            <option>Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Notifications
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-blue-600" defaultChecked />
              <span className="ml-2">New user registrations</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-blue-600" defaultChecked />
              <span className="ml-2">New community creations</span>
            </label>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Save Settings
        </button>
      </div>
    </div>
  </div>
  );
}


export default SettingsPage;