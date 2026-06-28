# CyberKhana Interviews

**Interview Booking Portal** — Candidates pick a day and a 20-minute time slot. Each slot can only be booked once.

![CyberKhana](CyberKhana_text_logo.png)

## 🗓️ Schedule

Two interview days, **7 slots each** (6 + 1 extra), **20 minutes per slot**, running **9:00 PM → 11:20 PM**:

| Day 1 — 29/6 | Day 2 — 30/6 |
|--------------|--------------|
| 9:00 – 9:20 PM | 9:00 – 9:20 PM |
| 9:20 – 9:40 PM | 9:20 – 9:40 PM |
| 9:40 – 10:00 PM | 9:40 – 10:00 PM |
| 10:00 – 10:20 PM | 10:00 – 10:20 PM |
| 10:20 – 10:40 PM | 10:20 – 10:40 PM |
| 10:40 – 11:00 PM | 10:40 – 11:00 PM |
| 11:00 – 11:20 PM | 11:00 – 11:20 PM |

Once a candidate books a slot, that card is disabled for everyone else — enforced server-side with `LockService` so two people can never grab the same slot.

## 🛠️ Tech Stack

- **Frontend:** Single-file HTML/CSS/JS — no frameworks, no dependencies
- **Backend:** Google Apps Script → Google Sheets
- **Hosting:** Vercel

## 📁 Project Structure

```
├── book.html           # The interview booking form
├── code.gs             # Google Apps Script (paste into Apps Script editor)
├── vercel.json         # Vercel routing configuration
├── CyberKhana_text_logo.png
├── logo1.png
└── README.md
```

## ⚙️ Setup

1. Create a **new Google Sheet**, then open **Extensions → Apps Script**.
2. Delete any sample code and paste the contents of `code.gs`.
3. (Optional) Run `setupSheet` once to add the header row.
4. Deploy: **Deploy → New deployment → Web app**
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Copy the **Web App URL** and paste it into `book.html` → the `SCRIPT_URL` constant.
6. Deploy `book.html` to Vercel (or open it directly in a browser).

## 🔒 How double-booking is prevented

- On page load, `book.html` calls `…/exec?action=taken` (`doGet`) to fetch all booked slot keys and disables those cards.
- On submit, `doPost` acquires a script lock, **re-checks** the slot is still free, and only then writes the row.
- If the slot was taken in the meantime, the server returns `{ status: "taken" }` and the form asks the candidate to pick another time.

## 📊 Collected Data

| Column | Description |
|--------|-------------|
| Timestamp | When the booking was made |
| Full Name | Candidate's full name |
| Interview Day | `29/6` or `30/6` |
| Time Slot | e.g. `9:00 PM – 9:20 PM` |
| Slot Key | Unique key, e.g. `29/6 \| 9:00 PM – 9:20 PM` (used to detect duplicates) |

## 🔗 Links

- [Website](https://www.cyberkhana.tech)
- [Instagram](https://www.instagram.com/cyberkhana)
- [Telegram](https://t.me/cyberkhana)
- [LinkedIn](https://www.linkedin.com/company/cyberkhana/)

---

**CyberKhana** — Revolutionizing the Iraqi Cybersecurity Education Landscape.
