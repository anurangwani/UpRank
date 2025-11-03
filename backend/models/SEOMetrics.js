import mongoose from 'mongoose';

const seoMetricsSchema = mongoose.Schema(
    {
        keyword: { type: String, required: true },
        position: { type: Number, required: true },
        searchVolume: { type: Number, required: true },
        backlinkCount: { type: Number, required: true },
        domainAuthority: { type: Number, required: true },
        date: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

const SEOMetrics = mongoose.model('SEOMetrics', seoMetricsSchema);

export default SEOMetrics;
