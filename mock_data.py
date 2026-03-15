# ============================================================
# mock_data.py — CiviScan Mock Scenarios
# Use these when the real API key is not available yet.
# All 8 scenarios cover different damage types and severities.
# ============================================================

MOCK_REPORTS = [
    {
        "report_id": "WO-2024-001",
        "location": "Jalan Bukit Jalil, KL",
        "lat": 3.0551,
        "lng": 101.6841,
        "image_path": "test_images/pothole_large.jpg",
        "ai_analysis": {
            "damage_type": "pothole",
            "severity_score": 9,
            "confidence": "high",
            "description": "Large pothole approximately 40cm wide and 8cm deep on a main road, posing serious vehicle damage and accident risk.",
            "urgency": "immediate",
            "recommended_action": "Deploy road repair crew immediately to patch pothole with cold mix asphalt and cordon off area.",
            "location": "Jalan Bukit Jalil, KL",
            "image_analyzed": "test_images/pothole_large.jpg",
            "severity_breakdown": {
                "ai_base_score": 9,
                "type_weight": 0,
                "confidence_adjustment": 0,
                "final_score": 9
            }
        }
    },
    {
        "report_id": "WO-2024-002",
        "location": "Persiaran Wawasan, Puchong",
        "lat": 3.0319,
        "lng": 101.6205,
        "image_path": "test_images/flooded_drain.jpg",
        "ai_analysis": {
            "damage_type": "flooded_drain",
            "severity_score": 8,
            "confidence": "high",
            "description": "Severely blocked drain causing floodwater to cover over half the road surface, making it impassable during rain.",
            "urgency": "high",
            "recommended_action": "Dispatch drainage crew to unblock drain grates and pump standing water; check for upstream blockage.",
            "location": "Persiaran Wawasan, Puchong",
            "image_analyzed": "test_images/flooded_drain.jpg",
            "severity_breakdown": {
                "ai_base_score": 6,
                "type_weight": 2,
                "confidence_adjustment": 0,
                "final_score": 8
            }
        }
    },
    {
        "report_id": "WO-2024-003",
        "location": "Taman Desa Aman, Cheras",
        "lat": 3.0785,
        "lng": 101.7460,
        "image_path": "test_images/broken_streetlight.jpg",
        "ai_analysis": {
            "damage_type": "broken_streetlight",
            "severity_score": 8,
            "confidence": "high",
            "description": "Streetlight pole completely fallen across the footpath with exposed electrical wiring visible at the base.",
            "urgency": "high",
            "recommended_action": "Isolate power to fallen streetlight immediately and dispatch electrical repair team with safety equipment.",
            "location": "Taman Desa Aman, Cheras",
            "image_analyzed": "test_images/broken_streetlight.jpg",
            "severity_breakdown": {
                "ai_base_score": 7,
                "type_weight": 1,
                "confidence_adjustment": 0,
                "final_score": 8
            }
        }
    },
    {
        "report_id": "WO-2024-004",
        "location": "Jalan Kelang Lama, KL",
        "lat": 3.0921,
        "lng": 101.6724,
        "image_path": "test_images/cracked_pavement.jpg",
        "ai_analysis": {
            "damage_type": "cracked_pavement",
            "severity_score": 4,
            "confidence": "high",
            "description": "Wide crack spanning approximately 2cm across the full width of the pedestrian footpath, creating a trip hazard.",
            "urgency": "medium",
            "recommended_action": "Schedule pavement repair crew to fill cracks with concrete sealant within 2 weeks.",
            "location": "Jalan Kelang Lama, KL",
            "image_analyzed": "test_images/cracked_pavement.jpg",
            "severity_breakdown": {
                "ai_base_score": 5,
                "type_weight": -1,
                "confidence_adjustment": 0,
                "final_score": 4
            }
        }
    },
    {
        "report_id": "WO-2024-005",
        "location": "Persiaran Cyber, Cyberjaya",
        "lat": 2.9213,
        "lng": 101.6559,
        "image_path": "test_images/fallen_sign.jpg",
        "ai_analysis": {
            "damage_type": "fallen_sign",
            "severity_score": 7,
            "confidence": "medium",
            "description": "Speed limit sign on main intersection completely fallen with post snapped at base, leaving junction without signage.",
            "urgency": "high",
            "recommended_action": "Replace fallen road sign immediately and install new pole; inspect nearby signs for similar damage.",
            "location": "Persiaran Cyber, Cyberjaya",
            "image_analyzed": "test_images/fallen_sign.jpg",
            "severity_breakdown": {
                "ai_base_score": 7,
                "type_weight": 1,
                "confidence_adjustment": -1,
                "final_score": 7
            }
        }
    },
    {
        "report_id": "WO-2024-006",
        "location": "Taman Sri Muda, Shah Alam",
        "lat": 3.0732,
        "lng": 101.5654,
        "image_path": "test_images/debris.jpg",
        "ai_analysis": {
            "damage_type": "debris",
            "severity_score": 5,
            "confidence": "high",
            "description": "Large fallen tree branch blocking approximately one lane of a residential road after recent storm.",
            "urgency": "medium",
            "recommended_action": "Send maintenance crew with chainsaw to clear fallen branches and check for other storm-related blockages nearby.",
            "location": "Taman Sri Muda, Shah Alam",
            "image_analyzed": "test_images/debris.jpg",
            "severity_breakdown": {
                "ai_base_score": 5,
                "type_weight": 0,
                "confidence_adjustment": 0,
                "final_score": 5
            }
        }
    },
    {
        "report_id": "WO-2024-007",
        "location": "Jalan Ampang, KL",
        "lat": 3.1578,
        "lng": 101.7234,
        "image_path": "test_images/vandalism.jpg",
        "ai_analysis": {
            "damage_type": "vandalism",
            "severity_score": 2,
            "confidence": "high",
            "description": "Graffiti spray-painted on bus stop shelter wall. Structure is intact and functional, purely cosmetic damage.",
            "urgency": "low",
            "recommended_action": "Schedule graffiti removal team to clean bus shelter surface within 4 weeks.",
            "location": "Jalan Ampang, KL",
            "image_analyzed": "test_images/vandalism.jpg",
            "severity_breakdown": {
                "ai_base_score": 3,
                "type_weight": -1,
                "confidence_adjustment": 0,
                "final_score": 2
            }
        }
    },
    {
        "report_id": "WO-2024-008",
        "location": "Jalan Bukit Jalil, KL",
        "lat": 3.0563,
        "lng": 101.6857,
        "image_path": "test_images/pothole_small.jpg",
        "ai_analysis": {
            "damage_type": "pothole",
            "severity_score": 3,
            "confidence": "medium",
            "description": "Small pothole approximately 4cm wide at the road edge near the curb, minor risk to cyclists.",
            "urgency": "low",
            "recommended_action": "Add to scheduled maintenance queue for pothole patching during next road crew visit to area.",
            "location": "Jalan Bukit Jalil, KL",
            "image_analyzed": "test_images/pothole_small.jpg",
            "severity_breakdown": {
                "ai_base_score": 4,
                "type_weight": 0,
                "confidence_adjustment": -1,
                "final_score": 3
            }
        }
    }
]


def get_mock_report(report_id: str) -> dict:
    """Fetch a single mock report by ID"""
    for report in MOCK_REPORTS:
        if report["report_id"] == report_id:
            return report
    return None


def get_all_mock_reports() -> list:
    """Return all mock reports"""
    return MOCK_REPORTS


def get_reports_by_urgency(urgency: str) -> list:
    """Filter mock reports by urgency level: immediate / high / medium / low"""
    return [r for r in MOCK_REPORTS if r["ai_analysis"]["urgency"] == urgency]


def get_reports_by_damage_type(damage_type: str) -> list:
    """Filter mock reports by damage type"""
    return [r for r in MOCK_REPORTS if r["ai_analysis"]["damage_type"] == damage_type]


def get_cluster_coordinates() -> list:
    """Return GPS coords for clustering — note WO-001 and WO-008 are near each other (same road)"""
    return [
        {"report_id": r["report_id"], "lat": r["lat"], "lng": r["lng"]}
        for r in MOCK_REPORTS
    ]


# ============================================================
# Quick test — run this file directly to preview all reports
# ============================================================
if __name__ == "__main__":
    import json

    print("\n📋 ALL MOCK REPORTS SUMMARY")
    print("=" * 55)
    for r in MOCK_REPORTS:
        a = r["ai_analysis"]
        print(f"  {r['report_id']} | {a['damage_type']:20s} | Score: {a['severity_score']:2}/10 | {a['urgency'].upper():9} | {r['location']}")

    print("\n\n🔴 IMMEDIATE / HIGH PRIORITY REPORTS:")
    print("=" * 55)
    urgent = get_reports_by_urgency("immediate") + get_reports_by_urgency("high")
    for r in urgent:
        print(json.dumps(r["ai_analysis"], indent=2))

    print("\n\n📍 GPS COORDINATES FOR CLUSTERING:")
    print("=" * 55)
    print(json.dumps(get_cluster_coordinates(), indent=2))
