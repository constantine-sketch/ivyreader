# IvyReader Marketing Website Integration Guide

## Deep Linking from Marketing Website to Mobile App

After a user completes payment on the marketing website, redirect them to the IvyReader mobile app using deep links to automatically set their subscription tier.

---

## Deep Link Format

```
manus20260130164246://purchase-complete?tier={TIER}
```

### Parameters

- **tier** (required): The subscription tier the user purchased
  - Valid values: `premium` | `elite`
  - Case-insensitive

---

## Integration Steps

### 1. After Successful Payment

When a user completes payment for Premium or Elite tier:

```javascript
// Example: After Stripe payment success
const tier = userPurchasedTier; // 'premium' or 'elite'
const deepLink = `manus20260130164246://purchase-complete?tier=${tier}`;

// Redirect user to the app
window.location.href = deepLink;
```

### 2. Fallback for Web Users

If the user is on web and doesn't have the app installed, provide a fallback:

```javascript
const tier = userPurchasedTier;
const deepLink = `manus20260130164246://purchase-complete?tier=${tier}`;
const webFallback = `https://8081-ik4t6s36n3oc5oeaw7m92-88ba9329.us1.manus.computer`;

// Try to open the app
window.location.href = deepLink;

// After a delay, redirect to web app if app didn't open
setTimeout(() => {
  window.location.href = webFallback;
}, 2000);
```

### 3. Universal Link (Recommended)

For better user experience, use universal links that work on both mobile and web:

**iOS Universal Link:** `https://ivyreader.app/purchase-complete?tier=premium`
**Android App Link:** `https://ivyreader.app/purchase-complete?tier=elite`

These will automatically open the app if installed, or open the web version if not.

---

## Flow Diagram

```
Marketing Website
    ↓
User selects tier (Premium/Elite)
    ↓
User completes payment (Stripe)
    ↓
Payment success webhook
    ↓
Redirect to: manus20260130164246://purchase-complete?tier={tier}
    ↓
IvyReader App Opens
    ↓
App sets user's subscription tier
    ↓
App redirects to onboarding flow
    ↓
User completes profile setup
    ↓
User enters main app with correct tier
```

---

## Testing

### Test Deep Links

**Premium Tier:**
```
manus20260130164246://purchase-complete?tier=premium
```

**Elite Tier:**
```
manus20260130164246://purchase-complete?tier=elite
```

### Testing on Mobile

1. Open Safari (iOS) or Chrome (Android)
2. Paste the deep link in the address bar
3. Press Enter
4. The IvyReader app should open automatically
5. Verify the tier is set correctly in the user's profile

### Testing on Web

The deep link will redirect to the web version of the app with the tier parameter preserved.

---

## Error Handling

The app handles these error cases gracefully:

1. **Missing tier parameter** → User proceeds to onboarding with default "free" tier
2. **Invalid tier value** → User proceeds to onboarding with default "free" tier
3. **Network error during tier update** → User still proceeds to onboarding (tier can be updated later in settings)

---

## Implementation Checklist

- [ ] Add deep link redirect after successful Stripe payment
- [ ] Test Premium tier deep link on iOS
- [ ] Test Premium tier deep link on Android
- [ ] Test Elite tier deep link on iOS
- [ ] Test Elite tier deep link on Android
- [ ] Add fallback for web users
- [ ] Verify tier appears correctly in app after purchase
- [ ] Test error cases (invalid tier, missing parameter)

---

## Support

For questions or issues with the integration, please contact the IvyReader development team.

**Deep Link Scheme:** `manus20260130164246://`
**Purchase Complete Path:** `purchase-complete`
**Required Parameter:** `tier` (premium | elite)
