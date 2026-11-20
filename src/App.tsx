/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesHubPage } from './pages/ServicesHubPage';
import { ServiceCategoryPage } from './pages/ServiceCategoryPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { HowWeWorkPage } from './pages/HowWeWorkPage';
import { RequestQuotePage } from './pages/RequestQuotePage';
import { SiteVisitPage } from './pages/SiteVisitPage';
import { ContactPage } from './pages/ContactPage';
import { TechnicalAdvisorPage } from './pages/TechnicalAdvisorPage';
import { LegalPage } from './pages/LegalPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  return (
    <BrowserRouter>
      {mapsQuotaExceeded && (
        <div
          role="alert"
          className="fixed inset-x-0 top-20 z-50 border-b border-[hsl(var(--accent))] bg-[hsl(0_0%_10%)] px-6 py-3 text-xs text-[hsl(40_6%_94%)]"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <p>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 text-[hsl(var(--accent))]"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </p>
            <button
              type="button"
              onClick={() => setMapsQuotaExceeded(false)}
              className="shrink-0 border border-[hsl(0_0%_30%)] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[hsl(40_6%_90%)] hover:border-[hsl(var(--accent))]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/services" element={<ServicesHubPage />} />

          {/* 5 Service Categories + Dynamic Child Service Detail Routes */}
          <Route
            path="/building-contracting-dubai"
            element={<ServiceCategoryPage categorySlug="building-contracting-dubai" />}
          />
          <Route
            path="/building-contracting-dubai/:child"
            element={<ServiceDetailPage categorySlug="building-contracting-dubai" />}
          />

          <Route
            path="/interior-fit-out-dubai"
            element={<ServiceCategoryPage categorySlug="interior-fit-out-dubai" />}
          />
          <Route
            path="/interior-fit-out-dubai/:child"
            element={<ServiceDetailPage categorySlug="interior-fit-out-dubai" />}
          />

          <Route
            path="/mep-hvac-dubai"
            element={<ServiceCategoryPage categorySlug="mep-hvac-dubai" />}
          />
          <Route
            path="/mep-hvac-dubai/:child"
            element={<ServiceDetailPage categorySlug="mep-hvac-dubai" />}
          />

          <Route
            path="/interior-finishing-dubai"
            element={<ServiceCategoryPage categorySlug="interior-finishing-dubai" />}
          />
          <Route
            path="/interior-finishing-dubai/:child"
            element={<ServiceDetailPage categorySlug="interior-finishing-dubai" />}
          />

          <Route
            path="/building-maintenance-dubai"
            element={<ServiceCategoryPage categorySlug="building-maintenance-dubai" />}
          />
          <Route
            path="/building-maintenance-dubai/:child"
            element={<ServiceDetailPage categorySlug="building-maintenance-dubai" />}
          />

          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/how-we-work" element={<HowWeWorkPage />} />
          <Route path="/technical-desk" element={<TechnicalAdvisorPage />} />
          <Route path="/request-a-quote" element={<RequestQuotePage />} />
          <Route path="/site-visit" element={<SiteVisitPage />} />
          <Route path="/contact-us" element={<ContactPage />} />

          <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
          <Route path="/terms-and-conditions" element={<LegalPage type="terms" />} />
          <Route path="/cookie-policy" element={<LegalPage type="cookies" />} />

          <Route path="/admin" element={<AdminPage />} />

          {/* Required Redirects */}
          <Route path="/about" element={<Navigate to="/about-us" replace />} />
          <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
          <Route path="/quote" element={<Navigate to="/request-a-quote" replace />} />
          <Route
            path="/amc"
            element={<Navigate to="/building-maintenance-dubai/building-maintenance-amc" replace />}
          />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
