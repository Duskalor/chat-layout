import { userState } from '../store/user-state';

export const Dashboard = () => {
  const { onlineUsers, dashboardStats } = userState();

  return (
    <div className="h-full flex flex-col bg-surface p-6">
      <h1 className="text-2xl font-semibold text-text-primary mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-surface-alt p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-text-secondary mb-1">Online Users</h3>
          <p className="text-3xl font-bold text-text-primary">{onlineUsers.length}</p>
        </div>

        <div className="bg-surface-alt p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-text-secondary mb-1">Active Chats</h3>
          <p className="text-3xl font-bold text-text-primary">
            {dashboardStats?.activeChats ?? 0}
          </p>
        </div>

        <div className="bg-surface-alt p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-text-secondary mb-1">Total Messages</h3>
          <p className="text-3xl font-bold text-text-primary">
            {dashboardStats?.totalMessages ?? 0}
          </p>
        </div>

        <div className="bg-surface-alt p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-text-secondary mb-1">Total Todos</h3>
          <p className="text-3xl font-bold text-text-primary">
            {dashboardStats?.totalTodos ?? 0}
          </p>
        </div>

        <div className="bg-surface-alt p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-text-secondary mb-1">Completed Todos</h3>
          <p className="text-3xl font-bold text-green-600">
            {dashboardStats?.completedTodos ?? 0}
          </p>
        </div>

        <div className="bg-surface-alt p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-text-secondary mb-1">Pending Todos</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {dashboardStats?.pendingTodos ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
};
