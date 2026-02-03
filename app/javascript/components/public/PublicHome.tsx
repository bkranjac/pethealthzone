import React, { useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';
import { Pet } from '../../types/pet';

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getAge = (birthday: string): number =>
  Math.floor((Date.now() - new Date(birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000));

const serif = "'EB Garamond', Georgia, serif";
const sans = "'Inter', system-ui, sans-serif";

const styles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ── Pill Carousel ── */
.gh-strip { position: relative; max-width: 1140px; margin: 0 auto; }
.gh-strip-outer { background: #fff; border-radius: 60px; padding: 10px; overflow: hidden; }
.gh-strip-track { display: flex; gap: 12px; overflow-x: auto; scroll-behavior: smooth; scrollbar-width: none; -ms-overflow-style: none; padding: 0 4px; }
.gh-strip-track::-webkit-scrollbar { display: none; }
.gh-pill { flex: 0 0 auto; display: flex; align-items: center; gap: 14px; background: #ebe7e0; border-radius: 50px; padding: 8px 28px 8px 8px; text-decoration: none; color: #1a1919; transition: background 0.2s, box-shadow 0.2s; cursor: pointer; }
.gh-pill:hover { background: #e2ded6; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.gh-pill-img { width: 64px; height: 64px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: #ccc; }
.gh-pill-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gh-pill-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #d4d4d4, #bbb); }
.gh-pill-name { font-family: ${sans}; font-size: 15px; font-weight: 500; color: #3a3a3a; white-space: nowrap; }

/* Arrows */
.gh-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; background: transparent; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 2; transition: opacity 0.2s; }
.gh-arrow:hover { opacity: 0.7; }
.gh-arrow-left { left: -28px; }
.gh-arrow-right { right: -28px; }
.gh-arrow svg { width: 22px; height: 22px; stroke: #999; stroke-width: 2.5; fill: none; }

/* ── Sections ── */
.gh-section { animation: fadeIn 0.6s ease-out both; }
.gh-separator { width: 60px; height: 1px; background: #d9d9d9; margin: 0 auto; }

/* ── Buttons ── */
.gh-btn { display: inline-block; background: #3858e9; color: #fff; padding: 13px 30px; border-radius: 2px; font-family: ${sans}; font-weight: 600; font-size: 14px; letter-spacing: 0.02em; text-decoration: none; transition: background 0.2s; }
.gh-btn:hover { background: #213fd4; }
.gh-btn-outline { display: inline-block; background: transparent; color: #3858e9; padding: 12px 28px; border-radius: 2px; border: 1px solid #3858e9; font-family: ${sans}; font-weight: 600; font-size: 14px; letter-spacing: 0.02em; text-decoration: none; transition: background 0.2s, color 0.2s; cursor: not-allowed; opacity: 0.7; }
`;

export const PublicHome: React.FC = () => {
  const { data: pets, loading, error } = useResource<Pet>('/api/v1/pets', { autoFetch: true });

  const carouselPets = useMemo(() => {
    const available = pets?.filter(pet => !pet.adopted) || [];
    return shuffleArray(available).slice(0, 8);
  }, [pets]);

  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = useCallback((dir: number) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * 260, behavior: 'smooth' });
  }, []);

  return (
    <div style={{ fontFamily: sans, color: '#1e1e1e', lineHeight: 1.875 }}>
      <style>{styles}</style>

      {/* ───── Pill Carousel ───── */}
      <section style={{ backgroundColor: '#f0ede8', padding: '28px 20px' }}>
        {loading && (
          <div style={{ maxWidth: '1140px', margin: '0 auto', textAlign: 'center', padding: '24px 0' }}>
            <p style={{ color: '#888', fontSize: '15px' }}>Loading pets...</p>
          </div>
        )}
        {error && (
          <div style={{ maxWidth: '1140px', margin: '0 auto', textAlign: 'center', padding: '24px 0' }}>
            <p style={{ color: '#e26f56', fontSize: '15px' }}>Unable to load pets. Please try again later.</p>
          </div>
        )}

        {!loading && !error && carouselPets.length === 0 && (
          <div style={{ maxWidth: '1140px', margin: '0 auto', textAlign: 'center', padding: '24px 0' }}>
            <p style={{ color: '#888', fontSize: '15px' }}>No pets available right now. Check back soon!</p>
          </div>
        )}

        {!loading && !error && carouselPets.length > 0 && (
          <div className="gh-strip">
            <div className="gh-strip-outer">
              <div className="gh-strip-track" ref={trackRef}>
                {carouselPets.map((pet) => (
                  <Link
                    to={`/adopt/${pet.id}`}
                    key={pet.id}
                    className="gh-pill"
                  >
                    <div className="gh-pill-img">
                      {pet.picture ? (
                        <img src={pet.picture} alt={pet.name} />
                      ) : (
                        <div className="gh-pill-placeholder">
                          <span style={{ fontSize: '28px' }}>🐾</span>
                        </div>
                      )}
                    </div>
                    <span className="gh-pill-name">{pet.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {carouselPets.length > 3 && (
              <>
                <button className="gh-arrow gh-arrow-left" onClick={() => scroll(-1)} aria-label="Scroll left">
                  <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <button className="gh-arrow gh-arrow-right" onClick={() => scroll(1)} aria-label="Scroll right">
                  <svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18" /></svg>
                </button>
              </>
            )}
          </div>
        )}
      </section>

      {/* ───── View All Pets CTA ───── */}
      <section style={{ padding: '36px 0', textAlign: 'center', backgroundColor: '#fff' }}>
        <Link to="/adopt" className="gh-btn">
          View All Available Pets
        </Link>
      </section>

      {/* ───── How Adoption Works ───── */}
      <section style={{ padding: '18px 0', backgroundColor: '#f6f6f6' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <h2 style={{ fontFamily: serif, fontSize: '20px', fontWeight: 400, color: '#1a1919', margin: 0, whiteSpace: 'nowrap' }}>
            How It Works
          </h2>
          {[
            { num: '1', label: 'Browse' },
            { num: '2', label: 'Visit' },
            { num: '3', label: 'Adopt' },
          ].map((step, i) => (
            <React.Fragment key={step.num}>
              {i > 0 && <span style={{ color: '#ccc', fontSize: '18px', margin: '0 -12px' }}>&rsaquo;</span>}
              <span style={{ fontFamily: sans, fontSize: '13px', fontWeight: 500, color: '#666', letterSpacing: '0.03em' }}>
                <span style={{ fontFamily: serif, fontSize: '16px', color: '#b3a58a', marginRight: '5px' }}>{step.num}.</span>
                {step.label}
              </span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ───── Happy Tails ───── */}
      <section
        className="gh-section"
        style={{ padding: '64px 0', backgroundColor: '#ffffff' }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 400, color: '#1a1919', marginBottom: '12px' }}>
              Happy Tails
            </h2>
            <div className="gh-separator" />
          </div>

          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { quote: "Adopting Bella was the best decision we ever made. She brought so much joy into our lives from day one.", name: "Sarah M.", detail: "Adopted Bella, 2024" },
              { quote: "The staff were incredibly helpful and made the whole process so smooth. Our cat Max is now king of the house!", name: "James R.", detail: "Adopted Max, 2025" },
              { quote: "We were nervous about adopting a rescue, but PetHealthZone prepared us so well. Rocky is the sweetest boy.", name: "The Chen Family", detail: "Adopted Rocky, 2025" },
            ].map((story, i) => (
              <div
                key={i}
                style={{
                  flex: '1',
                  minWidth: '260px',
                  backgroundColor: '#f6f6f6',
                  padding: '28px',
                  borderRadius: '2px',
                  borderTop: '3px solid #b3a58a',
                }}
              >
                <p style={{ fontFamily: serif, fontSize: '17px', fontStyle: 'italic', color: '#444', lineHeight: 1.7, marginBottom: '18px' }}>
                  &ldquo;{story.quote}&rdquo;
                </p>
                <p style={{ fontFamily: sans, fontSize: '14px', fontWeight: 600, color: '#1a1919' }}>{story.name}</p>
                <p style={{ fontFamily: sans, fontSize: '13px', color: '#a1a1a1' }}>{story.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Mission + Stats ───── */}
      <section
        className="gh-section"
        style={{ padding: '64px 0', backgroundColor: '#f6f6f6' }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px', display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <p
              style={{
                fontFamily: sans,
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#b3a58a',
                marginBottom: '14px',
              }}
            >
              About Us
            </p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 400, color: '#1a1919', marginBottom: '18px', lineHeight: 1.25 }}>
              Our Mission
            </h2>
            <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.875, marginBottom: '14px' }}>
              At PetHealthZone, we're dedicated to rescuing animals in need, providing them with
              comprehensive medical care, and finding them loving forever homes. Every pet deserves
              a second chance at happiness.
            </p>
            <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.875 }}>
              Our experienced staff ensures each animal receives proper medical attention, rehabilitation,
              and socialization before finding their perfect match.
            </p>
          </div>
          <div style={{ flex: '0 0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { value: '200+', label: 'Pets Adopted' },
              { value: '15', label: 'Years of Service' },
              { value: '50+', label: 'Volunteers' },
              { value: '98%', label: 'Success Rate' },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  width: '130px',
                  padding: '22px 14px',
                  textAlign: 'center',
                  backgroundColor: '#fff',
                  borderRadius: '2px',
                }}
              >
                <p style={{ fontFamily: serif, fontSize: '30px', fontWeight: 400, color: '#3858e9' }}>{stat.value}</p>
                <p style={{ fontFamily: sans, fontSize: '12px', color: '#a1a1a1', marginTop: '4px' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Donate CTA ───── */}
      <section
        className="gh-section"
        style={{ padding: '48px 0', backgroundColor: '#ffffff', textAlign: 'center' }}
      >
        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 400, color: '#1a1919', marginBottom: '10px' }}>
            Help Us Help Them
          </h2>
          <div className="gh-separator" style={{ marginBottom: '16px' }} />
          <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.75, marginBottom: '24px' }}>
            Your support helps us rescue, rehabilitate, and rehome animals in need.
          </p>
          <span className="gh-btn-outline">
            Donate (Coming Soon)
          </span>
        </div>
      </section>
    </div>
  );
};
