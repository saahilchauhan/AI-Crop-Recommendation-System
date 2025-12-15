import React, { useState, useEffect } from 'react';
//import { MapPin, FileText, Info, Leaf, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { MapPin, FileText, Info, Leaf, AlertCircle, CheckCircle, Loader } from 'lucide-react';

// Simplified crop database
const CROPS = {
  rice: { name: 'धान (Rice)', icon: '🌾', season: 'खरीफ', yield: '30-40 क्विंटल/एकड़' },
  wheat: { name: 'गेहूं (Wheat)', icon: '🌾', season: 'रबी', yield: '25-30 क्विंटल/एकड़' },
  maize: { name: 'मक्का (Maize)', icon: '🌽', season: 'खरीफ/रबी', yield: '20-30 क्विंटल/एकड़' },
  cotton: { name: 'कपास (Cotton)', icon: '🌱', season: 'खरीफ', yield: '15-20 क्विंटल/एकड़' },
  chickpea: { name: 'चना (Chickpea)', icon: '🫘', season: 'रबी', yield: '8-12 क्विंटल/एकड़' },
  kidneybeans: { name: 'राजमा (Kidney Beans)', icon: '🫘', season: 'रबी', yield: '10-15 क्विंटल/एकड़' },
  pigeonpeas: { name: 'अरहर (Arhar)', icon: '🫘', season: 'खरीफ', yield: '8-10 क्विंटल/एकड़' },
  mothbeans: { name: 'मोठ (Moth Beans)', icon: '🫘', season: 'खरीफ', yield: '5-8 क्विंटल/एकड़' },
  mungbean: { name: 'मूंग (Mung Bean)', icon: '🫘', season: 'खरीफ', yield: '8-12 क्विंटल/एकड़' },
  blackgram: { name: 'उड़द (Black Gram)', icon: '🫘', season: 'खरीफ/रबी', yield: '8-10 क्विंटल/एकड़' },
  lentil: { name: 'मसूर (Lentil)', icon: '🫘', season: 'रबी', yield: '8-12 क्विंटल/एकड़' },
  pomegranate: { name: 'अनार (Pomegranate)', icon: '🍎', season: 'साल भर', yield: '100-150 क्विंटल/एकड़' },
  
  // ADD THESE MISSING ONES:
  banana: { name: 'केला (Banana)', icon: '🍌', season: 'साल भर', yield: '300-400 क्विंटल/एकड़' },
  mango: { name: 'आम (Mango)', icon: '🥭', season: 'गर्मी', yield: '100-150 क्विंटल/एकड़' },
  grapes: { name: 'अंगूर (Grapes)', icon: '🍇', season: 'साल भर', yield: '150-200 क्विंटल/एकड़' },
  watermelon: { name: 'तरबूज (Watermelon)', icon: '🍉', season: 'गर्मी', yield: '200-300 क्विंटल/एकड़' },
  muskmelon: { name: 'खरबूजा (Muskmelon)', icon: '🍈', season: 'गर्मी', yield: '150-200 क्विंटल/एकड़' },
  apple: { name: 'सेब (Apple)', icon: '🍎', season: 'सर्दी', yield: '80-120 क्विंटल/एकड़' },
  orange: { name: 'संतरा (Orange)', icon: '🍊', season: 'सर्दी', yield: '150-200 क्विंटल/एकड़' },
  papaya: { name: 'पपीता (Papaya)', icon: '🫐', season: 'साल भर', yield: '400-600 क्विंटल/एकड़' },
  coconut: { name: 'नारियल (Coconut)', icon: '🥥', season: 'साल भर', yield: '80-100 फल/पेड़/साल' },
  jute: { name: 'जूट (Jute)', icon: '🌿', season: 'खरीफ', yield: '20-30 क्विंटल/एकड़' },
  coffee: { name: 'कॉफ़ी (Coffee)', icon: '☕', season: 'साल भर', yield: '8-12 क्विंटल/एकड़' }
};

const FarmerFriendlyCropApp = () => {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [soilData, setSoilData] = useState({
    N: '',
    P: '',
    K: '',
    pH: ''
  });
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [language, setLanguage] = useState('hi'); // 'hi' for Hindi, 'en' for English

  const text = {
    hi: {
      title: 'फसल सिफारिश प्रणाली',
      subtitle: 'किसानों के लिए सरल और मुफ्त',
      step1: 'स्थान',
      step2: 'मिट्टी',
      step3: 'सुझाव',
      step1Title: 'कदम 1: अपना स्थान बताएं',
      step1Desc: 'हम आपके मौसम की जानकारी अपने आप लेंगे',
      getLocation: 'मेरा स्थान लें',
      orEnterManually: 'या खुद से भरें',
      manualEntry: 'मैनुअल रूप से भरें →',
      whyNeeded: 'क्यों जरूरी है?',
      whyNeededText: 'आपके क्षेत्र का मौसम (तापमान, नमी) जानने से हम सही फसल सुझा सकते हैं। यह जानकारी स्वचालित रूप से ली जाती है।',
      step2Title: 'कदम 2: मिट्टी की जानकारी',
      step2Desc: 'अपने मृदा स्वास्थ्य कार्ड से नंबर भरें',
      nitrogen: 'नाइट्रोजन (N)',
      phosphorus: 'फास्फोरस (P)',
      potassium: 'पोटाश (K)',
      ph: 'पीएच (pH)',
      seeOnCard: 'आपके मृदा कार्ड पर देखें',
      example: 'जैसे',
      dontHaveCard: 'मृदा कार्ड नहीं है?',
      useAverage: 'औसत मान का उपयोग करें',
      getRecommendation: 'फसल सुझाव पाएं',
      goBack: '← पीछे जाएं',
      yourWeather: 'आपका मौसम',
      yourSoil: 'आपकी मिट्टी',
      temp: 'तापमान',
      humidity: 'नमी',
      suitability: 'उपयुक्तता',
      recommendedCrops: 'आपके लिए सुझाई गई फसलें',
      basedOn: 'आपकी मिट्टी और मौसम के अनुसार सबसे अच्छी फसलें',
      season: 'मौसम',
      expectedYield: 'अनुमानित उपज',
      best: 'सबसे अच्छा',
      good: 'अच्छा',
      okay: 'ठीक',
      loading: 'जानकारी ला रहे हैं...',
      importantInfo: 'महत्वपूर्ण सूचना',
      disclaimer: 'फसल चुनने से पहले अपने स्थानीय कृषि अधिकारी से सलाह लें। बाजार की मांग और पानी की उपलब्धता भी देखें।',
      startNew: 'नई खोज शुरू करें',
      footer1: '🌾 किसानों के लिए निःशुल्क सेवा | IIT Patna',
      footer2: 'यह जानकारी केवल सुझाव के लिए है। अंतिम निर्णय से पहले विशेषज्ञ से परामर्श लें।',
      locationError: 'स्थान प्राप्त करने में समस्या। कृपया मैन्युअल रूप से भरें।'
    },
    en: {
      title: 'Crop Recommendation System',
      subtitle: 'Simple and Free for Farmers',
      step1: 'Location',
      step2: 'Soil',
      step3: 'Results',
      step1Title: 'Step 1: Share Your Location',
      step1Desc: 'We will automatically get weather information',
      getLocation: 'Get My Location',
      orEnterManually: 'Or Enter Manually',
      manualEntry: 'Enter Manually →',
      whyNeeded: 'Why is this needed?',
      whyNeededText: 'Knowing your local weather (temperature, humidity) helps us suggest the right crops. This information is automatically collected.',
      step2Title: 'Step 2: Soil Information',
      step2Desc: 'Fill numbers from your Soil Health Card',
      nitrogen: 'Nitrogen (N)',
      phosphorus: 'Phosphorus (P)',
      potassium: 'Potash (K)',
      ph: 'pH Level',
      seeOnCard: 'Check on your Soil Card',
      example: 'e.g.',
      dontHaveCard: "Don't have Soil Card?",
      useAverage: 'Use Average Values',
      getRecommendation: 'Get Crop Suggestions',
      goBack: '← Go Back',
      yourWeather: 'Your Weather',
      yourSoil: 'Your Soil',
      temp: 'Temperature',
      humidity: 'Humidity',
      suitability: 'Suitability',
      recommendedCrops: 'Recommended Crops for You',
      basedOn: 'Best crops based on your soil and weather',
      season: 'Season',
      expectedYield: 'Expected Yield',
      best: 'Best',
      good: 'Good',
      okay: 'Okay',
      loading: 'Loading...',
      importantInfo: 'Important Information',
      disclaimer: 'Consult your local agricultural officer before choosing crops. Consider market demand and water availability.',
      startNew: 'Start New Search',
      footer1: '🌾 Free Service for Farmers | IIT Patna',
      footer2: 'This information is for guidance only. Consult an expert before making final decisions.',
      locationError: 'Unable to get location. Please enter manually.'
    }
  };

  const t = text[language];

  // Get user's location
  const getLocationAndWeather = async () => {
    setLoadingWeather(true);
    try {
      // Get GPS location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      setLocation({ lat: latitude, lon: longitude });

      // Fetch weather data from Open-Meteo (free, no API key needed!)
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation&timezone=auto`
      );
      
      const weatherData = await weatherResponse.json();
      
      setWeather({
        temperature: Math.round(weatherData.current.temperature_2m),
        humidity: Math.round(weatherData.current.relative_humidity_2m),
        rainfall: weatherData.current.precipitation || 0
      });

      setStep(2);
    } catch (error) {
      alert(t.locationError);
      // Use default values for demo
      setWeather({
        temperature: 28,
        humidity: 65,
        rainfall: 0
      });
      setStep(2);
    } finally {
      setLoadingWeather(false);
    }
  };

  // Use average soil values
  const useAverageValues = () => {
    setSoilData({
      N: '80',
      P: '50',
      K: '50',
      pH: '6.5'
    });
  };

  const getRecommendations = async () => {
  setLoadingRecommendations(true);
  
  try {
    const response = await fetch('https://crop-backend-api-5ynn.onrender.com/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        N: parseFloat(soilData.N) || 80,
        P: parseFloat(soilData.P) || 50,
        K: parseFloat(soilData.K) || 50,
        temperature: weather?.temperature || 25,
        humidity: weather?.humidity || 70,
        ph: parseFloat(soilData.pH) || 6.5,
        rainfall: weather?.rainfall || 0
      })
    });

    const data = await response.json();
    
    console.log('API Response:', data);
    
    if (data.success && data.top_5_crops) {
      // Map ML model crop names to our CROPS object
      const cropMapping = {
        'rice': 'rice',
        'wheat': 'wheat',
        'maize': 'maize',
        'chickpea': 'chickpea',
        'kidneybeans': 'kidneybeans',
        'pigeonpeas': 'pigeonpeas',
        'mothbeans': 'mothbeans',
        'mungbean': 'mungbean',
        'blackgram': 'blackgram',
        'lentil': 'lentil',
        'pomegranate': 'pomegranate',
        'banana': 'banana',
        'mango': 'mango',
        'grapes': 'grapes',
        'watermelon': 'watermelon',
        'muskmelon': 'muskmelon',
        'apple': 'apple',
        'orange': 'orange',
        'papaya': 'papaya',
        'coconut': 'coconut',
        'cotton': 'cotton',
        'jute': 'jute',
        'coffee': 'coffee'
      };
      
      const transformed = data.top_5_crops.slice(0, 5).map((crop, idx) => {
        const mappedCrop = cropMapping[crop.toLowerCase()] || crop.toLowerCase();
        const cropData = CROPS[mappedCrop];
        
        // Fallback if crop not found in CROPS
        if (!cropData) {
          console.warn(`Crop not found in database: ${crop}`);
          return {
            crop: crop,
            score: Math.round(data.top_5_probabilities[idx] * 100),
            data: {
              name: crop.charAt(0).toUpperCase() + crop.slice(1),
              icon: '🌾',
              season: 'Based on your conditions',
              yield: 'Varies by region'
            }
          };
        }
        
        return {
          crop: mappedCrop,
          score: Math.round(data.top_5_probabilities[idx] * 100),
          data: cropData
        };
      });
      
      console.log('Transformed recommendations:', transformed);
      
      setRecommendations(transformed);
      setStep(3);
    } else {
      alert('Error getting recommendations. Please try again.');
      console.error('API returned error:', data);
    }
  } catch (error) {
    console.error('Error calling ML API:', error);
    alert('Unable to connect to ML service. Please check your connection.');
  } finally {
    setLoadingRecommendations(false);
  }
};

/*   const getRecommendations = () => {
    const N = parseFloat(soilData.N) || 80;
    const P = parseFloat(soilData.P) || 50;
    const K = parseFloat(soilData.K) || 50;
    const pH = parseFloat(soilData.pH) || 6.5;
    const temp = weather?.temperature || 25;
    const humidity = weather?.humidity || 70;

    const scores = [];

    // Rice - needs high water, warm temp
    if (temp > 25 && humidity > 70 && N > 70) {
      scores.push({ crop: 'rice', score: 95 });
    } else {
      scores.push({ crop: 'rice', score: 60 });
    }

    // Wheat - cool temp, moderate water
    if (temp < 25 && temp > 15 && N > 70) {
      scores.push({ crop: 'wheat', score: 95 });
    } else {
      scores.push({ crop: 'wheat', score: 60 });
    }

    // Maize - versatile
    scores.push({ crop: 'maize', score: 75 });

    // Cotton - hot, moderate humidity
    if (temp > 25 && humidity > 60 && humidity < 85) {
      scores.push({ crop: 'cotton', score: 90 });
    } else {
      scores.push({ crop: 'cotton', score: 60 });
    }

    // Sugarcane - high NPK, hot
    if (N > 90 && K > 50 && temp > 25) {
      scores.push({ crop: 'sugarcane', score: 88 });
    } else {
      scores.push({ crop: 'sugarcane', score: 55 });
    }

    // Chickpea - cool, low N
    if (temp < 25 && N < 60) {
      scores.push({ crop: 'chickpea', score: 92 });
    } else {
      scores.push({ crop: 'chickpea', score: 65 });
    }

    // Arhar - moderate conditions
    scores.push({ crop: 'pigeonpeas', score: 70 });

    // Soybean - moderate N
    if (N > 40 && N < 100 && temp > 20) {
      scores.push({ crop: 'soybean', score: 85 });
    } else {
      scores.push({ crop: 'soybean', score: 65 });
    }

    // Potato - cool weather
    if (temp < 25 && pH > 5.5 && pH < 7.5) {
      scores.push({ crop: 'potato', score: 88 });
    } else {
      scores.push({ crop: 'potato', score: 60 });
    }

    // Tomato - moderate conditions
    if (temp > 20 && temp < 30) {
      scores.push({ crop: 'tomato', score: 82 });
    } else {
      scores.push({ crop: 'tomato', score: 65 });
    }

    // Sort by score
    scores.sort((a, b) => b.score - a.score);
    
    setRecommendations(scores.slice(0, 5));
    setStep(3);
  }; */

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-green-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Leaf className="w-10 h-10" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1>
                <p className="text-green-100 text-sm">{t.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold"
            >
              {language === 'hi' ? 'English' : 'हिंदी'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 gap-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
              1
            </div>
            <span className="hidden md:block font-semibold">{t.step1}</span>
          </div>
          <div className="w-16 h-1 bg-gray-300"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
              2
            </div>
            <span className="hidden md:block font-semibold">{t.step2}</span>
          </div>
          <div className="w-16 h-1 bg-gray-300"></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
              3
            </div>
            <span className="hidden md:block font-semibold">{t.step3}</span>
          </div>
        </div>

        {/* Step 1: Location */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <MapPin className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.step1Title}</h2>
              <p className="text-gray-600 text-lg">{t.step1Desc}</p>
            </div>

            <button
              onClick={getLocationAndWeather}
              disabled={loadingWeather}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-6 rounded-xl text-xl shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loadingWeather ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  {t.loading}
                </>
              ) : (
                <>
                  <MapPin className="w-6 h-6" />
                  {t.getLocation}
                </>
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-500 mb-2">{t.orEnterManually}</p>
              <button
                onClick={() => {
                  setWeather({ temperature: 28, humidity: 65, rainfall: 0 });
                  setStep(2);
                }}
                className="text-green-600 hover:text-green-700 font-semibold underline"
              >
                {t.manualEntry}
              </button>
            </div>

            <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1">{t.whyNeeded}</p>
                  <p>{t.whyNeededText}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Soil Data */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <FileText className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">{t.step2Title}</h2>
              <p className="text-gray-600 text-lg text-center">{t.step2Desc}</p>
            </div>

            {/* Weather Display */}
            {weather && (
              <div className="mb-6 bg-blue-50 rounded-xl p-4">
                <p className="font-semibold text-gray-700 mb-2">{t.yourWeather}:</p>
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-gray-600">{t.temp}:</span>
                    <span className="font-bold text-blue-600 ml-2">{weather.temperature}°C</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t.humidity}:</span>
                    <span className="font-bold text-blue-600 ml-2">{weather.humidity}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Soil Input */}
            <div className="space-y-6">
              <div>
                <label className="block text-xl font-bold text-gray-700 mb-2">
                  {t.nitrogen}
                </label>
                <input
                  type="number"
                  value={soilData.N}
                  onChange={(e) => setSoilData({...soilData, N: e.target.value})}
                  placeholder={`${t.example}: 80`}
                  className="w-full text-2xl p-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                />
                <p className="text-sm text-gray-500 mt-1">{t.seeOnCard} 'N'</p>
              </div>

              <div>
                <label className="block text-xl font-bold text-gray-700 mb-2">
                  {t.phosphorus}
                </label>
                <input
                  type="number"
                  value={soilData.P}
                  onChange={(e) => setSoilData({...soilData, P: e.target.value})}
                  placeholder={`${t.example}: 50`}
                  className="w-full text-2xl p-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                />
                <p className="text-sm text-gray-500 mt-1">{t.seeOnCard} 'P'</p>
              </div>

              <div>
                <label className="block text-xl font-bold text-gray-700 mb-2">
                  {t.potassium}
                </label>
                <input
                  type="number"
                  value={soilData.K}
                  onChange={(e) => setSoilData({...soilData, K: e.target.value})}
                  placeholder={`${t.example}: 50`}
                  className="w-full text-2xl p-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                />
                <p className="text-sm text-gray-500 mt-1">{t.seeOnCard} 'K'</p>
              </div>

              <div>
                <label className="block text-xl font-bold text-gray-700 mb-2">
                  {t.ph}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={soilData.pH}
                  onChange={(e) => setSoilData({...soilData, pH: e.target.value})}
                  placeholder={`${t.example}: 6.5`}
                  className="w-full text-2xl p-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                />
                <p className="text-sm text-gray-500 mt-1">{t.seeOnCard} 'pH'</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-2">{t.dontHaveCard}</p>
              <button
                onClick={useAverageValues}
                className="text-green-600 hover:text-green-700 font-semibold underline"
              >
                {t.useAverage}
              </button>
            </div>

            <button
              onClick={getRecommendations}
              disabled={loadingRecommendations}
              className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-6 rounded-xl text-xl shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loadingRecommendations ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  {t.loading}
                </>
              ) : (
                t.getRecommendation
              )}
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl"
            >
              {t.goBack}
            </button>
          </div>
        )}

        {/* Step 3: Recommendations */}
        {step === 3 && recommendations && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.recommendedCrops}</h2>
                <p className="text-gray-600">आपकी मिट्टी और मौसम के अनुसार सबसे अच्छी फसलें</p>
              </div>

              {/* Weather Summary */}
              {weather && (
                <div className="mb-6 bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600">
                    <strong>आपका मौसम:</strong> {weather.temperature}°C, {weather.humidity}% नमी
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>आपकी मिट्टी:</strong> N:{soilData.N || '80'} P:{soilData.P || '50'} K:{soilData.K || '50'} pH:{soilData.pH || '6.5'}
                  </p>
                </div>
              )}

              {/* Top Recommendations */}
              <div className="space-y-4">
                {recommendations.map((rec, idx) => {
                  const crop = CROPS[rec.crop];
                  const badge = idx === 0 ? t.best : idx === 1 ? t.good : t.okay;
                  const badgeColor = idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-green-400' : 'bg-blue-400';
                  
                  return (
                    <div key={rec.crop} className={`border-2 rounded-xl p-6 ${
                      idx === 0 ? 'border-yellow-400 bg-yellow-50' : 
                      idx === 1 ? 'border-green-400 bg-green-50' : 
                      'border-blue-300 bg-blue-50'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-5xl">{crop.icon}</span>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-2xl font-bold text-gray-800">{crop.name}</h3>
                              <span className={`${badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                                {badge}
                              </span>
                            </div>
                            <p className="text-gray-600">
                              <strong>{t.season}:</strong> {crop.season}
                            </p>
                            <p className="text-gray-600">
                              <strong>{t.expectedYield}:</strong> {crop.yield}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-600">{rec.score}%</div>
                          <div className="text-sm text-gray-600">{t.suitability}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 bg-orange-50 border-l-4 border-orange-600 p-4 rounded">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">महत्वपूर्ण सूचना</p>
                    <p>फसल चुनने से पहले अपने स्थानीय कृषि अधिकारी से सलाह लें। बाजार की मांग और पानी की उपलब्धता भी देखें।</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setStep(1);
                  setRecommendations(null);
                }}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl"
              >
                नई खोज शुरू करें
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="mb-2">{t.footer1}</p>
          <p className="text-xs">{t.footer2}</p>
        </div>
      </div>
    </div>
  );
};

export default FarmerFriendlyCropApp;