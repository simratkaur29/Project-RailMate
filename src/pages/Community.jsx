import { useState } from 'react';
import ReviewCard from '../components/ReviewCard';
import AnnouncementCard from '../components/AnnouncementCard';
import reviewsData from '../data/reviews';
import '../styles/community.css';

const announcements = [
  { id: 1, icon: '📢', title: 'Vande Bharat Service Extended', description: 'New Vande Bharat Express service launched on the Delhi-Jaipur route starting October 2026.', date: '2026-09-05' },
  { id: 2, icon: '⚠️', title: 'Platform Change Notice', description: 'Rajdhani Express (12309) will depart from Platform 5 instead of Platform 3 from Sept 10-15.', date: '2026-09-03' },
  { id: 3, icon: '🔧', title: 'Track Maintenance Alert', description: 'Trains on the Mumbai-Pune route may experience delays of 30-45 mins due to scheduled maintenance.', date: '2026-09-01' },
  { id: 4, icon: '🎉', title: 'Festive Season Booking Open', description: 'Special trains for Diwali season are now available for booking. Book early to avoid waitlisting!', date: '2026-08-28' },
];

const railwayTips = [
  { id: 1, tip: 'Arrive at the station at least 30 minutes before departure to find your coach and settle in.' },
  { id: 2, tip: 'Always keep your ticket or PNR number handy for verification by the TTE.' },
  { id: 3, tip: 'Check the platform number on display boards — it can change at the last minute.' },
  { id: 4, tip: 'Keep your valuables secure and luggage chained to the berth during night travel.' },
  { id: 5, tip: 'Use only authorized IRCTC food services for hygienic meals during your journey.' },
];

function Community({ user }) {
  const [activeTab, setActiveTab] = useState('announcements');
  const [reviews, setReviews] = useState(reviewsData);
  const [newReview, setNewReview] = useState({ train: '', rating: 5, text: '' });
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('railmate_posts');
    return saved ? JSON.parse(saved) : [
      { id: 1, user: 'Rajesh Kumar', text: 'Just had an amazing experience on the Vande Bharat! The seats are so comfortable and the food was great.', likes: 5, likedBy: [], date: '2026-09-02' },
      { id: 2, user: 'Anita Desai', text: 'Tip: Always carry a small padlock for your luggage in Sleeper class. Safety first!', likes: 8, likedBy: [], date: '2026-09-01' },
      { id: 3, user: 'Mohan Lal', text: 'The Chandigarh station has been renovated and it looks amazing now. Clean waiting rooms and good food options!', likes: 3, likedBy: [], date: '2026-08-30' },
    ];
  });
  const [newPost, setNewPost] = useState('');

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.train.trim() || !newReview.text.trim()) return;

    const review = {
      id: Date.now(),
      user: user?.name || 'Anonymous',
      train: newReview.train,
      rating: newReview.rating,
      text: newReview.text,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews([review, ...reviews]);
    setNewReview({ train: '', rating: 5, text: '' });
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post = {
      id: Date.now(),
      user: user?.name || 'Anonymous',
      text: newPost,
      likes: 0,
      likedBy: [],
      date: new Date().toISOString().split('T')[0],
    };
    const updated = [post, ...posts];
    setPosts(updated);
    localStorage.setItem('railmate_posts', JSON.stringify(updated));
    setNewPost('');
  };

  const handleLike = (postId) => {
    const userName = user?.name || 'Anonymous';
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const alreadyLiked = p.likedBy?.includes(userName);
        return {
          ...p,
          likes: alreadyLiked ? p.likes - 1 : p.likes + 1,
          likedBy: alreadyLiked
            ? p.likedBy.filter((n) => n !== userName)
            : [...(p.likedBy || []), userName],
        };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem('railmate_posts', JSON.stringify(updated));
  };

  const handleDeletePost = (postId) => {
    const updated = posts.filter((p) => p.id !== postId);
    setPosts(updated);
    localStorage.setItem('railmate_posts', JSON.stringify(updated));
  };

  const tabs = [
    { key: 'announcements', label: '📢 Announcements' },
    { key: 'tips', label: '💡 Railway Tips' },
    { key: 'reviews', label: '⭐ Reviews' },
    { key: 'posts', label: '💬 Posts' },
  ];

  return (
    <main className="community-page">
      <div className="page-header">
        <h1>👥 Community</h1>
        <p>Connect with fellow travelers and stay updated</p>
      </div>

      <div className="container community-content">
        <div className="tab-nav">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Announcements */}
        {activeTab === 'announcements' && (
          <div className="community-list">
            {announcements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        )}

        {/* Railway Tips */}
        {activeTab === 'tips' && (
          <div className="community-list">
            {railwayTips.map((t) => (
              <div key={t.id} className="announcement-card card" style={{ borderLeftColor: 'var(--secondary)' }}>
                <span className="icon">💡</span>
                <div>
                  <p>{t.tip}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reviews */}
        {activeTab === 'reviews' && (
          <div>
            <div className="review-form">
              <h3>Write a Review</h3>
              <form onSubmit={handleAddReview}>
                <div className="form-group">
                  <label htmlFor="review-train">Train Name</label>
                  <input
                    id="review-train"
                    type="text"
                    placeholder="e.g. Rajdhani Express"
                    value={newReview.train}
                    onChange={(e) => setNewReview({ ...newReview, train: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Rating</label>
                  <div className="rating-input">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        onClick={() => setNewReview({ ...newReview, rating: n })}
                        style={{ color: n <= newReview.rating ? 'var(--accent)' : 'var(--border)' }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="review-text">Your Review</label>
                  <textarea
                    id="review-text"
                    placeholder="Share your experience..."
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    rows="3"
                  />
                </div>
                <button type="submit" className="btn btn-primary">Submit Review</button>
              </form>
            </div>

            <div className="community-list">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}

        {/* Community Posts */}
        {activeTab === 'posts' && (
          <div>
            <div className="post-form">
              <form onSubmit={handleAddPost}>
                <textarea
                  placeholder="Share something with the community..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-sm">Post</button>
              </form>
            </div>

            <div className="community-list">
              {posts.map((post) => (
                <div key={post.id} className="post-card card">
                  <div className="post-header">
                    <span className="post-user">👤 {post.user}</span>
                    <span className="post-date">{post.date}</span>
                  </div>
                  <p className="post-body">{post.text}</p>
                  <div className="post-actions">
                    <button
                      className={`like-btn ${post.likedBy?.includes(user?.name) ? 'liked' : ''}`}
                      onClick={() => handleLike(post.id)}
                    >
                      ❤️ {post.likes}
                    </button>
                    {(post.user === user?.name || post.user === 'Anonymous') && (
                      <button className="delete-btn" onClick={() => handleDeletePost(post.id)}>
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Community;
