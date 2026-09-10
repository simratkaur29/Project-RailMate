function ReviewCard({ review }) {
  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="review-card card">
      <div className="review-top">
        <div>
          <div className="reviewer">{review.user}</div>
          <div className="review-train"> 🚆 {review.train}</div>
        </div>
        <div className="stars">{renderStars(review.rating)}</div>
      </div>
      <p className="review-body">{review.text}</p>
      <div className="review-date"> 📅 {review.date}</div>
    </div>
  );
}

export default ReviewCard;
