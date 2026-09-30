import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard, Users, BookOpen, BarChart3, Bell, LogOut,
  Settings, Calendar, ChevronRight, Menu, X, Briefcase,
  Award, UserCheck, ClipboardList, TrendingUp, Home, FileText
} from 'lucide-react';

const LOGO = 'https://cdn.brandfetch.io/id0UtA99bn/w/400/h/400/theme/dark/icon.jpeg?k=id64Mup7ac&t=1726639084841';

const NAV_CONFIG = {
  admin: {
    label: 'Admin Central',
    color: 'role-admin',
    sections: [
      {
        title: 'Principal',
        items: [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
          { icon: BarChart3, label: 'Statistiques', path: '/admin/stats' },
        ]
      },
      {
        title: 'Gestion',
        items: [
          { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
          { icon: UserCheck, label: 'Intervenants', path: '/admin/intervenants' },
          { icon: BookOpen, label: 'Formations', path: '/admin/formations' },
          { icon: Calendar, label: 'Planification', path: '/admin/planification' },
        ]
      },
      {
        title: 'Communication',
        items: [
          { icon: Bell, label: 'Notifications', path: '/admin/notifications', badge: true },
        ]
      },
    ]
  },
  regional: {
    label: 'Gestionnaire Régional',
    color: 'role-regional',
    sections: [
      {
        title: 'Principal',
        items: [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/regional/dashboard' },
          { icon: BookOpen, label: 'Formations', path: '/regional/formations' },
        ]
      },
      {
        title: 'Suivi',
        items: [
          { icon: ClipboardList, label: 'Plans entreprises', path: '/regional/plans' },
          { icon: UserCheck, label: 'Affectation', path: '/regional/affectation' },
          { icon: TrendingUp, label: 'Suivi formations', path: '/regional/suivi' },
        ]
      },
      {
        title: 'Communication',
        items: [
          { icon: Bell, label: 'Notifications', path: '/regional/notifications', badge: true },
        ]
      },
    ]
  },
  local: {
    label: 'Gestionnaire Local',
    color: 'role-local',
    sections: [
      {
        title: 'Principal',
        items: [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/local/dashboard' },
          { icon: Calendar, label: 'Planning', path: '/local/planning' },
        ]
      },
      {
        title: 'Terrain',
        items: [
          { icon: ClipboardList, label: 'Sessions', path: '/local/sessions' },
          { icon: TrendingUp, label: 'Suivi exécution', path: '/local/suivi' },
        ]
      },
      {
        title: 'Communication',
        items: [
          { icon: Bell, label: 'Notifications', path: '/local/notifications', badge: true },
        ]
      },
    ]
  },
  company: {
    label: 'Entreprise',
    color: 'role-company',
    sections: [
      {
        title: 'Principal',
        items: [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/company/dashboard' },
          { icon: BookOpen, label: 'Catalogue', path: '/company/catalogue' },
        ]
      },
      {
        title: 'Formations',
        items: [
          { icon: Calendar, label: 'Planifier', path: '/company/planification' },
          { icon: ClipboardList, label: 'Mes formations', path: '/company/mes-formations' },
          { icon: FileText, label: 'Historique', path: '/company/historique' },
        ]
      },
      {
        title: 'Communication',
        items: [
          { icon: Bell, label: 'Notifications', path: '/company/notifications', badge: true },
        ]
      },
    ]
  },
  intervenant: {
    label: 'Intervenant',
    color: 'role-intervenant',
    sections: [
      {
        title: 'Principal',
        items: [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/intervenant/dashboard' },
          { icon: Users, label: 'Mon profil', path: '/intervenant/profil' },
        ]
      },
      {
        title: 'Compétences',
        items: [
          { icon: Award, label: 'Mes compétences', path: '/intervenant/competences' },
          { icon: BookOpen, label: 'Offres formation', path: '/intervenant/offres' },
          { icon: Briefcase, label: 'Mes missions', path: '/intervenant/missions' },
        ]
      },
      {
        title: 'Communication',
        items: [
          { icon: Bell, label: 'Notifications', path: '/intervenant/notifications', badge: true },
        ]
      },
    ]
  }
};

export const AppLayout = ({ children, pageTitle, pageSubtitle }) => {
  const { user, logout, unreadCount } = useAuth();
  const { notifications, markNotifRead } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  const config = NAV_CONFIG[user?.role] || NAV_CONFIG.admin;

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabels = {
    admin: 'Administrateur Central',
    regional: 'Gestionnaire Régional',
    local: 'Gestionnaire Local',
    company: 'Entreprise',
    intervenant: 'Intervenant'
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-img">
              <img src={LOGO} alt="OFPPT" />
            </div>
            <div className="sidebar-logo-text">
              <strong>OFPPT</strong>
              <span>Formation Continue</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 16px' }}>
          <div className="sidebar-user">
            <div className="sidebar-user-row">
              <div className="sidebar-user-avatar">{user?.avatar || user?.name?.[0]}</div>
              <div className="sidebar-user-info">
                <strong>{user?.name}</strong>
                <span>{roleLabels[user?.role]}</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {config.sections.map((section, si) => (
            <div key={si}>
              <div className="nav-section-title">{section.title}</div>
              {section.items.map((item, ii) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <div
                    key={ii}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {item.badge && unreadCount > 0 && (
                      <span className="nav-badge">{unreadCount}</span>
                    )}
                    {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="nav-item" onClick={() => navigate(`/${user?.role}/profil`)}>
            <Settings size={18} />
            <span>Paramètres</span>
          </div>
          <div className="nav-item" onClick={handleLogout} style={{ color: 'rgba(200,16,46,0.7)' }}>
            <LogOut size={18} />
            <span>Déconnexion</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#374151', padding: 8 }}
              className="mobile-menu-btn"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div>
              <div className="topbar-title">{pageTitle}</div>
              {pageSubtitle && <div className="topbar-breadcrumb"><Home size={13} /><span>›</span>{pageSubtitle}</div>}
            </div>
          </div>
          <div className="topbar-right">
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button className="topbar-btn" onClick={() => setShowNotif(!showNotif)}>
                <Bell size={18} />
                {unreadCount > 0 && <span className="notif-dot" />}
              </button>

              {showNotif && (
                <div className="notif-panel">
                  <div className="notif-panel-header">
                    <strong style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-display)' }}>Notifications</strong>
                    {unreadCount > 0 && <span className="badge badge-red">{unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}</span>}
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`} onClick={() => markNotifRead(n.id)}>
                      <div className="notif-icon">
                        <Bell size={16} />
                      </div>
                      <div className="notif-content">
                        <strong>{n.title}</strong>
                        <p>{n.message}</p>
                        <time>{n.time}</time>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '12px 20px', textAlign: 'center' }}>
                    <button className="btn btn-ghost btn-sm w-full" onClick={() => { navigate(`/${user?.role}/notifications`); setShowNotif(false); }}>
                      Voir toutes
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', background: 'var(--gray-50)', borderRadius: 10, border: '1px solid var(--gray-100)', cursor: 'pointer' }}
              onClick={() => navigate(`/${user?.role}/profil`)}>
              <div className="avatar avatar-sm">{user?.avatar || user?.name?.[0]}</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' }}>{user?.name?.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
