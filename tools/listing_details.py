"""Adds the full details of the 8 listings from the old website to assets/data/listings.json.

Run once after tools/photos.py has made each listing's gallery (<id>-<n>-<width>.webp).
Descriptions are taken from the old site, tidied into short paragraphs.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'assets' / 'data' / 'listings.json'
IMGS = ROOT / 'assets' / 'img' / 'listings'

DETAILS = {
    'n24-276': {
        'status': 'Available', 'plot': 1523,
        'description': [
            'A building plot of 1,523 m² in the Primošten area, sold with a preliminary design for a modern villa of about 330 m² gross area.',
            'The design combines modern architecture with a Mediterranean feel: several levels following the terrain, large glass walls, spacious terraces and an outdoor area with a swimming pool, sun deck and lounge. It can be adapted to the new owner\'s wishes.',
            'The plot is quiet and surrounded by nature, with an open view of the sea and the surrounding area. It can be bought with or without a building permit.',
        ],
        'features': ['Preliminary design included in the price', 'With or without a building permit', 'About 1.6 km to the sea', 'About 3 km to Primošten centre', 'Open sea view', 'Swimming pool in the design', 'Private parking'],
    },
    'n24-231': {
        'status': 'Under construction',
        'description': [
            'Sun Hill is one of the settlements of Primošten Resort, a development of new apartments and villas above Primošten.',
            'Prices, floor plans and availability of the individual units are available on request. See the Primošten Resort page for all units.',
        ],
        'features': [],
    },
    'n24-251': {
        'status': 'Available', 'year': 1980, 'garage': 1,
        'description': [
            'A house in the very centre of Tisno, in the first row to the sea, with an open view.',
            'The basement has a small garage and a room with a bathroom and a kitchen. The ground floor has a living room with a kitchen, a bathroom, a dressing room and large terraces at the front and back. The first floor is an unfinished apartment with one bedroom, a bathroom and a toilet.',
            'The house needs renovation. It faces south-east.',
        ],
        'features': ['First row to the sea', 'Centre of Tisno', 'Garage', 'Terraces at the front and back', 'Needs renovation'],
    },
    'n24-261': {
        'status': 'Available', 'year': 2025, 'parking': 1, 'garage': 1,
        'description': [
            'A new apartment building in the centre of Primošten, with an elevator, garages and terraces with glass railings. Apartment prices include VAT.',
        ],
        'units': [
            ['A1', 98.67, 375000], ['A2', 69.29, 265000], ['A3', 100.74, 375000], ['A4', 90.24, 330000],
            ['B1', 100.21, 390000], ['B2', 62.43, 225000], ['B3', 87.67, 320000], ['B4', 80.80, 310000],
            ['C1', 96.10, 390000], ['C2', 60.07, 245000], ['C3', 86.43, 347000], ['C4', 80.04, 320000],
            ['D1', 146.97, 790000], ['D2', 120.30, 670000],
        ],
        'standards': [
            'Reinforced concrete structure on a 40 cm foundation slab; 25 cm load-bearing walls',
            'Facade insulated with 10 cm of stone wool (ETICS)',
            'Anthracite aluminium windows with triple glazing, motorised insulated roller shutters and built-in mosquito nets',
            'Anti-burglary, fire-resistant entrance doors',
            'Samsung multi-split inverter air conditioning built into the ceilings',
            'Electric underfloor heating in the bathrooms, Geberit built-in cisterns',
            'Ceramic floors of the buyer\'s choice by agreement; epoxy floors in garages and storage',
            'Preparation for an electric car charger at every garage space',
            'Double-waterproofed terraces with hidden drainage; roof insulated with 15 cm XPS',
            'Elevator; stone-clad entrance and staircase',
        ],
        'features': ['Elevator', 'Garage', 'Air conditioning', 'Terraces with glass railings', 'Centre of Primošten'],
    },
    'n24-169': {
        'status': 'Available', 'year': 2022, 'parking': 2, 'garage': 1,
        'description': [
            'A new urban villa in Brodarica with three residential units in a row, modern architecture and a view of the sea.',
            'Each unit has its own garden with room for a swimming pool (not included in the price).',
        ],
        'units': [['S1', 143.73, None, 'Sold', 250], ['S2', 150.52, 320000, None, 128], ['S3', 150.52, 360000, None, 231]],
        'features': ['Garage', 'Air conditioning', 'Balcony', 'Sea view', 'Garden', 'Roof terrace', 'Room for a pool'],
    },
    'n24-107': {
        'status': 'Available', 'year': 2021,
        'description': [
            'A modern apartment in a new building of four units in Primošten. Large glass walls give every apartment an open view of the old town on its peninsula.',
            'Apartment 3 has its own swimming pool and a total area of 136.39 m². The building has an excellent access road from the main street.',
            'A garage space is available at €1,500 per m², and an outdoor parking space for €5,000.',
        ],
        'features': ['Swimming pool', 'View of the old town', 'Close to the sea', 'Air conditioning', 'Balcony', 'Garden'],
    },
    'n24-70': {
        'status': 'Available', 'year': 2020, 'plot': 460, 'parking': 4, 'garage': 1,
        'description': [
            'A new 330 m² villa on a 460 m² garden near Vodice, built with care for every detail and for privacy.',
            'It has four bedrooms, each with its own bathroom, a guest toilet, a fitness room and a 40 m² swimming pool. Schüco windows, underfloor heating, fully equipped and furnished.',
            'The centre and restaurants are 1 km away, with walks in nature right around the house and a beautiful view.',
        ],
        'features': ['Swimming pool 40 m²', 'Fitness room', 'Four en-suite bedrooms', 'Underfloor heating', 'Furnished', 'Sea view', 'Roof terrace', 'Garage'],
    },
    'n24-92': {
        'status': 'Available', 'year': 2021, 'plot': 1038, 'garage': 1,
        'description': [
            'A modern 343 m² villa on a 1,038 m² plot on the hill above Primošten, with privacy and a sea view.',
            'Four bedrooms, four bathrooms and two toilets, and a 40 m² swimming pool. Underfloor heating, a heat pump and central cooling.',
            'The price is for the fully equipped villa.',
        ],
        'features': ['Swimming pool 40 m²', 'Sea view', 'Close to the sea', 'Underfloor heating', 'Heat pump and central cooling', 'Gym', 'Bar', 'Roof terrace', 'Furnished', 'Garage'],
    },
}

# Corrections found on the old listing pages.
FIX = {'n24-169': {'area': 'brodarica', 'type': 'apartment', 'title': 'Modern new building with sea view'},
       'n24-70': {'area': 'vodice', 'title': 'New 4 bedroom villa near Vodice'}}

data = json.loads(DATA.read_text(encoding='utf8'))
for l in data:
    if l.get('sample'):
        continue
    l.update(FIX.get(l['id'], {}))
    l.update(DETAILS.get(l['id'], {}))
    n = 0
    while (IMGS / f"{l['id']}-{n + 1}-640.webp").exists():
        n += 1
    if n:
        l['img'] = f"{l['id']}-1"
        l['gallery'] = n
DATA.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding='utf8')
print('updated', sum(1 for l in data if not l.get('sample')), 'listings')
