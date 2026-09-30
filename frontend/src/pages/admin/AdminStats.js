import React from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area } from 'recharts';
import { Bell, Check, Info, CheckCircle, AlertCircle } from 'lucide-react';

const COLORS = ['#C8102E', '#0066FF', '#00C896', '#F5A623', '#7928CA'];

const monthData = [
  { mois: 'Jan', formations: 12, entreprises: 8, intervenants: 6 },
  { mois: 'Fév', formations: 18, entreprises: 14, intervenants: 9 },
  { mois: 'Mar', formations: 22, entreprises: 16, intervenants: 12 },
  { mois: 'Avr', formations: 15, entreprises: 11, intervenants: 8 },
  { mois: 'Mai', formations: 28, entreprises: 20, intervenants: 15 },
  { mois: 'Jun', formations: 24, entreprises: 18, intervenants: 13 },
];

const regionData = [
  { name: 'Casa-Settat', value: 45, formations: 28 },
  { name: 'Rabat-Salé', value: 22, formations: 14 },
  { name: 'Fès-Meknès', value: 18, formations: 11 },
  { name: 'Marrakech', value: 10, formations: 6 },
  { name: 'Tanger', value: 5, formations: 3 },
];

const domainData = [
  { name: 'Digital', value: 35 },
  { name: 'Industriel', value: 28 },
  { name: 'Management', value: 20 },
  { name: 'Génie Civil', value: 17 },
];

export const StatsPage = () => {
  const { stats, plans, intervenants, themes } = useData();

  return (
    <AppLayout pageTitle="Statistiques & Reporting" pageSubtitle="Statistiques">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Statistiques & Reporting</h1>
          <p>Vue d'ensemble des réalisations de formation continue</p>
        </div>
        <button className="btn btn-ghost">📥 Exporter PDF</button>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        {[
          { label: 'Total Formations', value: stats.totalPlans, sub: `${stats.plansEnCours} en cours`, color: 'red' },
          { label: 'Taux de réalisation', value: `${Math.round((stats.plansTermines / stats.totalPlans) * 100)}%`, sub: `${stats.plansTermines} terminées`, color: 'green' },
          { label: 'Intervenants actifs', value: stats.totalIntervenants, sub: 'Tous types', color: 'blue' },
          { label: 'Thèmes catalogue', value: stats.totalThemes, sub: '4 domaines', color: 'orange' },
        ].map((s, i) => (
          <div className={`stat-card ${s.color}`} key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 6 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Évolution mensuelle</div>
              <div className="card-subtitle">Formations, entreprises et intervenants</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="colorForms" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8102E" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#C8102E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEntrep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066FF" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="mois" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', fontSize: 13 }} />
              <Legend />
              <Area type="monotone" dataKey="formations" name="Formations" stroke="#C8102E" fill="url(#colorForms)" strokeWidth={2} />
              <Area type="monotone" dataKey="entreprises" name="Entreprises" stroke="#0066FF" fill="url(#colorEntrep)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Répartition par domaine</div>
              <div className="card-subtitle">% des formations par domaine</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="55%" height={220}>
              <PieChart>
                <Pie data={domainData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {domainData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {domainData.map((d, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i], flexShrink: 0 }}></span>
                      <span style={{ fontSize: 13, color: '#374151' }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{d.value}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${d.value}%`, background: COLORS[i] }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Regional stats */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Réalisations par région</div>
            <div className="card-subtitle">Distribution géographique des formations</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={regionData} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#374151' }} axisLine={false} tickLine={false} width={90} />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', fontSize: 13 }} />
            <Bar dataKey="value" name="Entreprises %" fill="#C8102E" radius={[0, 4, 4, 0]} />
            <Bar dataKey="formations" name="Formations" fill="#EBF2FF" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Status table */}
      <div className="table-container">
        <div className="table-header">
          <div className="card-title">Détail des plans de formation</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Entreprise</th>
              <th>Thème</th>
              <th>Région</th>
              <th>Groupes</th>
              <th>Intervenant</th>
              <th>Statut</th>
              <th>Réalisation</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan.id}>
                <td style={{ fontWeight: 600 }}>{plan.entreprise}</td>
                <td style={{ fontSize: 13 }}>{plan.theme}</td>
                <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>{plan.region}</td>
                <td><span className="badge badge-blue">{plan.groupes}G</span></td>
                <td style={{ fontSize: 13 }}>{plan.intervenant || <span style={{ color: 'var(--gray-400)', fontStyle: 'italic' }}>Non affecté</span>}</td>
                <td>{plan.statut === 'en_cours' ? <span className="badge badge-blue">En cours</span> : plan.statut === 'termine' ? <span className="badge badge-green">Terminé</span> : <span className="badge badge-orange">Planifié</span>}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="progress-bar" style={{ flex: 1, minWidth: 80 }}>
                      <div className={`progress-fill ${plan.progression >= 100 ? 'green' : 'blue'}`} style={{ width: `${plan.progression}%` }}></div>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--gray-500)', minWidth: 30 }}>{plan.progression}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
};

// ============================================================
// NOTIFICATIONS PAGE
// ============================================================
export const NotificationsPage = ({ role = 'admin' }) => {
  const { notifications, markNotifRead } = useData();

  const typeIcon = (type) => ({
    success: <CheckCircle size={18} style={{ color: 'var(--accent-green)' }} />,
    info: <Info size={18} style={{ color: 'var(--accent-blue)' }} />,
    warning: <AlertCircle size={18} style={{ color: 'var(--accent)' }} />,
  })[type] || <Bell size={18} style={{ color: 'var(--gray-500)' }} />;

  return (
    <AppLayout pageTitle="Notifications" pageSubtitle="Notifications">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Notifications</h1>
          <p>{notifications.filter(n => n.unread).length} non lues</p>
        </div>
        <button className="btn btn-ghost" onClick={() => notifications.forEach(n => markNotifRead(n.id))}>
          <Check size={16} /> Tout marquer lu
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => markNotifRead(n.id)}
            style={{
              background: n.unread ? 'var(--primary-ultra-light)' : 'white',
              border: n.unread ? '1px solid #FFCDD5' : '1px solid var(--gray-100)',
              borderRadius: 16,
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 16,
              cursor: 'pointer',
              transition: 'var(--transition)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: n.unread ? 'white' : 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: n.unread ? 'var(--shadow-sm)' : 'none' }}>
              {typeIcon(n.type)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-900)' }}>{n.title}</span>
                <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{n.time}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5 }}>{n.message}</p>
            </div>
            {n.unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 4 }}></div>}
          </div>
        ))}
      </div>
    </AppLayout>
  );
};
