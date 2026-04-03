import React from 'react';
import { useStore } from '../store/useStore';
import { FiUsers, FiShield, FiUser, FiEdit3 } from 'react-icons/fi';
import { Card } from '../components/ui/card';
import { PageTransition } from '../components/PageTransition';

export function AdminUsersPage() {
  const { role, allProfiles, toggleUserRole } = useStore();

  if (role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <FiShield className="w-16 h-16 text-rose-500/50" />
        <h2 className="text-2xl font-black">Access Denied</h2>
        <p className="text-muted-foreground">You do not have administrative privileges.</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center gap-4 p-6 rounded-2xl border bg-card/40 backdrop-blur-md">
          <div className="p-3 rounded-2xl bg-primary/10">
            <FiUsers className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-black tracking-tight">User Management</h1>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Control application access and roles locally
            </p>
          </div>
        </div>

        <Card className="overflow-hidden border-border/40 bg-card/30 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/50 text-muted-foreground uppercase tracking-wider text-[10px] font-black">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {allProfiles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      No users found in the system.
                    </td>
                  </tr>
                ) : (
                  allProfiles.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black uppercase text-sm border border-primary/20">
                            {user.full_name?.charAt(0) || <FiUser className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{user.full_name || 'Anonymous User'}</p>
                            <p className="text-[10px] text-muted-foreground font-semibold tracking-tighter">{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                            user.role === 'admin' 
                              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                              : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => toggleUserRole(user.id)}
                          className="p-2 hover:bg-muted rounded-xl transition-all active:scale-95 group-hover:text-primary flex items-center gap-2 ml-auto"
                        >
                          <FiEdit3 className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase">Toggle Role</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
