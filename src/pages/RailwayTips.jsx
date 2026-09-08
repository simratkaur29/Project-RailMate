import TipCard from '../components/TipCard';
import tipsData from '../data/tips';
import '../styles/community.css';

function RailwayTips() {
  const categories = [
    { key: 'beforeJourney', title: '🎒 Before Journey', data: tipsData.beforeJourney },
    { key: 'atStation', title: '🚉 At the Station', data: tipsData.atStation },
    { key: 'duringJourney', title: '🚆 During Journey', data: tipsData.duringJourney },
    { key: 'safety', title: '🛡️ Safety', data: tipsData.safety },
  ];

  return (
    <main className="tips-page">
      <div className="page-header">
        <h1>💡 Railway Tips</h1>
        <p>Essential tips for a safe and comfortable railway journey</p>
      </div>

      <div className="container">
        {categories.map((category) => (
          <div key={category.key} className="tips-category">
            <h2>{category.title}</h2>
            <div className="tips-cards">
              {category.data.map((tip) => (
                <TipCard key={tip.id} tip={tip} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default RailwayTips;
