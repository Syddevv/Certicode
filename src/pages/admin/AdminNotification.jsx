import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import "../../styles/adminNotification.css";
import searchIcon from "../../assets/Search.png";
import notifBell from "../../assets/NotifBell.png";
import salesIcon from "../../assets/large-transac.png";
import systemIcon from "../../assets/black-settings.png";
import projectIcon from "../../assets/new-custom.png";
import healthtrackIcon from "../../assets/healthtrack.png";
import supportTicketIcon from "../../assets/supptix.png";
import customerIcon from "../../assets/newcustomer.png";
import { AdminNotificationsAPI } from "../../services/AdminNotificationsAPI";

const AdminNotification = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const [typeCounts, setTypeCounts] = useState({
    all: 0,
    sales: 0,
    projects: 0,
    system: 0,
    support: 0,
    customer: 0
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    per_page: 20
  });

  useEffect(() => {
    fetchNotifications();
  }, [activeTab]);

  const fetchNotifications = async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const filters = {};
      if (activeTab !== "all") {
        filters.type = activeTab;
      }
      
      const response = await AdminNotificationsAPI.getNotifications(page, filters);
      
      if (response.success) {
        setNotifications(response.data?.data || []);
        setUnreadCount(response.data?.unread_count || 0);
        setTypeCounts(response.data?.type_counts || {
          all: 0,
          sales: 0,
          projects: 0,
          system: 0,
          support: 0,
          customer: 0
        });
        setPagination(response.data?.pagination || {
          current_page: 1,
          total_pages: 1,
          total_items: 0,
          per_page: 20
        });
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleOpenDetail = (notification) => {
    if (notification?.action_url) {
      navigate(notification.action_url);
    } else {
      navigate("/ticket");
    }
  };

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    try {
      const response = await AdminNotificationsAPI.markAsRead(notificationId);
      if (response.success) {
        setUnreadCount(response.unread_count);
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleDismiss = async (notificationId, e) => {
    e.stopPropagation();
    try {
      const response = await AdminNotificationsAPI.dismissNotification(notificationId);
      if (response.success) {
        setUnreadCount(response.unread_count);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        
        setTypeCounts(prev => ({
          ...prev,
          all: Math.max(0, prev.all - 1),
          [activeTab === 'all' ? 'all' : activeTab]: Math.max(0, prev[activeTab === 'all' ? 'all' : activeTab] - 1)
        }));
      }
    } catch (err) {
      console.error("Error dismissing notification:", err);
    }
  };

  const getIconByType = (type, colorClass) => {
    switch (type) {
      case 'sales':
        return salesIcon;
      case 'project':
        return colorClass === 'soft-blue' ? healthtrackIcon : projectIcon;
      case 'system':
        return systemIcon;
      case 'support':
        return supportTicketIcon;
      case 'customer':
        return customerIcon;
      default:
        return projectIcon;
    }
  };

  const getPillClass = (colorClass, type) => {
    if (colorClass) return colorClass;
    switch (type) {
      case 'sales': return 'green';
      case 'project': return 'orange';
      case 'support': return 'gray';
      case 'customer': return 'purple';
      case 'system': return '';
      default: return '';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const loadMore = () => {
    if (pagination.current_page < pagination.total_pages) {
      fetchNotifications(pagination.current_page + 1);
    }
  };

  const handleManualCheck = async () => {
    try {
      setLoading(true);
      const response = await AdminNotificationsAPI.checkForNewNotifications();
      
      let message = `✅ Found ${response.new_notifications} new notifications!\n\n`;
      message += `📊 Current Stats:\n`;
      message += `   • Revenue: $${response.stats?.total_revenue?.toLocaleString() || 0}\n`;
      message += `   • Customers: ${response.stats?.total_customers || 0}\n`;
      message += `   • Projects: ${response.stats?.total_projects || 0}\n`;
      message += `   • Orders: ${response.stats?.total_orders || 0}`;
      
      alert(message);
      
      if (response.new_notifications > 0) {
        fetchNotifications();
      }
    } catch (err) {
      alert('Error checking notifications: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar activePage="notifications" />

      <main className="notifications-main">
        <AdminTopbar
          className="notif-topbar"
          searchIcon={
            <img src={searchIcon} alt="Search" className="search-icon" />
          }
        >
          <Link
            to="/admin-notification"
            className="notification-link"
            aria-label="Notifications"
          >
            <img src={notifBell} alt="Notifications" className="topbar-icon" />
            {unreadCount > 0 && <span className="notification-dot" />}
          </Link>
          <div className="user-profile">
          </div>
        </AdminTopbar>

        <section className="notifications-header">
          <div>
            <h1>Notifications</h1>
            <p className="subtitle">
              Manage and track all administrative alerts for CertiCode.
            </p>
          </div>

          <div className="notif-tabs">
            <button 
              className={`notif-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => handleTabChange('all')}
            >
              All {typeCounts.all > 0 && `(${typeCounts.all})`}
            </button>
            <button 
              className={`notif-tab ${activeTab === 'sales' ? 'active' : ''}`}
              onClick={() => handleTabChange('sales')}
            >
              Sales {typeCounts.sales > 0 && `(${typeCounts.sales})`}
            </button>
            <button 
              className={`notif-tab ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => handleTabChange('projects')}
            >
              Projects {typeCounts.projects > 0 && `(${typeCounts.projects})`}
            </button>
            <button 
              className={`notif-tab ${activeTab === 'system' ? 'active' : ''}`}
              onClick={() => handleTabChange('system')}
            >
              System {typeCounts.system > 0 && `(${typeCounts.system})`}
            </button>
            <button 
              className={`notif-tab ${activeTab === 'support' ? 'active' : ''}`}
              onClick={() => handleTabChange('support')}
            >
              Support {typeCounts.support > 0 && `(${typeCounts.support})`}
            </button>
            <button 
              className={`notif-tab ${activeTab === 'customer' ? 'active' : ''}`}
              onClick={() => handleTabChange('customer')}
            >
              Customers {typeCounts.customer > 0 && `(${typeCounts.customer})`}
            </button>
          </div>
        </section>

        <section className="notifications-list">
          {loading && notifications.length === 0 ? (
            <div className="loading-state">Loading notifications...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="empty-state">
              <p>No notifications to display</p>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <article 
                  key={notification.id} 
                  className={`notif-card ${!notification.is_read ? 'unread' : ''}`}
                >
                  <div className={`notif-icon-pill ${getPillClass(notification.color_class, notification.type)}`}>
                    <img 
                      src={getIconByType(notification.type, notification.color_class)} 
                      alt={notification.type} 
                    />
                  </div>
                  <div className="notif-body">
                    <div className="notif-title-row">
                      <h3>{notification.title}</h3>
                      <span className="notif-time">
                        {formatTime(notification.created_at)}
                        {!notification.is_read && (
                          <span className="unread-badge"></span>
                        )}
                      </span>
                    </div>
                    <p className="notif-sub">{notification.message}</p>
                    <div className="notif-actions-row">
                      {!notification.is_read && (
                        <button
                          type="button"
                          className="btn-pill secondary"
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                        >
                          Mark as Read
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-pill ghost"
                        onClick={(e) => handleDismiss(notification.id, e)}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {pagination.current_page < pagination.total_pages && (
                <div className="load-more-container">
                  <button 
                    className="load-more-btn"
                    onClick={loadMore}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminNotification;