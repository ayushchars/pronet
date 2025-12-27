# Quick Integration Guide - ProNet Referral System

## 🚀 Get Started in 5 Minutes

### Step 1: Add Route to Router
In your main router file (e.g., `src/router.jsx` or `src/App.jsx`):

```jsx
import ReferralPage from './Page/ReferralPage';

// Inside your route definition:
<Route path="/referral" element={<ReferralPage />} />
// OR
<Route path="/dashboard/referral" element={<ReferralPage />} />
// OR
<Route path="/team/referral" element={<ReferralPage />} />
```

### Step 2: Add Navigation Link
In your navigation/header component:

```jsx
<Link to="/referral" className="nav-link">
  💰 Team & Referrals
</Link>
// OR with icon
<Link to="/referral">
  <span>🎯</span> Referral Network
</Link>
```

### Step 3: Done! ✅
Users can now:
- Access their referral page
- Share their code
- Join teams
- View hierarchy
- Track earnings

---

## 📁 File Structure

```
pronet/
├── src/
│   ├── Components/
│   │   ├── Team/
│   │   │   ├── ReferralCode.jsx
│   │   │   ├── ReferralCode.css
│   │   │   ├── JoinTeam.jsx
│   │   │   ├── JoinTeam.css
│   │   │   ├── TeamHierarchy.jsx
│   │   │   └── TeamHierarchy.css
│   │   └── shared/
│   │       ├── Tabs.jsx
│   │       └── Tabs.css
│   └── Page/
│       ├── ReferralPage.jsx
│       └── ReferralPage.css
```

---

## 🔧 Customization Options

### Change Colors
Edit the gradient colors in CSS files:

```css
/* In ReferralCode.css, JoinTeam.css, etc. */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

Default colors:
- Primary: `#667eea` (Purple)
- Secondary: `#764ba2` (Dark Purple)
- Accent: `#fbbf24` (Gold)

### Change Page Title
In `ReferralPage.jsx`, edit:
```jsx
<h1>Team & Referral Management</h1>
```

### Change Tab Names
In `ReferralPage.jsx`, edit:
```jsx
<TabsTrigger value="my-code">Your Tab Name Here</TabsTrigger>
```

### Change Route Path
Anywhere you add the route, use your preferred path:
```jsx
<Route path="/your/custom/path" element={<ReferralPage />} />
```

---

## 🧪 Testing Checklist

### Before Going Live
- [ ] Route is accessible from navigation
- [ ] ReferralCode component displays (test without joining team)
- [ ] Can copy referral code
- [ ] Can view referral link
- [ ] JoinTeam component loads
- [ ] Can validate a referral code
- [ ] Can join a team
- [ ] TeamHierarchy displays (test with team members)
- [ ] All tabs work smoothly
- [ ] Mobile responsive design works
- [ ] No console errors
- [ ] Auth token is properly handled

### Test Workflows
1. **Share Code Workflow**
   - Go to ReferralPage
   - Click "My Referral Code" tab
   - Copy code
   - Share with someone

2. **Join Team Workflow**
   - Get a referral code
   - Go to ReferralPage
   - Click "Join a Team" tab
   - Enter code
   - Click validate
   - Click join

3. **View Hierarchy Workflow**
   - Click "Team Hierarchy" tab
   - Expand/collapse members
   - View member details

---

## 🔗 API Endpoints Used

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/team/my-referral-code` | ✅ | Get user's code & stats |
| POST | `/api/team/validate-referral-code` | ❌ | Validate code before joining |
| POST | `/api/team/apply-referral-code` | ✅ | Join team using code |
| GET | `/api/team/downline-structure/me` | ✅ | Get user's team hierarchy |

**✅ = Requires auth token**
**❌ = No auth required**

---

## 🛠️ Troubleshooting

### Problem: "Cannot find module 'ReferralPage'"
**Solution**: Check that the import path is correct
```jsx
// Correct
import ReferralPage from './Page/ReferralPage';
import ReferralPage from '../Page/ReferralPage';

// Wrong
import ReferralPage from './ReferralPage';
```

### Problem: API returning 401 Unauthorized
**Solution**: 
- Check auth token is in localStorage
- Verify endpoint is not admin-only
- Check token hasn't expired

### Problem: Components showing but no styling
**Solution**:
- Ensure CSS files are imported in JSX files
- Check CSS file paths are correct
- Verify webpack/vite is processing CSS

### Problem: Tabs not switching
**Solution**:
- Check Tabs.jsx is imported correctly
- Verify TabsList, TabsTrigger, TabsContent are used correctly
- Check no CSS conflicts with existing tab styles

### Problem: Icons not showing
**Solution**:
- These components use Lucide React icons
- Install: `npm install lucide-react`
- Or replace with your icon library

---

## 📦 Dependencies

Required:
- React (already in pronet)
- Lucide React: `npm install lucide-react`

Optional (if not already in pronet):
- axios or fetch (built-in)

---

## 🎨 Styling Notes

### Responsive Design
- Desktop (1200px+): Full layout, 4-column grids
- Tablet (768px): 2-column grids, adjusted padding
- Mobile (480px): Single column, touch-optimized

### Theme
- Gradient backgrounds: Purple to dark purple
- Gold accents: #fbbf24
- White cards with subtle shadows
- Rounded corners: 8px-12px

### Icons Used
From Lucide React:
- `Copy` - Copy button
- `Check` - Success state
- `AlertCircle` - Error state
- `Loader` - Loading state
- `ChevronDown` - Expand
- `ChevronRight` - Collapse

---

## 📱 Mobile Considerations

✅ Fully responsive
✅ Touch-friendly buttons (min 44px height)
✅ Readable text on small screens
✅ Horizontal scroll for wide content
✅ Stacked layout on mobile
✅ Optimized spacing

---

## 🔐 Security

✅ Uses existing auth middleware
✅ Only authenticated users can join teams
✅ Code validation prevents invalid joins
✅ No sensitive data in localStorage
✅ HTTPS recommended for production

---

## 📊 Analytics (Optional)

Add tracking to measure:
- Referral code shares
- Successful code validations
- Team joins
- Hierarchy views
- Click-through rates

Example:
```jsx
const handleShare = () => {
  // Your analytics
  analytics.track('referral_code_shared');
  // Then copy code
}
```

---

## 🚀 Deployment

1. **Test locally**
   ```bash
   npm run dev
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Deploy** to your hosting

4. **Verify endpoints** are accessible from production domain

---

## 📞 Need Help?

### Common Questions

**Q: Can users share their code multiple times?**
A: Yes! Each share creates no new code, just shares the same code.

**Q: What happens when someone uses my code?**
A: They become part of your downline and appear in your hierarchy.

**Q: Can users change their referral code?**
A: No, codes are permanent once generated.

**Q: How are earnings calculated?**
A: Based on level, direct count, and team activity (backend logic).

**Q: Can I customize earning percentages?**
A: Yes, edit backend logic in teamReferralApi.js

---

## ✅ Verification Steps

After integration, verify:

1. Page loads without errors
   - Check browser console (F12)
   - No red error messages

2. Referral code displays
   - Code should be 25 characters (PRO-XXXXX-XXXXXXXX)
   - Copy button works

3. Join team form works
   - Can enter code
   - Can validate
   - Can join

4. Hierarchy displays
   - Shows team members
   - Can expand/collapse
   - Shows stats

5. Responsive design
   - Resize browser window
   - Layout adapts smoothly
   - Mobile looks good

---

## 📝 Version History

- **v1.0** - Initial release with core features
  - Referral code display
  - Team joining
  - Hierarchy visualization
  - Tab-based page layout

---

## 🎉 You're All Set!

Your ProNet app now has a complete referral system. Users can:
- ✅ See their referral code
- ✅ Share with friends
- ✅ Join teams
- ✅ View their network
- ✅ Track growth

Happy coding! 🚀
