import { useEffect, useRef, useState } from 'react';
import ScratchCard from './ScratchCard';
import Countdown from './Countdown';
import Petals from './Petals';
import './App.css';

const targetDate = '2026-09-21T12:21:00';
const inviteKey = import.meta.env.VITE_INVITE_KEY?.trim();

export default function App() {
  const providedKey = new URLSearchParams(window.location.search).get('invite');

  if (providedKey !== inviteKey) {
    return (
      <main className="access-gate">
        <div className="access-gate-card">
          <div className="access-mark">✦</div>
          <h1>हे निमंत्रण खासगी आहे</h1>
          <p>हे लग्नाचे निमंत्रण पाहण्यासाठी आपल्याला मिळालेली खास लिंक वापरा.</p>
        </div>
      </main>
    );
  }

  return <Invitation />;
}

function Invitation() {
  const [activePanel, setActivePanel] = useState('ceremony');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.18 },
    );

    const panels = document.querySelectorAll('.reveal-panel');
    panels.forEach((panel) => observer.observe(panel));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const startMusic = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        window.removeEventListener('pointerdown', startMusic);
        window.removeEventListener('keydown', startMusic);
      } catch (error) {
        setIsPlaying(false);
      }
    };

    startMusic();
    window.addEventListener('pointerdown', startMusic, { once: true });
    window.addEventListener('keydown', startMusic, { once: true });

    return () => {
      window.removeEventListener('pointerdown', startMusic);
      window.removeEventListener('keydown', startMusic);
    };
  }, []);

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.warn('Audio autoplay was blocked:', error);
      }
    }
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      '🚩 शुभ विवाह निमंत्रण 🚩\nकोमल आणि राहुल यांच्या विवाह सोहळ्यास उपस्थित राहण्याचे सौजन्य घ्यावे.\n\nतारीख: सोमवार, २१/०९/२०२६\nवेळ: दुपारी १२:२१\nस्थळ: कलेश्वर मंदिर हॉल, आटपाडी, सांगली\n\nनिमंत्रण पत्रिका: ' + window.location.href,
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  const addToCalendar = () => {
    const calendarUrl =
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Komal+and+Rahul+Wedding&dates=20260921T065100Z/20260921T080000Z&details=Wedding+ceremony+at+Kalleshwar+Temple+Hall,+Attpadi&location=Attpadi,Sangli';
    window.open(calendarUrl, '_blank');
  };

  const details = {
    ceremony: {
      title: 'हळदी समारंभ',
      date: 'सोमवार दि. २१/०९/२०२६',
      time: 'सकाळी ९:३० वा.',
      description: 'हळदी समारंभाच्या मंगलमय प्रसंगी आपण सर्वांचे शुभ उपस्थितीची अपेक्षा आहे.',
    },
    venue: {
      title: 'विवाहस्थळ',
      date: 'सोमवार दि. २१/०९/२०२६',
      time: 'दुपारी १२:२१ मि.',
      description: 'कलेश्वर मंदिर हॉल, आटपाडी, ता. आटपाडी, जि. सांगली येथे मंगलशृंगार होणार आहे.',
    },
    family: {
      title: 'निमंत्रक',
      date: 'समस्त भंडगे परिवार',
      time: 'व मित्रपरिवार',
      description: 'आमच्या शुभ लग्न सोहळ्यासाठी आपण स्नेह, आशीर्वाद आणि शुभेच्छांचा आशीर्वाद द्या.',
    },
  };

  return (
    <div className="invite-app">
      <Petals />

      <audio ref={audioRef} src="/wedding_music.mp3.mp3" loop preload="auto" />
      <button className="music-btn" onClick={toggleMusic} type="button">
        {isPlaying ? '⏸️ थांबवा' : '🎵 संगीत'}
      </button>

      <main className="story-shell">
        <section className="reveal-panel hero-panel">
          <div className="panel-inner hero-inner">
            <div className="ornament ornament-left" />
            <div className="ornament ornament-right" />
            <div className="mandala" />

            <div className="pattern-tag">|| श्री गणेश प्रसन्न ||</div>
            <div className="ganesh-icon">ॐ</div>

            <div className="hero-text-block">
              <h1>शुभ विवाह</h1>
              <p className="subtitle">आपल्या प्रेम, आशीर्वाद आणि शुभेच्छांचा साक्षी होण्यासाठी</p>

              <div className="hero-intro-box">
                <p>हृदयांतील एक सुंदर नातं,</p>
                <p>आणि त्या नात्याला पंख देणाऱ्या आपल्याच शुभेच्छांचा</p>
                <p>सौजन्य</p>
              </div>

              <div className="hero-meta muted-meta">
                <span>सोमवार दि. २१/०९/२०२६</span>
                <span>दुपारी १२:२१ मि.</span>
              </div>
            </div>

            <button
              className="scroll-cue"
              onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
              type="button"
            >
              नावं पाहण्यासाठी पुढे करा ↓
            </button>
          </div>
        </section>

        <section className="reveal-panel story-panel">
          <div className="panel-inner glass-card">
            <div className="scratch-instruction">आमच्या प्रेमकथेचा पहिला पडदा</div>
            <div className="scratch-quote">
              “हर धड़कन में तेरा नाम, हर मुस्कान में तेरा रंग।
              <span>तू मेरे साथ है, तो सब कुछ है सुंदर, सब कुछ है संग।</span>”
            </div>
            <p className="scratch-caption">
              मनाच्या या सुंदर क्षणी, आपले प्रेम आणि आशीर्वाद आपल्या नात्याला अधिक प्रसन्न करतात.
              <br />
              आपल्या शुभेच्छांची रंगत पाहण्यासाठी खाली स्क्रॅच करा.
            </p>
            <div className="bride-groom-grid">
              <ScratchCard
                title="चि. सौ. कां."
                name="कोमल"
                details="कै. भिमराव नाना भंडगे यांची नात व श्री. आबा भिमराव भंडगे यांची सुकन्या"
                coverText="स्क्रॅच करा"
                coverColor="#a51f3f"
              />

              <div className="heart-divider">
                <span>💞</span>
              </div>

              <ScratchCard
                title="चि."
                name="राहुल"
                details="कै. गजानन भवना केंगारे यांचे नातू व श्री. नंदकुमार गजानन केंगारे यांचे चिरंजीव"
                coverText="स्क्रॅच करा"
                coverColor="#d7a81d"
              />
            </div>
          </div>
        </section>

        <section className="reveal-panel count-panel">
          <div className="panel-inner glass-card">
            <div className="section-kicker">असंख्य शुभेच्छांचा जल्लोष</div>
            <h2>संगमाची वाट पाहत आहे</h2>
            <p className="countdown-shayari">दोन जीव, एक स्वप्न, प्रेमाची सुंदर कहाणी,<br />या मंगल क्षणाची सुरू झाली गोड प्रतीक्षा आजपासूनच जाणी.</p>
            <p className="countdown-prompt">प्रेमाचा हा क्षण उलगडण्यासाठी क्लिक करा किंवा स्क्रॅच करा</p>
            <Countdown targetDate={targetDate} revealOnInteraction />
            <div className="wedding-meta">
              <span>सोमवार दि. २१/०९/२०२६</span>
              <span>दुपारी १२:२१ मि.</span>
            </div>
          </div>
        </section>

        <section className="reveal-panel detail-panel">
          <div className="panel-inner glass-card tabs-card">
            <div className="top-bar">
              <button className="ghost-btn" onClick={() => setActivePanel('ceremony')} type="button">
                हळदी
              </button>
              <button className="ghost-btn" onClick={() => setActivePanel('venue')} type="button">
                स्थळ
              </button>
              <button className="ghost-btn" onClick={() => setActivePanel('family')} type="button">
                परिवार
              </button>
            </div>

            <div className="detail-box">
              <div className="detail-badge">✨ आपले स्वागत आहे ✨</div>
              <h3>{details[activePanel].title}</h3>
              <p className="detail-date">{details[activePanel].date}</p>
              <p className="detail-time">{details[activePanel].time}</p>
              <p>{details[activePanel].description}</p>
            </div>
          </div>
        </section>

        <section className="reveal-panel venue-panel">
          <div className="panel-inner glass-card">
            <div className="venue-copy">
              <div className="section-kicker">विवाहस्थळ</div>
              <h3>कलेश्वर मंदिर हॉल</h3>
              <p>आटपाडी, ता. आटपाडी, जि. सांगली</p>
            </div>

            <div className="map-box">
              <iframe
                title="Wedding venue map"
                src="https://www.google.com/maps?q=Kalleshwar%20Temple%20Hall%20Attpadi%20Sangli&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="cta-row">
              <a className="primary-btn" href="https://maps.google.com/?q=Kalleshwar+Temple+Hall+Attpadi+Sangli" target="_blank" rel="noreferrer">
                🗺️ नकाशा उघडा
              </a>
              <button className="secondary-btn" onClick={addToCalendar} type="button">
                📅 Calendar
              </button>
            </div>
          </div>
        </section>

        <section className="reveal-panel rsvp-panel">
          <div className="panel-inner glass-card">
            <div className="section-kicker">शुभेच्छेची स्नेहदिंडी</div>
            <h3>💌 आपले प्रेम व आशीर्वाद आमच्या आनंदामध्ये जोडले जावोत.</h3>
            <p>आपल्याच्या उपस्थितीने हा सोहळा अधिक Resonant आणि स्मरणीय बनतो.</p>
            <div className="cta-row compact">
              <button className="primary-btn" onClick={handleShareWhatsApp} type="button">
                📲 WhatsApp Share
              </button>
              <button className="secondary-btn" onClick={() => window.alert('आपल्या शुभेच्छांसाठी आम्ही आभारी आहोत!')} type="button">
                ✅ RSVP
              </button>
            </div>
          </div>
        </section>

        <footer className="reveal-panel footer-panel">
          <div className="panel-inner footer-card">
            <div className="flower-mark">✦</div>
            <h4>निमंत्रक</h4>
            <p>समस्त भंडगे व मित्रपरिवार अजनाळे</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
