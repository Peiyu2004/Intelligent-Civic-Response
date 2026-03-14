import requests
import base64
import json
from pathlib import Path

API_KEY = "sk-ZriJfUkoMrCewClKw62lAQ"
API_URL = "https://aiworkshopapi.flexinfra.com.my/v1/chat/completions"

#prompt
DAMAGE_PROMPT = """You are a municipal infrastructure damage assessment AI working for a city government in Malaysia.

A citizen has submitted a photo of possible infrastructure damage.

STRICT OUTPUT RULES — YOU MUST FOLLOW THESE:
1. Respond with ONLY a raw JSON object
2. Do NOT write ```json or ``` anywhere
3. Do NOT write any sentence before or after the JSON
4. Start your response with { and end with }
5. Do NOT add any explanation or greeting

====================
STEP 1 — IDENTIFY DAMAGE CATEGORY
====================
Choose the CLOSEST matching category based on what you see in the photo:

- pothole
  = A hole or depression that goes THROUGH the road surface, exposing the layers underneath.
  = Look for: circular or irregular hole, crumbling edges, exposed gravel or soil at the bottom, water pooling INSIDE the hole.
  = Do NOT use if the surface is cracked but still flat and connected — use cracked_pavement instead.
  = ROAD BLOCKING RULE: If the pothole covers more than half the road width or is on a highway → add +2 to severity.
  = Do NOT use for circular or round crack patterns — a circle-shaped crack on a flat surface is still cracked_pavement, NOT a pothole. A pothole must have depth and missing material.
  = If BOTH a pothole AND cracks are visible in the same photo → use pothole, as it is the more dangerous damage. Mention both in the description.

- broken_streetlight
  = A street light that is visibly damaged, leaning, has broken glass, missing bulb cover, or has fallen over.
  = Look for: bent pole, shattered lamp, dark unlit area at night.
  = ROAD BLOCKING RULE: If the pole has fallen ACROSS the road and is blocking traffic → score must be 9 or 10. If pole is fallen at roadside only → score 7–8.
  = A streetlight pole can look like a bent metal pole, bar or column — it does not have to still look like a lamp post.
  = Look for: a tall metal pole or column that is bent, leaning heavily or lying on the ground, even if the lamp head is broken off or missing. The pole itself counts as a broken streetlight even without the lamp.
  = A seriously bent or fallen streetlight pole lying on grass, road or pavement IS broken_streetlight — do NOT classify it as other just because it looks like a metal bar.
  = KEY RULE: If you see a tall metal pole that is bent or fallen near a road or pavement — even if the lamp is missing or broken off — it is broken_streetlight, NOT other.
  = CLUE: Streetlight poles are usually round or cylindrical metal tubes, grey or black, and are taller than a person. They are found along roads, pavements and car parks.

- cracked_pavement
  = Use this for ANY road or pavement surface that is cracked, split, broken or fractured — including serious and severe cracks.
  = This includes: small hairline cracks, wide cracks, deep cracks, spider web cracks, raised or sunken slabs, severely broken asphalt that has not yet formed a hole.
  = USE cracked_pavement even when cracks are very serious, very wide, or very deep — as long as the surface is still present and connected, it is cracked_pavement NOT pothole.
  = Look for: irregular jagged lines, random crack directions, uneven widths, broken edges, pieces breaking off but still on the surface.
  = Do NOT use for brick or cobblestone roads — straight uniform lines between bricks are joints, not cracks.
  = Do NOT use for broken or damaged road dividers, bollards or barriers — those are metal/concrete structures, not pavement → use other instead.
  = KEY RULE: If the road surface is still there but broken → cracked_pavement. Only use pothole if there is a physical hole where material is completely gone.
  = ROAD BLOCKING RULE: If cracks cover the full road width and make it dangerous to drive → add +2 to severity.
  = Do NOT use for brick or cobblestone roads even if the markings on them are faded or worn — if the road is made of bricks or stones and the markings are faded → use worn_road_marking instead.
  = If BOTH cracks AND a pothole are visible in the same photo → use pothole instead, not cracked_pavement.

- flooded_drain
  = Blocked drainage causing water to pool or flood on road or walkway.
  = Look for: standing water, blocked drain grates, submerged road markings.
  = ROAD BLOCKING RULE: If flooding covers the entire road and makes it impassable → score must be 9 or 10. If flooding is partial → score 6–8.

- fallen_sign
  = A traffic sign, road sign or directional signage that is fallen, bent, missing or unreadable.
  = Look for: sign lying on ground, bent post, blank/missing sign face.
  = Severity guide:
      1–3 = Sign slightly tilted but still readable, fallen at road side away from traffic
      4–5 = Sign fully fallen but at road side, NOT blocking traffic — MAXIMUM score of 5 if roadside only
      7–8 = Sign fallen and blocking part of the road OR missing at a busy junction
      9–10 = Sign blocking entire road OR critical safety sign (stop, junction warning) completely missing
  = STRICT RULE: If the sign is fallen at the ROAD SIDE and NOT blocking any traffic lane, your score MUST NOT exceed 5.
  = KEY RULE: A sign fallen at the road SIDE → maximum score 5. A sign fallen ON the road blocking traffic → score 7 or above.

- worn_road_marking
  = Faded or worn road markings ONLY — use this when painted lines, arrows, zebra crossings, or lane markings are no longer clearly visible.
  = ALSO use this for brick roads, cobblestone roads, or paved stone roads where the painted markings on top have faded or worn away — the brick texture is NOT cracked_pavement.
  = The road surface underneath must be intact — no holes or structural damage.
  = Do NOT use if cracks or holes are present (use cracked_pavement or pothole instead).
  = KEY RULE: If you see a brick or stone road with faded paint markings → this is worn_road_marking, NOT cracked_pavement. The lines between bricks are joints, not cracks.
  = ROAD BLOCKING RULE: Worn road markings do not block roads — maximum score is 6 regardless of severity.
- vandalism
  = ONLY use this when damage is clearly caused by deliberate and intentional human action — NOT accidents, wear, or weather.
  = Common vandalism types:
      1. GRAFFITI — spray paint, marker or paint written/drawn on walls, bridges, bus stops, road signs, drain walls, or any public surface
      2. SMASHED GLASS — deliberately broken glass panels on bus shelters, phone booths, or public notice boards
      3. BROKEN PUBLIC FURNITURE — benches, bins, or public seats that have been kicked, beaten or intentionally destroyed (look for impact marks, not rust or wear)
      4. DEFACED SIGNS — road signs or public signage that have been scratched, painted over, stickered, or deliberately made unreadable
      5. BURNT PROPERTY — scorch marks or fire damage on public infrastructure caused deliberately
  = Look for: spray paint text or drawings, shattered glass with impact centre point, deliberate scratch marks, intentional destruction patterns.
  = STRICT DO NOT USE rules — these are NOT vandalism, use other categories instead:
      - Broken road dividers, bollards or guardrails → use other
      - Fallen or bent streetlight poles → use broken_streetlight
      - Cracked or broken pavement → use cracked_pavement
      - Rust, moss, or weather wear on any structure → use other
      - Damaged signs from accidents or storms → use fallen_sign
      - Structural collapse or deterioration → use other
      - Anything broken by accident, weather, or natural wear → use other
      - Bent or damaged metal railings, guardrails, bike racks or barriers → use other
  = KEY RULE: If you cannot clearly see deliberate human intent (spray paint, smashing, scratching), do NOT use vandalism.
  = ROAD BLOCKING RULE: If vandalism has resulted in debris or broken material blocking the road → increase severity by +2.

- debris
  = Foreign objects blocking or littering the road or walkway.
  = Look for: fallen tree branches, construction waste, garbage, rocks on road.
  = ROAD BLOCKING RULE: This is the most important factor for debris severity:
      - Debris at road SIDE, not blocking traffic → score 1–4
      - Debris blocking ONE lane, vehicles can still pass → score 5–6
      - Debris blocking MOST of the road, vehicles must slow or stop → score 7–8
      - Debris blocking ENTIRE road, completely impassable → score 9–10

- other
  = Damage is clearly visible but does not match any category above.
  = Use this for: broken road dividers, damaged guardrails, bent metal railings, broken bollards, damaged bike racks, missing manhole covers, collapsed retaining walls, sinkholes, or any structural damage not listed above — INCLUDING broken concrete or metal dividers on or beside the road.
  = KEY RULE: When you see bent or damaged metal structures that are NOT a streetlight pole or road sign → use other.
  = ROAD BLOCKING RULE: If the damaged structure is blocking or partially blocking the road → add +2 to severity. If it is at the roadside only → score normally.

====================
MULTIPLE DAMAGE RULE
====================
If you can see MORE THAN ONE type of damage in the same photo, follow these rules:

1. CATEGORIZE under the MOST DANGEROUS damage type using this priority order (highest to lowest):
   1st — flooded_drain (if flooding is blocking the road)
   2nd — broken_streetlight (if pole is fallen across road or wires exposed)
   3rd — pothole (if hole is large or blocking road)
   4th — debris (if blocking most or entire road)
   5th — fallen_sign (if blocking road)
   6th — cracked_pavement (serious cracks covering road)
   7th — other (structural damage blocking road)
   8th — worn_road_marking
   9th — vandalism
   10th — fallen_sign (roadside only)
   11th — debris (roadside only)

2. USE the severity score of the MOST DANGEROUS damage, then add +1 for each additional damage type visible (maximum score still capped at 10).

3. DESCRIBE ALL visible damage in the description field — do not only mention the main category.
   Example: "Large pothole on main road with surrounding cracks and a fallen road sign at the roadside."

4. RECOMMENDED ACTION must address ALL visible damage types, not just the main one.
   Example: "Dispatch road crew to patch pothole and repair surrounding cracks; also send crew to reinstall fallen road sign."

EXAMPLE SCENARIOS:
- Pothole + cracks → categorize as pothole, score = pothole score + 1, describe both
- Flooded drain + debris blocking road → categorize as flooded_drain, score = flood score + 1, describe both
- Fallen sign + cracked pavement + worn markings → categorize as cracked_pavement, score = crack score + 2, describe all three
- Broken streetlight + vandalism graffiti → categorize as broken_streetlight, score = streetlight score + 1, describe both

====================
STEP 2 — ESTIMATE SEVERITY SCORE (1–10)
====================
Give an INTEGER score from 1 to 10 based on BOTH the visual severity AND the safety risk:

SCORE 1–3 (LOW) — Minor, cosmetic, no immediate danger:
- Small surface crack less than 1cm wide
- Faded road markings
- Minor graffiti on a wall
- Small pothole at road edge, less than 5cm wide
- Slightly bent sign that is still readable

SCORE 4–6 (MEDIUM) — Moderate damage, needs repair within weeks:
- Pothole 5–15cm wide in non-main road
- Crack wider than 1cm across pavement
- Streetlight visibly damaged but pole still standing
- Partial drain blockage with minor pooling
- Sign that is tilted but partially readable

SCORE 7–8 (HIGH) — Serious damage, needs repair within days:
- Pothole larger than 30cm wide or deeper than 5cm
- Large crack spanning full width of pavement
- Streetlight completely broken or fallen
- Significant flooding covering road surface
- Sign completely fallen or missing on main road

SCORE 9–10 (CRITICAL) — Immediate danger to public safety, fix TODAY:
- Pothole larger than 30cm wide or on highway
- Collapsed road section
- Exposed electrical wires from streetlight
- Severe flooding blocking entire road
- Multiple hazards visible in one photo
- Sign blocking the entire road

====================
STEP 3 — ASSESS YOUR CONFIDENCE
====================
Rate how clearly you can see the damage:

- high   = Image is clear, damage is obvious and easily identifiable
- medium = Image is slightly blurry or damage is partially visible
- low    = Image is very blurry, dark, or damage is hard to identify clearly

====================
STEP 4 — DETERMINE URGENCY
====================
Base urgency strictly on severity score:
- Score 9–10 = immediate
- Score 7–8  = high
- Score 4–6  = medium
- Score 1–3  = low

====================
OUTPUT FORMAT
====================
Return ONLY this JSON with no extra text:
{
  "damage_type": "<category from list above>",
  "severity_score": <integer 1–10>,
  "confidence": "<high / medium / low>",
  "description": "<one clear sentence describing exactly what you see>",
  "urgency": "<immediate / high / medium / low>",
  "recommended_action": "<one sentence telling the repair crew exactly what to do>"
}

SPECIAL CASE — If the photo does NOT show any infrastructure damage:
{
  "damage_type": "other",
  "severity_score": 1,
  "confidence": "high",
  "description": "No infrastructure damage detected in this image.",
  "urgency": "low",
  "recommended_action": "No action required. Please resubmit with a clearer photo of the damage."
}"""

TYPE_WEIGHT = {
    "flooded_drain":       0,   # immediate public danger
    "broken_streetlight": +1,   # safety risk especially at night
    "fallen_sign":         0,   # traffic safety risk
    "worn_road_marking":  +1,   # general road hazard
    "pothole":             0,   # neutral, scored by size
    "debris":             +1,   # neutral, scored by severity
    "cracked_pavement":   -1,   # usually less urgent
    "vandalism":          -1,   # usually cosmetic
    "other":               0    # neutral
}

CONFIDENCE_ADJUSTMENT = {
    "high":    0,   # AI is sure — keep score as is
    "medium": -1,   # AI is unsure — slightly reduce
    "low":    -2    # AI is very unsure — reduce more
}


def clean_response(text: str) -> str:
    """Clean AI response to extract pure JSON no matter what the AI returns"""

    text = text.strip()

    # Remove markdown code fences
    if "```" in text:
        lines = text.split("\n")
        clean_lines = [l for l in lines if not l.strip().startswith("```")]
        text = "\n".join(clean_lines).strip()

    # Remove "json" word at start
    if text.lower().startswith("json"):
        text = text[4:].strip()

    # Extract just the JSON object (finds first { to last })
    start = text.find("{")
    end = text.rfind("}") + 1
    if start != -1 and end > start:
        text = text[start:end]

    return text.strip()


def apply_severity_formula(result: dict) -> dict:
    """
    SEVERITY SCORE FORMULA
    ======================
    Final Score = AI Base Score + Type Weight + Confidence Adjustment
    Then clamped between 1 and 10

    Example:
    AI gives pothole score 7
    Type weight for pothole = 0
    Confidence = medium → adjustment = -1
    Final score = 7 + 0 + (-1) = 6

    Example 2:
    AI gives flooded_drain score 6
    Type weight for flooded_drain = +2
    Confidence = high → adjustment = 0
    Final score = 6 + 2 + 0 = 8
    """

    base_score = result.get("severity_score", 5)
    damage_type = result.get("damage_type", "other")
    confidence = result.get("confidence", "high")

    # Get type weight
    type_weight = TYPE_WEIGHT.get(damage_type, 0)

    # Get confidence adjustment
    conf_adjustment = CONFIDENCE_ADJUSTMENT.get(confidence, 0)

    # Calculate final score
    final_score = base_score + type_weight + conf_adjustment

    # Clamp between 1 and 10
    final_score = max(1, min(10, final_score))

    # Save breakdown for transparency
    result["severity_score"] = final_score
    result["severity_breakdown"] = {
        "ai_base_score": base_score,
        "type_weight": type_weight,
        "confidence_adjustment": conf_adjustment,
        "final_score": final_score
    }

    return result


def validate_and_fix(result: dict) -> dict:
    """Validate all fields and auto-fix any wrong values from AI"""

    valid_damage_types = [
        "pothole", "broken_streetlight", "cracked_pavement",
        "flooded_drain", "fallen_sign", "worn_road_marking",
        "vandalism", "debris", "other"
    ]
    valid_urgency = ["immediate", "high", "medium", "low"]
    valid_confidence = ["high", "medium", "low"]

    # Fix damage_type
    if result.get("damage_type") not in valid_damage_types:
        # Try to match common variations
        raw = str(result.get("damage_type", "")).lower()
        if "pothole" in raw or "hole" in raw:
            result["damage_type"] = "pothole"
        elif "light" in raw or "lamp" in raw or "streetlight" in raw:
            result["damage_type"] = "broken_streetlight"
        elif "crack" in raw or "pavement" in raw:
            result["damage_type"] = "cracked_pavement"
        elif "flood" in raw or "drain" in raw or "water" in raw:
            result["damage_type"] = "flooded_drain"
        elif "sign" in raw or "signage" in raw:
            result["damage_type"] = "fallen_sign"
        elif "road" in raw or "damage" in raw:
            result["damage_type"] = "worn_road_marking"
        elif "vandal" in raw or "graffiti" in raw:
            result["damage_type"] = "vandalism"
        elif "debris" in raw or "block" in raw:
            result["damage_type"] = "debris"
        else:
            result["damage_type"] = "other"

    # Fix severity_score range
    try:
        score = int(result.get("severity_score", 5))
        result["severity_score"] = max(1, min(10, score))
    except:
        result["severity_score"] = 5

    # Fix confidence
    if result.get("confidence") not in valid_confidence:
        result["confidence"] = "medium"

    # Apply severity formula (type weighting + confidence adjustment)
    result = apply_severity_formula(result)

    # Fix urgency based on FINAL score
    final_score = result["severity_score"]
    if final_score >= 9:
        result["urgency"] = "immediate"
    elif final_score >= 7:
        result["urgency"] = "high"
    elif final_score >= 4:
        result["urgency"] = "medium"
    else:
        result["urgency"] = "low"

    # Fix missing description
    if not result.get("description"):
        result["description"] = "Infrastructure damage detected."

    # Fix missing recommended_action
    if not result.get("recommended_action"):
        result["recommended_action"] = "Inspect and repair as needed."

    return result


def analyze_damage(image_path: str, location: str = "Unknown Location") -> dict:
    """Send image to AI and get damage analysis back"""

    print(f"📸 Sending image to AI for analysis...")

    # Read image and convert to base64
    image_bytes = Path(image_path).read_bytes()
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")

    # Detect image type
    suffix = Path(image_path).suffix.lower()
    mime_map = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp"
    }
    mime_type = mime_map.get(suffix, "image/jpeg")

    # ── FlexToken API call ────────────────────────────────────────────────
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    payload = {
        "model": "qwen2.5",
        "max_tokens": 1000,
        "temperature": 0.1,
        "top_p": 0.9,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:{mime_type};base64,{image_b64}"}
                    },
                    {
                        "type": "text",
                        "text": DAMAGE_PROMPT
                    }
                ]
            }
        ]
    }

    response = requests.post(API_URL, headers=headers, json=payload)
    response.raise_for_status()
    response_data = response.json()

    # Extract text from FlexToken response
    response_text = clean_response(response_data["choices"][0]["message"]["content"])
    result = json.loads(response_text)

    # Validate and apply full severity formula
    result = validate_and_fix(result)

    result["location"] = location
    result["image_analyzed"] = image_path

    return result


def generate_work_order(analysis: dict, report_id: str) -> dict:
    """Turn AI analysis into a formatted Work Order"""

    urgency_to_priority = {
        "immediate": 1,
        "high":      2,
        "medium":    3,
        "low":       4
    }

    urgency_to_days = {
        "immediate": "TODAY - Within hours",
        "high":      "Within 3 days",
        "medium":    "Within 2-3 weeks",
        "low":       "Within 1-2 months"
    }

    urgency_to_color = {
        "immediate": "RED",
        "high":      "RED",
        "medium":    "ORANGE",
        "low":       "GREEN"
    }

    work_order = {
        "WORK_ORDER_ID":  report_id,
        "STATUS":         "OPEN",
        "PRIORITY":       urgency_to_priority.get(analysis["urgency"], 3),
        "URGENCY":        analysis["urgency"].upper(),
        "COLOR_INDICATOR": urgency_to_color.get(analysis["urgency"], "GREEN"),
        "DEADLINE":       urgency_to_days.get(analysis["urgency"], "Within 2-3 weeks"),
        "DAMAGE_TYPE":    analysis["damage_type"].replace("_", " ").upper(),
        "SEVERITY_SCORE": f"{analysis['severity_score']} / 10",
        "CONFIDENCE":     analysis.get("confidence", "high").upper(),
        "LOCATION":       analysis["location"],
        "DESCRIPTION":    analysis["description"],
        "ACTION_REQUIRED": analysis["recommended_action"],
        "IMAGE":          analysis["image_analyzed"]
    }

    # Add severity breakdown if available
    if "severity_breakdown" in analysis:
        work_order["SEVERITY_BREAKDOWN"] = analysis["severity_breakdown"]

    return work_order


def process_citizen_report(image_path: str, location: str, report_id: str = "WO-001") -> dict:
    """MAIN FUNCTION — full pipeline: Photo -> AI -> Severity Formula -> Work Order"""

    print(f"\n{'='*55}")
    print(f"🏙️  INTELLIGENT CIVIC RESPONSE SYSTEM — CiviScan")
    print(f"{'='*55}")
    print(f"📍 Location : {location}")
    print(f"🖼️  Image    : {image_path}")
    print(f"{'='*55}\n")

    # Step 1: AI analyzes the image
    analysis = analyze_damage(image_path, location)

    # Step 2: Print analysis summary
    breakdown = analysis.get("severity_breakdown", {})
    print(f"✅ AI Analysis Complete!")
    print(f"   Damage Type  : {analysis['damage_type']}")
    print(f"   Confidence   : {analysis.get('confidence', 'N/A').upper()}")
    print(f"   ─────────────────────────────")
    print(f"   Severity Breakdown:")
    print(f"     AI Base Score        : {breakdown.get('ai_base_score', 'N/A')}")
    print(f"     Type Weight          : {breakdown.get('type_weight', 'N/A'):+d}")
    print(f"     Confidence Adjustment: {breakdown.get('confidence_adjustment', 'N/A'):+d}")
    print(f"     ─────────────────────")
    print(f"     FINAL Score          : {breakdown.get('final_score', analysis['severity_score'])} / 10")
    print(f"   ─────────────────────────────")
    print(f"   Urgency      : {analysis['urgency'].upper()}")

    # Step 3: Generate Work Order
    work_order = generate_work_order(analysis, report_id)

    print(f"\n📋 Work Order Generated!")
    print(f"   ID             : {work_order['WORK_ORDER_ID']}")
    print(f"   Priority Level : {work_order['PRIORITY']} — {work_order['URGENCY']}")
    print(f"   Color          : {work_order['COLOR_INDICATOR']}")
    print(f"   Deadline       : {work_order['DEADLINE']}")

    final_output = {
        "ai_analysis": analysis,
        "work_order": work_order
    }

    print(f"\n{'='*55}")
    print("📄 FULL JSON OUTPUT:")
    print('='*55)
    print(json.dumps(final_output, indent=2))

    return final_output


# ============================================================
# MOCK TEST — use this when API quota runs out
# Change "mock_test()" and comment out "process_citizen_report"
# ============================================================
def mock_test():
    print("\n🧪 RUNNING MOCK TEST (no API needed)\n")

    fake_analysis = {
        "damage_type": "flooded_drain",
        "severity_score": 6,
        "confidence": "high",
        "description": "Blocked drain causing significant water pooling across the road surface.",
        "urgency": "medium",
        "recommended_action": "Clear blocked drain grates and pump standing water immediately.",
        "location": "Jalan Bukit Jalil, KL",
        "image_analyzed": "test_image.jpg"
    }

    fake_analysis = validate_and_fix(fake_analysis)
    work_order = generate_work_order(fake_analysis, "WO-2024-MOCK")

    final_output = {
        "ai_analysis": fake_analysis,
        "work_order": work_order
    }

    print(json.dumps(final_output, indent=2))
    print("\n✅ Mock test complete! This is what real output will look like.")


# ============================================================
# RUN — switch between OPTION A (real) and OPTION B (mock)
# ============================================================
if __name__ == "__main__":

    import sys
    import os
    import random

    IMAGE_FOLDER = "test_images"

    # If image passed as argument — use it
    if len(sys.argv) > 1:
        image    = sys.argv[1]
        location = sys.argv[2] if len(sys.argv) > 2 else "Jalan Bukit Jalil, KL"

    # Otherwise — pick a random image from test_images folder
    else:
        all_images = [
            f for f in os.listdir(IMAGE_FOLDER)
            if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))
        ]
        chosen = random.choice(all_images)
        image    = os.path.join(IMAGE_FOLDER, chosen)
        location = "Jalan Bukit Jalil, KL"
        print(f"🎲 Randomly selected image: {chosen}")

    # OPTION A: Real AI — use when quota is available
    result = process_citizen_report(
        image_path=image,
        location=location,
        report_id="WO-2024-001"
    )

    # OPTION B: Mock test — use when quota runs out
    # Add # in front of all OPTION A lines above, then remove # below
    # mock_test()