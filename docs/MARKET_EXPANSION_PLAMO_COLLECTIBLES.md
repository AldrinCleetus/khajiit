# Khajiit: Market Expansion Proposal & Technical Specification
## Plamo, Gunpla & Scale Model Backlog Marketplace (India)

*Document Version:* 1.0  
*Status:* Feature & Market Opportunity Proposal  
*Target Segment:* Hobbyists, Gunpla / Scale Model Builders, Anime Figure Collectors in India  

---

## 1. Executive Summary & Market Opportunity

Indian hobbyists face a severe structural problem when buying and selling **Plamo** (Plastic Model kits: Bandai Gunpla, Kotobukiya, 30MM, Pokepla, LBX, Warhammer, Scale Military/Automotive models) and collectibles.

Currently, this vibrant, high-ticket enthusiast community is trapped in **Discord forums (e.g. *"Plamo India" - #sell-your-backlog*), WhatsApp groups, Reddit, and Instagram DMs**.

### Why the Current Channel (Discord / Reddit) Fails:
1. **Unstructured Chaos:** Sellers post unsearchable thread titles like *"Corey's Backlog sale"*, *"Curiosity killed the Cat"*, or *"Fund thy Knight's Gluttony Sale"*. Buyers cannot search by Grade, Scale, Franchise, or specific Kit Name.
2. **The "Backlog" Phenomenon:** Model kit builders routinely acquire kits faster than they can assemble them ("the backlog"). When moving, needing liquid cash, or switching interests, collectors liquidate multiple sealed or partially built kits at once.
3. **Crude Geographic Filtering:** Discord threads use loose manual tags (e.g. `kochi`, `bangalore`, `delhi`) that cannot calculate actual radius or filter for local hand-to-hand exchange.
4. **Fragile Shipping & Box Damage:** Model kit runners and collectible boxes are easily crushed in standard Indian couriers. Local hand-to-hand pickup is overwhelmingly preferred for delicate kits or large Master Grade (MG) / Perfect Grade (PG) boxes.
5. **Opaque Pricing & Scalping:** Bandai kits have printed JPY retail prices on the barcode. In India, imported retail kits carry high customs duties (35–45%) and steep middleman markups. P-Bandai (Premium Bandai web exclusives) have extreme price volatility. There is no standard reference for what a second-hand backlog kit should cost in INR.
6. **Bootleg / Knockoff Hazards:** Unsuspecting buyers risk receiving third-party recasts/bootlegs (Daban, Dragon Momoko, TT Hongli) sold at genuine Bandai prices without explicit disclosures.

---

## 2. Why Khajiit is the Perfect Platform for Plamo & Backlog Sales

| Feature | Discord / Reddit / WhatsApp | OLX / Quikr | Khajiit (Proposed Specialized Vertical) |
| :--- | :--- | :--- | :--- |
| **Model Autocomplete** | None (free text) | None (generic keywords) | **Pre-populated Kit Catalog** (Select Brand $\to$ Grade $\to$ Model; auto-fills scale, release year, box art, JPY MSRP) |
| **Backlog Multi-Kit Bundles** | Wall of text in Discord threads | Single photo / price only | **Built-in Split-Option Bidding (`PurchaseOption`)**: Buyer can bid on "Full Backlog Lot" or individual kits |
| **Condition Grading** | Ambiguous descriptions | "Used" | **Standardized Plamo Condition Tiers** (MISB, Runners Sealed, Cut Runners, Snap Built, Painted) |
| **Fair Market Benchmark** | Subjective, volatile | No guidance | **JPY MSRP $\times$ Landing Factor** benchmark with verified condition depreciation |
| **Bootleg Disclosures** | Manual honesty policy | Rampant counterfeit scams | **Mandatory Authenticity Badge** (`Bandai Spirits Genuine`, `P-Bandai Web Exclusive`, `Third-Party / Daban`) |
| **Local Pickup Privacy** | DMs with strangers | Exposed phone numbers | **Static 1.5 km Privacy Circle** + Phone unmasking only upon mutual pickup agreement |

---

## 3. Data Model & Prisma Schema Extension

To support Plamo as a first-class citizen alongside `PROPERTIES`, `MOBILES`, and `ELECTRONICS`, we extend `MainCategory` and introduce a dedicated `PlamoKitCatalog` and `PlamoMetadata` relation:

```prisma
// ── MainCategory Enum Extension ──────────────────────────────────────
enum MainCategory {
  PROPERTIES
  MOBILES
  ELECTRONICS
  PLAMO // Plastic Models, Gunpla & Hobby Kits
}

// ── Plamo Condition Enums ─────────────────────────────────────────────
enum PlamoBuildCondition {
  MISB                 // Mint in Sealed Box (Factory taped / shrink-wrapped)
  UNSTARTED_SEALED_BAGS// Box opened to inspect, but all runner plastic bags sealed
  CUT_RUNNERS          // Some parts cut from runners, but unbuilt (runners bagged)
  SNAP_BUILT           // Assembled straight out of the box (no glue/paint)
  PANEL_LINED_DECALED  // Assembled with panel lining and water-slide / foil decals
  CUSTOM_PAINTED       // Airbrushed, weathered, or customized
  INCOMPLETE_PARTS     // Missing runners, broken pegs, or for kitbashing/spare parts
}

enum PlamoOrigin {
  BANDAI_GENUINE       // Official Bandai Spirits / Namco
  KOTOBUKIYA_GENUINE   // Kotobukiya (Megami Device, Frame Arms, Armored Core)
  GOOD_SMILE_MODEROID  // Good Smile Company Moderoid / Plamax
  THIRD_PARTY_ORIGINAL // In Era, SNAA, Motor Nuclear, Hemoxian (Original Chinese Mecha)
  BOOTLEG_RECAST       // Daban, Dragon Momoko, TT Hongli (Third-party bootleg copies)
}

enum PlamoExclusivity {
  STANDARD_RETAIL      // Regular mass retail release
  PBANDAI_EXCLUSIVE    // Premium Bandai Web Shop exclusive
  GUNDAM_BASE_LIMITED  // The Gundam Base Tokyo/Fukuoka physical exclusive
  EXPO_EVENT_LIMITED   // Chara-Hobby, Gunpla Expo, Anime Festival exclusive
}

// ── Pre-Populated Model Kit Catalog Table ─────────────────────────────
model PlamoKitCatalog {
  id               String            @id @default(uuid())
  manufacturer     String            // "Bandai Spirits", "Kotobukiya", "Good Smile"
  franchise        String            // "Mobile Suit Gundam", "Pokemon", "Little Battlers eXperience (LBX)", "30 Minutes Missions"
  subSeries        String?           // "Universal Century", "Witch from Mercury", "SEED Freedom", "Iron-Blooded Orphans"
  grade            String            // "HG (High Grade)", "RG (Real Grade)", "MG (Master Grade)", "PG (Perfect Grade)", "EG (Entry Grade)", "Non-Scale"
  scale            String            // "1/144", "1/100", "1/60", "Non-Scale"
  kitName          String            // "Gundam Aerial", "F91 Gundam", "G-Line Standard Armor", "Lbx Elysion"
  janBarcode       String?           // 4573102633569 (standard Japanese barcode for instant match)
  
  // Baseline Pricing (Official JPY MSRP for fair-market landing calculations)
  msrpJpy          Int               // e.g. 1430 JPY for HG Aerial, 4500 JPY for MG Barbatos
  releaseYear      Int?              // e.g. 2022
  isPBandai        Boolean           @default(false)
  boxArtUrl        String?           // Official promotional box art thumbnail
  
  listings         PlamoMetadata[]
  
  @@unique([manufacturer, grade, kitName, scale])
  @@index([franchise, grade])
  @@index([kitName])
}

// ── Listing Metadata Relation (One-to-One with Listing) ───────────────
model PlamoMetadata {
  id                  String              @id @default(uuid())
  listingId           String              @unique
  listing             Listing             @relation(fields: [listingId], references: [id], onDelete: Cascade)
  
  // Catalog Reference (Optional if user enters a rare/unlisted kit)
  catalogId           String?
  catalog             PlamoKitCatalog?    @relation(fields: [catalogId], references: [id])
  isCustomKit         Boolean             @default(false)
  
  // Core Specs (Prefilled from catalog or manually supplied)
  manufacturer        String              // "Bandai Spirits"
  franchise           String              // "Mobile Suit Gundam"
  subSeries           String?             // "Universal Century"
  grade               String              // "HG 1/144"
  scale               String              // "1/144"
  kitName             String              // "G-Line Standard Armor"
  
  // Kit Status & Integrity
  origin              PlamoOrigin         @default(BANDAI_GENUINE)
  exclusivity         PlamoExclusivity    @default(STANDARD_RETAIL)
  buildCondition      PlamoBuildCondition @default(UNSTARTED_SEALED_BAGS)
  boxCondition        String              // "Mint / Pristine", "Minor Shelf Wear", "Dented / Crushed"
  
  // Verification Checklist (High-Trust Inclusions)
  allRunnersPresent   Boolean             @default(true)
  runnerBagsSealed    Boolean             @default(true)
  manualIncluded      Boolean             @default(true)
  decalsIncluded      Boolean             @default(true)
  hasStickerIssues    Boolean             @default(false)
  
  // Customization & Spares (if built)
  sparePartsIncluded  Boolean             @default(true)
  actionBaseIncluded  Boolean             @default(false)
  
  createdAt           DateTime            @default(now())
  updatedAt           DateTime            @updatedAt
}
```

---

## 4. Automatic Kit Catalog Pre-fill & Seller Experience

When a user selects `Plamo & Hobby Kits` in Step 1 of the Khajiit Listing Wizard:

```
[ Step 1: Category Selection ]
Main Category: [ Plamo & Hobby Kits ]
Subcategory:   [ Gunpla (Gundam Plastic Models) ] 
               (Options: Gunpla, Anime Mecha, Pokepla & Miniatures, Scale Military/Cars, Figures)

[ Step 2: Instant Kit Autocomplete ]
Search Kit:   [ Aerial                  ]
Matches:
  1. HG 1/144 Gundam Aerial (Witch from Mercury) - Bandai Spirits (MSRP: ¥1,430)
  2. Full Mechanics 1/100 Gundam Aerial - Bandai Spirits (MSRP: ¥4,180)
  3. SDEX Gundam Aerial - Bandai Spirits (MSRP: ¥660)
  4. HG 1/144 Gundam Aerial Rebuild - Bandai Spirits (MSRP: ¥1,870)
  [ + Not in catalog? Enter kit details manually ]
```

### Auto-Filled Fields:
Upon selecting a match (e.g. *HG 1/144 Gundam Aerial*):
- `Grade`: **HG (High Grade)**
- `Scale`: **1/144**
- `Franchise`: **Mobile Suit Gundam (The Witch from Mercury)**
- `Manufacturer`: **Bandai Spirits**
- `MSRP`: **¥1,430**
- `Official Box Art Thumbnail`: Attached as visual reference preview.

The seller only needs to fill in:
1. **Kit Condition:** (MISB vs. Open Box Runners Sealed vs. Built)
2. **Box Condition:** (Mint / Minor Corner Scuff / Dented)
3. **Price in INR** (With automated fair price comparison)
4. **Exchange:** (Local Pickup / Courier with Bubble Wrap)

---

## 5. Pricing & Fair Market Benchmark (JPY MSRP $\to$ Landed INR)

One of the largest pain points in the Indian Plamo community is **untransparent import pricing**. Unlike consumer electronics which have local Indian MRPs, Gunpla is imported.

### The Pricing Benchmark Formula:
Every Bandai kit has its official Japanese Yen retail price ($MSRP_{\text{JPY}}$) encoded in its barcode.

$$\text{Standard Landed Value (INR)} = MSRP_{\text{JPY}} \times R_{\text{JPY}\to\text{INR}} \times (1 + T_{\text{customs+shipping}})$$

In India:
- $R_{\text{JPY}\to\text{INR}} \approx 0.55\text{ to }0.60$
- Typical import landed factor ($T_{\text{customs+shipping}}$) is approximately $1.6\times \text{to } 2.0\times$ for retail shipments.
- **Fair Market Standard:** Standard retail Gunpla in India typically sells between **₹0.90 to ₹1.15 per Yen of MSRP** (e.g. a ¥1,430 kit retails locally at ₹1,350 – ₹1,650).
- **P-Bandai Web Exclusives:** Web-order exclusives or out-of-print kits carry an authenticity rarity multiplier of $1.3\times \text{to } 1.8\times$.

### Transparent Valuation Tiers for Plamo:
| Tier | Condition Check | Pricing Rule | Example (¥2,000 HG Kit) |
| :--- | :--- | :--- | :--- |
| **`Great Deal`** | Runners Sealed in Bags | $< ₹0.85$ per JPY of MSRP | Listing price: **₹1,400** (below standard import landing cost) |
| **`Fair Price`** | Runners Sealed in Bags | $₹0.85 – ₹1.15$ per JPY of MSRP | Listing price: **₹1,900** |
| **`Overpriced`** | Standard Retail Kit | $> ₹1.30$ per JPY of MSRP | Listing price: **₹2,800** (flagged as scalper pricing) |
| **P-Bandai Exemption** | Official P-Bandai tag | Scarcity adjusted benchmark | Clearly tagged: *"Premium Bandai Limited Web Run"* |

---

## 6. Anti-Scam & Trust Safeguards for Hobbyists

1. **Bootleg / Counterfeit Detection:**
   - Scammers often buy Chinese knockoffs (Daban/GaoGao) for ₹600 and resell them in Bandai boxes for ₹2,500.
   - Form requires photographic proof of the **Bandai Spirits Blue/Red Logo** on the lower-left corner of the box or runner tags.
   - Separate filter for collectors specifically seeking third-party kits (`Origin: Third-Party Original / Bootleg`).

2. **Runner Bag Seal Verification:**
   - For unbuilt kits, sellers must check: *"Are all plastic runner sleeves factory sealed?"*
   - Protects buyers from missing polycaps, lost V-fins, or missing water-slide decal sheets.

3. **Box Damage Disclosure:**
   - Serious collectors care deeply about box integrity. The listing requires selecting Box Grade:
     - `Mint (Collector Grade)`
     - `Minor Shelf Wear / Edge Whiteness`
     - `Dented / Crushed Corners`

4. **Split-Option Backlog Sales:**
   - Sellers frequently post 3–6 kits in a single post (e.g., *"Corey's Backlog sale"* in the Discord screenshot).
   - Khajiit's `PurchaseOption` enables the seller to list:
     - Option 1: Entire Backlog (3 kits) — ₹5,500 (Discounted)
     - Option 2: HG Gundam Aerial Only — ₹1,600
     - Option 3: HG Gundam Calibarn Only — ₹2,200
     - Option 4: LBX Elysion Only — ₹1,900
   - Buyers can place verified bids on specific kits without having to buy the entire lot.

---

## 7. Catalog Seeding Strategy (Where to Get the Data)

To pre-fill the database with 5,000+ popular model kits:

1. **Primary Open Datasets & Scrapers:**
   - **Bandai Hobby Site Catalog:** Official public specs, JAN barcodes, and JPY MSRPs for all Gunpla, 30MM, 30MS, and Pokepla.
   - **HobbySearch (1999.co.jp/eng):** Comprehensive English database containing kit weights, runner bag counts, box dimensions, scales, and high-res box art.
   - **Dalong.net:** The definitive global archive of Gunpla manual scans and runner layouts.
   - **MyFigureCollection (MFC):** API database for Kotobukiya (Megami Device, Frame Arms Girl) and Good Smile Moderoid kits.

2. **Seed Priority (Phase 1 Catalog):**
   - **Gunpla High Grade (HG) 1/144:** (Universal Century, Witch from Mercury, SEED/SEED Freedom, 00, IBO).
   - **Real Grade (RG) 1/144:** All 40+ releases.
   - **Master Grade (MG) 1/100:** Top 100 popular kits (Barbatos, Freedom 2.0, Nu Ver.Ka, Sazabi Ver.Ka).
   - **30 Minute Missions (30MM) & 30 Minute Sisters (30MS).**
   - **Pokepla (Pokemon Plastic Models):** High volume in India among younger collectors.

---

## 8. Summary of Benefits to Khajiit

1. **High Transaction Velocity & Loyal Enthusiast Base:** Plamo collectors constantly trade and recycle their backlog to fund new pre-orders.
2. **Clear Defensibility:** Generic marketplaces (OLX, Quikr, Facebook Marketplace) have zero concept of kit grades, runner seals, or JPY MSRP conversions.
3. **Direct Solution to Discord's Friction:** Gives communities like *"Plamo India"* a dedicated, searchable, structured home with local pickup and safe escrow-ready bidding.
