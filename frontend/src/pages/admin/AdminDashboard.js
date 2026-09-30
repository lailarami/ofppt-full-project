import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Users, BookOpen, TrendingUp, Award, ArrowUpRight, Calendar, UserCheck,
  BarChart2, Activity, CheckCircle, Clock, AlertCircle, ChevronRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const COLORS = ['#C8102E', '#0066FF', '#00C896', '#F5A623', '#7928CA'];

const monthData = [
  { mois: 'Jan', formations: 12, entreprises: 8 },
  { mois: 'Fév', formations: 18, entreprises: 14 },
  { mois: 'Mar', formations: 22, entreprises: 16 },
  { mois: 'Avr', formations: 15, entreprises: 11 },
  { mois: 'Mai', formations: 28, entreprises: 20 },
  { mois: 'Jun', formations: 24, entreprises: 18 },
];

const domainData = [
  { name: 'Digital', value: 35 },
  { name: 'Industriel', value: 28 },
  { name: 'Management', value: 20 },
  { name: 'Génie Civil', value: 17 },
];

export const AdminDashboard = () => {
  const { stats, plans, intervenants, themes, users } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const recentPlans = plans.slice(0, 4);

  const getStatusBadge = (status) => {
    const map = {
      en_cours: <span className="badge badge-blue">En cours</span>,
      planifie: <span className="badge badge-orange">Planifié</span>,
      termine: <span className="badge badge-green">Terminé</span>,
      annule: <span className="badge badge-gray">Annulé</span>,
    };
    return map[status] || <span className="badge badge-gray">{status}</span>;
  };

  return (
    <AppLayout pageTitle="Dashboard Administrateur" pageSubtitle="Vue globale">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-banner-content">
          <h2>Bonjour, {user?.name?.split(' ')[0]} 👋</h2>
          <p>Voici un aperçu global de la plateforme OFPPT Formation Continue</p>
          <div style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }} onClick={() => navigate('/admin/formations')}>
              <BookOpen size={16} /> Gérer formations
            </button>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }} onClick={() => navigate('/admin/intervenants')}>
              <UserCheck size={16} /> Gérer intervenants
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { icon: Users, label: 'Utilisateurs', value: stats.totalUsers, color: 'red', trend: '+12%', up: true },
          { icon: UserCheck, label: 'Intervenants', value: stats.totalIntervenants, color: 'blue', trend: '+8%', up: true },
          { icon: BookOpen, label: 'Thèmes de formation', value: stats.totalThemes, color: 'green', trend: '+5%', up: true },
          { icon: Calendar, label: 'Plans actifs', value: stats.totalPlans, color: 'orange', trend: `${stats.plansEnCours} en cours`, up: true },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div className={`stat-card ${s.color}`} key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`stat-icon ${s.color}`}><Icon size={22} /></div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className={`stat-trend ${s.up ? 'up' : 'down'}`}>
                <ArrowUpRight size={13} /> {s.trend}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick status */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        {[
          { icon: CheckCircle, label: 'Terminés', val: stats.plansTermines, color: '#00C896', bg: '#E6FFF8' },
          { icon: Activity, label: 'En cours', val: stats.plansEnCours, color: '#0066FF', bg: '#EBF2FF' },
          { icon: Clock, label: 'Planifiés', val: stats.plansPlanifies, color: '#F5A623', bg: '#FFF8EB' },
          { icon: AlertCircle, label: 'Sans intervenant', val: plans.filter(p => !p.intervenantId && p.statut !== 'termine').length, color: '#C8102E', bg: '#FFF0F2' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', background: item.bg, borderRadius: 12, border: `1px solid ${item.color}20`, flex: '1', minWidth: 160 }}>
              <Icon size={20} style={{ color: item.color }} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)', color: item.color }}>{item.val}</div>
                <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>{item.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Formations par mois</div>
              <div className="card-subtitle">Évolution des 6 derniers mois</div>
            </div>
            <BarChart2 size={18} style={{ color: 'var(--gray-400)' }} />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="mois" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', fontSize: 13 }} />
              <Bar dataKey="formations" name="Formations" fill="#C8102E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="entreprises" name="Entreprises" fill="#EBF2FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Répartition par domaine</div>
              <div className="card-subtitle">Distribution des formations</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={domainData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {domainData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {domainData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i], flexShrink: 0 }}></span>
                    <span style={{ fontSize: 13, color: '#374151' }}>{d.name}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent plans table */}
      <div className="table-container">
        <div className="table-header">
          <div>
            <div className="card-title">Plans de formation récents</div>
            <div className="card-subtitle">{plans.length} plans au total</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/planification')}>
            Voir tout <ChevronRight size={14} />
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Entreprise</th>
              <th>Thème de formation</th>
              <th>Groupes</th>
              <th>Date début</th>
              <th>Intervenant</th>
              <th>Statut</th>
              <th>Progression</th>
            </tr>
          </thead>
          <tbody>
            {recentPlans.map(plan => (
              <tr key={plan.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar avatar-sm">{plan.entreprise[0]}</div>
                    <span style={{ fontWeight: 600 }}>{plan.entreprise}</span>
                  </div>
                </td>
                <td>{plan.theme}</td>
                <td><span className="badge badge-blue">{plan.groupes} groupe{plan.groupes > 1 ? 's' : ''}</span></td>
                <td style={{ color: 'var(--gray-500)', fontSize: 13 }}>{new Date(plan.dateDebut).toLocaleDateString('fr-FR')}</td>
                <td>
                  {plan.intervenant ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="avatar avatar-sm">{plan.intervenant[0]}</div>
                      <span style={{ fontSize: 13 }}>{plan.intervenant}</span>
                    </div>
                  ) : <span style={{ color: 'var(--gray-400)', fontSize: 13, fontStyle: 'italic' }}>Non affecté</span>}
                </td>
                <td>{getStatusBadge(plan.statut)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 100 }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
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

export default AdminDashboard;
