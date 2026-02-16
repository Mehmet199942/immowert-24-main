# SMS Automation Sequences

## SMS Sequence Overview
- **Total Messages:** 5
- **Duration:** 14 days
- **Compliance:** Include opt-out option in every message
- **Character Limit:** Keep under 160 characters when possible

---

## SMS 1: Immediate (Within 5 minutes)
**Timing:** Immediately after form submission

```
Hi [Name], this is [Your Name] from FastCashOffer. Thanks for requesting a cash offer on your property at [Address]. I'm reviewing the details now and will have your offer ready within 24 hours. I'll call you tomorrow at [Time]. Reply STOP to opt out.
```

**Character Count:** ~240 (will send as 2 messages)

---

## SMS 2: 24 Hours Later (With Offer)
**Timing:** 24 hours after submission

```
[Name], great news! Your cash offer for [Address] is ready: $[Amount]. I'll call you in the next hour to discuss. Have questions now? Call me: (555) 123-4567
```

**Character Count:** ~160

---

## SMS 3: Day 3 (If No Response)
**Timing:** 72 hours after submission (if no contact made)

```
Hi [Name], just following up on your $[Amount] cash offer for [Address]. Is this still a good time to sell? I'm here to answer any questions. - [Your Name]
```

**Character Count:** ~160

---

## SMS 4: Day 7 (Value Add)
**Timing:** 7 days after submission

```
[Name], I know selling a property is a big decision. I sent you our free guide "7 Things to Know Before Selling" to your email. Let me know if you have questions! - [Your Name]
```

**Character Count:** ~160

---

## SMS 5: Day 14 (Last Touch)
**Timing:** 14 days after submission

```
[Name], this is my last message. Your offer of $[Amount] for [Address] is still available if you're interested. No pressure - just wanted you to know the option is there. Best, [Your Name]
```

**Character Count:** ~180

---

## Alternative SMS Variations

### For Urgent Situations (Foreclosure, etc.)

**SMS 1 (Urgent):**
```
Hi [Name], I understand you're facing [situation]. We can help. I'm preparing your cash offer now and will call you within 2 hours. - [Your Name], FastCashOffer
```

**SMS 2 (Urgent):**
```
[Name], your $[Amount] cash offer is ready. We can close in 7 days to help with your situation. Call me ASAP: (555) 123-4567 - [Your Name]
```

### For Inherited Properties

**SMS 1 (Inherited):**
```
Hi [Name], sorry for your loss. I'm preparing a fair cash offer for the inherited property at [Address]. No repairs needed. I'll call you tomorrow. - [Your Name]
```

**SMS 2 (Inherited):**
```
[Name], your cash offer is ready: $[Amount]. We handle everything - you don't even need to visit the property. Call to discuss: (555) 123-4567
```

---

## SMS Best Practices

### Timing
- **Best days:** Tuesday, Wednesday, Thursday
- **Best times:** 10am-12pm, 2pm-4pm (local time)
- **Avoid:** Before 9am, after 8pm, weekends (unless urgent)

### Tone
- **Friendly but professional**
- **Conversational, not salesy**
- **Use first name only**
- **Keep it brief**

### Compliance
- **Always include opt-out:** "Reply STOP to opt out"
- **Include business name**
- **Don't send more than 1 per day**
- **Respect opt-outs immediately**

### Personalization
- Use first name
- Reference their specific property
- Mention their situation if known
- Include specific offer amount

---

## SMS Service Recommendations

**Recommended Platforms:**
1. **Twilio** - Most flexible, developer-friendly
2. **SimpleTexting** - Easy to use, good for small teams
3. **EZ Texting** - Great automation features
4. **Podium** - Good for reviews + messaging
5. **CallRail** - Includes call tracking

**Features to Look For:**
- Automation/drip campaigns
- Personalization/merge fields
- Two-way messaging
- Compliance tools (auto opt-out)
- Analytics/reporting
- CRM integration

---

## Response Handling

### If They Reply "YES" or "INTERESTED"
```
Great! I'll call you in the next 30 minutes to go over the details. Or you can call me now: (555) 123-4567 - [Your Name]
```

### If They Reply "NOT INTERESTED"
```
No problem, [Name]. If your situation changes, feel free to reach out anytime. Best of luck! - [Your Name]
```

### If They Reply "MORE INFO"
```
Happy to help! The best way is a quick 5-min call. When's a good time? Or call me: (555) 123-4567 - [Your Name]
```

### If They Reply "STOP"
```
[Automated] You've been unsubscribed from FastCashOffer messages. Reply START to resubscribe.
```

---

## A/B Testing Ideas

**Test Variables:**
1. **Sender name:** First name only vs. Full name vs. Company name
2. **Message length:** Short (80 chars) vs. Long (160 chars)
3. **Call-to-action:** "Call me" vs. "Reply YES" vs. "Click link"
4. **Timing:** Morning vs. Afternoon
5. **Emoji usage:** With vs. Without
6. **Urgency:** Urgent language vs. Casual language

**Metrics to Track:**
- Delivery rate
- Open rate (if using link tracking)
- Response rate
- Opt-out rate
- Conversion to call
- Conversion to sale

---

## Legal Compliance (TCPA)

**Required Elements:**
1. ✓ Obtain consent before texting
2. ✓ Include opt-out instructions
3. ✓ Honor opt-outs immediately
4. ✓ Identify your business
5. ✓ Don't text before 8am or after 9pm
6. ✓ Keep records of consent

**Consent Language (for quiz form):**
```
☐ By checking this box, I consent to receive text messages from FastCashOffer at the number provided. Message frequency varies. Message and data rates may apply. Reply STOP to opt out.
```

---

## Integration with Email

**Coordinated Approach:**
- SMS for immediate, time-sensitive communication
- Email for detailed information and education
- Don't duplicate messages - complement each other

**Example Timeline:**
- Day 0: SMS #1 (immediate) + Email #1 (confirmation)
- Day 1: SMS #2 (offer ready) + Email #2 (detailed offer)
- Day 3: SMS #3 (follow-up) only
- Day 4: Email #3 (education) only
- Day 7: SMS #4 (value add) + Email #5 (objections)
- Day 14: SMS #5 (final) + Email #7 (final)

This prevents overwhelming the lead while maintaining consistent touch points.
