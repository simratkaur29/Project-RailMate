function TipCard({ tip }) {
  return (
    <div className="tip-card card">
      <span className="tip-icon">{tip.icon}</span>
      <div>
        <h4>{tip.title}</h4>
        <p>{tip.description}</p>

      </div>
    </div>
    
  );
}

export default TipCard;
