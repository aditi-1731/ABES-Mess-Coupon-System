import React, { useState, useEffect } from 'react';
import * as mockApi from '../../services/mockApi';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Search, Plus, Edit2, Trash2, Shield, UserCheck, UserX } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Add/Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    rollNo: '',
    department: 'Computer Science & Engineering',
    phone: '',
    mealsLeft: 90
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getUsers({
        role: roleFilter,
        search
      });
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter, search]);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'student',
      rollNo: '',
      department: 'Computer Science & Engineering',
      phone: '',
      mealsLeft: 90
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      rollNo: user.rollNo || '',
      department: user.department || '',
      phone: user.phone || '',
      mealsLeft: user.mealsLeft || 0
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await mockApi.updateUser(editingUser.id, formData);
        toast.success(`Updated ${formData.name}`);
      } else {
        await mockApi.addUser(formData);
        toast.success(`Created new user ${formData.name}`);
      }
      setModalOpen(false);
      loadUsers();
    } catch {
      toast.error('Operation failed');
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await mockApi.toggleUserStatus(user.id);
      toast.success(`User ${user.name} is now ${user.status === 'active' ? 'Deactivated' : 'Active'}`);
      loadUsers();
    } catch {
      toast.error('Failed to change status');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Permanently delete user ${user.name}?`)) return;
    try {
      await mockApi.deleteUser(user.id);
      toast.success('User deleted');
      loadUsers();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-navy dark:text-white">
            User Directory & Access Control
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage student registrations, counter staff, mess managers, and system administrators.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
          Add User
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, roll no, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg focus:ring-2 focus:ring-orange/30"
            />
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg focus:ring-2 focus:ring-orange/30"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="staff">Counter Staff</option>
              <option value="manager">Mess Managers</option>
              <option value="admin">Administrators</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-dark-border bg-slate-50 dark:bg-dark-bg/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Roll / ID</th>
                <th className="p-4">Department / Hall</th>
                <th className="p-4">Balance</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    Loading directory...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-dark-border/40">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-navy text-white font-bold text-xs flex items-center justify-center uppercase">
                          {u.avatar || u.name?.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{u.name}</p>
                          <p className="text-[10px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          u.role === 'admin'
                            ? 'navy'
                            : u.role === 'manager'
                            ? 'warning'
                            : u.role === 'staff'
                            ? 'primary'
                            : 'default'
                        }
                        size="sm"
                      >
                        {u.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4 font-mono text-slate-600 dark:text-slate-300">
                      {u.rollNo || u.employeeId || '—'}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {u.department || u.counter || 'Campus Dining'}
                    </td>
                    <td className="p-4 font-bold text-slate-700 dark:text-slate-200">
                      {u.role === 'student' ? `${u.mealsLeft || 0} meals` : '—'}
                    </td>
                    <td className="p-4">
                      <Badge variant={u.status === 'active' ? 'success' : 'danger'} size="sm" dot>
                        {u.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          title={u.status === 'active' ? 'Deactivate' : 'Activate'}
                          className="p-1.5 text-slate-400 hover:text-orange rounded-lg"
                        >
                          {u.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4 text-success" />}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(u)}
                          title="Edit User"
                          className="p-1.5 text-slate-400 hover:text-navy dark:hover:text-white rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          title="Delete User"
                          className="p-1.5 text-slate-400 hover:text-danger rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? `Edit ${editingUser.name}` : 'Add New User'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Official Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Portal Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs"
              >
                <option value="student">Student</option>
                <option value="staff">Staff (Counter)</option>
                <option value="manager">Mess Manager</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Roll / Employee ID
              </label>
              <input
                type="text"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                placeholder="e.g. 2300320100099"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs font-mono"
              />
            </div>
          </div>

          {formData.role === 'student' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Meals Balance
              </label>
              <input
                type="number"
                value={formData.mealsLeft}
                onChange={(e) => setFormData({ ...formData, mealsLeft: parseInt(e.target.value, 10) || 0 })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-xs"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-dark-border">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
