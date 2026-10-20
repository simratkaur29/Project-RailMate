/**
 * Destination data for RailMate Travel Companion.
 * NOTE: This is sample data for demonstration purposes.
 * Attraction details, food recommendations, and transportation
 * information are general suggestions and may not reflect
 * current availability or conditions.
 */

const destinations = [
  {
    name: "New Delhi",
    tagline: "The Heart of India",
    description:
      "India's capital city blends ancient heritage with modern energy. From Mughal-era monuments to bustling markets and wide boulevards, Delhi offers an unforgettable mix of history, culture, food, and vibrant city life.",
    attractions: [
      {
        id: "ndl-1",
        name: "Red Fort",
        image: "/images/attractions/ndl-1.jpg",
        description:
          "A UNESCO World Heritage Site and iconic Mughal-era fortress built by Emperor Shah Jahan in the 17th century.",
        category: "History and Heritage",
      },
      {
        id: "ndl-2",
        name: "Qutub Minar",
        image: "/images/attractions/ndl-2.jpg",
        description:
          "A 73-meter tall minaret and one of the earliest examples of Indo-Islamic architecture in India.",
        category: "History and Heritage",
      },
      {
        id: "ndl-3",
        name: "India Gate",
        image: "/images/attractions/ndl-3.jpg",
        description:
          "A war memorial and landmark on Rajpath, surrounded by lush green lawns — ideal for an evening walk.",
        category: "History and Heritage",
      },
      {
        id: "ndl-4",
        name: "Lotus Temple",
        image: "/images/attractions/ndl-4.jpg",
        description:
          "A stunning Bahá'í House of Worship shaped like a lotus flower, known for its remarkable architecture and peaceful ambiance.",
        category: "History and Heritage",
      },
      {
        id: "ndl-5",
        name: "Lodhi Garden",
        image: "/images/attractions/ndl-5.jpg",
        description:
          "A beautiful city park spread over 90 acres, featuring 15th-century tombs and monuments amidst manicured greenery.",
        category: "Nature",
      },
      {
        id: "ndl-6",
        name: "Garden of Five Senses",
        image: "/images/attractions/ndl-6.jpg",
        description:
          "A landscaped park with artistic installations, rock formations, and themed gardens for a relaxed visit.",
        category: "Nature",
      },
      {
        id: "ndl-7",
        name: "Chandni Chowk",
        image: "/images/attractions/ndl-7.jpg",
        description:
          "One of the oldest and busiest markets in India, famous for street food, textiles, and local goods.",
        category: "Shopping",
      },
      {
        id: "ndl-8",
        name: "Connaught Place",
        image: "/images/attractions/ndl-8.jpg",
        description:
          "A major commercial and financial hub with a circular market, restaurants, shops, and entertainment options.",
        category: "Shopping",
      },
      {
        id: "ndl-9",
        name: "National Rail Museum",
        image: "/images/attractions/ndl-9.jpg",
        description:
          "A museum dedicated to the history of Indian Railways, with vintage locomotives and interactive exhibits — great for families.",
        category: "Family-Friendly",
      },
      {
        id: "ndl-10",
        name: "National Zoological Park",
        image: "/images/attractions/ndl-10.jpg",
        description:
          "Home to a wide variety of animals and birds, this zoo near Old Fort is a popular family outing spot.",
        category: "Family-Friendly",
      },
    ],
    food: [
      {
        name: "Chole Bhature",
        description:
          "Spiced chickpea curry served with deep-fried bread — a Delhi breakfast staple.",
        category: "Street Food",
      },
      {
        name: "Paranthe Wali Gali Paranthas",
        description:
          "Stuffed flatbreads from the famous lane in Chandni Chowk, available with dozens of fillings.",
        category: "Street Food",
      },
      {
        name: "Butter Chicken",
        description:
          "Creamy tomato-based chicken curry — one of Delhi's most iconic dishes.",
        category: "Main Course",
      },
      {
        name: "Chaat",
        description:
          "Tangy and spicy snack variations like Gol Gappe, Aloo Tikki, and Papdi Chaat found across the city.",
        category: "Street Food",
      },
      {
        name: "Kebabs",
        description:
          "Succulent grilled and tandoor-cooked kebabs from Old Delhi's kebab lanes.",
        category: "Non-Veg",
      },
      {
        name: "Kulfi Falooda",
        description:
          "Traditional Indian ice cream served with vermicelli and rose syrup — a refreshing dessert.",
        category: "Dessert",
      },
    ],
    transportation: [
      {
        mode: "Delhi Metro",
        description:
          "An extensive metro network connecting most parts of the city. Convenient, affordable, and air-conditioned.",
      },
      {
        mode: "Auto-Rickshaws",
        description:
          "Widely available for short distances. Use metered or app-based auto services when possible.",
      },
      {
        mode: "Ride-Sharing Apps",
        description:
          "Cab services are widely available. Convenient for longer distances and late-night travel.",
      },
      {
        mode: "DTC Buses",
        description:
          "Delhi Transport Corporation runs buses across the city. Economical for budget travelers.",
      },
    ],
    travelTips: [
      "The Delhi Metro is often the fastest way to travel across the city.",
      "Carry a water bottle and stay hydrated, especially during summer months.",
      "Plan visits to outdoor monuments in the morning or evening to avoid peak heat.",
      "Keep your belongings secure in crowded markets like Chandni Chowk.",
      "Many attractions have separate entry fees for Indian and international visitors.",
      "Bargaining is common in street markets but not in malls or fixed-price shops.",
    ],
  },
  {
    name: "Chandigarh",
    tagline: "The City Beautiful",
    description:
      "India's first planned city, designed by the French architect Le Corbusier. Known for its clean roads, lush gardens, modernist architecture, and high quality of life, Chandigarh serves as the capital of both Punjab and Haryana.",
    attractions: [
      {
        id: "chd-1",
        name: "Rock Garden",
        image: "/images/attractions/chd-1.jpg",
        description:
          "A unique sculpture garden built by Nek Chand using recycled industrial and household waste. A must-visit attraction.",
        category: "History and Heritage",
      },
      {
        id: "chd-2",
        name: "Capitol Complex",
        image: "/images/attractions/chd-2.jpg",
        description:
          "A UNESCO World Heritage Site designed by Le Corbusier, featuring the High Court, Secretariat, and Open Hand Monument.",
        category: "History and Heritage",
      },
      {
        id: "chd-3",
        name: "Sukhna Lake",
        image: "/images/attractions/chd-3.jpg",
        description:
          "A beautiful man-made lake at the foothills of the Shivalik range, popular for boating, jogging, and evening walks.",
        category: "Nature",
      },
      {
        id: "chd-4",
        name: "Rose Garden (Zakir Hussain Rose Garden)",
        image: "/images/attractions/chd-4.jpg",
        description:
          "Asia's largest rose garden with over 1,600 varieties of roses spread across 30 acres.",
        category: "Nature",
      },
      {
        id: "chd-5",
        name: "Elante Mall",
        image: "/images/attractions/chd-5.jpg",
        description:
          "One of the largest malls in northern India, featuring international brands, a food court, and entertainment.",
        category: "Shopping",
      },
      {
        id: "chd-6",
        name: "Sector 17 Market",
        image: "/images/attractions/chd-6.jpg",
        description:
          "The main commercial centre of Chandigarh with a pedestrian plaza, shops, restaurants, and cinemas.",
        category: "Shopping",
      },
      {
        id: "chd-7",
        name: "International Dolls Museum",
        image: "/images/attractions/chd-7.jpg",
        description:
          "A fascinating collection of dolls from over 25 countries, making it a delightful outing for families with children.",
        category: "Family-Friendly",
      },
      {
        id: "chd-8",
        name: "Chandigarh Bird Park",
        image: "/images/attractions/chd-8.jpg",
        description:
          "Home to various bird species in walk-through aviaries, located near Sukhna Lake.",
        category: "Nature",
      },
    ],
    food: [
      {
        name: "Amritsari Kulcha",
        description:
          "Stuffed bread served with chole and chutney — a popular Punjabi breakfast in Chandigarh.",
        category: "Street Food",
      },
      {
        name: "Chole Bhature",
        description:
          "A hearty combination of spiced chickpeas and fried bread found at most local eateries.",
        category: "Street Food",
      },
      {
        name: "Lassi",
        description:
          "Thick, creamy yogurt-based drink — sweet or salted — a staple refreshment in Punjab.",
        category: "Beverage",
      },
      {
        name: "Tandoori Chicken",
        description:
          "Marinated chicken cooked in a clay tandoor, widely available at Sector 17 restaurants.",
        category: "Non-Veg",
      },
      {
        name: "Patiala Peg",
        description:
          "Not a food, but Chandigarh is known for its vibrant café and lounge culture in Sectors 26 and 35.",
        category: "Experience",
      },
    ],
    transportation: [
      {
        mode: "CTU Buses",
        description:
          "Chandigarh Transport Undertaking buses connect all major sectors and nearby areas.",
      },
      {
        mode: "Auto-Rickshaws",
        description:
          "Available across the city. Use prepaid auto stands at the station for fair pricing.",
      },
      {
        mode: "Ride-Sharing Apps",
        description:
          "Cab services are available and convenient for travel within and around the city.",
      },
      {
        mode: "Cycling",
        description:
          "Chandigarh's flat roads and dedicated cycle tracks make cycling a pleasant option.",
      },
    ],
    travelTips: [
      "Chandigarh is well-planned in sectors — learn the sector numbers for easier navigation.",
      "Sukhna Lake is best enjoyed during early mornings or sunsets.",
      "Visit the Rock Garden on weekdays to avoid weekend crowds.",
      "The city is walkable within sectors, so comfortable shoes are recommended.",
      "Carry light layers — evenings can be cooler, especially in winter months.",
      "Street food is excellent in Sector 17 and Sector 22 markets.",
    ],
  },
  {
    name: "Jaipur",
    tagline: "The Pink City",
    description:
      "Jaipur, the capital of Rajasthan, is famous for its stunning palaces, vibrant bazaars, and rich Rajput heritage. The city's pink-hued old town, majestic forts, and warm hospitality make it one of India's most beloved tourist destinations.",
    attractions: [
      {
        id: "jpr-1",
        name: "Amber Fort",
        image: "/images/attractions/jpr-1.jpg",
        description:
          "A magnificent hilltop fort with artistic Hindu-style elements, breathtaking views, and a rich history.",
        category: "History and Heritage",
      },
      {
        id: "jpr-2",
        name: "Hawa Mahal (Palace of Winds)",
        image: "/images/attractions/jpr-2.jpg",
        description:
          "An iconic pink sandstone palace with 953 small windows, designed to allow royal women to observe street life.",
        category: "History and Heritage",
      },
      {
        id: "jpr-3",
        name: "City Palace",
        image: "/images/attractions/jpr-3.jpg",
        description:
          "A splendid complex of courtyards, gardens, and buildings that blend Rajasthani and Mughal architecture.",
        category: "History and Heritage",
      },
      {
        id: "jpr-4",
        name: "Jantar Mantar",
        image: "/images/attractions/jpr-4.jpg",
        description:
          "A UNESCO World Heritage Site featuring the world's largest stone sundial and astronomical instruments.",
        category: "History and Heritage",
      },
      {
        id: "jpr-5",
        name: "Nahargarh Fort",
        image: "/images/attractions/jpr-5.jpg",
        description:
          "Perched on the Aravalli hills, this fort offers panoramic views of Jaipur — especially stunning at sunset.",
        category: "Nature",
      },
      {
        id: "jpr-6",
        name: "Jal Mahal",
        image: "/images/attractions/jpr-6.jpg",
        description:
          "A palace set in the middle of Man Sagar Lake, creating a picturesque view against the Aravalli hills.",
        category: "Nature",
      },
      {
        id: "jpr-7",
        name: "Johari Bazaar",
        image: "/images/attractions/jpr-7.jpg",
        description:
          "Famous for Rajasthani jewellery, gemstones, and traditional textiles — a paradise for shoppers.",
        category: "Shopping",
      },
      {
        id: "jpr-8",
        name: "Bapu Bazaar",
        image: "/images/attractions/jpr-8.jpg",
        description:
          "A bustling market known for textiles, leather goods, and traditional Rajasthani handicrafts.",
        category: "Shopping",
      },
      {
        id: "jpr-9",
        name: "Birla Mandir",
        image: "/images/attractions/jpr-9.jpg",
        description:
          "A beautiful white marble temple situated at the base of Moti Dungari hill, peaceful and family-friendly.",
        category: "Family-Friendly",
      },
      {
        id: "jpr-10",
        name: "Elefantastic Elephant Sanctuary",
        image: "/images/attractions/jpr-10.jpg",
        description:
          "An ethical elephant sanctuary where visitors can learn about elephant care — a unique experience for families.",
        category: "Family-Friendly",
      },
    ],
    food: [
      {
        name: "Dal Baati Churma",
        description:
          "Rajasthan's signature dish — baked wheat balls served with lentil curry and sweet crumbled bread.",
        category: "Main Course",
      },
      {
        name: "Laal Maas",
        description:
          "A fiery red mutton curry made with mathania chillies — a Rajasthani delicacy for spice lovers.",
        category: "Non-Veg",
      },
      {
        name: "Pyaaz Kachori",
        description:
          "Deep-fried pastry filled with spiced onion filling — a beloved Jaipur street snack.",
        category: "Street Food",
      },
      {
        name: "Ghewar",
        description:
          "A traditional Rajasthani sweet made from flour, soaked in sugar syrup and topped with rabri.",
        category: "Dessert",
      },
      {
        name: "Lassi at Lassiwala",
        description:
          "Famous thick lassi served in clay cups from the iconic shop on MI Road.",
        category: "Beverage",
      },
    ],
    transportation: [
      {
        mode: "Auto-Rickshaws",
        description:
          "Widely available. Negotiate the fare beforehand or use app-based auto services.",
      },
      {
        mode: "Ride-Sharing Apps",
        description:
          "Cab services are convenient for reaching attractions spread across the city.",
      },
      {
        mode: "Jaipur Metro",
        description:
          "A limited metro line connecting Mansarovar to Chandpole, useful for certain routes.",
      },
      {
        mode: "City Buses (JCTSL)",
        description:
          "Jaipur City Transport runs buses on major routes, though frequency may vary.",
      },
    ],
    travelTips: [
      "Visit forts and outdoor attractions early in the morning to avoid heat and crowds.",
      "Carry cash for bazaar shopping — many smaller shops may not accept cards.",
      "Stay hydrated and carry sunscreen, especially during summer months.",
      "Hiring a full-day cab can be more convenient for covering multiple attractions.",
      "Check if a composite ticket is available for major heritage sites to save on entry fees.",
      "Respect local customs when visiting temples and religious sites.",
    ],
  },
  {
    name: "Amritsar",
    tagline: "The Holy City of the Golden Temple",
    description:
      "Amritsar, the spiritual and cultural centre of Sikhism, is home to the iconic Golden Temple (Sri Harmandir Sahib). The city is rich with history, spirituality, vibrant bazaars, and some of the finest Punjabi cuisine in India.",
    attractions: [
      {
        id: "asr-1",
        name: "Golden Temple (Sri Harmandir Sahib)",
        image: "/images/attractions/asr-1.jpg",
        description:
          "The holiest shrine of Sikhism, featuring a gold-plated sanctum surrounded by a sacred pool. Open to all visitors.",
        category: "History and Heritage",
      },
      {
        id: "asr-2",
        name: "Jallianwala Bagh",
        image: "/images/attractions/asr-2.jpg",
        description:
          "A historic memorial garden commemorating the 1919 massacre — a significant site in India's independence movement.",
        category: "History and Heritage",
      },
      {
        id: "asr-3",
        name: "Wagah Border",
        image: "/images/attractions/asr-3.jpg",
        description:
          "The India-Pakistan border crossing known for its daily flag-lowering ceremony attended by enthusiastic crowds.",
        category: "History and Heritage",
      },
      {
        id: "asr-4",
        name: "Partition Museum",
        image: "/images/attractions/asr-4.jpg",
        description:
          "India's first museum dedicated to the Partition of 1947, housed in the historic Town Hall.",
        category: "History and Heritage",
      },
      {
        id: "asr-5",
        name: "Ram Bagh Garden",
        image: "/images/attractions/asr-5.jpg",
        description:
          "A historic Mughal-style garden that served as the summer palace of Maharaja Ranjit Singh.",
        category: "Nature",
      },
      {
        id: "asr-6",
        name: "Hall Bazaar",
        image: "/images/attractions/asr-6.jpg",
        description:
          "A bustling market near the Golden Temple selling traditional Punjabi clothing, jutis, and souvenirs.",
        category: "Shopping",
      },
      {
        id: "asr-7",
        name: "Katra Jaimal Singh Market",
        image: "/images/attractions/asr-7.jpg",
        description:
          "A traditional market known for Phulkari embroidery, textiles, and Punjabi accessories.",
        category: "Shopping",
      },
      {
        id: "asr-8",
        name: "Maharaja Ranjit Singh Museum",
        image: "/images/attractions/asr-8.jpg",
        description:
          "A museum showcasing Sikh artefacts, weapons, paintings, and manuscripts — enriching for families.",
        category: "Family-Friendly",
      },
    ],
    food: [
      {
        name: "Langar at the Golden Temple",
        description:
          "The world's largest free community kitchen serves simple, wholesome vegetarian meals to all visitors.",
        category: "Experience",
      },
      {
        name: "Amritsari Kulcha",
        description:
          "Crispy stuffed bread cooked in a tandoor, served with chole and chutney — an Amritsar specialty.",
        category: "Street Food",
      },
      {
        name: "Amritsari Fish",
        description:
          "Batter-fried fish seasoned with ajwain (carom seeds) — a beloved local delicacy.",
        category: "Non-Veg",
      },
      {
        name: "Lassi",
        description:
          "Tall glasses of thick, creamy lassi topped with malai — a staple Punjab refreshment.",
        category: "Beverage",
      },
      {
        name: "Pinni",
        description:
          "A traditional Punjabi sweet made from whole wheat flour, jaggery, and dry fruits.",
        category: "Dessert",
      },
    ],
    transportation: [
      {
        mode: "Auto-Rickshaws",
        description:
          "The most common mode of transport in Amritsar. Negotiate fares before boarding.",
      },
      {
        mode: "Cycle Rickshaws",
        description:
          "Available in the old city area near the Golden Temple for short distances.",
      },
      {
        mode: "Ride-Sharing Apps",
        description:
          "Cab services are available for convenience, especially for the Wagah Border trip.",
      },
      {
        mode: "PRTC / Local Buses",
        description:
          "Punjab Roadways buses connect Amritsar to nearby towns and the Wagah Border.",
      },
    ],
    travelTips: [
      "Cover your head and remove shoes before entering the Golden Temple complex.",
      "Reach the Wagah Border by 3-4 PM to get good seating for the ceremony.",
      "The old city area is best explored on foot or by cycle rickshaw.",
      "Try the street food around the Golden Temple — it is among the best in India.",
      "Carry a scarf or head covering for visiting religious sites.",
      "Amritsar can be very hot in summer — plan outdoor visits for mornings or evenings.",
    ],
  },
  {
    name: "Mumbai",
    tagline: "The City of Dreams",
    description:
      "India's financial capital and entertainment hub, Mumbai is a city that never sleeps. From colonial-era architecture to Bollywood glamour, bustling local trains to serene seafronts, Mumbai offers an electrifying urban experience.",
    attractions: [
      {
        id: "mum-1",
        name: "Gateway of India",
        image: "/images/attractions/mum-1.jpg",
        description:
          "An iconic arch monument overlooking the Arabian Sea, built to commemorate King George V's visit in 1911.",
        category: "History and Heritage",
      },
      {
        id: "mum-2",
        name: "Chhatrapati Shivaji Maharaj Terminus",
        image: "/images/attractions/mum-2.jpg",
        description:
          "A UNESCO World Heritage Site and a stunning example of Victorian Gothic Revival architecture.",
        category: "History and Heritage",
      },
      {
        id: "mum-3",
        name: "Marine Drive",
        image: "/images/attractions/mum-3.jpg",
        description:
          "A 3.6 km arc-shaped promenade along the coast, known as the Queen's Necklace when lit up at night.",
        category: "Nature",
      },
      {
        id: "mum-4",
        name: "Elephanta Caves",
        image: "/images/attractions/mum-4.jpg",
        description:
          "Ancient rock-cut cave temples on an island in Mumbai Harbour, accessible by ferry from the Gateway.",
        category: "History and Heritage",
      },
      {
        id: "mum-5",
        name: "Colaba Causeway",
        image: "/images/attractions/mum-5.jpg",
        description:
          "A vibrant street market in South Mumbai offering fashion, antiques, accessories, and street food.",
        category: "Shopping",
      },
      {
        id: "mum-6",
        name: "Crawford Market",
        image: "/images/attractions/mum-6.jpg",
        description:
          "A bustling wholesale market known for fresh produce, imported goods, and pet animals.",
        category: "Shopping",
      },
      {
        id: "mum-7",
        name: "Sanjay Gandhi National Park",
        image: "/images/attractions/mum-7.jpg",
        description:
          "A large protected area within Mumbai, featuring hiking trails, Kanheri Caves, and a lion safari.",
        category: "Nature",
      },
      {
        id: "mum-8",
        name: "EsselWorld & Water Kingdom",
        image: "/images/attractions/mum-8.jpg",
        description:
          "Mumbai's popular amusement and water park, great for a fun family day out.",
        category: "Family-Friendly",
      },
    ],
    food: [
      {
        name: "Vada Pav",
        description:
          "Mumbai's iconic street food — a spiced potato fritter in a bread bun with chutneys.",
        category: "Street Food",
      },
      {
        name: "Pav Bhaji",
        description:
          "A spicy mixed vegetable mash served with buttered bread rolls — a Mumbai classic.",
        category: "Street Food",
      },
      {
        name: "Bombay Sandwich",
        description:
          "A layered vegetable sandwich with chutney and cheese, grilled or toasted on the streets.",
        category: "Street Food",
      },
      {
        name: "Seafood at Trishna / Gajalee",
        description:
          "Mumbai is famous for its fresh seafood — crab, prawns, and fish prepared in coastal styles.",
        category: "Non-Veg",
      },
      {
        name: "Cutting Chai",
        description:
          "Half a glass of strong, milky tea — the city's favourite quick refreshment.",
        category: "Beverage",
      },
    ],
    transportation: [
      {
        mode: "Mumbai Local Trains",
        description:
          "The lifeline of Mumbai. Three lines (Western, Central, Harbour) connect the entire city.",
      },
      {
        mode: "BEST Buses",
        description:
          "Mumbai's bus service covers routes not reached by trains. Affordable and extensive.",
      },
      {
        mode: "Mumbai Metro",
        description:
          "Metro lines are expanding and connect key suburbs — check for routes near your destination.",
      },
      {
        mode: "Kaali-Peeli Taxis & Ride-Sharing",
        description:
          "Metered black-and-yellow taxis and app-based cab services are available citywide.",
      },
    ],
    travelTips: [
      "Avoid local trains during peak hours (8-10 AM and 6-8 PM) if you're unfamiliar with the system.",
      "Marine Drive is best enjoyed during sunset — bring a snack and relax by the sea.",
      "Keep cash handy for street food — most vendors don't accept cards.",
      "Mumbai's weather is humid most of the year — carry light, breathable clothing.",
      "Traffic congestion is common — plan travel time generously for appointments.",
      "The ferry to Elephanta Caves runs from the Gateway of India and takes about an hour.",
    ],
  },
  {
    name: "Varanasi",
    tagline: "The Spiritual Capital of India",
    description:
      "One of the world's oldest continuously inhabited cities, Varanasi sits on the banks of the sacred Ganges. It is a city of temples, ghats, ancient learning, and profound spiritual traditions that draw visitors from across the globe.",
    attractions: [
      {
        id: "vrn-1",
        name: "Dashashwamedh Ghat",
        image: "/images/attractions/vrn-1.jpg",
        description:
          "The main ghat on the Ganges, famous for its spectacular Ganga Aarti ceremony held every evening.",
        category: "History and Heritage",
      },
      {
        id: "vrn-2",
        name: "Kashi Vishwanath Temple",
        image: "/images/attractions/vrn-2.jpg",
        description:
          "One of the most famous Hindu temples dedicated to Lord Shiva, located in the heart of the old city.",
        category: "History and Heritage",
      },
      {
        id: "vrn-3",
        name: "Sarnath",
        image: "/images/attractions/vrn-3.jpg",
        description:
          "The site where Buddha gave his first sermon. Features ancient stupas, a museum, and the Ashoka Pillar.",
        category: "History and Heritage",
      },
      {
        id: "vrn-4",
        name: "Assi Ghat",
        image: "/images/attractions/vrn-4.jpg",
        description:
          "A serene ghat popular among travelers, known for morning yoga sessions, chai stalls, and cultural events.",
        category: "Nature",
      },
      {
        id: "vrn-5",
        name: "Boat Ride on the Ganges",
        image: "/images/attractions/vrn-5.jpg",
        description:
          "A sunrise boat ride along the ghats offers an unforgettable view of rituals, temples, and daily life.",
        category: "Nature",
      },
      {
        id: "vrn-6",
        name: "Vishwanath Gali",
        image: "/images/attractions/vrn-6.jpg",
        description:
          "A narrow lane near the temple filled with silk shops, brassware, wooden toys, and street food stalls.",
        category: "Shopping",
      },
      {
        id: "vrn-7",
        name: "Banaras Hindu University (BHU)",
        image: "/images/attractions/vrn-7.jpg",
        description:
          "One of Asia's largest residential universities with a beautiful campus and the Bharat Kala Bhavan museum.",
        category: "Family-Friendly",
      },
      {
        id: "vrn-8",
        name: "Ramnagar Fort",
        image: "/images/attractions/vrn-8.jpg",
        description:
          "An 18th-century fort on the eastern bank of the Ganges, housing a museum of vintage cars and royal artefacts.",
        category: "History and Heritage",
      },
    ],
    food: [
      {
        name: "Banarasi Paan",
        description:
          "The famous betel leaf preparation from Varanasi — a cultural experience in itself.",
        category: "Experience",
      },
      {
        name: "Kachori Sabzi",
        description:
          "Crispy deep-fried pastry with spiced lentil filling, served with potato curry — a classic breakfast.",
        category: "Street Food",
      },
      {
        name: "Malaiyo",
        description:
          "A winter-special frothy milk dessert flavoured with saffron and cardamom — unique to Varanasi.",
        category: "Dessert",
      },
      {
        name: "Thandai",
        description:
          "A refreshing spiced milk drink with nuts and aromatic spices, popular during festivals.",
        category: "Beverage",
      },
      {
        name: "Banarasi Tamatar Chaat",
        description:
          "A tangy tomato-based chaat special to the city — simple but bursting with flavour.",
        category: "Street Food",
      },
    ],
    transportation: [
      {
        mode: "Auto-Rickshaws",
        description:
          "Available throughout the city. Negotiate fares as meters are rarely used.",
      },
      {
        mode: "E-Rickshaws",
        description:
          "Electric rickshaws are common for short distances within the old city and ghat areas.",
      },
      {
        mode: "Boats",
        description:
          "Hiring a boat is essential for exploring the ghats along the Ganges river.",
      },
      {
        mode: "Walking",
        description:
          "The old city's narrow lanes are best explored on foot — vehicles cannot enter many areas.",
      },
    ],
    travelTips: [
      "Attend the Ganga Aarti at Dashashwamedh Ghat — arrive early for a good viewing spot.",
      "The old city lanes are narrow — wear comfortable walking shoes.",
      "Sunrise boat rides are highly recommended — book the evening before.",
      "Be respectful at the ghats, especially the cremation ghats.",
      "Varanasi silk sarees make excellent souvenirs — visit trusted shops.",
      "The city can be overwhelming for first-time visitors — pace yourself and enjoy the atmosphere.",
    ],
  },
  {
    name: "Patna",
    tagline: "The Ancient City on the Ganges",
    description:
      "Patna, the capital of Bihar, is one of the oldest continuously inhabited cities in the world. Known as Pataliputra in ancient times, it was a seat of the Maurya and Gupta empires. Today it blends historical significance with growing urban development.",
    attractions: [
      {
        id: "ptn-1",
        name: "Golghar",
        image: "/images/attractions/ptn-1.jpg",
        description:
          "A massive granary built in 1786 with a unique beehive shape. Climb the spiral staircase for panoramic views of Patna.",
        category: "History and Heritage",
      },
      {
        id: "ptn-2",
        name: "Patna Museum",
        image: "/images/attractions/ptn-2.jpg",
        description:
          "Houses a rich collection of Hindu and Buddhist sculptures, paintings, and a fossilised tree trunk.",
        category: "History and Heritage",
      },
      {
        id: "ptn-3",
        name: "Takht Sri Patna Sahib",
        image: "/images/attractions/ptn-3.jpg",
        description:
          "One of five sacred Takhts (thrones) in Sikhism, marking the birthplace of Guru Gobind Singh.",
        category: "History and Heritage",
      },
      {
        id: "ptn-4",
        name: "Eco Park",
        image: "/images/attractions/ptn-4.jpg",
        description:
          "A well-maintained park on the banks of the Ganges, featuring boating, gardens, and amusement rides.",
        category: "Family-Friendly",
      },
      {
        id: "ptn-5",
        name: "Gandhi Maidan",
        image: "/images/attractions/ptn-5.jpg",
        description:
          "A large open ground in the heart of Patna, used for public events and bordered by parks.",
        category: "Nature",
      },
      {
        id: "ptn-6",
        name: "Kumhrar Archaeological Site",
        image: "/images/attractions/ptn-6.jpg",
        description:
          "Excavated ruins of the ancient Pataliputra capital, including remnants of the Mauryan assembly hall.",
        category: "History and Heritage",
      },
    ],
    food: [
      {
        name: "Litti Chokha",
        description:
          "Roasted wheat balls filled with sattu (gram flour), served with mashed vegetable — Bihar's iconic dish.",
        category: "Main Course",
      },
      {
        name: "Sattu Paratha",
        description:
          "Flatbread stuffed with roasted gram flour — a nutritious and traditional Bihar staple.",
        category: "Street Food",
      },
      {
        name: "Khaja",
        description:
          "A layered, crispy sweet pastry soaked in sugar syrup — a famous Bihar sweet from Silao.",
        category: "Dessert",
      },
      {
        name: "Thekua",
        description:
          "A deep-fried sweet snack made from wheat flour, jaggery, and grated coconut — a Chhath festival essential.",
        category: "Dessert",
      },
    ],
    transportation: [
      {
        mode: "Auto-Rickshaws",
        description:
          "The primary mode of transport in Patna. Shared autos are also available on common routes.",
      },
      {
        mode: "Ride-Sharing Apps",
        description:
          "App-based cab services are available for comfortable travel around the city.",
      },
      {
        mode: "City Buses",
        description:
          "Local buses connect various parts of the city, though schedules may vary.",
      },
      {
        mode: "E-Rickshaws",
        description:
          "Widely available for short distances and last-mile connectivity.",
      },
    ],
    travelTips: [
      "Visit Golghar early in the morning for the best views and fewer crowds.",
      "Patna's historical sites are spread across the city — plan transportation in advance.",
      "Try Litti Chokha at a local eatery for an authentic taste of Bihar.",
      "The Ganges riverfront is a peaceful place for an evening walk.",
      "Carry comfortable footwear — some historical sites involve walking on uneven ground.",
      "The city is developing rapidly, so some online maps may not reflect recent road changes.",
    ],
  },
  {
    name: "Kolkata",
    tagline: "The City of Joy",
    description:
      "Kolkata, the cultural capital of India, is a city of literary traditions, colonial architecture, vibrant festivals, and warm-hearted people. From the grand Victoria Memorial to the bustling streets of College Street, Kolkata is an experience unlike any other.",
    attractions: [
      {
        id: "kol-1",
        name: "Victoria Memorial",
        image: "/images/attractions/kol-1.jpg",
        description:
          "A majestic white marble monument and museum set in lush gardens — one of Kolkata's most iconic landmarks.",
        category: "History and Heritage",
      },
      {
        id: "kol-2",
        name: "Howrah Bridge",
        image: "/images/attractions/kol-2.jpg",
        description:
          "An engineering marvel and cantilever bridge over the Hooghly River, connecting Howrah to Kolkata.",
        category: "History and Heritage",
      },
      {
        id: "kol-3",
        name: "Indian Museum",
        image: "/images/attractions/kol-3.jpg",
        description:
          "The oldest and largest museum in India, housing rare antiques, armour, fossils, and Mughal paintings.",
        category: "History and Heritage",
      },
      {
        id: "kol-4",
        name: "Princep Ghat",
        image: "/images/attractions/kol-4.jpg",
        description:
          "A riverside promenade on the Hooghly with Palladian columns — beautiful during sunset.",
        category: "Nature",
      },
      {
        id: "kol-5",
        name: "New Market",
        image: "/images/attractions/kol-5.jpg",
        description:
          "One of the oldest markets in Kolkata with a vast variety of goods — from clothing to electronics.",
        category: "Shopping",
      },
      {
        id: "kol-6",
        name: "College Street (Boi Para)",
        image: "/images/attractions/kol-6.jpg",
        description:
          "The largest second-hand book market in the world — a paradise for bibliophiles.",
        category: "Shopping",
      },
      {
        id: "kol-7",
        name: "Eco Tourism Park (New Town)",
        image: "/images/attractions/kol-7.jpg",
        description:
          "A large urban park featuring themed gardens, a butterfly garden, and boating facilities for families.",
        category: "Family-Friendly",
      },
      {
        id: "kol-8",
        name: "Marble Palace",
        image: "/images/attractions/kol-8.jpg",
        description:
          "A grand 19th-century mansion with European sculptures, paintings, and a small zoo — unique and underrated.",
        category: "History and Heritage",
      },
    ],
    food: [
      {
        name: "Rosogolla",
        description:
          "The iconic Bengali sweet — soft spongy balls of chhena soaked in light sugar syrup.",
        category: "Dessert",
      },
      {
        name: "Kathi Roll",
        description:
          "Paratha wrapped around skewered kebab meat or paneer — a famous Kolkata street invention.",
        category: "Street Food",
      },
      {
        name: "Fish Curry (Macher Jhol)",
        description:
          "A light, aromatic fish curry that is a staple in every Bengali household.",
        category: "Main Course",
      },
      {
        name: "Phuchka",
        description:
          "Kolkata's version of golgappa — crispy puris filled with spiced mashed potato and tangy tamarind water.",
        category: "Street Food",
      },
      {
        name: "Mishti Doi",
        description:
          "Sweetened fermented yogurt set in clay pots — a beloved Bengali dessert.",
        category: "Dessert",
      },
    ],
    transportation: [
      {
        mode: "Kolkata Metro",
        description:
          "India's first metro railway. Currently operates on multiple lines connecting key areas.",
      },
      {
        mode: "Yellow Taxis",
        description:
          "Kolkata's iconic yellow Ambassador taxis are still available alongside app-based cabs.",
      },
      {
        mode: "Trams",
        description:
          "Asia's oldest running tram network — a heritage experience, though coverage is limited.",
      },
      {
        mode: "Ferry",
        description:
          "Ferries across the Hooghly River connect Howrah and Kolkata — scenic and affordable.",
      },
    ],
    travelTips: [
      "Visit the Victoria Memorial on a clear day — the gardens are beautiful for photography.",
      "Kolkata's street food is exceptional — try phuchka from local street vendors.",
      "The city is humid for most of the year — carry light cotton clothing.",
      "Hand-pulled rickshaws still operate in some areas — a unique Kolkata experience.",
      "Book clubs and adda (conversation) culture thrive in College Street coffee houses.",
      "Durga Puja season (October) transforms the city — plan well in advance if visiting then.",
    ],
  },
];

export default destinations;
