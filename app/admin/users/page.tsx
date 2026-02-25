'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Users, Plus, Pencil, Trash2, Shield, Crown, X, Phone, Calendar, Filter, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    createdAt: string;
}

const ROLES = [
    { value: 'VISITOR', label: 'Visitor' },
    { value: 'RENTER', label: 'Renter' },
    { value: 'INVESTOR', label: 'Investor' },
    { value: 'LANDLORD_MARKETING', label: 'Landlord (Marketing)' },
    { value: 'LANDLORD_MANAGED', label: 'Landlord (Managed)' },
    { value: 'ADMIN', label: 'Admin' },
];

const OWNER_ROLE = { value: 'OWNER', label: 'Owner (Head Boss)' };

export default function UsersPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'RENTER',
    });
    const [error, setError] = useState('');

    // Filters
    const [roleFilter, setRoleFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [search, setSearch] = useState('');

    const isOwner = session?.user?.role === 'OWNER';
    const availableRoles = isOwner ? [...ROLES, OWNER_ROLE] : ROLES;

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (roleFilter) params.set('role', roleFilter);
            if (dateFrom) params.set('dateFrom', dateFrom);
            if (dateTo) params.set('dateTo', dateTo);
            if (search) params.set('search', search);

            const res = await fetch(`/api/admin/users?${params.toString()}`);
            const data = await res.json();
            setUsers(data.users || []);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [roleFilter, dateFrom, dateTo]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers();
    };

    const clearFilters = () => {
        setRoleFilter('');
        setDateFrom('');
        setDateTo('');
        setSearch('');
        fetchUsers();
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', password: '', phone: '', role: 'RENTER' });
        setError('');
        setShowModal(true);
    };

    const handleEditUser = (user: User) => {
        if (user.role === 'OWNER' && !isOwner) {
            alert('Only the Owner can edit the Owner account');
            return;
        }
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            phone: user.phone || '',
            role: user.role,
        });
        setError('');
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const url = editingUser
                ? `/api/admin/users/${editingUser.id}`
                : '/api/admin/users';
            const method = editingUser ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Something went wrong');
                return;
            }

            setShowModal(false);
            fetchUsers();
        } catch (err) {
            setError('Failed to save user');
        }
    };

    const handleDeleteUser = async (user: User) => {
        if (user.role === 'OWNER') {
            alert('Cannot delete the Owner account');
            return;
        }

        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const res = await fetch(`/api/admin/users/${user.id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchUsers();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete user');
            }
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const handleMakeAdmin = async (user: User) => {
        if (!confirm(`Make ${user.name} an admin?`)) return;

        try {
            const res = await fetch(`/api/admin/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...user, role: 'ADMIN' }),
            });

            if (res.ok) {
                fetchUsers();
            }
        } catch (err) {
            alert('Failed to update user');
        }
    };

    const getRoleBadgeStyle = (role: string) => {
        switch (role) {
            case 'OWNER':
                return 'bg-yellow-500/10 text-yellow-500';
            case 'ADMIN':
                return 'bg-emerald-500/10 text-emerald-500';
            case 'RENTER':
                return 'bg-blue-500/10 text-blue-500';
            case 'INVESTOR':
                return 'bg-purple-500/10 text-purple-500';
            case 'LANDLORD_MARKETING':
            case 'LANDLORD_MANAGED':
                return 'bg-orange-500/10 text-orange-500';
            default:
                return 'bg-gray-500/10 text-gray-400';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Users</h1>
                    <p className="mt-1 text-gray-400">Manage users and admin access</p>
                </div>
                <Button onClick={handleAddUser}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </div>

            {/* Search & Filters */}
            <div className="mb-4 flex flex-wrap gap-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-64 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                    />
                    <Button type="submit" variant="secondary">Search</Button>
                </form>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm ${showFilters ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                >
                    <Filter className="h-4 w-4" />
                    Filters
                </button>

                {(roleFilter || dateFrom || dateTo) && (
                    <button onClick={clearFilters} className="text-sm text-gray-400 hover:text-white">
                        Clear all
                    </button>
                )}
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <label className="mb-2 block text-sm text-gray-400">Role</label>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                            >
                                <option value="">All Roles</option>
                                {availableRoles.map((role) => (
                                    <option key={role.value} value={role.value}>{role.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm text-gray-400">Joined From</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm text-gray-400">Joined To</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-white">{users.length}</div>
                    <div className="text-sm text-gray-400">Total Users</div>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-emerald-500">
                        {users.filter((u) => u.role === 'ADMIN' || u.role === 'OWNER').length}
                    </div>
                    <div className="text-sm text-gray-400">Admins</div>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-blue-500">
                        {users.filter((u) => u.role === 'RENTER').length}
                    </div>
                    <div className="text-sm text-gray-400">Renters</div>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                    <div className="text-2xl font-bold text-orange-500">
                        {users.filter((u) => u.role.startsWith('LANDLORD')).length}
                    </div>
                    <div className="text-sm text-gray-400">Landlords</div>
                </div>
            </div>

            {/* Users Table */}
            <div className="rounded-xl border border-gray-800 bg-gray-900">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        <Users className="mx-auto mb-2 h-8 w-8" />
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {user.role === 'OWNER' && (
                                                    <Crown className="h-5 w-5 text-yellow-500" />
                                                )}
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="flex items-center gap-1 text-sm text-gray-400">
                                                        <Mail className="h-3 w-3" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.phone ? (
                                                <a
                                                    href={`tel:${user.phone}`}
                                                    className="flex items-center gap-1 text-sm text-emerald-500 hover:underline"
                                                >
                                                    <Phone className="h-3 w-3" />
                                                    {user.phone}
                                                </a>
                                            ) : (
                                                <span className="text-sm text-gray-500">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getRoleBadgeStyle(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-sm text-gray-400">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(user.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {user.role !== 'OWNER' && (
                                                    <>
                                                        {user.role !== 'ADMIN' && (
                                                            <button
                                                                onClick={() => handleMakeAdmin(user)}
                                                                className="rounded-lg p-2 text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-500"
                                                                title="Make Admin"
                                                            >
                                                                <Shield className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleEditUser(user)}
                                                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user)}
                                                            className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-500"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {user.role === 'OWNER' && isOwner && session?.user?.id === user.id && (
                                                    <button
                                                        onClick={() => handleEditUser(user)}
                                                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {user.role === 'OWNER' && !isOwner && (
                                                    <span className="text-xs text-gray-500">Protected</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold">
                                {editingUser ? 'Edit User' : 'Add New User'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+20 10 1234 5678"
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Password {editingUser && '(leave blank to keep current)'}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                                    {...(!editingUser && { required: true })}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Role
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                                    disabled={editingUser?.role === 'OWNER'}
                                >
                                    {availableRoles.map((role) => (
                                        <option key={role.value} value={role.value}>
                                            {role.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1">
                                    {editingUser ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}