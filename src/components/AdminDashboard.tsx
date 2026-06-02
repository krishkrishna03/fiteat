import { useEffect, useState } from 'react'
import API from '../api/api'
import { useAuth } from '../context/AuthContext'

const AdminDashboard = () => {
  const auth = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [selectedUserPlans, setSelectedUserPlans] = useState<any[]>([])
  const [selectedUserPayments, setSelectedUserPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsResponse, usersResponse, paymentsResponse, analyticsResponse] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/users'),
          API.get('/admin/payments'),
          API.get('/admin/analytics'),
        ])
        setStats(statsResponse.data.stats)
        setAnalytics(analyticsResponse.data)
        setUsers(usersResponse.data)
        setPayments(paymentsResponse.data)
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Unable to load admin dashboard data.')
      } finally {
        setLoading(false)
      }
    }


    loadDashboard()
  }, [])

  const loadUserDetails = async (userId: string) => {
    try {
      const response = await API.get(`/admin/users/${userId}`)
      setSelectedUser(response.data.user)
      setSelectedUserPlans(response.data.plans)
      setSelectedUserPayments(response.data.payments)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to load user details.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1419] via-[#14272e] to-[#081018] px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-[1200px] space-y-8">
        <div className="rounded-[2rem] border border-[#84cc16]/20 bg-[#131d23]/80 p-8 shadow-2xl shadow-[#84cc16]/10 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#84cc16]">Admin Dashboard</p>
              <h1 className="mt-4 text-4xl font-bold text-white">Welcome, {auth.user?.name}</h1>
              <p className="mt-2 max-w-2xl text-slate-400">Review all user profiles, plan payments, and product performance from one place.</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[2rem] border border-[#84cc16]/20 bg-[#0f1419]/90 p-8 text-center text-slate-300">Loading dashboard...</div>
        ) : (
          <div className="space-y-8">
            {error && <div className="rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[2rem] bg-[#0f1419]/90 p-6 shadow-xl shadow-[#84cc16]/10">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Users</p>
                <p className="mt-4 text-3xl font-semibold text-white">{stats?.totalUsers ?? 0}</p>
              </div>
              <div className="rounded-[2rem] bg-[#0f1419]/90 p-6 shadow-xl shadow-[#84cc16]/10">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Revenue</p>
                <p className="mt-4 text-3xl font-semibold text-white">₹{stats?.totalRevenue ?? 0}</p>
              </div>
              <div className="rounded-[2rem] bg-[#0f1419]/90 p-6 shadow-xl shadow-[#84cc16]/10">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Active Plans</p>
                <p className="mt-4 text-3xl font-semibold text-white">{stats?.activeSubscriptions ?? 0}</p>
              </div>
              <div className="rounded-[2rem] bg-[#0f1419]/90 p-6 shadow-xl shadow-[#84cc16]/10">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Transactions</p>
                <p className="mt-4 text-3xl font-semibold text-white">{stats?.totalTransactions ?? 0}</p>
              </div>
            </div>

            <section className="rounded-[2rem] border border-[#84cc16]/20 bg-[#0f1419]/90 p-8 shadow-xl shadow-[#84cc16]/10">
              <h2 className="text-2xl font-semibold text-white">Recent Payments</h2>
              <div className="mt-6 space-y-3">
                {payments.length === 0 ? (
                  <p className="text-sm text-slate-400">No payments found yet.</p>
                ) : (
                  payments.slice(0, 8).map((payment) => (
                    <div key={payment._id} className="rounded-3xl bg-[#141f25] p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-white">{payment.planId?.name || 'Plan Purchase'}</p>
                          <p className="text-sm text-slate-400">{payment.userId?.name} · {payment.userId?.email}</p>
                        </div>
                        <div className="text-right text-white">
                          <p className="font-semibold">₹{payment.amount}</p>
                          <p className="text-sm text-slate-400">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#84cc16]/20 bg-[#0f1419]/90 p-8 shadow-xl shadow-[#84cc16]/10">
              <h2 className="text-2xl font-semibold text-white">Product & User Analytics</h2>
              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <div className="rounded-3xl bg-[#141f25] p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Active Users</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{analytics?.activeUsers ?? 0}</p>
                </div>
                <div className="rounded-3xl bg-[#141f25] p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Returning Customers</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{analytics?.returningCustomers ?? 0}</p>
                </div>
                <div className="rounded-3xl bg-[#141f25] p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Plan Types Purchased</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{analytics?.plansPurchased?.length ?? 0}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl bg-[#141f25] p-6">
                  <h3 className="text-lg font-semibold text-white">Top Plans Purchased</h3>
                  <div className="mt-4 space-y-3">
                    {analytics?.plansPurchased?.length ? (
                      analytics.plansPurchased.slice(0, 5).map((plan: any) => (
                        <div key={plan._id} className="rounded-2xl bg-[#111c22] p-4">
                          <p className="font-semibold text-white">{plan._id || 'Unknown plan'}</p>
                          <p className="text-sm text-slate-400">{plan.count} purchases</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">No plan purchase analytics available yet.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl bg-[#141f25] p-6">
                  <h3 className="text-lg font-semibold text-white">User Goals</h3>
                  <div className="mt-4 space-y-3">
                    {analytics?.usersByGoal?.length ? (
                      analytics.usersByGoal.map((item: any) => (
                        <div key={item._id} className="rounded-2xl bg-[#111c22] p-4">
                          <p className="font-semibold text-white">{item._id || 'Unknown'}</p>
                          <p className="text-sm text-slate-400">{item.count} users</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">No goal analytics available yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#84cc16]/20 bg-[#0f1419]/90 p-8 shadow-xl shadow-[#84cc16]/10">
              <h2 className="text-2xl font-semibold text-white">User Profiles</h2>
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-[#152a33] text-sm text-left text-slate-300">
                  <thead>
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Plans</th>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#152a33]">
                    {users.map((userItem) => (
                      <tr key={userItem._id} className="bg-[#111c22] hover:bg-[#172a34]">
                        <td className="px-4 py-4 font-semibold text-white">{userItem.name}</td>
                        <td className="px-4 py-4 text-slate-400">{userItem.email}</td>
                        <td className="px-4 py-4 text-slate-400">{userItem.activePlans?.length ?? 0}</td>
                        <td className="px-4 py-4 text-slate-400">{new Date(userItem.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => loadUserDetails(userItem._id)}
                            className="rounded-full bg-[#84cc16]/10 px-4 py-2 text-sm font-semibold text-[#84cc16] transition hover:bg-[#84cc16]/20"
                          >
                            View purchases
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {selectedUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                <div className="relative w-full max-w-6xl overflow-y-auto rounded-[2rem] border border-[#84cc16]/20 bg-[#0b1316] p-6 shadow-2xl shadow-black/80">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="absolute right-4 top-4 rounded-full border border-slate-700 bg-[#111f26] px-4 py-2 text-sm text-slate-300 transition hover:border-white hover:text-white w-fit"
                  >
                    Close
                  </button>

                  <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-[#84cc16]/10 bg-[#141f25] p-6 text-white shadow-inner shadow-[#84cc16]/5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold">{selectedUser.name}'s Profile & History</h2>
                      <p className="text-sm text-slate-400 mt-2">{selectedUser.email}</p>
                    </div>
                    <span className="rounded-3xl bg-[#0d1614] px-4 py-2 text-sm font-semibold text-[#84cc16]">User detail popup</span>
                  </div>

                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    <div className="rounded-3xl bg-[#141f25] p-6 shadow-lg shadow-[#84cc16]/5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-[#84cc16]/20 p-3 text-xl">👤</div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-[#84cc16]">Name</p>
                          <p className="text-sm font-semibold text-white">{selectedUser.name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-[#141f25] p-6 shadow-lg shadow-[#84cc16]/5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-[#84cc16]/20 p-3 text-xl">📱</div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-[#84cc16]">Phone</p>
                          <p className="text-sm font-semibold text-white">{selectedUser.phone || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-[#141f25] p-6 shadow-lg shadow-[#84cc16]/5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-[#84cc16]/20 p-3 text-xl">⚕️</div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-[#84cc16]">Age</p>
                          <p className="text-sm font-semibold text-white">{selectedUser.age ?? 'N/A'} years</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-[#141f25] p-6 shadow-lg shadow-[#84cc16]/5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-[#84cc16]/20 p-3 text-xl">⚖️</div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-[#84cc16]">Weight</p>
                          <p className="text-sm font-semibold text-white">{selectedUser.weight ?? 'N/A'} kg</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-[#141f25] p-6 shadow-lg shadow-[#84cc16]/5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-[#84cc16]/20 p-3 text-xl">📏</div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-[#84cc16]">Height</p>
                          <p className="text-sm font-semibold text-white">{selectedUser.height ?? 'N/A'} cm</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-[#141f25] p-6 shadow-lg shadow-[#84cc16]/5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-[#84cc16]/20 p-3 text-xl">📍</div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-[#84cc16]">Location</p>
                          <p className="text-sm font-semibold text-white">{selectedUser.location || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-[#141f25] p-6 shadow-lg shadow-[#84cc16]/5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-[#84cc16]/20 p-3 text-xl">🏠</div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-[#84cc16]">Address</p>
                          <p className="text-sm font-semibold text-white truncate">{selectedUser.address || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-[#141f25] p-6 shadow-lg shadow-[#84cc16]/5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-[#84cc16]/20 p-3 text-xl">🎯</div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-[#84cc16]">Member Since</p>
                          <p className="text-sm font-semibold text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl bg-[#141f25] p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span>📋</span> Active Plans ({selectedUserPlans.length})
                      </h3>
                      <div className="space-y-3">
                        {selectedUserPlans.length === 0 ? (
                          <p className="text-sm text-slate-400">No plans purchased yet.</p>
                        ) : (
                          selectedUserPlans.map((plan: any) => (
                            <div key={plan._id} className="rounded-2xl bg-[#111c22] p-4 border border-[#84cc16]/10">
                              <p className="font-semibold text-white">{plan.planId?.name || plan.planName}</p>
                              <p className="text-sm text-slate-400 mt-2">Status: <span className="text-[#84cc16] font-semibold">{plan.status}</span></p>
                              <p className="text-sm text-slate-400">Start: {new Date(plan.startDate).toLocaleDateString()}</p>
                              <p className="text-sm text-slate-400">End: {new Date(plan.endDate).toLocaleDateString()}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="rounded-3xl bg-[#141f25] p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span>💳</span> Payment History ({selectedUserPayments.length})
                      </h3>
                      <div className="space-y-3">
                        {selectedUserPayments.length === 0 ? (
                          <p className="text-sm text-slate-400">No payment records yet.</p>
                        ) : (
                          selectedUserPayments.map((payment: any) => (
                            <div key={payment._id} className="rounded-2xl bg-[#111c22] p-4 border border-[#84cc16]/10">
                              <p className="font-semibold text-white">{payment.planId?.name || 'Plan purchase'}</p>
                              <p className="text-sm text-slate-400 mt-2">Amount: <span className="text-[#84cc16] font-semibold">₹{payment.amount}</span></p>
                              <p className="text-sm text-slate-400">Date: {new Date(payment.paymentDate).toLocaleDateString()}</p>
                              <p className="text-sm text-slate-400">Status: <span className={payment.status === 'completed' ? 'text-emerald-400 font-semibold' : 'text-yellow-400 font-semibold'}>{payment.status}</span></p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
