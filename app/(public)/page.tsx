import Link from "next/link";
import ResearchCards from "@/components/pub/researchCards";
import NewsSection from "@/components/pub/newsCard";
import JoinUs from "@/components/pub/joinUs";
import InfiniteCarousel from "@/components/pub/InfiniteCarousel";
import EquipmentCard from "@/components/pub/EquipmentCard";
import { Reveal, HeroReveal, StatCounter } from "@/components/pub/reveal";
import {
  fetchHomeStats,
  fetchLatestPublications,
  fetchLatestProjects,
  fetchLatestEquipments,
} from "@/lib/load_data/load_home";
import fetchResearchAreas from "@/lib/load_data/load_research_areas";
import fetchGalleryUrls from "@/lib/load_data/load_gallery_url";
import GalleryCarousel from "@/components/pub/GalleryCarousel";

export const revalidate = 0;

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s
  return s.slice(0, n - 1).trimEnd() + '…'
}

export default async function Home() {
  const [stats, publications, projects, equipments, researchAreas,galleryUrls] = await Promise.all([
    fetchHomeStats(),
    fetchLatestPublications(4),
    fetchLatestProjects(2),
    fetchLatestEquipments(5),
    fetchResearchAreas(),
    fetchGalleryUrls()
  ]);
  const areas = researchAreas || [];
  return (
    <div className="relative">
      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: 'url("/hero2.jpg")' }} />
        <div className="hero-overlay" />

        <div className="hero-content">
          <HeroReveal delay={0.2}>
            <div className="hero-badge">
              <span className="hero-badge-label">Department of Chemical Engineering &middot; IIT Delhi</span>
            </div>
          </HeroReveal>

          <HeroReveal delay={0.4} y={40} duration={1}>
            <h1 className="hero-title">
              Advancing chemical sciences
              <span className="hero-title-accent">through rigorous research.</span>
            </h1>
            <span className="hero-title-divider" />
          </HeroReveal>

          <HeroReveal delay={0.7}>
            <p className="hero-subtitle">
              We pursue fundamental questions in catalysis, advanced materials, and sustainable
              chemical processes, translating discoveries into applications that serve science
              and society.
            </p>
          </HeroReveal>

          <HeroReveal delay={0.9}>
            <div className="hero-buttons">
              <Link href="/research/areas" className="hero-btn-primary">
                Explore Research
              </Link>
              <Link href="/publications" className="hero-btn-secondary">
                View Publications
              </Link>
            </div>
          </HeroReveal>
        </div>

        <div className="hero-scroll-indicator">
          <HeroReveal delay={1.1} duration={0.6}>
            <div className="hero-scroll-bounce">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 8l5 5 5-5" />
              </svg>
            </div>
          </HeroReveal>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="stats-bar">
        <div className="stats-grid">
          <StatCounter to={stats.publications} label="Publications" />
          <StatCounter to={stats.projects} label="Research Projects" delay={0.05} />
          <StatCounter to={stats.awards} label="Awards" delay={0.1} />
          <StatCounter to={stats.alumni} label="Alumni" delay={0.15} />
          <StatCounter to={stats.groupMembers} label="Team Members" delay={0.2} />
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section className="section" style={{ background: 'white' }}>
        <div className="section-container">
          <div className="about-grid">
            <Reveal x={-40} y={0}>
              <div className="section-label">About the Lab</div>
              <h2 className="section-heading">Advancing Chemical Sciences at IIT Delhi</h2>
              <p className="about-body">
                Our laboratory brings together researchers investigating the frontiers of chemical
                engineering — from single-atom catalysts that enable greener reactions to advanced
                materials designed for energy storage, environmental remediation, and healthcare.
                We publish in leading journals, collaborate with industry, and train the next
                generation of chemical scientists.
              </p>
            </Reveal>
            <Reveal x={40} y={0}>
              <div className="about-card">
                <div className="about-focus-item">
                  <div className="about-focus-number">I.</div>
                  <div className="about-focus-title">Catalysis &amp; Reaction Engineering</div>
                  <div className="about-focus-desc">Designing catalytic systems for efficient chemical transformations and industrial applications.</div>
                </div>
                <div className="about-focus-item">
                  <div className="about-focus-number">II.</div>
                  <div className="about-focus-title">Advanced Material Synthesis</div>
                  <div className="about-focus-desc">Developing novel materials with tailored properties for energy, environment, and healthcare.</div>
                </div>
                <div className="about-focus-item">
                  <div className="about-focus-number">III.</div>
                  <div className="about-focus-title">Sustainable Chemical Processes</div>
                  <div className="about-focus-desc">Creating green methodologies that minimize environmental impact while maximizing efficiency.</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ RESEARCH AREAS ═══ */}
      <section className="section" style={{ background: '#f8fafc', borderBottom: '1px solid rgba(15, 37, 87, 0.05)' }}>
        <div className="section-container">
          <Reveal>
            <div className="section-header-row">
              <div>
                <div className="section-label">Our Expertise</div>
                <h2 className="section-heading">Research Areas</h2>
              </div>
              <Link href="/research/areas" className="section-link">
                View all research areas &rarr;
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {areas.slice(0, 4).map((item, index) => {
              const plainDesc = truncate(stripHtml(item.body), 160)
              return (
                <Reveal key={item.id} delay={index * 0.1} y={30}>
                  <div className="group relative flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-amber-700/30 transition-all duration-300 h-full">
                    {item.imgUrl ? (
                      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                        <img
                          src={item.imgUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
                      </div>
                    ) : (
                      <div className="relative h-52 w-full flex items-center justify-center bg-slate-50 border-b border-slate-100 text-slate-400">
                        <span className="text-xs">No Image Available</span>
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-xl font-serif font-bold text-slate-900 mb-3 group-hover:text-amber-700 transition-colors duration-200 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                          {plainDesc}
                        </p>
                      </div>
                      <Link
                        href={`/research/areas#${item.id}`}
                        className="inline-flex items-center text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors mt-auto group/btn"
                      >
                        Read More
                        <svg 
                          className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ RESEARCH & ANNOUNCEMENTS ═══ */}
      <section className="section research-section overflow-hidden">
        <div className="section-container ">
          <Reveal>
            <div className="section-header-row">
              <div>
                <div className="section-label">Latest Work</div>
                <h2 className="section-heading">Research &amp; Announcements</h2>
              </div>
              <Link href="/research/areas" className="section-link">View all research &rarr;</Link>
            </div>
          </Reveal>
          <div className="w-full overflow-hidden">
          <ResearchCards publications={publications} projects={projects} />
          </div>
          <Reveal>
            <div style={{ marginTop: 48 }}>
              <Link href="/research/areas" className="explore-btn">Explore Research Areas</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FACILITIES ═══ */}
      <section className="section" style={{ background: 'white' }}>
        <div className="section-container">
          <Reveal>
            <div className="section-header-row mb-10">
              <div className="max-w-2xl">
                <div className="section-label">Our Infrastructure</div>
                <h2 className="section-heading">Research Facilities</h2>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Our laboratory is equipped with state-of-the-art instruments supporting research across
                  spectroscopy, microscopy, thermal analysis, and chemical characterization.
                </p>
              </div>
              <Link href="/research/facilities" className="section-link self-end">
                View all facilities &rarr;
              </Link>
            </div>
          </Reveal>
          
          <div className="w-full overflow-hidden mt-10">
            <InfiniteCarousel speed={30} gap={24}>
              {equipments.map((item) => (
                <div key={item.id} className="w-[300px] min-w-[300px] flex">
                  <EquipmentCard item={item} />
                </div>
              ))}
            </InfiniteCarousel>
          </div>
        </div>
      </section>

      {/* ═══ NEWS ═══ */}
      <NewsSection />


      {/* ═══ Gallery  ═══ */}
      <GalleryCarousel galleryUrls={galleryUrls} />

      {/* ═══ CTA ═══ */}
      <JoinUs />
    </div>
  );
}
