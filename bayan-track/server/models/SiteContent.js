import mongoose from 'mongoose';

const SnapshotItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false },
);

const CommunityCardSchema = new mongoose.Schema(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
    sublabel: { type: String, required: true },
  },
  { _id: false },
);

const SiteContentSchema = new mongoose.Schema(
  {
    communityCards: {
      type: [CommunityCardSchema],
      default: [
        { value: '4102', label: 'Postal Code', sublabel: 'Bacoor City' },
        { value: '7,129', label: 'Population', sublabel: '2020 Census' },
        { value: 'IV-A', label: 'Region', sublabel: 'CALABARZON' },
        { value: 'CAVITE', label: 'Province', sublabel: 'Philippines' },
      ],
    },
    aboutHeroTitle: { type: String, default: 'About Our Community' },
    aboutHeroSubtitle: { type: String, default: 'Mambog II: A progressive residential barangay in the heart of Bacoor.' },
    aboutSnapshotItems: {
      type: [SnapshotItemSchema],
      default: [
        { label: 'Region', value: 'CALABARZON (Region IV-A)' },
        { label: 'Population (2020)', value: '7,129 Residents' },
        { label: 'City', value: 'Bacoor City, Cavite' },
        { label: 'Share of Bacoor', value: 'Approx. 1.07%' },
        { label: 'Postal Code', value: '4102' },
        { label: 'Elevation', value: '~12.7 meters ASL' },
        { label: 'Coordinates', value: '14.4239°N, 120.9523°E' },
        { label: 'Classification', value: 'Urban / Residential' },
      ],
    },
    aboutPopulationTrend: {
      type: [SnapshotItemSchema],
      default: [
        { label: '1990 Census', value: '~2,500' },
        { label: '2010 Census', value: '~5,800' },
        { label: '2020 Census', value: '7,129' },
      ],
    },
    aboutCoreGovernance: {
      type: [String],
      default: [
        'Barangay Assembly: Biannual meetings for resident consultation.',
        'Committees: Peace & Order, Health, Finance, Youth, Infrastructure.',
        'Transparency: Full disclosure of budget and projects.',
      ],
    },
    aboutHistoryText: { type: String, default: '' },
    aboutGovernanceText: { type: String, default: '' },
    contactOfficeHours: { type: String, default: 'Monday - Friday, 8:00 AM - 5:00 PM' },
    contactLocationText: { type: String, default: 'Barangay Mambog II Hall, Bacoor City, Cavite' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true },
);

export default mongoose.model('SiteContent', SiteContentSchema);
