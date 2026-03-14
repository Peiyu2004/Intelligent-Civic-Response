# ── OPTION A: Google Gemini (current) — uncomment if FlexToken = Gemini ──
from google import genai
from google.genai import types

# ── OPTION B: OpenAI — uncomment if FlexToken = OpenAI ───────────────────
# from openai import OpenAI

# ── OPTION C: Anthropic — uncomment if FlexToken = Anthropic ─────────────
# import anthropic
import json
from pathlib import Path

API_KEY = "test"

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
Choose the CLOSEST matching category based on what you see in the photo.
Read each description carefully before deciding. If two categories seem possible, pick the one that matches the MOST VISIBLE damage in the photo.

- pothole
  = A hole or depression punched into the road surface, exposing the layers underneath.
  = Common in Malaysian roads after heavy rain weakens the asphalt base.
  = Look for: circular or irregular-shaped hole, crumbling or broken asphalt edges around the hole, exposed gravel or soil underneath, water pooling inside the hole.
  = Do NOT use for surface cracks without a hole (use cracked_pavement instead).
  = Severity guide:
      1–3 = Small hole under 5cm wide at the road edge, vehicles can easily avoid it
      4–6 = Medium hole 5–15cm wide on a residential or side road
      7–8 = Large hole over 15cm wide or deeper than 5cm, hard to avoid
      9–10 = Massive hole over 30cm wide, on a highway or main road, or multiple potholes in one area

- broken_streetlight
  = A street lamp or light pole that is visibly damaged and no longer functioning properly or safely.
  = Especially dangerous at night when it leaves roads completely dark.
  = Look for: bent or leaning pole, shattered lamp cover or bulb, light that is off in a normally lit area, pole that has fallen onto the road or pavement, burn marks or damage at the base.
  = Severity guide:
      1–3 = Light flickering or slightly tilted but still mostly working
      4–6 = Light visibly damaged, bulb broken, but pole still standing upright
      7–8 = Pole completely fallen or light unit fully destroyed, area is dark
      9–10 = Fallen pole blocking road OR exposed electrical wires visible — electrocution risk

- cracked_pavement
  = Visible splitting, fracturing or breaking of the road or walkway surface without a hole forming.
  = Look for: straight or branching line cracks across the surface, spider web or star-shaped crack patterns, sections of pavement that are raised, sunken or uneven, broken edges along the road.
  = Do NOT use if there is an actual hole (use pothole instead).
  = Severity guide:
      1–3 = Hairline crack under 1cm wide, surface still smooth and safe to walk or drive on
      4–6 = Crack wider than 1cm, raised edges that could cause trips or tyre damage
      7–8 = Large crack spanning the full width of pavement or road, severe uneven surface
      9–10 = Fully collapsed or sunken road section, structural failure visible

- flooded_drain
  = A blocked or overflowing drain that is causing water to pool or flood the surrounding road or walkway.
  = Very common in Malaysia during and after heavy rain.
  = Look for: standing or flowing water on road surface, drain grates blocked with leaves, mud or rubbish, submerged road markings or curbs, water flowing onto pedestrian areas.
  = Severity guide:
      1–3 = Minor water pooling only at the drain itself, road still passable
      4–6 = Partial blockage, water spreading onto road edge but one lane still clear
      7–8 = Flooding covers most of the road surface, vehicles slowing down or diverting
      9–10 = Entire road blocked by floodwater, completely impassable, risk of vehicles being swept

- fallen_sign
  = A road sign, traffic sign or directional sign that is no longer standing properly and cannot be clearly read by drivers or pedestrians.
  = Look for: sign lying flat on the ground, post snapped or bent at the base, sign face missing or turned the wrong way, sign that is completely unreadable from a normal driving distance.
  = Severity guide:
      1–3 = Sign slightly tilted but text still fully readable by drivers
      4–6 = Sign leaning badly or partially fallen, text only partly visible
      7–8 = Sign completely fallen or missing on a main road or busy junction
      9–10 = Critical safety sign (stop sign, junction warning, speed limit) missing at a dangerous location

- worn_road_marking
  = Road surface paint or markings that have faded or worn away so much that they are no longer clearly visible.
  = The road surface underneath must be INTACT — no cracks or holes.
  = Look for: lane dividing lines that are barely visible, zebra crossing stripes that have mostly disappeared, directional arrows on the road that are faded, yellow or white lines at junctions that are gone.
  = Do NOT use if cracks or holes are present — use cracked_pavement or pothole instead.
  = Severity guide:
      1–3 = Markings slightly faded but still clearly visible in daylight
      4–6 = Markings mostly faded, hard to see clearly especially at night or in rain
      7–8 = Markings almost completely gone, drivers cannot see lane boundaries
      9–10 = All markings invisible at a dangerous junction, pedestrian crossing or highway lane merge

- vandalism
  = Deliberate and intentional damage or defacement of public infrastructure or property.
  = Look for: graffiti or spray paint on walls, bus stops, bridges or road signs, smashed or deliberately broken fixtures like benches or bins, shattered glass from deliberately broken panels, scratched or defaced public property.
  = Severity guide:
      1–3 = Graffiti or minor marks on a wall or surface, purely cosmetic, nothing is broken
      4–6 = Fixture or equipment damaged but still usable, moderate cosmetic damage
      7–8 = Public fixture completely destroyed or unusable due to deliberate damage
      9–10 = Vandalism that creates a direct safety hazard, such as smashed glass on a walkway or destroyed safety barriers

- debris
  = Foreign objects or waste materials that have landed on or are blocking a road, walkway or drain.
  = Look for: fallen tree branches or whole trees across the road, piles of construction waste or sand on the road, large rocks or boulders on the road surface, bags of rubbish blocking a drain or walkway, scattered broken materials from a vehicle or building.
  = Severity guide:
      1–3 = Small litter or minor debris at the road edge, not blocking traffic flow
      4–6 = Debris partially blocking one lane, vehicles can still pass with care
      7–8 = Large debris blocking a full lane or footpath, forcing vehicles to swerve
      9–10 = Road completely blocked, or sharp/dangerous debris scattered across the full road surface

- other
  = Damage is clearly visible in the photo but does not match any of the categories above.
  = Use this for: missing or broken manhole covers, collapsed retaining walls, damaged road dividers or bollards, broken pedestrian guardrails, sinkholes, or any other infrastructure damage not listed.
  = Look for: anything that is clearly broken, missing or damaged that belongs to public infrastructure but does not fit the descriptions above.
  = Severity guide:
      1–3 = Minor visible damage with no immediate safety risk
      4–6 = Moderate damage that needs attention within a few weeks
      7–8 = Serious structural damage that needs repair within days
      9–10 = Immediate danger to public safety, must be fixed today

====================
STEP 2 — ESTIMATE SEVERITY SCORE (1–10)
====================
Give an INTEGER score from 1 to 10 based on BOTH the visual severity AND the safety risk.
Use the severity guide for each category in STEP 1 above as your primary reference.
Also use these general rules:

SCORE 1–3 (LOW) — Minor, cosmetic, no immediate danger:
- Damage is visible but poses no risk to vehicles or pedestrians
- Can be scheduled for routine maintenance

SCORE 4–6 (MEDIUM) — Moderate damage, needs repair within weeks:
- Damage is noticeable and could cause minor injury or vehicle damage if ignored
- Should be added to the next maintenance schedule

SCORE 7–8 (HIGH) — Serious damage, needs repair within days:
- Damage poses a real risk of injury, accident or property damage
- Repair crew should be dispatched within 1–3 days

SCORE 9–10 (CRITICAL) — Immediate danger to public safety, fix TODAY:
- Damage is an active hazard — someone could be seriously injured right now
- Repair crew must respond immediately
- Examples: exposed electrical wires, road completely blocked, massive pothole on highway, missing manhole cover on busy road, multiple hazards visible in one photo

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
    "flooded_drain":      +2,   # immediate public danger
    "broken_streetlight": +1,   # safety risk especially at night
    "fallen_sign":        +1,   # traffic safety risk
    "worn_road_marking":  +1,   # general road hazard
    "pothole":             0,   # neutral, scored by size
    "debris":              0,   # neutral, scored by severity
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

    # ── OPTION A: Google Gemini — use if FlexToken = Gemini ─────────────
    client = genai.Client(api_key=API_KEY)
    # ── OPTION B: OpenAI — use if FlexToken = OpenAI ─────────────────────
    # client = OpenAI(api_key=API_KEY)
    # ── OPTION C: Anthropic — use if FlexToken = Anthropic ───────────────
    # client = anthropic.Anthropic(api_key=API_KEY)

    print(f"📸 Sending image to AI for analysis...")

    # Read the image as bytes
    image_bytes = Path(image_path).read_bytes()

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

    # ── OPTION A: Google Gemini API call ─────────────────────────────────
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
            DAMAGE_PROMPT
        ]
    )
    # ── OPTION B: OpenAI API call ─────────────────────────────────────────
    # import base64
    # image_b64 = base64.b64encode(image_bytes).decode("utf-8")
    # response = client.chat.completions.create(
    #     model="gpt-4o",
    #     messages=[{"role": "user", "content": [
    #         {"type": "image_url", "image_url": {"url": f"data:{mime_type};base64,{image_b64}"}},
    #         {"type": "text", "text": DAMAGE_PROMPT}
    #     ]}]
    # )
    # ── OPTION C: Anthropic API call ──────────────────────────────────────
    # import base64
    # image_b64 = base64.b64encode(image_bytes).decode("utf-8")
    # response = client.messages.create(
    #     model="claude-sonnet-4-20250514",
    #     max_tokens=1000,
    #     messages=[{"role": "user", "content": [
    #         {"type": "image", "source": {"type": "base64", "media_type": mime_type, "data": image_b64}},
    #         {"type": "text", "text": DAMAGE_PROMPT}
    #     ]}]
    # )

    # Clean and parse response
    response_text = clean_response(response.text)
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

    # OPTION A: Real AI — use when quota is available
    result = process_citizen_report(
        image_path="test_images/pothole.jpg",  # ← folder/filename
        location="Jalan Bukit Jalil, KL",  # change to location
        report_id="WO-2024-001"
    )

    # OPTION B: Mock test — use when quota runs out
    # Add # in front of all OPTION A lines above, then remove # below
    # mock_test()