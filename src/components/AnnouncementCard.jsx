function AnnouncementCard({ announcement }) {
  return (
    <div className="announcement-card card">
      <span className="icon">{announcement.icon}</span>
      <div>
        <h4>{announcement.title}</h4>
        <p>{announcement.description}</p>
        <div className="date"> 📅 {announcement.date}</div>
      </div>
    </div>
  );
}

export default AnnouncementCard;
