import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--secondary) 0%, #0f172a 100%)',
        color: 'white',
        padding: '80px 0',
        textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '20px',
          }}>
            Real Projects.{' '}
            <span style={{ color: 'var(--primary)' }}>Real Experience.</span>
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#94a3b8',
            maxWidth: '600px',
            margin: '0 auto 32px',
            lineHeight: 1.6,
          }}>
            SkillBridge connects college students with local businesses through micro-projects.
            Build your portfolio with real work. Get quality talent at affordable rates.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  Go to Dashboard
                </Link>
                <Link to="/projects" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                  Browse Projects
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free
                </Link>
                <Link to="/projects" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                  Browse Projects
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>
            How It Works
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '48px', fontSize: '16px' }}>
            A simple, structured process for both students and businesses
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
          }}>
            {[
              {
                step: '01',
                title: 'Post or Browse',
                desc: 'Businesses post projects with budgets and deadlines. Students browse and find opportunities matching their skills.',
              },
              {
                step: '02',
                title: 'Bid and Connect',
                desc: 'Students submit proposals with their timeline and budget. Businesses review bids and choose the best fit.',
              },
              {
                step: '03',
                title: 'Complete and Review',
                desc: 'Work gets done. Both parties leave ratings and reviews. Students build a verified portfolio.',
              },
            ].map((item) => (
              <div key={item.step} className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '16px',
                  margin: '0 auto 16px',
                }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                  {item.title}
                </h3>
                <p style={{ color: 'var(--text-light)', fontSize: '14px', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Students / For Businesses */}
      <section style={{ padding: '0 0 80px', }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}>
            <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: 'var(--primary)' }}>
                For Students
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Gain real-world experience before graduation',
                  'Build a verified project portfolio',
                  'Earn money while learning new skills',
                  'Get ratings and reviews from real clients',
                ].map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: 'var(--text-light)' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, flexShrink: 0 }}>&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: 'var(--accent)' }}>
                For Businesses
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Affordable alternative to expensive agencies',
                  'Access motivated and fresh talent',
                  'Post projects with custom budgets',
                  'Review and rate student work quality',
                ].map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: 'var(--text-light)' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section style={{
          background: 'var(--primary)',
          color: 'white',
          padding: '60px 0',
          textAlign: 'center',
        }}>
          <div className="container">
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
              Ready to Get Started?
            </h2>
            <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '24px' }}>
              Join SkillBridge today and start building real-world experience.
            </p>
            <Link to="/register" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700 }}>
              Create Your Account
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
