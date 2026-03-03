import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import "../../styles/ticketDetail.css";
import searchIcon from "../../assets/Search.png";
import notifBell from "../../assets/NotifBell.png";
import stripeIcon from "../../assets/stripe.png";
import vectorMailIcon from "../../assets/tabler_mail-filled.png";
import vectorAssetIcon from "../../assets/Vectorasset.png";
import galleryIcon from "../../assets/gallery.png";
import vectorDownloadIcon from "../../assets/lucide_download.png";
import lockIcon from "../../assets/lockicon.png";
import groupDueInIcon from "../../assets/Groupduein.png";
import vectorFirstResponseIcon from "../../assets/Vectorfirstresponse.png";
import vectorServiceTierIcon from "../../assets/Vectorservicetier.png";
import archiveIcon from "../../assets/archive.png";
import attachFileIcon from "../../assets/attachfile.png";
import { SupportTicketAPI } from "../../services/SupportTicketAPI";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const TicketDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      showErrorToast("Please log in to access the Support Desk");
      navigate('/login');
      return;
    }
    
    fetchTicketDetails();
  }, [id]);

  useEffect(() => {
    const threadElement = document.querySelector('.conversation-thread');
    if (threadElement) {
      threadElement.scrollTop = threadElement.scrollHeight;
    }
  }, [replies]);

  const fetchTicketDetails = async () => {
    setLoading(true);
    try {
      const ticketData = await SupportTicketAPI.getTicket(id);
      setTicket(ticketData);
      setStatus(ticketData.status || "open");
      setPriority(ticketData.priority || "medium");
      
      await fetchReplies();
    } catch (error) {
      console.error("Failed to fetch ticket details:", error);
      showErrorToast(error.message || "Failed to load ticket details");
      
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        navigate('/login');
      } else if (error.response?.status === 404) {
        showErrorToast("Ticket not found");
        navigate('/support');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async () => {
    try {
      const repliesData = await SupportTicketAPI.getReplies(id);
      setReplies(Array.isArray(repliesData) ? repliesData : []);
    } catch (replyError) {
      console.log("No replies yet or error fetching replies:", replyError);
      setReplies([]);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await SupportTicketAPI.updateTicket(id, { status: newStatus });
      setStatus(newStatus);
      setTicket({ ...ticket, status: newStatus });
      showSuccessToast(`Ticket status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      showErrorToast(error.message || "Failed to update status");
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      await SupportTicketAPI.updateTicket(id, { priority: newPriority });
      setPriority(newPriority);
      setTicket({ ...ticket, priority: newPriority });
      showSuccessToast(`Priority updated to ${newPriority}`);
    } catch (error) {
      console.error("Failed to update priority:", error);
      showErrorToast(error.message || "Failed to update priority");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showErrorToast("File size must be less than 10MB");
        return;
      }
      
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        showErrorToast("Only PNG, JPG, JPEG, and PDF files are allowed");
        return;
      }
      
      setAttachment(file);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      showErrorToast("Please enter a message");
      return;
    }

    setSending(true);
    try {
      const replyData = {
        message: replyMessage,
        is_internal_note: isInternalNote,
        attachment: attachment
      };
      
      await SupportTicketAPI.sendReply(id, replyData);
      
      await fetchReplies();
      
      setReplyMessage("");
      setAttachment(null);
      setIsInternalNote(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      showSuccessToast(isInternalNote ? "Internal note added" : "Reply sent to customer");
    } catch (error) {
      console.error("Failed to send reply:", error);
      showErrorToast(error.message || "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const handleArchiveAndClose = async () => {
    if (!window.confirm("Archive and close this ticket?")) {
      return;
    }

    try {
      await SupportTicketAPI.updateTicket(id, { status: "closed" });
      showSuccessToast("Ticket archived and closed");
      navigate('/support');
    } catch (error) {
      console.error("Failed to close ticket:", error);
      showErrorToast(error.message || "Failed to close ticket");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name) => {
    if (!name) return "AG";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="layout">
        <Sidebar activePage="support" />
        <main className="main-content detail-bg">
          <AdminTopbar searchIcon={<img src={searchIcon} alt="Search" className="search-icon" />}>
            <Link to="/admin-notification" className="notification-link" aria-label="Notifications">
              <img src={notifBell} alt="Notifications" className="topbar-icon" />
              <span className="notification-dot"></span>
            </Link>
          </AdminTopbar>
          <div className="detail-container loading-state">
            <div className="loading-spinner">Loading ticket details...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="layout">
        <Sidebar activePage="support" />
        <main className="main-content detail-bg">
          <AdminTopbar searchIcon={<img src={searchIcon} alt="Search" className="search-icon" />}>
            <Link to="/admin-notification" className="notification-link" aria-label="Notifications">
              <img src={notifBell} alt="Notifications" className="topbar-icon" />
              <span className="notification-dot"></span>
            </Link>
          </AdminTopbar>
          <div className="detail-container error-state">
            <div>Ticket not found</div>
            <button onClick={() => navigate('/support')}>Back to Support Desk</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar activePage="support" />

      <main className="main-content detail-bg">
        <AdminTopbar searchIcon={<img src={searchIcon} alt="Search" className="search-icon" />}>
          <Link to="/admin-notification" className="notification-link" aria-label="Notifications">
            <img src={notifBell} alt="Notifications" className="topbar-icon" />
            <span className="notification-dot"></span>
          </Link>
        </AdminTopbar>

        <div className="detail-container">
          <section className="ticket-main">
            <nav className="breadcrumbs">
              <span onClick={() => navigate("/support")} className="crumb-link">Support Desk Inbox</span>
              <span className="crumb-separator">›</span>
              <span className="crumb-active">{ticket.subject}</span>
            </nav>

            <div className="ticket-header">
              <div className="header-content">
                <div className="title-row">
                  <h1>{ticket.subject}</h1>
                  <span className={`badge-${ticket.status === 'open' ? 'active' : ticket.status === 'in_progress' ? 'warning' : 'closed'}`}>
                    {ticket.status?.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                <div className="meta-row">
                  <span><img src={stripeIcon} alt="Company" className="meta-icon" /> {ticket.company || "No Company"}</span>
                  <span><img src={vectorMailIcon} alt="Email" className="meta-icon" /> {ticket.email}</span>
                  {ticket.phone && <span><img src={vectorAssetIcon} alt="Phone" className="meta-icon" /> {ticket.phone}</span>}
                </div>
              </div>
            </div>

            <div className="conversation-thread">
              <div className="message-row client">
                <div className="avatar-box">{getInitials(`${ticket.first_name} ${ticket.last_name}`)}</div>
                <div className="message-body">
                  <div className="message-meta">
                    <strong>{ticket.first_name} {ticket.last_name}</strong> <span className="time">{formatDate(ticket.created_at)}</span>
                  </div>
                  <div className="message-bubble white-bubble">
                    <p>{ticket.message}</p>

                    {ticket.attachment_path && (
                      <div className="attachment-card">
                        <div className="file-icon orange-bg">
                          <img src={galleryIcon} alt="Attachment" className="attachment-icon" />
                        </div>
                        <div className="file-info">
                          <span className="filename">Attachment</span>
                          <span className="filesize">Click to view</span>
                        </div>
                        <a href={`${API_ORIGIN}/storage/${ticket.attachment_path}`} target="_blank" rel="noopener noreferrer" className="btn-download">
                          <img src={vectorDownloadIcon} alt="Download" className="download-icon" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {replies.map((reply) => (
                <div key={reply.id} className={`message-row ${reply.is_internal_note ? 'internal-note' : 'agent'}`}>
                  <div className="message-body">
                    <div className="message-meta align-right">
                      <span className="time">{formatDate(reply.created_at)}</span> 
                      <strong>{reply.user?.name || 'Support Agent'}</strong> 
                      {reply.is_internal_note && <span className="internal-badge">INTERNAL NOTE</span>}
                      <span className="tag-ar">{getInitials(reply.user?.name)}</span>
                    </div>
                    <div className={`message-bubble ${reply.is_internal_note ? 'internal-bubble' : 'dark-bubble'}`}>
                      <p>{reply.message}</p>
                      {reply.attachment_path && (
                        <div className="attachment-card">
                          <div className="file-icon orange-bg">
                            <img src={galleryIcon} alt="Attachment" className="attachment-icon" />
                          </div>
                          <div className="file-info">
                            <span className="filename">Attachment</span>
                            <span className="filesize">Click to view</span>
                          </div>
                          <a href={`${API_ORIGIN}/storage/${reply.attachment_path}`} target="_blank" rel="noopener noreferrer" className="btn-download">
                            <img src={vectorDownloadIcon} alt="Download" className="download-icon" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="editor-container">
              <div className="editor-toolbar">
                <div className="tools-right">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                    /> Internal Note
                  </label>
                </div>
              </div>
              <textarea 
                className="editor-textarea compact" 
                placeholder="Type your message here..." 
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows="3"
              ></textarea>
              <div className="editor-footer">
                <button className="btn-attach" onClick={() => fileInputRef.current?.click()}>
                  <img src={attachFileIcon} alt="Attach" className="attach-icon" />
                  {attachment ? attachment.name : "Attach files"}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                    accept=".png,.jpg,.jpeg,.pdf"
                  />
                </button>
                <button 
                  className="btn-send" 
                  onClick={handleSendReply}
                  disabled={sending || !replyMessage.trim()}
                >
                  {sending ? "Sending..." : isInternalNote ? "Add Note ➔" : "Send Reply ➔"}
                </button>
              </div>
            </div>
          </section>

          <aside className="ticket-sidebar">
            <div className="sidebar-card">
              <div className="card-header">
                <h3>CONTROL PANEL</h3>
                <img src={lockIcon} alt="Lock" className="card-icon" />
              </div>

              <div className="form-group">
                <label>Status</label>
                <div className="select-wrapper">
                  <select value={status} onChange={(e) => handleStatusChange(e.target.value)}>
                    <option value="open">Open</option>
                    <option value="in_progress">In-progress</option>
                    <option value="closed">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Priority Level</label>
                <div className="segmented-control">
                  <button 
                    className={priority === 'low' ? 'active' : ''} 
                    onClick={() => handlePriorityChange('low')}
                  >
                    Low
                  </button>
                  <button 
                    className={priority === 'medium' ? 'active' : ''} 
                    onClick={() => handlePriorityChange('medium')}
                  >
                    Med
                  </button>
                  <button 
                    className={priority === 'high' ? 'active' : ''} 
                    onClick={() => handlePriorityChange('high')}
                  >
                    High
                  </button>
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <label className="section-title">SERVICE LEVEL</label>
              <div className="sla-row">
                <div className="sla-label">
                  <img src={groupDueInIcon} alt="Due In" className="sla-icon" />
                  SLA Due in
                </div>
                <span className="badge-green">{ticket.sla_timer || "2h 15m"}</span>
              </div>
              <div className="sla-row">
                <div className="sla-label">
                  <img src={vectorFirstResponseIcon} alt="First Response" className="sla-icon" />
                  First Response
                </div>
                <span className="sla-value">13m</span>
              </div>
              <div className="sla-row">
                <div className="sla-label">
                  <img src={vectorServiceTierIcon} alt="Service Tier" className="sla-icon" />
                  Service Tier
                </div>
                <span className="badge-platinum">Platinum</span>
              </div>
            </div>

            <div className="sidebar-footer-link">
              <button onClick={handleArchiveAndClose}>
                <img src={archiveIcon} alt="Archive" className="archive-icon" />
                Archive & Close Ticket
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default TicketDetail;