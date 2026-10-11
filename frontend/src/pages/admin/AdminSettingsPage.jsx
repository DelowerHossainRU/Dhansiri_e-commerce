import React, { useState, useEffect } from 'react';
import { Palette, Type, Layout, Save, Check, Sparkles, Building2, Truck, Bell } from 'lucide-react';
import api from '../../api/client';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Skeleton } from '../../components/common/Skeleton';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'sonner';

export const AdminSettingsPage = () => {
  const { themes, fonts, activeThemeId, activeFontId, setTheme, setFont, refreshSettings } = useTheme();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('themes');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/cms/settings');
        if (res.success && res.data) {
          setSettings(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put('/cms/settings', settings);
      if (res.success) {
        toast.success('System configuration saved successfully');
        refreshSettings();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="max-w-6xl space-y-8 pb-16">
      {/* Page Header */}
      <div className="pb-4 border-b" style={{ borderColor: 'var(--brand-border)' }}>
        <span
          className="text-xs uppercase tracking-widest font-bold block mb-1"
          style={{ color: 'var(--brand-accent)' }}
        >
          Enterprise Brand & Platform CMS
        </span>
        <h1 className="font-serif-display text-2xl sm:text-3xl font-bold" style={{ color: 'var(--brand-primary)' }}>
          System Styling & Platform Parameters
        </h1>
        <p className="text-xs sm:text-sm text-[#52525B] mt-1">
          Customize the enterprise visual theme, corporate typography, homepage hero CMS, and operational trade parameters.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b gap-2 sm:gap-6 text-xs sm:text-sm font-semibold overflow-x-auto" style={{ borderColor: 'var(--brand-border)' }}>
        <button
          onClick={() => setActiveTab('themes')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'themes'
              ? 'border-amber-600 text-[#1E2420]'
              : 'border-transparent text-[#71717A] hover:text-[#1E2420]'
          }`}
          style={activeTab === 'themes' ? { borderColor: 'var(--brand-accent)', color: 'var(--brand-primary)' } : {}}
        >
          <Palette className="w-4 h-4" />
          <span>Brand Themes (10 Palettes)</span>
        </button>

        <button
          onClick={() => setActiveTab('fonts')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'fonts'
              ? 'border-amber-600 text-[#1E2420]'
              : 'border-transparent text-[#71717A] hover:text-[#1E2420]'
          }`}
          style={activeTab === 'fonts' ? { borderColor: 'var(--brand-accent)', color: 'var(--brand-primary)' } : {}}
        >
          <Type className="w-4 h-4" />
          <span>Typography & Fonts</span>
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'hero'
              ? 'border-amber-600 text-[#1E2420]'
              : 'border-transparent text-[#71717A] hover:text-[#1E2420]'
          }`}
          style={activeTab === 'hero' ? { borderColor: 'var(--brand-accent)', color: 'var(--brand-primary)' } : {}}
        >
          <Layout className="w-4 h-4" />
          <span>Homepage Hero CMS</span>
        </button>

        <button
          onClick={() => setActiveTab('general')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'general'
              ? 'border-amber-600 text-[#1E2420]'
              : 'border-transparent text-[#71717A] hover:text-[#1E2420]'
          }`}
          style={activeTab === 'general' ? { borderColor: 'var(--brand-accent)', color: 'var(--brand-primary)' } : {}}
        >
          <Building2 className="w-4 h-4" />
          <span>Operations & Contact</span>
        </button>
      </div>

      {/* TAB 1: 10 CURATED THEMES */}
      {activeTab === 'themes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-serif-display text-lg font-bold" style={{ color: 'var(--brand-primary)' }}>
                10 Curated Enterprise Theme Palettes
              </h2>
              <p className="text-xs text-[#52525B]">
                Click any theme to activate it instantly across the entire platform. Saved directly to MongoDB.
              </p>
            </div>
            <div className="text-xs font-semibold px-3 py-1 bg-white border rounded-full self-start" style={{ borderColor: 'var(--brand-border)' }}>
              Active Theme: <span className="font-bold capitalize" style={{ color: 'var(--brand-primary)' }}>{activeThemeId.replace('-', ' ')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {themes.map((t) => {
              const isActive = activeThemeId === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-5 rounded-xs border transition-all duration-200 cursor-pointer relative bg-white hover:shadow-md ${
                    isActive
                      ? 'ring-2 ring-offset-2 ring-amber-600 shadow-md'
                      : 'hover:border-zinc-400'
                  }`}
                  style={{
                    borderColor: isActive ? 'var(--brand-accent)' : 'var(--brand-border)'
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif-display text-base font-bold text-[#1E2420]">
                          {t.name}
                        </h3>
                        <span className="text-[11px] font-serif text-[#71717A]">
                          ({t.banglaName})
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full inline-block mt-1 bg-zinc-100 text-[#52525B]">
                        {t.badge}
                      </span>
                    </div>

                    {isActive && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-white px-2.5 py-1 rounded-full shadow-xs bg-emerald-700">
                        <Check className="w-3.5 h-3.5" /> Active
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#52525B] font-light mb-4 line-clamp-2">
                    {t.description}
                  </p>

                  {/* Swatches Bar */}
                  <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                    <span className="text-[10px] font-semibold text-[#71717A] uppercase tracking-wider block">
                      Color Swatches
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 text-center">
                        <div
                          className="h-8 rounded-xs border shadow-xs"
                          style={{ backgroundColor: t.colors.primary, borderColor: 'rgba(0,0,0,0.1)' }}
                        />
                        <span className="text-[9px] text-[#71717A] mt-1 block">Primary</span>
                      </div>
                      <div className="flex-1 text-center">
                        <div
                          className="h-8 rounded-xs border shadow-xs"
                          style={{ backgroundColor: t.colors.accent, borderColor: 'rgba(0,0,0,0.1)' }}
                        />
                        <span className="text-[9px] text-[#71717A] mt-1 block">Accent</span>
                      </div>
                      <div className="flex-1 text-center">
                        <div
                          className="h-8 rounded-xs border shadow-xs"
                          style={{ backgroundColor: t.colors.bgMain, borderColor: 'rgba(0,0,0,0.1)' }}
                        />
                        <span className="text-[9px] text-[#71717A] mt-1 block">Background</span>
                      </div>
                      <div className="flex-1 text-center">
                        <div
                          className="h-8 rounded-xs border shadow-xs"
                          style={{ backgroundColor: t.colors.footerBg, borderColor: 'rgba(0,0,0,0.1)' }}
                        />
                        <span className="text-[9px] text-[#71717A] mt-1 block">Footer</span>
                      </div>
                    </div>
                  </div>

                  {/* Activation Button */}
                  <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-end">
                    <button
                      type="button"
                      disabled={isActive}
                      onClick={(e) => {
                        e.stopPropagation();
                        setTheme(t.id);
                      }}
                      className={`text-xs px-3 py-1.5 rounded-xs font-semibold transition-colors ${
                        isActive
                          ? 'text-zinc-400 bg-zinc-100 cursor-default'
                          : 'text-white hover:opacity-90'
                      }`}
                      style={!isActive ? { backgroundColor: t.colors.primary } : {}}
                    >
                      {isActive ? 'Currently Active' : 'Apply This Theme'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TYPOGRAPHY / FONT SWITCHER */}
      {activeTab === 'fonts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-serif-display text-lg font-bold" style={{ color: 'var(--brand-primary)' }}>
                Typography & Font Family Controls
              </h2>
              <p className="text-xs text-[#52525B]">
                Select the font family for headings and interface display. Instantly active across the entire platform.
              </p>
            </div>
            <div className="text-xs font-semibold px-3 py-1 bg-white border rounded-full self-start" style={{ borderColor: 'var(--brand-border)' }}>
              Active Font: <span className="font-bold capitalize" style={{ color: 'var(--brand-primary)' }}>{activeFontId}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fonts.map((f) => {
              const isActive = activeFontId === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => setFont(f.id)}
                  className={`p-5 rounded-xs border transition-all duration-200 cursor-pointer bg-white hover:shadow-md ${
                    isActive
                      ? 'ring-2 ring-offset-2 ring-amber-600 shadow-md'
                      : 'hover:border-zinc-400'
                  }`}
                  style={{
                    borderColor: isActive ? 'var(--brand-accent)' : 'var(--brand-border)'
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3
                        className="text-lg font-bold text-[#1E2420]"
                        style={{ fontFamily: f.headingFamily }}
                      >
                        {f.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 text-[#52525B]">
                          {f.category}
                        </span>
                        <span className="text-[11px] text-[#71717A]">{f.badge}</span>
                      </div>
                    </div>

                    {isActive && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-white px-2.5 py-1 rounded-full shadow-xs bg-emerald-700">
                        <Check className="w-3.5 h-3.5" /> Active
                      </span>
                    )}
                  </div>

                  {/* Font Live Sample Preview */}
                  <div
                    className="p-4 rounded-xs bg-slate-50 border border-slate-200 my-3"
                  >
                    <p
                      className="text-lg font-medium text-[#1E2420] mb-1"
                      style={{ fontFamily: f.headingFamily }}
                    >
                      {f.previewText}
                    </p>
                    <p className="text-xs text-[#71717A]" style={{ fontFamily: f.bodyFamily }}>
                      Chinigura • Miniket • Nazirshail • Kalijira • Basmati ৳750 / 5kg
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      disabled={isActive}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFont(f.id);
                      }}
                      className={`text-xs px-3 py-1.5 rounded-xs font-semibold transition-colors ${
                        isActive
                          ? 'text-zinc-400 bg-zinc-100 cursor-default'
                          : 'text-white hover:opacity-90'
                      }`}
                      style={!isActive ? { backgroundColor: 'var(--brand-primary)' } : {}}
                    >
                      {isActive ? 'Currently Active' : 'Apply Typography'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DYNAMIC HOMEPAGE HERO CMS */}
      {activeTab === 'hero' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white border p-6 rounded-xs space-y-5 shadow-xs" style={{ borderColor: 'var(--brand-border)' }}>
            <div className="border-b pb-3" style={{ borderColor: 'var(--brand-border-light)' }}>
              <h3 className="font-serif-display text-base font-bold" style={{ color: 'var(--brand-primary)' }}>
                Homepage Hero Headline & Messaging
              </h3>
              <p className="text-xs text-[#52525B]">
                Full CMS control over the main public landing hero text, badges, and action triggers.
              </p>
            </div>

            <Input
              label="Hero Top Pill Badge"
              value={settings.heroBadge || ''}
              onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
              placeholder="Direct From Dinajpur Millers • 100% Sortex Pure"
            />

            <Input
              label="Hero Main Title / Headline"
              value={settings.heroTitle || ''}
              onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
              placeholder="Pure Grain. Exceptional Taste."
            />

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2420] mb-1.5">
                Hero Subheadline / Description
              </label>
              <textarea
                rows={3}
                value={settings.heroSubtitle || ''}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                className="w-full p-3 bg-white border rounded-xs text-xs sm:text-sm outline-none focus:ring-1 focus:ring-amber-500"
                style={{ borderColor: 'var(--brand-border)' }}
                placeholder="Harvested from prime alluvial terroirs across North Bengal..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary CTA Text"
                value={settings.heroPrimaryCtaText || ''}
                onChange={(e) => setSettings({ ...settings, heroPrimaryCtaText: e.target.value })}
              />
              <Input
                label="Primary CTA Link"
                value={settings.heroPrimaryCtaLink || ''}
                onChange={(e) => setSettings({ ...settings, heroPrimaryCtaLink: e.target.value })}
              />
              <Input
                label="Secondary CTA Text"
                value={settings.heroSecondaryCtaText || ''}
                onChange={(e) => setSettings({ ...settings, heroSecondaryCtaText: e.target.value })}
              />
              <Input
                label="Secondary CTA Link"
                value={settings.heroSecondaryCtaLink || ''}
                onChange={(e) => setSettings({ ...settings, heroSecondaryCtaLink: e.target.value })}
              />
            </div>
          </div>

          {/* Hero Highlight Card & Product Preview */}
          <div className="bg-white border p-6 rounded-xs space-y-5 shadow-xs" style={{ borderColor: 'var(--brand-border)' }}>
            <div className="border-b pb-3" style={{ borderColor: 'var(--brand-border-light)' }}>
              <h3 className="font-serif-display text-base font-bold" style={{ color: 'var(--brand-primary)' }}>
                Hero Right Showcase Product Card
              </h3>
              <p className="text-xs text-[#52525B]">
                Customize the featured cultivar showcase card on the right side of the hero section.
              </p>
            </div>

            <Input
              label="Hero Product Image URL"
              value={settings.heroImage || ''}
              onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Product Badge Tag"
                value={settings.heroHighlightTag || ''}
                onChange={(e) => setSettings({ ...settings, heroHighlightTag: e.target.value })}
              />
              <Input
                label="Product Title"
                value={settings.heroHighlightTitle || ''}
                onChange={(e) => setSettings({ ...settings, heroHighlightTitle: e.target.value })}
              />
              <Input
                label="Price Display"
                value={settings.heroHighlightPrice || ''}
                onChange={(e) => setSettings({ ...settings, heroHighlightPrice: e.target.value })}
              />
            </div>

            <Input
              label="Short Description"
              value={settings.heroHighlightDesc || ''}
              onChange={(e) => setSettings({ ...settings, heroHighlightDesc: e.target.value })}
            />

            <Input
              label="Product Destination Link"
              value={settings.heroHighlightLink || ''}
              onChange={(e) => setSettings({ ...settings, heroHighlightLink: e.target.value })}
            />
          </div>

          {/* Hero Statistics Counters */}
          <div className="bg-white border p-6 rounded-xs space-y-5 shadow-xs" style={{ borderColor: 'var(--brand-border)' }}>
            <div className="border-b pb-3" style={{ borderColor: 'var(--brand-border-light)' }}>
              <h3 className="font-serif-display text-base font-bold" style={{ color: 'var(--brand-primary)' }}>
                Credibility Metric Indicators
              </h3>
              <p className="text-xs text-[#52525B]">
                Configure the three laboratory / quality indicators shown below the hero description.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-zinc-50 border rounded-xs space-y-2">
                <Input
                  label="Stat 1 Value"
                  value={settings.heroStat1Number || ''}
                  onChange={(e) => setSettings({ ...settings, heroStat1Number: e.target.value })}
                />
                <Input
                  label="Stat 1 Label"
                  value={settings.heroStat1Label || ''}
                  onChange={(e) => setSettings({ ...settings, heroStat1Label: e.target.value })}
                />
              </div>

              <div className="p-3 bg-zinc-50 border rounded-xs space-y-2">
                <Input
                  label="Stat 2 Value"
                  value={settings.heroStat2Number || ''}
                  onChange={(e) => setSettings({ ...settings, heroStat2Number: e.target.value })}
                />
                <Input
                  label="Stat 2 Label"
                  value={settings.heroStat2Label || ''}
                  onChange={(e) => setSettings({ ...settings, heroStat2Label: e.target.value })}
                />
              </div>

              <div className="p-3 bg-zinc-50 border rounded-xs space-y-2">
                <Input
                  label="Stat 3 Value"
                  value={settings.heroStat3Number || ''}
                  onChange={(e) => setSettings({ ...settings, heroStat3Number: e.target.value })}
                />
                <Input
                  label="Stat 3 Label"
                  value={settings.heroStat3Label || ''}
                  onChange={(e) => setSettings({ ...settings, heroStat3Label: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" loading={saving}>
            <Save className="w-4 h-4 mr-1.5" /> Save Hero Section Parameters
          </Button>
        </form>
      )}

      {/* TAB 4: GENERAL OPERATIONS & CONTACT */}
      {activeTab === 'general' && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Header Announcement Banner */}
          <div className="bg-white border p-6 rounded-xs space-y-4 shadow-xs" style={{ borderColor: 'var(--brand-border)' }}>
            <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: 'var(--brand-border-light)' }}>
              <Bell className="w-4 h-4 text-amber-700" />
              <h3 className="font-serif-display text-base font-bold" style={{ color: 'var(--brand-primary)' }}>
                Header Announcement Banner
              </h3>
            </div>
            <Input
              label="Banner Announcement Message"
              value={settings.announcementBarText || ''}
              onChange={(e) => setSettings({ ...settings, announcementBarText: e.target.value })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Banner Destination Link"
                value={settings.announcementBarLink || ''}
                onChange={(e) => setSettings({ ...settings, announcementBarLink: e.target.value })}
              />
              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 text-xs font-bold text-[#1E2420] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.isAnnouncementBarActive ?? true}
                    onChange={(e) => setSettings({ ...settings, isAnnouncementBarActive: e.target.checked })}
                    className="w-4 h-4 accent-amber-600"
                  />
                  Show Announcement Bar Across Platform
                </label>
              </div>
            </div>
          </div>

          {/* Commercial Logistics Rules */}
          <div className="bg-white border p-6 rounded-xs space-y-4 shadow-xs" style={{ borderColor: 'var(--brand-border)' }}>
            <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: 'var(--brand-border-light)' }}>
              <Truck className="w-4 h-4 text-amber-700" />
              <h3 className="font-serif-display text-base font-bold" style={{ color: 'var(--brand-primary)' }}>
                Logistics & Order Limits
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Retail Free Delivery Threshold (BDT) *"
                type="number"
                value={settings.freeDeliveryThresholdRetail || 2500}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThresholdRetail: Number(e.target.value) })}
                required
              />
              <Input
                label="Default Retail Delivery Charge (BDT) *"
                type="number"
                value={settings.defaultRetailDeliveryFee || 80}
                onChange={(e) => setSettings({ ...settings, defaultRetailDeliveryFee: Number(e.target.value) })}
                required
              />
              <Input
                label="Wholesale Min Order Threshold (Kg) *"
                type="number"
                value={settings.wholesaleMinOrderKg || 250}
                onChange={(e) => setSettings({ ...settings, wholesaleMinOrderKg: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          {/* Corporate Profile & Addresses */}
          <div className="bg-white border p-6 rounded-xs space-y-4 shadow-xs" style={{ borderColor: 'var(--brand-border)' }}>
            <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: 'var(--brand-border-light)' }}>
              <Building2 className="w-4 h-4 text-amber-700" />
              <h3 className="font-serif-display text-base font-bold" style={{ color: 'var(--brand-primary)' }}>
                Corporate Contact & Office Details
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary Phone Number"
                value={settings.phonePrimary || ''}
                onChange={(e) => setSettings({ ...settings, phonePrimary: e.target.value })}
              />
              <Input
                label="Wholesale Trade Desk Phone"
                value={settings.phoneWholesale || ''}
                onChange={(e) => setSettings({ ...settings, phoneWholesale: e.target.value })}
              />
              <Input
                label="General Email Address"
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
              <Input
                label="Trade Desk Email"
                value={settings.salesEmail || ''}
                onChange={(e) => setSettings({ ...settings, salesEmail: e.target.value })}
              />
            </div>
            <Input
              label="Corporate Head Office Address"
              value={settings.headOfficeAddress || ''}
              onChange={(e) => setSettings({ ...settings, headOfficeAddress: e.target.value })}
            />
            <Input
              label="Milling Silo Complex Address"
              value={settings.millAddress || ''}
              onChange={(e) => setSettings({ ...settings, millAddress: e.target.value })}
            />
          </div>

          <Button type="submit" variant="primary" size="lg" loading={saving}>
            <Save className="w-4 h-4 mr-1.5" /> Save Platform Parameters
          </Button>
        </form>
      )}
    </div>
  );
};
