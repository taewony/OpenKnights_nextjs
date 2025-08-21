import React from "react";
import { Link } from "react-router-dom";

const UsersPage: React.FC = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">Registered Users</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300">
        View all registered users, their roles, and participation history.
      </p>
      {/* Future content for user listings */}
    </div>
  );
};

export default UsersPage;