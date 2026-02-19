import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import "../../styles/supportDesk.css";
import urgentIcon from "../../assets/urgent.png";
import volumeIcon from "../../assets/volume.png";
import searchIcon from "../../assets/Search.png";
import notifBell from "../../assets/NotifBell.png";
import { SupportTicketAPI } from "../../services/SupportTicketAPI";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const SupportDesk = () => {
  const navigate = useNavigate(); 
  const [stats, setStats] = useState({
    open_tickets: 0,
    avg_response_minutes: 0,
    resolved_today: 0,
    sla_breaches: 0,
    category_stats: {},
    urgent_tickets: []
  });
  
  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      showErrorToast("Please log in to access the Support Desk");
      navigate('/login');
      return;
    }
    
    fetchSupportStats();
    fetchTickets();
  }, []);

  const fetchSupportStats = async () => {
    try {
      const data = await SupportTicketAPI.getTicketStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setError("Failed to load statistics");
    }
  };

  const fetchTickets = async (filter = "all") => {
    setLoading(true);
    setError(null);
    try {
      const data = await SupportTicketAPI.getTickets(filter);
      
      let ticketsArray = [];
      
      if (data.data && Array.isArray(data.data)) {
        ticketsArray = data.data;
      } else if (Array.isArray(data)) {
        ticketsArray = data;
      }
      
      setTickets(ticketsArray);
      
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      setError(error.message || "Failed to load tickets");
      
      if (error.response?.status === 401) {
        showErrorToast("Session expired. Please log in again.");
        localStorage.removeItem('auth_token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBulkClose = async () => {
    if (selectedTickets.length === 0) {
      showErrorToast("Please select tickets to close");
      return;
    }

    if (!window.confirm(`Close ${selectedTickets.length} selected tickets?`)) {
      return;
    }

    try {
      await SupportTicketAPI.bulkCloseTickets(selectedTickets);
      showSuccessToast("Tickets closed successfully");
      fetchTickets(currentFilter);
      fetchSupportStats();
      setSelectedTickets([]);
    } catch (error) {
      console.error("Failed to bulk close:", error);
      showErrorToast(error.message || "Failed to close tickets");
    }
  };

  const handleAssign = async () => {
    if (selectedTickets.length === 0) {
      showErrorToast("Please select tickets to assign");
      return;
    }

    const assigneeId = prompt("Enter assignee user ID:");
    if (!assigneeId) return;

    try {
      const assignPromises = selectedTickets.map(ticketId => 
        SupportTicketAPI.assignTicket(ticketId, assigneeId)
      );

      await Promise.all(assignPromises);
      showSuccessToast("Tickets assigned successfully");
      fetchTickets(currentFilter);
      setSelectedTickets([]);
    } catch (error) {
      console.error("Failed to assign tickets:", error);
      showErrorToast(error.message || "Network error");
    }
  };

  const handleFilterClick = (filter) => {
    setCurrentFilter(filter);
    setSelectedTickets([]);
    fetchTickets(filter);
  };

  const handleTicketSelect = (ticketId, e) => {
    e.stopPropagation();
    
    setSelectedTickets(prev => {
      if (prev.includes(ticketId)) {
        return prev.filter(id => id !== ticketId);
      } else {
        return [...prev, ticketId];
      }
    });
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (!searchTerm) {
      fetchTickets(currentFilter);
      return;
    }

    const filtered = tickets.filter(ticket => 
      (ticket.ticket_id && ticket.ticket_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ticket.subject && ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ticket.email && ticket.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setTickets(filtered);
  };

  const handleTicketClick = (ticketId) => {
    // Navigate to /ticket page
    navigate(`/ticket`);
  };

  const handleUrgentItemClick = (ticketId) => {
    // Navigate to /ticket page for urgent items too
    navigate(`/ticket`);
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case "high": return "tag red";
      case "medium": return "tag orange";
      case "low": return "tag blue";
      default: return "tag gray";
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case "open": return "tag green";
      case "in_progress": return "tag orange";
      case "closed": return "tag gray";
      default: return "tag gray";
    }
  };

  const formatTime = (minutes) => {
    if (!minutes) return "0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTimeLeft = (slaTimer) => {
    if (!slaTimer) return "00:00 LEFT";
    const [hours, minutes] = slaTimer.split(':');
    return `${hours}:${minutes} LEFT`;
  };

  return (
    <div className="layout">
      <Sidebar activePage="support" />
      <main className="main-content">
        <AdminTopbar 
          searchIcon={<img src={searchIcon} alt="Search" className="search-icon" />}
          onSearch={handleSearch}
        >
          <button className="btn primary" onClick={handleAssign}>Assign</button>
          <button className="btn outline" onClick={handleBulkClose}>Bulk Close</button>
          <Link to="/admin-notification" className="notification-link" aria-label="Notifications">
            <img src={notifBell} alt="Notifications" className="topbar-icon" />
            <span className="notification-dot" />
          </Link>
          <img src="https://i.pravatar.cc/150?u=alex" className="user-avatar-small" alt="user" />
        </AdminTopbar>

        <div className="page-header-row">
          <div>
            <h2>Support Desk</h2>
            <p className="subtitle">Real-time triage and resolution hub.</p>
          </div>
          <div className="filter-group">
            <button 
              className={`filter-pill ${currentFilter === "all" ? "active" : ""}`}
              onClick={() => handleFilterClick("all")}
            >
              All
            </button>
            <button 
              className={`filter-pill ${currentFilter === "high" ? "active" : ""}`}
              onClick={() => handleFilterClick("high")}
            >
              High Priority
            </button>
            <button 
              className={`filter-pill ${currentFilter === "unassigned" ? "active" : ""}`}
              onClick={() => handleFilterClick("unassigned")}
            >
              Unassigned
            </button>
            <button 
              className={`filter-pill ${currentFilter === "overdue" ? "active" : ""}`}
              onClick={() => handleFilterClick("overdue")}
            >
              Overdue
            </button>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">OPEN TICKETS <span className="badge green">+12%</span></div>
            <div className="stat-value">{stats.open_tickets}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">AVG. RESPONSE <span className="badge red">+5%</span></div>
            <div className="stat-value">{formatTime(stats.avg_response_minutes)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">RESOLVED TODAY <span className="badge red">-2%</span></div>
            <div className="stat-value">{stats.resolved_today}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">SLA BREACHES <span className="badge green">+1%</span></div>
            <div className="stat-value">{stats.sla_breaches}</div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={() => { fetchSupportStats(); fetchTickets(); }}>Retry</button>
          </div>
        )}

        <div className="support-content-grid">
          <div className="table-wrapper">
            {loading ? (
              <div className="loading">Loading tickets...</div>
            ) : (
              <table className="ticket-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>TICKET ID</th>
                    <th>SUBJECT</th>
                    <th>CATEGORY</th>
                    <th>PRIORITY</th>
                    <th>STATUS</th>
                    <th>SLA TIMER</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="no-tickets">
                        {searchTerm ? "No tickets match your search" : "No tickets found"}
                      </td>
                    </tr>
                  ) : (
                    tickets.map(ticket => (
                      <tr 
                        key={ticket.id} 
                        onClick={() => handleTicketClick(ticket.id)} 
                        style={{ cursor: "pointer" }}
                      >
                        <td onClick={(e) => handleTicketSelect(ticket.id, e)}>
                          <input 
                            type="checkbox" 
                            checked={selectedTickets.includes(ticket.id)}
                            onChange={() => {}}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td className="t-id">#{ticket.ticket_id}</td>
                        <td>
                          <div className="t-subject">{ticket.subject}</div>
                          <div className="t-sub">{ticket.company || ticket.email}</div>
                        </td>
                        <td><span className="tag gray">{ticket.category}</span></td>
                        <td>
                          <span className={getPriorityClass(ticket.priority)}>
                            {ticket.priority.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className={getStatusClass(ticket.status)}>
                            {ticket.status.replace("_", " ").toUpperCase()}
                          </span>
                        </td>
                        <td className="t-timer">{ticket.sla_timer || "00:00:00"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="support-sidebar">
            <div className="sidebar-box">
              <h5 className="side-title">📊 VOLUME BY CATEGORY</h5>
              <div className="progress-list">
                {Object.entries(stats.category_stats || {}).map(([category, percentage]) => (
                  <div className="prog-item" key={category}>
                    <div className="prog-info">
                      <span>{category}</span> 
                      <span>{percentage}%</span>
                    </div>
                    <div className="prog-track">
                      <div className="prog-fill" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-box transparent">
              <div className="side-header">
                <h5 className="side-title">📌 URGENT ITEMS</h5>
                <span className="badge live">{stats.urgent_tickets?.length || 0} LIVE</span>
              </div>

              {stats.urgent_tickets?.map(ticket => (
                <div 
                  key={ticket.id} 
                  className="urgent-card" 
                  onClick={() => handleUrgentItemClick(ticket.id)} 
                  style={{ cursor: "pointer" }}
                >
                  <div className="u-top">
                    <span className="u-id">#{ticket.ticket_id}</span>
                    <span className="u-badge">
                      {getTimeLeft(ticket.sla_timer)}
                    </span>
                  </div>
                  <div className="u-title">{ticket.subject}</div>
                  <div className="u-sub">{ticket.company || ticket.email}</div>
                </div>
              ))}

              {(!stats.urgent_tickets || stats.urgent_tickets.length === 0) && (
                <div className="no-urgent">No urgent tickets</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupportDesk;
