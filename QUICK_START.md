# Daily Body Pain Tracker - Quick Start Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```
Output is in the `out/` directory.

---

## 📋 Using the Application

### Recording Pain
1. Go to **Home** or **Recorder** page
2. Choose **Front View** or **Back View**
3. Click a body part (e.g., "L. Delt" for left deltoid)
4. Drag the **pain intensity slider** (1-10)
5. Click **Confirm** to save

**Color Guide:**
- 🟨 **1-3**: Mild pain
- 🟧 **4-6**: Moderate pain  
- 🟥 **7-10**: Severe pain

### Viewing Statistics
1. Go to **Statistics** page
2. Choose **This Week** or **This Month**
3. See top 10 most painful areas
4. Rankings sorted by total pain intensity

**Info Provided:**
- Total Intensity (sum of all pain levels)
- Average (mean pain level)
- Frequency (number of recordings)
- Progress bar visualization

### Checking History
1. Go to **History** page
2. **Expand** an entry to see details
3. **Delete** individual body parts or entire days
4. Entries shown newest first

---

## 🔧 Key Files

| File | Purpose |
|------|---------|
| `src/pages/index.tsx` | Recorder page |
| `src/pages/statistics.tsx` | Statistics/analytics page |
| `src/pages/history.tsx` | History log page |
| `src/lib/storage.ts` | localStorage operations |
| `src/lib/body-parts.ts` | 30+ body region definitions |
| `src/lib/aggregation.ts` | Statistics calculations |
| `src/styles/globals.css` | Global styles & Tailwind |

---

## 📊 Data Format

Pain entries stored as JSON in browser's localStorage:

```json
{
  "2026-02-24": {
    "date": "2026-02-24",
    "bodyPartEntries": {
      "left_deltoid": { "bodyPartId": "left_deltoid", "intensityLevel": 7 },
      "lower_back": { "bodyPartId": "lower_back", "intensityLevel": 5 }
    },
    "createdAt": "2026-02-24T14:30:00.000Z",
    "updatedAt": "2026-02-24T14:32:00.000Z"
  }
}
```

---

## 📦 Deployment

Ready to deploy to:
- **GitHub Pages** - `out/` folder
- **Netlify** - Connect Git repo
- **Vercel** - Connect Git repo
- **AWS S3** - Upload `out/` folder
- **Any static host** - Upload `out/` folder

---

## 🎯 Supported Regions (30+)

**Front View:**
Head, Neck, L/R Shoulder, L/R Deltoid, L/R Bicep, L/R Forearm, L/R Hand, Chest, L/R Breast, Abdomen, L/R Hip, L/R Thigh, L/R Knee, L/R Shin, L/R Foot

**Back View:**
Neck, L/R Shoulder, L/R Deltoid, L/R Tricep, L/R Forearm, L/R Hand, Upper Back, Mid Back, Lower Back, L/R Glute, L/R Thigh, L/R Knee, L/R Shin, L/R Foot

---

## ⌨️ Keyboard Shortcuts

- **ESC** - Close pain slider dialog

---

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Android Chrome)

---

## 💾 Troubleshooting

| Issue | Solution |
|-------|----------|
| Data not saving | Check if localStorage is enabled in browser |
| "Quota exceeded" message | App auto-deletes oldest month; try again |
| Slider not responding | Try a different browser; check JavaScript is enabled |
| Mobile layout broken | Update browser to latest version |

---

## 📞 More Info

See **README.md** for full documentation
See **IMPLEMENTATION_SUMMARY.md** for technical details
See **specs/** directory for specification documents

---

**Last Updated**: 2026-02-24  
**Version**: 1.0.0
