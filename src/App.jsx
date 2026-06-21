import { useMemo, useState } from "react";
import {
  ArrowLeft,
  AtSign,
  Bell,
  ChevronDown,
  Compass,
  Heart,
  Home,
  LockKeyhole,
  Menu,
  MessageCircle,
  PenSquare,
  Search,
  ShieldCheck,
  Video,
  X
} from "lucide-react";

const conversations = [
  {
    id: 1,
    name: "Mya Thazin",
    username: "mya_thazin",
    initials: "MT",
    message: "Sent you a reel",
    time: "2m",
    unread: true,
    active: true,
    gradient: "avatar-pink",
    locked: false
  },
  {
    id: 2,
    name: "Aung Min Khant",
    username: "aung_min_khant",
    initials: "AK",
    message: "You: ဟုတ်ကဲ့ အဆင်ပြေပါတယ်",
    time: "18m",
    unread: false,
    active: true,
    gradient: "avatar-blue",
    locked: false
  },
  {
    id: 3,
    name: "Coding Myanmar",
    username: "coding.mm",
    initials: "CM",
    message: "React project file ပို့ထားပါတယ်",
    time: "1h",
    unread: true,
    active: false,
    gradient: "avatar-orange",
    locked: false
  },
  {
    id: 4,
    name: "Su Myat Noe",
    username: "su_myat_noe",
    initials: "SN",
    message: "You: Thank you!",
    time: "3h",
    unread: false,
    active: false,
    gradient: "avatar-green",
    locked: true
  },
  {
    id: 5,
    name: "Design Lab",
    username: "design.lab",
    initials: "DL",
    message: "Liked a message",
    time: "6h",
    unread: false,
    active: true,
    gradient: "avatar-red",
    locked: true
  },
  {
    id: 6,
    name: "Htet Naing",
    username: "htet_naing",
    initials: "HN",
    message: "Voice message",
    time: "1d",
    unread: false,
    active: false,
    gradient: "avatar-cyan",
    locked: true
  },
  {
    id: 7,
    name: "Web Dev Myanmar",
    username: "webdev.mm",
    initials: "WM",
    message: "See you tomorrow",
    time: "2d",
    unread: false,
    active: false,
    gradient: "avatar-violet",
    locked: true
  }
];

const notes = [
  { id: 1, initials: "ZP", label: "Your note", gradient: "avatar-purple" },
  { id: 2, initials: "MT", label: "Mya", gradient: "avatar-pink", active: true },
  { id: 3, initials: "AK", label: "Aung", gradient: "avatar-blue", active: true },
  { id: 4, initials: "CM", label: "Coding", gradient: "avatar-orange" }
];

function Avatar({ initials, gradient, active, large = false }) {
  return (
    <div className={`avatar-frame ${large ? "avatar-large" : ""}`}>
      <div className={`avatar ${gradient}`}>{initials}</div>
      {active && <span className="active-indicator" />}
    </div>
  );
}

function NavButton({ icon: Icon, label, active, badge }) {
  return (
    <button type="button" className={`nav-button ${active ? "active" : ""}`}>
      <span className="nav-icon">
        <Icon size={25} strokeWidth={active ? 2.5 : 2} />
        {badge && <span className="nav-badge">{badge}</span>}
      </span>
      <span>{label}</span>
    </button>
  );
}

function LoginModal({ onClose }) {
  const authUrl =
    import.meta.env.VITE_INSTAGRAM_AUTH_URL || "/auth/instagram";

  const startOfficialLogin = () => {
    window.location.assign(authUrl);
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="login-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        <button
          type="button"
          className="modal-back"
          onClick={onClose}
          aria-label="Close login"
        >
          <ArrowLeft size={19} />
          Back
        </button>

        <div className="instagram-mark">
          <AtSign size={31} />
        </div>

        <h2 id="login-title">Log in to continue</h2>
        <p className="modal-description">
          Continue through Instagram's official authorization page to unlock
          the complete message list.
        </p>

        <button
          type="button"
          className="instagram-login-button"
          onClick={startOfficialLogin}
        >
          Continue with Instagram
        </button>

        <div className="security-note">
          <ShieldCheck size={18} />
          <span>
            This page does not request or store your Instagram password.
          </span>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("Primary");
  const [showLogin, setShowLogin] = useState(false);

  const filteredConversations = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return conversations.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.username.toLowerCase().includes(keyword) ||
        item.message.toLowerCase().includes(keyword);

      const matchesTab =
        tab === "Primary" ||
        (tab === "General" && !item.unread) ||
        (tab === "Requests" && item.locked);

      return matchesSearch && matchesTab;
    });
  }, [query, tab]);

  const openLogin = () => setShowLogin(true);

  return (
    <main className="app-layout">
      <aside className="sidebar">
        <div className="brand">Instagram</div>
        <AtSign className="brand-small" size={29} />

        <nav className="sidebar-navigation">
          <NavButton icon={Home} label="Home" />
          <NavButton icon={Search} label="Search" />
          <NavButton icon={Compass} label="Explore" />
          <NavButton icon={Video} label="Reels" />
          <NavButton
            icon={MessageCircle}
            label="Messages"
            active
            badge="3"
          />
          <NavButton icon={Heart} label="Notifications" />
          <NavButton icon={PenSquare} label="Create" />
        </nav>

        <div className="sidebar-bottom">
          <NavButton icon={AtSign} label="Threads" />
          <NavButton icon={Menu} label="More" />
        </div>
      </aside>

      <section className="inbox">
        <header className="inbox-header">
          <button type="button" className="username-button">
            zaypaihtet
            <ChevronDown size={17} />
          </button>

          <button
            type="button"
            className="round-icon-button"
            onClick={openLogin}
            aria-label="New message"
          >
            <PenSquare size={25} />
          </button>
        </header>

        <div className="search-wrapper">
          <Search size={18} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            aria-label="Search messages"
          />
          {query && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="notes-row">
          {notes.map((note, index) => (
            <button
              type="button"
              className="note"
              key={note.id}
              onClick={index === 0 ? openLogin : undefined}
            >
              <div className="story-ring">
                <Avatar
                  initials={note.initials}
                  gradient={note.gradient}
                  active={note.active}
                />
              </div>
              <span>{note.label}</span>
            </button>
          ))}
        </div>

        <div className="tabs">
          {["Primary", "General", "Requests"].map((item) => (
            <button
              type="button"
              className={tab === item ? "active" : ""}
              key={item}
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="conversation-area">
          <div className="conversation-list">
            {filteredConversations.map((item) => (
              <button
                type="button"
                className={`conversation ${item.locked ? "locked" : ""}`}
                key={item.id}
                onClick={openLogin}
              >
                <Avatar
                  initials={item.initials}
                  gradient={item.gradient}
                  active={item.active}
                  large
                />

                <div className="conversation-content">
                  <strong>{item.name}</strong>
                  <div
                    className={`message-preview ${
                      item.unread ? "unread" : ""
                    }`}
                  >
                    <span>{item.message}</span>
                    <span>· {item.time}</span>
                  </div>
                </div>

                {item.unread && !item.locked && (
                  <span className="unread-indicator" />
                )}
              </button>
            ))}
          </div>

          <div className="fade-lock" />

          <div className="unlock-card">
            <div className="lock-icon">
              <LockKeyhole size={24} />
            </div>
            <h1>Log in to keep reading</h1>
            <p>
              Some conversations are hidden. Log in to view the complete chat
              list and continue messaging.
            </p>
            <button type="button" onClick={openLogin}>
              Log in with Instagram
            </button>
          </div>
        </div>
      </section>

      <section className="message-placeholder">
        <div className="message-logo">
          <MessageCircle size={45} />
        </div>
        <h2>Your messages</h2>
        <p>Send private photos and messages to a friend or group.</p>
        <button type="button" onClick={openLogin}>
          Log in to send a message
        </button>
      </section>

      <nav className="mobile-navigation">
        <Home size={24} />
        <Search size={24} />
        <PenSquare size={24} />
        <Video size={24} />
        <MessageCircle size={24} fill="currentColor" />
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </main>
  );
}
