"""Removes the sample listings and adds the 10 listings delivered in November 2026
(folder "n24" from Tomislav), plus the updated Tisno house (N24-251).

Run once after tools/photos.py has made each listing's gallery (<id>-<n>-<width>.webp).
Units are [name, size m², price or None, status, garden m², bedrooms].
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'assets' / 'data' / 'listings.json'
IMGS = ROOT / 'assets' / 'img' / 'listings'

NEW = [
    {
        'id': 'n24-301', 'slug': 'new-semi-detached-house-zaboric', 'title': 'New semi-detached house 70 m from the sea',
        'area': 'zaboric', 'type': 'house', 'price': 430000, 'size': 99.71, 'beds': 3, 'baths': 3,
        'status': 'New build', 'year': 2026, 'parking': 2, 'renders': True,
        'description': [
            'A modern semi-detached house in Žaborić, a quiet Mediterranean village near Šibenik, only 70 m from the sea and a beach. Unit S2 of a new two-unit house is for sale: 99.71 m² over two floors, with a private garden of 135 m² and two parking spaces.',
            'The ground floor has an entrance hall, one bedroom, a bathroom, a modern kitchen with dining area and a large living room opening onto the garden and terrace. Upstairs are two bedrooms, two bathrooms and a balcony with a view of the surroundings and the sea.',
            'Large glass walls bring in plenty of daylight. The house is sold unfurnished; some images are renders.',
            'Beaches, a seaside promenade, restaurants, shops and a marina are nearby. Šibenik, the Krka and Kornati national parks and Split airport are a short drive away.',
        ],
        'standards': [
            'High-quality Italian ceramic tiles',
            'Underfloor heating in the living room and bathrooms',
            'Air conditioning in the living room and every bedroom',
            'PVC windows with good thermal insulation',
            'Glass balcony railings',
            'Laminate floors in the bedrooms',
        ],
        'features': ['70 m to the sea and beach', 'Private garden 135 m²', '2 parking spaces', 'Sea view from the balcony', 'Underfloor heating', 'Air conditioning', 'New build 2026'],
    },
    {
        'id': 'n24-302', 'slug': 'g-home-new-apartments-grebastica', 'title': 'G Home: new apartments 100 m from the beach',
        'area': 'grebastica', 'type': 'new-build', 'price': 242048, 'size': 75.64, 'beds': 2, 'baths': 2,
        'status': 'Completion 2027', 'parking': 2, 'renders': True,
        'description': [
            'The last apartments in G Home, a new project in Grebaštica only 100 m from the sea and the beach. Two small buildings with just six apartments in total mean peace and privacy all year round.',
            'Pre-sale price before construction starts: €3,200 per m². Every apartment comes with two parking spaces, large terraces and a practical layout. Completion is planned for 2027.',
            'Grebaštica is one of the most sought-after places on the Šibenik riviera, known for clear sea, beautiful beaches and quiet surroundings, a few minutes\' drive from Šibenik and Primošten. Ask us for floor plans and to reserve an apartment.',
        ],
        'units': [
            ['Apartment 1 (A)', None, None, 'Sold'],
            ['Apartment 2 (A)', 75.64, 242048, '', None, 2],
            ['Apartment 3 (A)', 79.55, 254560, '', None, 3],
            ['Apartment 4 (B, ground floor)', 91.95, 294240, '', None, 2],
            ['Apartment 5 (B, 1st floor)', 92.56, 296192, '', None, 2],
            ['Apartment 6 (B, 2nd floor)', 82.78, 264896, '', None, 2],
        ],
        'features': ['100 m to the beach', 'Only 6 apartments', '2 parking spaces per apartment', 'Large terraces', 'Pre-sale price', 'Completion 2027'],
    },
    {
        'id': 'n24-303', 'slug': 'building-plot-permit-sea-view-rogoznica', 'title': 'Building plot with permit and sea view',
        'area': 'rogoznica', 'type': 'land', 'price': 150000, 'size': 712, 'plot': 712,
        'status': 'Building permit', 'renders': True,
        'description': [
            'A 712 m² building plot in Rogoznica with a beautiful view of the sea, sold with a design for a house of 150 m² and a valid building permit.',
            'The images include visualisations of the permitted house with a swimming pool. Ask us for the project documents.',
        ],
        'features': ['Building permit', 'House design 150 m²', 'Sea view', 'Swimming pool in the design'],
    },
    {
        'id': 'n24-304', 'slug': 'renovated-stone-house-prvic-sepurina', 'title': 'Renovated stone house 30 m from the sea',
        'area': 'prvic', 'type': 'house', 'price': 200000, 'beds': 2, 'baths': 2,
        'status': 'Renovated',
        'description': [
            'A fully renovated traditional Dalmatian stone house in the heart of Šepurina on the island of Prvić, about 30 m from the sea.',
            'The house has a ground floor and two upper floors (footprint 3.5 × 5 m), with two bedrooms and two bathrooms. The stone walls and the roof have been restored, keeping the authentic look: exposed stone and a wooden roof structure.',
            'It stands in a quiet stone street of the old village core. Ideal for holidays, holiday rental or as an investment on an attractive island.',
        ],
        'features': ['30 m to the sea', 'Fully renovated', 'New roof', 'Three floors', 'Old village core of Šepurina', 'Ready to use'],
    },
    {
        'id': 'n24-305', 'slug': 'semi-detached-duplex-pool-brodarica', 'title': 'Modern semi-detached duplex with pool option',
        'area': 'brodarica', 'type': 'house', 'price': 390000, 'size': 120, 'beds': 3, 'baths': 3,
        'status': 'Concept design', 'parking': 1, 'renders': True,
        'description': [
            'A modern semi-detached duplex house in Brodarica near Šibenik, 500 m from the sea. Each unit has about 120 m² of living space over two floors and its own garden of about 200 m².',
            'The ground floor (about 60 m²) is open plan: a large living room, a kitchen with an island, a dining area, a bathroom and a storage room, with large glass walls to the garden and a terrace with a pergola. A 3 × 6 m pool or a jacuzzi can be added.',
            'The upper floor (about 60 m²) is the sleeping area: a master bedroom with its own bathroom and a large terrace with a sea view, two more bedrooms and another bathroom.',
            'The project is a concept design, so the buyer can still change the layout, terraces, pool, facade and interior before construction, within the regulations. The images are visualisations.',
        ],
        'features': ['500 m to the sea', 'Garden about 200 m²', 'Pool 3 × 6 m or jacuzzi option', 'Sea-view terrace', 'Parking', 'Design can be adapted'],
    },
    {
        'id': 'n24-306', 'slug': 'sunset-homes-new-apartments-sea-view-primosten', 'title': 'Sunset Homes: new apartments with open sea view',
        'area': 'primosten', 'type': 'new-build', 'price': 268000, 'size': 66.94, 'beds': 2, 'baths': 1,
        'status': 'Completion 2026', 'garage': 1, 'renders': True,
        'description': [
            'Modern apartments in a new building in Primošten with a wide, open view of the sea. The building is in a quiet, sunny spot, about 1,500 m from the sea and beach and 2,000 m from the centre of Primošten.',
            'Modern architecture, high-quality materials, large glass walls and spacious terraces. Every apartment has a parking or garage space. The ground-floor apartment S1 has its own garden and a jacuzzi on the terrace.',
            'Completion is planned for 2026. Ideal as a holiday home or a rental investment.',
        ],
        'units': [
            ['S1 (ground floor, garden)', 82.17, 411000, '', None, 2],
            ['S2 (ground floor)', 66.94, 268000, '', None, 2],
            ['S3', 73.45, None, 'Sold'],
            ['S4', 66.64, None, 'Sold'],
            ['S5 (2nd floor)', 73.45, 382000, '', None, 2],
            ['S6 (2nd floor)', 71.79, 330000, '', None, 2],
            ['S7 (penthouse)', 123.70, None, 'Sold'],
        ],
        'features': ['Open sea view', 'Parking or garage space', 'Large terraces', 'Quiet, sunny location', 'Completion 2026'],
    },
    {
        'id': 'n24-307', 'slug': 'apartment-stone-house-main-square-sibenik', 'title': 'Renovated apartment on the main square, sea view',
        'area': 'sibenik', 'type': 'apartment', 'price': 360000, 'size': 75.12, 'beds': 2, 'baths': 2,
        'status': 'Renovated, furnished',
        'description': [
            'A fully renovated and modern furnished apartment in the heart of Šibenik, in an authentic stone house on Medulić, the main square, with a view of the sea.',
            'The apartment has 75.12 m²: two bedrooms, a living room, a kitchen, two bathrooms and a hallway. It is a registered unit with its own title (etaža).',
            'A few steps from the waterfront, restaurants and shops. Thanks to a high-quality renovation and carefully chosen furniture it is ready to move into without further investment. Ideal to live in, for holidays or for holiday rental.',
        ],
        'features': ['Sea view', 'Old town centre', 'Fully renovated', 'Furnished', 'Air conditioning', 'Separate title'],
    },
    {
        'id': 'n24-308', 'slug': 'building-plots-vrpolje', 'title': 'Building plots in Vrpolje, 2 km from the sea',
        'area': 'sibenik', 'type': 'land', 'price': 66600, 'size': 888, 'plot': 888,
        'status': 'Building land',
        'description': [
            'Several residential building plots in Vrpolje, near Šibenik, in a quiet location 2 km from the sea. All plots are zoned for housing.',
        ],
        'units': [
            ['Plot 1', 1664, 124800],
            ['Plot 2', 2379, 120000],
            ['Plot 3', 1163, 87225],
            ['Plot 4', 888, 66600],
        ],
        'features': ['Residential building land', '2 km to the sea', 'Quiet location', 'Near Šibenik'],
    },
    {
        'id': 'n24-309', 'slug': 'furnished-apartment-100m-sea-srima', 'title': 'Furnished apartment 100 m from the sea',
        'area': 'srima', 'type': 'apartment', 'price': 211000, 'size': 51, 'beds': 1, 'baths': 1,
        'status': 'Furnished',
        'description': [
            'A fully equipped and furnished 51 m² apartment in one of the most attractive locations in Srima, 100 m from the sea, in a quiet street a few minutes\' walk from one of the best beaches on this part of the coast.',
            'Open-plan living room with kitchen and dining area, one bedroom with access to the balcony, a bathroom, a separate toilet and a covered balcony with an outdoor dining table.',
            'It is ready to move into and is sold with all the furniture and equipment shown in the photos. Srima is known for its beaches, clear sea and the promenade to Vodice; the centre and a shop are 500 m away.',
        ],
        'features': ['100 m to the sea', 'Fully furnished', 'Covered balcony', 'Air conditioning', 'Separate toilet', 'Quiet street'],
    },
]

UPDATE = {
    'n24-251': {'price': 520000, 'size': 184, 'area': 'murter', 'title': 'House in the first row to the sea, Tisno'},
    # Olive Grove: only Villa 1 is for sale, with a building permit. New renders from the owner.
    'n24-276': {
        'title': 'Olive Grove: villa plot with building permit', 'status': 'Building permit', 'renders': True,
        'description': [
            'A building plot of 1,523 m² on a hillside among olive trees above Primošten, sold with a building permit for a modern stone villa of about 330 m² gross area.',
            'The design combines modern architecture with a Mediterranean feel: several levels following the terrain, large glass walls, spacious terraces and an outdoor area with a swimming pool, sun deck and lounge.',
            'The plot is quiet and surrounded by nature, with an open view of the sea. Split airport is about 40 km away. The images are visualisations of the permitted villa.',
        ],
        'features': ['Building permit', 'Villa design about 330 m²', 'Swimming pool in the design', 'Olive grove setting', 'Open sea view', 'About 1.6 km to the sea', 'About 3 km to Primošten centre', 'Private parking'],
    },
}

data = [l for l in json.loads(DATA.read_text(encoding='utf8')) if not l.get('sample')]
have = {l['id'] for l in data}
for l in NEW:
    if l['id'] not in have:
        l['sample'] = False
        data.insert(0, l)  # the data is in newest-first order
for l in data:
    l.update(UPDATE.get(l['id'], {}))
    n = 0
    while (IMGS / f"{l['id']}-{n + 1}-640.webp").exists():
        n += 1
    if n:
        l['img'] = f"{l['id']}-1"
        l['gallery'] = n
DATA.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding='utf8')
print(len(data), 'listings')
