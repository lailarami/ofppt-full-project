import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export function ProfilPage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    region: user?.region || '',
  });

  const handleSave = () => {
    updateUser && updateUser(form);
    setEditing(false);
  };

  const roleLabel = {
    admin: 'Administrateur Central',
    regional: 'Gestionnaire Régional',
    local: 'Gestionnaire Local',
    company: 'Entreprise',
    intervenant: 'Intervenant',
  };

  return (
    <AppLayout pageTitle="Mon Profil" pageSubtitle="Gérez vos informations personnelles">
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className="card">
          {/* Avatar */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), #ff4d6d)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', color: '#fff', fontWeight: 700,
              margin: '0 auto 1rem'
            }}>
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <h2 style={{ margin: 0 }}>{user?.name}</h2>
            <p style={{ color: 'var(--primary)', fontWeight: 600 }}>{roleLabel[user?.role] || user?.role}</p>
            <span className={`badge badge-${user?.status === 'actif' ? 'green' : 'gray'}`}>{user?.status || 'actif'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="btn btn-primary" onClick={() => editing ? handleSave() : setEditing(true)}>
              {editing ? '💾 Sauvegarder' : '✏️ Modifier le profil'}
            </button>
          </div>

          <div className="grid-2">
            {[
              { label: 'Nom complet', key: 'name' },
              { label: 'Email', key: 'email', type: 'email' },
              { label: 'Téléphone', key: 'phone' },
              { label: 'Département', key: 'department' },
              ...(user?.role === 'regional' || user?.role === 'local' ? [{ label: 'Région', key: 'region' }] : []),
            ].map(f => (
              <div key={f.key} className="form-group">
                <label className="form-label">{f.label}</label>
                {editing ? (
                  <input className="form-control" type={f.type || 'text'} value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                ) : (
                  <div style={{ padding: '0.6rem 0', borderBottom: '1px solid var(--border)', color: form[f.key] ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {form[f.key] || '—'}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Rôle</span>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{roleLabel[user?.role]}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Date de création</span>
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{user?.dateCreation || '2024-01-01'}</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export function NotificationsPage() {
  const { notifications, markAllRead } = useData();
  const { user } = useAuth();
  const [filter, setFilter] = useState('Tous');

  const myNotifs = notifications.filter(n => 
    !n.destinataires || n.destinataires.includes(user?.role) || n.destinataires.includes('all')
  );
  const filtered = filter === 'Tous' ? myNotifs : myNotifs.filter(n => n.type === filter);
  const types = ['Tous', ...new Set(myNotifs.map(n => n.type))];

  const typeIcon = { info: 'ℹ️', success: '✅', warning: '⚠️', formation: '📚', affectation: '👨‍🏫', validation: '✔️' };
  const typeColor = { info: '#0066FF', success: '#00C896', warning: '#F5A623', formation: '#C8102E', affectation: '#8B5CF6', validation: '#00C896' };

  return (
    <AppLayout pageTitle="Notifications" pageSubtitle="Vos dernières notifications et alertes">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {types.map(t => (
            <button key={t} className={`filter-chip ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
          ))}
        </div>
        <button className="btn btn-ghost" onClick={markAllRead}>✓ Tout marquer comme lu</button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {filtered.map(n => (
          <div key={n.id} style={{
            padding: '1.25rem',
            background: n.lu ? 'var(--bg-secondary)' : '#fff',
            borderRadius: 10,
            border: `1px solid ${n.lu ? 'var(--border)' : typeColor[n.type] || 'var(--primary)'}`,
            borderLeft: `4px solid ${typeColor[n.type] || 'var(--primary)'}`,
            boxShadow: n.lu ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
            transition: 'all 0.2s',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: `${typeColor[n.type] || 'var(--primary)'}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', flexShrink: 0
            }}>
              {typeIcon[n.type] || '🔔'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{n.titre}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '1rem' }}>{n.date}</span>
              </div>
              <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{n.message}</p>
            </div>
            {!n.lu && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 4 }}></div>}
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
            <p>Aucune notification</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
