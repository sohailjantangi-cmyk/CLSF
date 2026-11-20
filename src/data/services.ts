import { ServiceCategory } from '../types';

const IMG_VILLA = '/src/assets/images/hero_villa_construction_1795167605296.jpg';
const IMG_FITOUT = '/src/assets/images/hero_commercial_fitout_1795167605424.jpg';
const IMG_MEP = '/src/assets/images/hero_mep_systems_1795167608928.jpg';
const IMG_FINISHING = '/src/assets/images/cat_interior_finishing_1795167609084.jpg';
const IMG_POOL = '/src/assets/images/cat_pool_maintenance_1795167608879.jpg';
const IMG_EXT = '/src/assets/images/cat_villa_extension_1795167608645.jpg';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    number: '01',
    title: 'Building Contracting',
    slug: 'building-contracting-dubai',
    tagline: 'Ground-up villa construction, structural extensions, and residential building works.',
    description:
      'Disciplined civil and structural contracting across Dubai, managing excavation, reinforced concrete frames, blockwork, waterproofing, and envelope completion under one accountable site team.',
    image: IMG_VILLA,
    qualityPoints: [
      {
        title: 'One Contract, One Sequence',
        detail: 'Substructure, superstructure, MEP rough-in, and envelope finishes run to a unified critical-path schedule.',
      },
      {
        title: 'Scope Defined Before Pricing',
        detail: 'Structural drawings and geotechnical assumptions are cross-checked into a measured BOQ prior to contract award.',
      },
      {
        title: 'Approvals Built Into the Plan',
        detail: 'Dubai Municipality, Trakhees, DDA, and community NOCs are sequenced ahead of excavation and slab pours.',
      },
      {
        title: 'Inspection at Every Stage',
        detail: 'Rebar spacing checks, concrete cube tests, and 48-hour membrane flood tests are logged before concealment.',
      },
    ],
    faqs: [
      {
        question: 'Do you handle authority permits and community NOCs before starting construction?',
        answer:
          'Yes. Our engineering team coordinates consultant submittals, municipality building permits, and master developer NOCs so site mobilisation proceeds without regulatory hold-ups.',
      },
      {
        question: 'How is pricing structured for villa construction or structural extensions?',
        answer:
          'Every project is priced against a line-by-line Bill of Quantities separating concrete frame, blockwork, waterproofing, MEP allowances, and finishes, eliminating ambiguous lump sums.',
      },
      {
        question: 'Can you work alongside our appointed architect and structural consultant?',
        answer:
          'Yes. We execute build-only contracts from consultant IFC drawings as well as design-and-build packages where CLSF coordinates architectural and structural engineering.',
      },
    ],
    children: [
      {
        title: 'Villa Construction',
        slug: 'villa-construction',
        summary: 'Turnkey civil, structural, MEP, and architectural finishing for private residential plots across Dubai.',
        image: IMG_VILLA,
        covers: [
          'Site hoarding, setting out, soil verification, and substructure foundation works',
          'Reinforced concrete columns, beams, post-tensioned or conventional slabs, and structural steel elements',
          'Thermal blockwork, external plastering, stone or render facades, and roof waterproofing systems',
          'Full first-fix and second-fix MEP integration, boundary walls, gates, and external paving',
        ],
        delivery: [
          'Pre-pour steel reinforcement and formwork inspections verified against structural IFC schedules',
          'Coordinated MEP sleeve openings cast into slabs and beams to prevent post-pour core cutting',
          'Staged bituminous and liquid-applied waterproofing with documented 48-hour ponding tests on roofs and wet areas',
        ],
        deliverables: [
          'Measured Bill of Quantities and stage payment schedule linked to physical site milestones',
          'Concrete cube test records, waterproofing warranty documentation, and authority completion certificates',
          'Full as-built structural and MEP drawings with signed snagging clearance at handover',
        ],
        faqs: [
          {
            question: 'What plot types do you construct on in Dubai?',
            answer: 'We build on private residential plots across freehold communities and established residential districts, adapting foundation and dewatering methods to plot soil reports.',
          },
          {
            question: 'How do you manage material approvals during construction?',
            answer: 'All structural concrete mixes, waterproofing membranes, MEP equipment, and architectural finishes are submitted via formal material approval sheets before procurement.',
          },
          {
            question: 'What inspection records are provided at handover?',
            answer: 'Clients receive laboratory concrete strength reports, pressure test logs, electrical megger test sheets, and signed completion checklists.',
          },
        ],
      },
      {
        title: 'G+1 Villa Construction',
        slug: 'g1-villa-construction',
        summary: 'Dedicated ground-plus-one residential construction engineered for thermal efficiency and long-term durability.',
        image: IMG_VILLA,
        covers: [
          'Excavation, anti-termite treatment, blinding concrete, and isolated or raft foundations',
          'Ground and first-floor reinforced concrete frame, cantilevered balconies, and staircase cores',
          'Insulated AAC or thermal block envelope, acoustic floor screeds, and solar-reflective roof build-ups',
          'Complete internal fit-out, MEP commissioning, and external courtyard hardscaping',
        ],
        delivery: [
          'Strict datum level and plumb control across ground and first-floor pours using laser survey checks',
          'Thermal bridge detailing at slab edges, parapets, and window reveals to meet Dubai Green Building Regulations',
          'Dedicated wet-trade curing schedules prior to tiling, stone fixing, and timber installation',
        ],
        deliverables: [
          'Programme of works tracking substructure, superstructure, envelope, and fit-out phases',
          'Thermal envelope and waterproofing test logs verified prior to plastering and screed',
          'Operation and maintenance manuals covering HVAC, pumps, and electrical distribution boards',
        ],
        faqs: [
          {
            question: 'Does G+1 construction include external boundary walls and driver quarters?',
            answer: 'Yes. Ancillary blocks, pump rooms, boundary walls, and shaded parking structures can be included within a single main contract.',
          },
          {
            question: 'How are first-floor wet areas protected against leaks?',
            answer: 'All upper-floor bathrooms and terraces receive two-coat cementitious or polyurethane waterproofing turned up walls, flood-tested for 48 hours before protective screed is laid.',
          },
          {
            question: 'Can smart home and low-voltage systems be integrated during first fix?',
            answer: 'Yes. KNX, structured data cabling, CCTV, and intercom containment are installed during blockwork channelling prior to plastering.',
          },
        ],
      },
      {
        title: 'Villa Extensions & Structural Modifications',
        slug: 'villa-extensions-structural-modifications',
        summary: 'Load-bearing alterations, majlis extensions, cantilevered canopies, and structural openings for occupied or vacant villas.',
        image: IMG_EXT,
        covers: [
          'Structural steel beam installations to remove internal load-bearing walls and open living volumes',
          'Single-storey and double-storey rear or side extensions tied cleanly into existing villa frames',
          'New staircase openings, slab cut-outs, lift shafts, and structural strengthening using carbon fibre or steel plates',
          'Foundation underpinning, chemical rebar anchoring, and matched external facade treatments',
        ],
        delivery: [
          'Non-destructive rebar scanning prior to any saw-cutting or structural coring',
          'Temporary acrow propping and needle-beam shoring engineered before load-bearing demolition begins',
          'Epoxy-grouted dowel connections between new and existing slabs with movement joint detailing',
        ],
        deliverables: [
          'Structural engineer calculations and authority modification permit packages',
          'Pull-out test verification for chemical anchors where specified by structural design',
          'Weatherproofed roof-to-wall flashings and matched exterior render or stone cladding',
        ],
        faqs: [
          {
            question: 'Do villa extensions require community developer and municipality approval?',
            answer: 'Yes. Structural modifications and built-up area additions require master developer NOC and Dubai Municipality or relevant authority sign-off, which we coordinate directly.',
          },
          {
            question: 'How do you prevent cracking where a new extension meets the existing villa?',
            answer: 'We install properly detailed expansion or slip joints with compatible backing rods, sealants, and reinforced plaster mesh across junction lines.',
          },
          {
            question: 'Can structural alterations be carried out while adjacent rooms remain protected?',
            answer: 'Yes. We erect sealed dust barriers, negative-air extraction where required, and floor protection across access routes.',
          },
        ],
      },
      {
        title: 'Residential Building Renovation',
        slug: 'residential-building-renovation',
        summary: 'Comprehensive structural, facade, common-area, and services refurbishment for multi-unit residential buildings.',
        image: IMG_FINISHING,
        covers: [
          'Facade concrete spalling repair, crack injection, elastomeric coatings, and parapet waterproofing',
          'Lobby, corridor, lift vestibule, and stairwell architectural refurbishment',
          'Riser pipework replacement, booster pump upgrades, and main LV panel refurbishment',
          'Roof heat-insulation renewal, screed re-grading, and expansion joint resealing',
        ],
        delivery: [
          'Phased floor-by-floor scheduling to minimise disruption in occupied residential buildings',
          'Acoustic and working-hour compliance aligned with building management and municipal regulations',
          'Dedicated site hoarding, debris chute or service-lift protection, and daily housekeeping protocols',
        ],
        deliverables: [
          'Condition survey report identifying structural, waterproofing, and MEP deficiencies prior to pricing',
          'Itemised BOQ split by building envelope, common areas, and mechanical risers',
          'Commissioning records and post-completion maintenance checklist for building owners',
        ],
        faqs: [
          {
            question: 'Can you renovate a residential building while tenants remain in occupation?',
            answer: 'Yes. We sequence noisy works within permitted hours, maintain safe egress corridors, and schedule utility shutdowns with advance resident notice.',
          },
          {
            question: 'Do you handle roof waterproofing replacement on older buildings?',
            answer: 'Yes. We strip failed membranes, repair substrate screeds, install tapered insulation where drainage falls are flat, and flood-test prior to protective tiles.',
          },
          {
            question: 'How do you price unknown defects uncovered during strip-out?',
            answer: 'Our initial survey identifies visible risks and establishes transparent unit rates in the BOQ for any concealed structural or riser repairs.',
          },
        ],
      },
    ],
  },
  {
    number: '02',
    title: 'Interior Fit-Out & Renovation',
    slug: 'interior-fit-out-dubai',
    tagline: 'Turnkey commercial fit-outs, retail showrooms, and full residential renovations.',
    description:
      'Precision interior fit-out and renovation contracting across Dubai, uniting strip-out, MEP adaptation, bespoke joinery, and architectural finishes under disciplined site management.',
    image: IMG_FITOUT,
    qualityPoints: [
      {
        title: 'One Contract, One Sequence',
        detail: 'Demolition, partition framing, first-fix MEP, ceiling closure, and joinery follow strict trade hold points.',
      },
      {
        title: 'Scope Defined Before Pricing',
        detail: 'Detailed finish schedules, hardware allowances, and MEP alterations are locked into a clear BOQ.',
      },
      {
        title: 'Approvals Built Into the Plan',
        detail: 'Building management fit-out permits, Civil Defence fire-alarm modifications, and authority NOCs are tracked from day one.',
      },
      {
        title: 'Inspection at Every Stage',
        detail: 'Above-ceiling MEP sign-off, acoustic seal verification, and line-by-line snagging precede handover.',
      },
    ],
    faqs: [
      {
        question: 'Do you handle Civil Defence and building management approvals for commercial fit-outs?',
        answer:
          'Yes. Any partition change affecting sprinklers, smoke detectors, or emergency lighting requires Civil Defence coordination and landlord fit-out sign-off, which we manage.',
      },
      {
        question: 'What is the difference between Category A and turnkey Category B fit-out?',
        answer:
          'Category A prepares the shell with raised floors, basic ceilings, and primary MEP, whereas turnkey Category B completes cellular partitions, boardrooms, joinery, lighting, and branding.',
      },
      {
        question: 'Do you fabricate custom joinery in-house or through controlled workshops?',
        answer:
          'All bespoke cabinetry, wall panelling, and reception desks are produced from approved shop drawings with pre-delivery workshop quality checks before site installation.',
      },
    ],
    children: [
      {
        title: 'Turnkey Interior Fit-Out',
        slug: 'turnkey-interior-fit-out',
        summary: 'End-to-end execution from bare shell-and-core spaces to fully commissioned residential and commercial interiors.',
        image: IMG_FITOUT,
        covers: [
          'As-built laser measurement, partition layout setting-out, and landlord fit-out permit coordination',
          'Full MEP distribution including FCU ducting, chilled water piping, small power, lighting, and data',
          'Drywall and acoustic partitioning, shadow-gap ceilings, flooring, stone cladding, and bespoke joinery',
          'Final testing, balancing, deep builder clean, and documented snag clearance',
        ],
        delivery: [
          'Coordinated reflected ceiling and MEP shop drawings preventing clashes between diffusers, sprinklers, and luminaires',
          'Above-ceiling pressure and light-leak inspection before gypsum boarding closes',
          'Sequential protection of finished marble, timber, and glazing through final commissioning',
        ],
        deliverables: [
          'Complete shop drawing and material submittal register',
          'TAB (Testing, Adjusting, and Balancing) air-flow report and electrical load schedules',
          'As-built documentation and single-point handover dossier',
        ],
        faqs: [
          {
            question: 'Can you work from our interior designer’s concept package?',
            answer: 'Yes. We translate concept drawings into buildable shop drawings, verify site dimensions, and execute the complete fit-out.',
          },
          {
            question: 'How long does a typical turnkey fit-out take?',
            answer: 'Timelines depend on built-up area and joinery lead times; a detailed Gantt programme is issued before mobilisation.',
          },
          {
            question: 'How do you manage landlord security deposits and building rules?',
            answer: 'We comply strictly with building protection standards, service-lift booking rules, and waste removal permits to secure clean deposit release.',
          },
        ],
      },
      {
        title: 'Commercial Office Fit-Out',
        slug: 'commercial-office-fit-out',
        summary: 'High-performance corporate offices, boardrooms, and executive suites built for acoustic privacy and MEP reliability.',
        image: IMG_FITOUT,
        covers: [
          'Double-glazed acoustic office fronts, demountable or drywall partitions, and meeting suite framing',
          'Raised access flooring, carpet tiles, poured terrazzo or honed stone reception floors',
          'Structured Cat6A cabling, server room cooling, UPS distribution, and architectural linear lighting',
          'Pantry wet areas, executive washrooms, acoustic baffles, and custom credenza joinery',
        ],
        delivery: [
          'Acoustic mineral wool infill and perimeter deflection-head sealing at slab soffits',
          'Dedicated fresh-air and CO2 ventilation balancing for high-occupancy boardrooms',
          'Fire-alarm and sprinkler head relocation certified by specialist Civil Defence-approved testing',
        ],
        deliverables: [
          'Approved authority completion certificates and landlord handover sign-off',
          'Tested data cabling patch schedules and electrical circuit directories',
          'Maintenance guide for acoustic partitions, hardware, and MEP controls',
        ],
        faqs: [
          {
            question: 'Do you install acoustic glass partitions for meeting rooms?',
            answer: 'Yes. We install single and double-glazed slim-profile aluminium and steel-framed systems with acoustic drop seals and timber or glazed doors.',
          },
          {
            question: 'Can you upgrade existing office AC zones when adding new enclosed rooms?',
            answer: 'Yes. Adding enclosed offices almost always requires thermostat zoning, return-air transfer ducts, and diffuser rebalancing so rooms do not overheat.',
          },
          {
            question: 'Do you coordinate out-of-hours work in occupied commercial towers?',
            answer: 'Yes. Core drilling, deliveries, and noisy works are scheduled strictly in night or weekend slots per tower management permits.',
          },
        ],
      },
      {
        title: 'Retail & Showroom Fit-Out',
        slug: 'retail-showroom-fit-out',
        summary: 'Durable, high-precision retail environments and product showrooms engineered for heavy footfall and exact lighting.',
        image: IMG_FITOUT,
        covers: [
          'Shopfront structural glazing, automated shutters, signage structural backing, and threshold detailing',
          'High-load display walls, concealed track lighting grids, and colour-accurate CRI 90+ luminaire installation',
          'Hard-wearing large-format porcelain, natural stone, or seamless microcement flooring',
          'Point-of-sale counters, stockroom racking zones, and fire-rated back-of-house partitions',
        ],
        delivery: [
          'Mall management design-submission coordination and strict night-shift site logistics',
          'Precision floor levelling prior to large-format slab installation to prevent lippage under grazing light',
          'Pre-wired display joinery with concealed driver access panels for rapid future servicing',
        ],
        deliverables: [
          'Mall handover clearance and Civil Defence fire-safety compliance documentation',
          'Accessible lighting driver schedules and spare finish batches for ongoing upkeep',
          'As-built shopfront and MEP drawings',
        ],
        faqs: [
          {
            question: 'Are you experienced with mall and retail plaza fit-out guidelines?',
            answer: 'Yes. We prepare full technical submittals, adhere to hoarding graphics and dust-containment rules, and coordinate night-access logistics.',
          },
          {
            question: 'How do you handle lighting driver accessibility in display ceilings?',
            answer: 'Drivers and transformers are grouped in ventilated, accessible ceiling hatches or remote service cupboards rather than sealed behind drywall.',
          },
          {
            question: 'Can existing showroom MEP capacity be verified before signing a lease?',
            answer: 'Yes. Through a pre-lease site visit we assess electrical load, chilled water tonnage, and drainage points against your display requirements.',
          },
        ],
      },
      {
        title: 'Villa & Apartment Renovation',
        slug: 'villa-apartment-renovation',
        summary: 'Complete strip-out and architectural renewal of existing villas and apartments across Dubai communities.',
        image: IMG_FINISHING,
        covers: [
          'Controlled demolition of dated partitions, ceilings, tile beds, and non-compliant MEP installations',
          'Re-screeded floors, new wet-area waterproofing, upgraded plumbing manifolds, and rewired distribution boards',
          'Flush shadow-gap gypsum ceilings, concealed linear AC slots, architectural lighting, and bespoke wardrobes',
          'Full facade refresh, aluminium window upgrades, and external terrace resurfacing',
        ],
        delivery: [
          'Pre-demolition isolation of live risers, power circuits, and neighbouring structural interfaces',
          'Full pressure testing of concealed PPR/PEX plumbing and AC drain lines before closing walls',
          'Moisture-meter verification on screeds prior to engineered wood or resin flooring',
        ],
        deliverables: [
          'Transparent strip-out and rebuild BOQ with approved finish sample boards',
          'Updated electrical load schedule and plumbing isolation valve map',
          'Snag-free handover with spare tiles, paint codes, and warranty records',
        ],
        faqs: [
          {
            question: 'Is a full strip-out better than tiling over existing floors?',
            answer: 'In older villas and apartments, stripping back to slab allows us to renew ageing waterproofing, re-route plumbing, and level substrates properly rather than masking defects.',
          },
          {
            question: 'Do you handle Emaar, Nakheel, and Dubai Holding renovation NOCs?',
            answer: 'Yes. We prepare the required architectural and MEP modification drawings to obtain community NOCs before work starts.',
          },
          {
            question: 'Can you replace dated bulkhead ceilings with modern minimal profiles?',
            answer: 'Yes. After assessing existing chilled water pipework and duct heights, we re-route services to maximise clear ceiling height.',
          },
        ],
      },
      {
        title: 'Bathroom Renovation',
        slug: 'bathroom-renovation',
        summary: 'Leak-proof wet rooms and architectural bathrooms built with tested waterproofing and concealed sanitary systems.',
        image: IMG_FINISHING,
        covers: [
          'Complete strip-out to structural slab and blockwork, removing deteriorated screed and old pipework',
          'Two-coat waterproofing membrane with corner reinforcing tape and 48-hour flood testing',
          'Concealed cistern frames, thermostatic mixer valves, linear floor drains, and sloped shower screeds',
          'Mitred porcelain or natural stone wall cladding, custom vanity joinery, and frameless tempered glass enclosures',
        ],
        delivery: [
          'Laser-verified floor gradients directing water cleanly to linear or point drains with zero ponding',
          '10-bar pressure testing on concealed hot and cold supply lines prior to tiling',
          'Silicone expansion joints at all wall-to-floor and wet-corner junctions instead of rigid grout',
        ],
        deliverables: [
          'Documented flood-test and pipe-pressure sign-off prior to tile closure',
          'Accessible service hatches or removable valve plates for concealed cistern maintenance',
          'Completed bathroom with balanced extract ventilation and moisture-resistant paint finishes',
        ],
        faqs: [
          {
            question: 'How do you ensure a renovated bathroom will not leak into the room below?',
            answer: 'We strip back to bare concrete, prime, apply continuous elastomeric waterproofing turned up the walls, and run a 48-hour standing water test before laying screed or tile.',
          },
          {
            question: 'Can you convert a standard bathtub layout into a walk-in curbless shower?',
            answer: 'Where existing slab thickness and trap depth permit—or by creating a subtle raised wet-zone threshold—we engineer proper falls for walk-in showers.',
          },
          {
            question: 'What tile adhesion system do you use for large-format porcelain?',
            answer: 'We use polymer-modified C2TE S1 adhesives with full back-buttering and mechanical levelling clips to prevent hollow spots.',
          },
        ],
      },
      {
        title: 'Kitchen Renovation',
        slug: 'kitchen-renovation',
        summary: 'Structural layout reconfiguration, heavy-duty MEP rough-in, and precision kitchen cabinetry and stone installation.',
        image: IMG_FINISHING,
        covers: [
          'Opening kitchen walls (subject to structural verification) and reconfiguring island layouts',
          'Dedicated 32A/45A appliance spurs, isolator switches, under-sink drainage upgrades, and extract ducting',
          'Moisture-resistant carcass cabinetry, soft-close hardware, and quartz, sintered stone, or granite worktops',
          'Acoustic floor preparation, splashback cladding, and task/under-cabinet LED lighting',
        ],
        delivery: [
          'Exact 1:1 appliance cut-sheet verification before first-fix electrical and plumbing outlets are set',
          'Plumb and square wall plastering so tall larder units and stone upstands sit without tapered gaps',
          'Templated laser measurement for stone worktops after base cabinets are levelled and anchored',
        ],
        deliverables: [
          'Verified appliance connection schedule with clearly labelled isolation switches',
          'Sealed worktop joints, undermount sink waterproofing, and tested extract airflow',
          'Fully adjusted hinges, drawer runners, and clean handover documentation',
        ],
        faqs: [
          {
            question: 'Should MEP outlets be moved before ordering kitchen cabinets?',
            answer: 'Final cabinetry layout and appliance specifications must be agreed before first-fix MEP so water, drain, gas/induction, and hood extract points align accurately.',
          },
          {
            question: 'Can you relocate kitchen drainage to a central island?',
            answer: 'On ground-floor villas we can trench the slab to relocate drainage with proper fall; on apartments, island plumbing depends on slab rules and riser proximity.',
          },
          {
            question: 'Do you supply and install both the civil/MEP works and the cabinetry?',
            answer: 'Yes. Having one contractor manage wall preparation, MEP, tiling, and joinery prevents tolerance disputes between trades.',
          },
        ],
      },
    ],
  },
  {
    number: '03',
    title: 'MEP & HVAC',
    slug: 'mep-hvac-dubai',
    tagline: 'Mechanical, electrical, plumbing, and HVAC contracting built for UAE climate loads.',
    description:
      'Engineered mechanical, electrical, plumbing, and HVAC installation and upgrade services across residential and commercial properties in Dubai, built to DEWA and Civil Defence standards.',
    image: IMG_MEP,
    qualityPoints: [
      {
        title: 'One Contract, One Sequence',
        detail: 'First-fix containment, pressure testing, insulation, and second-fix termination follow strict builder coordination.',
      },
      {
        title: 'Scope Defined Before Pricing',
        detail: 'Heat-load calculations, electrical diversity schedules, and pipe sizing anchor every MEP proposal.',
      },
      {
        title: 'Approvals Built Into the Plan',
        detail: 'DEWA load upgrades, chilled water authority approvals, and Civil Defence life-safety compliance are mapped early.',
      },
      {
        title: 'Inspection at Every Stage',
        detail: 'Hydrostatic pipe tests, duct leakage checks, insulation resistance testing, and airflow balancing are documented.',
      },
    ],
    faqs: [
      {
        question: 'Do you carry out MEP upgrades in existing buildings with poor cooling or electrical tripping?',
        answer:
          'Yes. We begin with a diagnostic site survey—measuring static pressure, chilled water delta-T, and phase load balance—before proposing targeted remediation.',
      },
      {
        question: 'Are all electrical and plumbing installations tested before walls and ceilings are closed?',
        answer:
          'Yes. No pipework or conduit is concealed until hydrostatic pressure tests, gravity drain flow tests, and continuity checks are witnessed and logged.',
      },
      {
        question: 'Do you supply and install VRF, ducted split, and chilled water FCU systems?',
        answer:
          'Yes. We engineer and install chilled water FCUs/AHUs, VRF/VRV systems, package units, and concealed ducted splits matched to the building infrastructure.',
      },
    ],
    children: [
      {
        title: 'MEP Contracting & Installation',
        slug: 'mep-contracting-installation',
        summary: 'Integrated mechanical, electrical, and public health engineering installations for new builds and major refurbishments.',
        image: IMG_MEP,
        covers: [
          'Combined services coordination drawings integrating HVAC ducts, chilled water, electrical containment, and drainage',
          'Main and sub-main distribution boards, earthing systems, lighting control, and low-current containment',
          'Domestic cold/hot water booster sets, transfer pumps, PPR/copper risers, and acoustic soil stacks',
          'Full Testing and Commissioning (T&C) prior to building occupation',
        ],
        delivery: [
          'Dedicated vertical and horizontal service zones maintaining minimum drainage slopes and ceiling heights',
          'Properly sized vibration isolation hangers, expansion loops, and fire-rated penetration collars',
          'Witnessed hydrostatic, air-balancing, and insulation resistance test sheets per floor or zone',
        ],
        deliverables: [
          'Coordinated MEP shop drawings and updated as-built schematics',
          'Complete testing & commissioning dossier with serial numbers and equipment warranties',
          'Labelled valve charts and circuit breaker directories',
        ],
        faqs: [
          {
            question: 'Why combine MEP under a single contractor rather than hiring separate trades?',
            answer: 'Single-point MEP prevents ceiling space conflicts between ducts, drainage falls, and lighting trays, and eliminates finger-pointing during commissioning.',
          },
          {
            question: 'Do you install fire-stopping at slab and fire-wall penetrations?',
            answer: 'Yes. All pipe, duct, and cable tray penetrations through fire-rated boundaries are sealed with UL-listed intumescent collars and firestop sealants.',
          },
          {
            question: 'Can you upgrade an older villa’s entire MEP infrastructure during renovation?',
            answer: 'Yes. Complete MEP replacement—new DBs, wiring, insulated PEX/PPR plumbing, and high-efficiency HVAC—is one of our core renovation scopes.',
          },
        ],
      },
      {
        title: 'HVAC Installation & Maintenance',
        slug: 'hvac-installation-maintenance',
        summary: 'High-ambient UAE cooling systems engineered for quiet airflow, clean indoor air quality, and reliable humidity control.',
        image: IMG_MEP,
        covers: [
          'Heat-load verification and installation of chilled water FCUs, VRF systems, and concealed ducted splits',
          'Pre-insulated phenolic or galvanized steel ductwork with acoustic lining and linear slot plenums',
          'Dedicated fresh air handling units (FAHU), bathroom/kitchen extract fans, and condensate drain trapping',
          'Chemical coil flushing, actuator valve replacement, duct cleaning, and thermostat calibration',
        ],
        delivery: [
          'Sealed duct joints and airtight plenum connections preventing cold-air loss into false ceilings',
          'Sloped, insulated condensate drains with accessible clean-out tees to prevent ceiling water stains',
          'Anemometer airflow balancing at every supply diffuser and return grille',
        ],
        deliverables: [
          'Room-by-room airflow and temperature commissioning report',
          'Properly sized access panels positioned directly beneath FCU filters, valves, and drain trays',
          'Preventative maintenance schedule tailored to Dubai dust and summer peak loads',
        ],
        faqs: [
          {
            question: 'Why do newly renovated spaces sometimes suffer from noisy AC or condensation?',
            answer: 'This usually results from undersized plenums, uninsulated duct transitions, or poorly trapped condensate drains. We size plenums for low velocity and insulate all cold surfaces continuously.',
          },
          {
            question: 'Can you replace noisy old FCUs without demolishing the entire ceiling?',
            answer: 'Often yes, by creating a neat framed access opening sized to the unit footprint, replacing the FCU, flushing strainers, and reinstating a flush plasterable access hatch.',
          },
          {
            question: 'How often should HVAC systems be serviced in Dubai?',
            answer: 'Filter and drain-line checks quarterly, with full coil chemical wash, belt/fan inspection, and electrical terminal torque checks twice yearly ahead of peak summer.',
          },
        ],
      },
      {
        title: 'Electrical Works',
        slug: 'electrical-works',
        summary: 'Safe, balanced LV power distribution, architectural lighting wiring, and fault diagnostics to DEWA regulations.',
        image: IMG_MEP,
        covers: [
          'Main distribution boards (MDB), sub-main distribution boards (SMDB), final DB dressing, and RCCB/ELCB protection',
          'Phase balancing, load calculations, armoured SWA sub-main cabling, and external weatherproof circuits',
          'DALI/0-10V dimming wiring, architectural linear LED drivers, emergency lighting, and surge protection',
          'Thermographic hotspot scanning, earth-loop impedance testing, and nuisance-tripping rectification',
        ],
        delivery: [
          'Strict colour-coded cabling inside PVC or GI conduit with heat-resistant glands and ferrules',
          'Megger insulation resistance and earth-fault loop testing prior to energisation',
          'Dedicated circuit separation for kitchen appliances, HVAC compressors, pool pumps, and EV chargers',
        ],
        deliverables: [
          'Typewritten circuit directory fixed inside every distribution board door',
          'Insulation resistance, earth continuity, and RCD trip-time test certificates',
          'Load balancing verification log across L1, L2, and L3 phases',
        ],
        faqs: [
          {
            question: 'Can you diagnose recurring breaker trips or uneven phase loads?',
            answer: 'Yes. We inspect DB terminations, test insulation resistance across circuits, measure clamp-amp draw per phase, and rebalance loads cleanly.',
          },
          {
            question: 'Do you install EV charger circuits in villas and commercial parking?',
            answer: 'Yes. We assess spare DB capacity, pull appropriately rated armoured cabling with dedicated Type-A/B protection, and mount weatherproof isolators.',
          },
          {
            question: 'How do you manage concealed LED strip drivers so they do not fail prematurely?',
            answer: 'We specify branded constant-voltage drivers with thermal headroom and house them in ventilated remote enclosures rather than sealed ceiling voids.',
          },
        ],
      },
      {
        title: 'Plumbing & Sanitary Works',
        slug: 'plumbing-sanitary-works',
        summary: 'Pressurised water supply networks, acoustic drainage stacks, pump systems, and sanitary ware installation.',
        image: IMG_MEP,
        covers: [
          'PPR and PEX-a manifold water distribution, pressure-reducing valves, and hot-water recirculation loops',
          'Booster pump sets, variable-frequency drive pumps, GRP water tank cleaning, and UV/filtration skids',
          'Acoustic uPVC/HDPE soil and waste stacks, floor traps with water seals, and grease trap installations',
          'Second-fix sanitary ware, concealed mixers, bidet assemblies, and linear shower channels',
        ],
        delivery: [
          'Manifold-fed pipework minimising concealed underground or in-wall joints',
          '10-bar hydrostatic pressure holding tests for 24 hours on supply lines and full-bore flow tests on drains',
          'Isolation angle valves and non-return check valves installed for straightforward servicing',
        ],
        deliverables: [
          'Pressure test log sheets and manifold circuit labelling',
          'Balanced hot/cold water pressure across upper floors',
          'Clean odour-free drainage with verified trap seals',
        ],
        faqs: [
          {
            question: 'Why does low water pressure or fluctuating hot water happen in multi-storey villas?',
            answer: 'Undersized risers, clogged inline strainers, or poorly calibrated booster pumps cause pressure drops. Installing zoned manifolds and VFD booster pumps solves this.',
          },
          {
            question: 'How do you prevent bathroom drainage odours?',
            answer: 'We ensure every floor gully maintains a proper water trap seal, verify stack venting to roof level, and seal sanitary waste sleeves tightly.',
          },
          {
            question: 'Do you replace corroded galvanised pipes in older Dubai properties?',
            answer: 'Yes. We replace corroded steel or brittle early-generation pipes with thermally fusion-welded PPR or flexible PEX-a manifold systems.',
          },
        ],
      },
      {
        title: 'Electromechanical Equipment Installation & Maintenance',
        slug: 'electromechanical-equipment-installation-maintenance',
        summary: 'Installation, alignment, and preventive care for building plant, pumps, ventilation fans, and control panels.',
        image: IMG_MEP,
        covers: [
          'Chilled water circulation pumps, domestic booster skids, sewage/stormwater submersible sump pumps',
          'Smoke extract fans, car park jet fans, kitchen ecology units, and make-up air plant',
          'Motor control centres (MCC), VFD drives, float switches, and BMS interface wiring',
          'Vibration isolation plinths, flexible bellows, non-return valves, and pressure gauge assemblies',
        ],
        delivery: [
          'Inertia base pouring, laser shaft alignment, and anti-vibration spring mount installation',
          'Dry-run protection, phase-failure relay verification, and thermal overload calibration',
          'Structured preventative checks covering bearing noise, seal leakage, and amperage draw',
        ],
        deliverables: [
          'Equipment commissioning sheets recording rated vs measured amp draw and flow pressure',
          'Tagged isolation valves and emergency stop controls in plant rooms',
          'Preventative maintenance logs supporting uninterrupted building operation',
        ],
        faqs: [
          {
            question: 'Do you service basement sump pumps and transfer pump rooms?',
            answer: 'Yes. We inspect float switches, non-return valves, control panel contactors, and pump impellers, replacing failed units with matched duty/standby sets.',
          },
          {
            question: 'Can you upgrade fixed-speed pumps to VFD-controlled booster sets?',
            answer: 'Yes. Variable-frequency drives maintain constant water pressure across changing demand while reducing water-hammer stress on building risers.',
          },
          {
            question: 'What is included in electromechanical handover documentation?',
            answer: 'Pump curves, wiring schematics, manufacturer datasheets, and recorded baseline operating currents and pressures.',
          },
        ],
      },
    ],
  },
  {
    number: '04',
    title: 'Interior Finishing',
    slug: 'interior-finishing-dubai',
    tagline: 'Ceilings, stone and tile work, flooring, painting, joinery, and architectural glazing.',
    description:
      'Architectural finishing trades executed with tight tolerances, plumb substrates, and coordinated shadow-gap detailing across villas, apartments, offices, and retail showrooms.',
    image: IMG_FINISHING,
    qualityPoints: [
      {
        title: 'One Contract, One Sequence',
        detail: 'Moisture testing, primer sealing, gypsum closure, tiling, and joinery follow strict climate-controlled sequencing.',
      },
      {
        title: 'Scope Defined Before Pricing',
        detail: 'Profiles, shadow gaps, grout widths, timber veneers, and hardware codes are specified before fabrication.',
      },
      {
        title: 'Approvals Built Into the Plan',
        detail: 'Physical mock-up panels and sample boards are signed off before bulk room application begins.',
      },
      {
        title: 'Inspection at Every Stage',
        detail: 'Grazing-light wall checks, hollow-tile sounding, and joinery alignment tolerances are verified before handover.',
      },
    ],
    faqs: [
      {
        question: 'Why do paint and joinery finishes fail early in poorly managed projects?',
        answer:
          'Installing wood or paint before concrete screeds dry and AC humidity is stabilised causes warping, blistering, and joint opening. We condition spaces prior to finishing.',
      },
      {
        question: 'Do you produce physical material samples and room mock-ups?',
        answer:
          'Yes. For projects with bespoke paint textures, stone mitres, or custom timber stains, we prepare sign-off samples under site lighting before full rollout.',
      },
      {
        question: 'Can we engage CLSF for interior finishing packages on an existing shell?',
        answer:
          'Yes. We execute standalone finishing packages—ceilings, tiling, joinery, painting, and glazing—for shells completed by third-party civil contractors.',
      },
    ],
    children: [
      {
        title: 'Gypsum Ceiling & Partitions',
        slug: 'gypsum-ceiling-partitions',
        summary: 'Flush shadow-gap ceilings, acoustic drywall partitions, concealed curtain pelmets, and linear AC slot frames.',
        image: IMG_FINISHING,
        covers: [
          'Moisture-resistant (MR), fire-rated (FR), and acoustic double-boarded drywall partition systems',
          'Level-5 taped and skimmed flat ceilings, recessed shadow-gap perimeter trims, and light coves',
          'Frameless plaster-in linear AC diffuser plenums and concealed motorised curtain tracks',
          'Flush-beaded access hatches aligned to ceiling grids for FCU and valve maintenance',
        ],
        delivery: [
          'Galvanised GI channel framing fixed with proper hanger spacings and acoustic deflection heads',
          'Independent MEP sign-off conducted inside ceiling voids prior to boarding closure',
          'Reinforced paper-tape jointing and full skim-coat preparation checked under raking light',
        ],
        deliverables: [
          'Laser-level flat ceilings free from joint telegraphing under architectural grazing light',
          'Clearly positioned, flush-finished MEP access hatches',
          'Acoustic-sealed partitions meeting room-to-room privacy requirements',
        ],
        faqs: [
          {
            question: 'How do you prevent hairline cracks along gypsum ceiling joints?',
            answer: 'We use proper perimeter shadow-gap trims or control joints on long spans, screw-fix boards at exact centres to rigid GI framing, and reinforce joints with paper tape.',
          },
          {
            question: 'What board type is used in bathrooms and kitchens?',
            answer: 'Wet zones receive moisture-resistant green board or cement board behind tile areas, paired with rust-resistant fasteners.',
          },
          {
            question: 'Can you integrate concealed linear diffusers without visible frames?',
            answer: 'Yes. Plaster-in aluminium slot diffusers are set into the GI frame prior to skimming so only a clean shadow slot remains visible.',
          },
        ],
      },
      {
        title: 'Flooring Installation',
        slug: 'flooring-installation',
        summary: 'Subfloor levelling, engineered timber, herringbone parquet, microcement, terrazzo, and commercial vinyl.',
        image: IMG_FINISHING,
        covers: [
          'Self-levelling cementitious screeds verified with straightedge flatness tolerances',
          'Moisture vapour barrier priming prior to engineered oak, herringbone, or chevron timber',
          'Commercial carpet tiles, acoustic underlays, raised access floor panels, and seamless resin/microcement',
          'Flush brass, bronze, or stainless threshold transitions between stone and timber zones',
        ],
        delivery: [
          'Digital calcium-carbide or pinless hygrometer slab moisture testing prior to wood adhesive application',
          '72-hour timber acclimatisation inside air-conditioned rooms before laying',
          'Perimeter expansion gaps concealed cleanly beneath recessed or flush skirtings',
        ],
        deliverables: [
          'Flat, squeak-free flooring with flush threshold detailing across doorways',
          'Moisture test log records supporting manufacturer timber warranties',
          'Protective breathable floor covering maintained until final deep clean',
        ],
        faqs: [
          {
            question: 'Is engineered timber suitable for Dubai villas and apartments?',
            answer: 'Yes, provided the subfloor moisture content is verified low, quality MS-polymer adhesive is used, and indoor AC humidity remains regulated.',
          },
          {
            question: 'How do you achieve a flush transition between marble and wood flooring?',
            answer: 'We adjust screed depths per room during substrate preparation so finished floor heights match exactly at a hairline metal divider.',
          },
          {
            question: 'Can raised access floors be retrofitted for offices?',
            answer: 'Yes, subject to existing floor-to-slab clearance and door head heights, allowing flexible under-floor power and data routing.',
          },
        ],
      },
      {
        title: 'Floor & Wall Tiling',
        slug: 'floor-wall-tiling',
        summary: 'Precision installation of large-format porcelain slabs, natural marble, travertine, and mosaic finishes.',
        image: IMG_FINISHING,
        covers: [
          'Bookmatched marble and sintered stone wall cladding using mechanical anchors and epoxy adhesives',
          'Large-format porcelain floor tiling with tight 1.5–2mm rectified grout lines',
          'External terrace and poolside anti-slip stone laid over drainage mats or pedestal systems',
          '45-degree mitred corner edge profiles filled with colour-matched resin',
        ],
        delivery: [
          'Dry-lay vein matching and tile set-out planning so cut slivers never occur at prominent corners',
          'Full-bed notched trowelling and back-buttering to achieve near-100% adhesive coverage',
          'Hollow-spot acoustic tapping checks before grouting begins',
        ],
        deliverables: [
          'Lippage-free surfaces aligned across wall and floor grout axes',
          'Stain-resistant epoxy grouting in wet areas and kitchen zones',
          'Penetrating stone sealing applied to natural marble and travertine',
        ],
        faqs: [
          {
            question: 'Do large-format porcelain slabs require special adhesives and handling?',
            answer: 'Yes. Slabs of 1200x2400mm and above require C2TE S1/S2 deformable adhesives, double-sided buttering, suction-frame handling, and vibration compaction.',
          },
          {
            question: 'Can you mitre tile edges instead of using plastic corner trims?',
            answer: 'Yes. We wet-cut 45-degree mitres and finish edges with colour-matched two-part resin for clean monolithic corners.',
          },
          {
            question: 'How do you prevent efflorescence on outdoor travertine terraces?',
            answer: 'We use low-alkali drainage screeds, waterproof the structural slab underneath, and seal stone pores cleanly.',
          },
        ],
      },
      {
        title: 'Painting & Decorative Finishes',
        slug: 'painting-decorative-finishes',
        summary: 'Level-5 smooth architectural emulsion, limewash, mineral plaster, and external elastomeric coatings.',
        image: IMG_FINISHING,
        covers: [
          'Full wall scraping, crack-bridging fibreglass mesh on dissimilar junctions, and multi-coat putty skimming',
          'Low-VOC matte washable architectural paints (Jotun, Dulux, or specified European mineral paints)',
          'Limewash, Venetian plaster, microcement wall finishes, and textured mineral renders',
          'External weather-shield masonry coatings and electrostatic metal frame spraying',
        ],
        delivery: [
          'Fine-grit mechanical vacuum sanding inspected under angled halogen grazing light',
          'Alkali-resistant primer sealing on fresh plaster before topcoat application',
          'Sharp masking lines at shadow gaps, stone skirtings, and timber architraves',
        ],
        deliverables: [
          'Uniform, lap-free walls and ceilings inspected under final architectural lighting',
          'Logged paint batch numbers and colour codes for future touch-ups',
          'Protected surfaces until final handover',
        ],
        faqs: [
          {
            question: 'What achieves a truly smooth wall without roller stipple or patch marks?',
            answer: 'Full-surface skim coating, vacuum sanding checked with grazing light, proper primer sealing, and consistent wet-edge rolling or airless spraying.',
          },
          {
            question: 'Do you handle exterior villa repainting and crack repair?',
            answer: 'Yes. We rout out thermal shrinkage cracks, fill with flexible elastomeric compound, prime chalking surfaces, and apply UV-resistant exterior systems.',
          },
          {
            question: 'Are low-VOC paints available for occupied properties?',
            answer: 'Yes. We specify zero- or low-VOC waterborne emulsions so spaces can be reoccupied promptly without lingering solvent odour.',
          },
        ],
      },
      {
        title: 'Wallpaper & Wall Cladding',
        slug: 'wallpaper-wall-cladding',
        summary: 'Architectural wallcoverings, fluted stone and timber panelling, acoustic slats, and feature wall systems.',
        image: IMG_FINISHING,
        covers: [
          'Commercial vinyl, linen, silk, and wide-format digital mural wallcoverings',
          'Fluted travertine, walnut, and oak timber wall panelling with concealed shadow reveals',
          'Perforated acoustic timber panels and fabric-wrapped acoustic wall systems for offices and cinemas',
          'Brushed metal inlay strips and concealed jib-door integration flush with wall cladding',
        ],
        delivery: [
          'Sealed, neutral-pH wall priming before wallpaper hanging to allow future removal without tearing plaster',
          'Laser-plumb first drop alignment and tight butt-seaming using non-staining heavy-duty adhesives',
          'Concealed French-cleat or Z-clip subframes behind heavy wall cladding for service access',
        ],
        deliverables: [
          'Seamless pattern alignment across corners, sockets, and flush jib doors',
          'Precision cut-outs around switches and architectural sconces',
          'Retained offcuts labelled by room for future repairs',
        ],
        faqs: [
          {
            question: 'Can you integrate flush concealed doors into fluted timber or stone walls?',
            answer: 'Yes. Using concealed 3D-adjustable hinges and frameless door frames, cladding runs continuously across the door leaf.',
          },
          {
            question: 'Why does wallpaper sometimes peel at seams in Dubai?',
            answer: 'Unsealed porous gypsum absorbs paste unevenly, and high indoor humidity softens weak adhesives. Proper sizing primer and mildew-resistant paste prevent seam lifting.',
          },
          {
            question: 'Do you install commercial-grade wallcoverings for offices and clinics?',
            answer: 'Yes. We hang Type II heavy-duty washable vinyl wallcoverings suited to corridors and reception spaces.',
          },
        ],
      },
      {
        title: 'Carpentry & Joinery',
        slug: 'carpentry-joinery',
        summary: 'Bespoke architectural millwork, wardrobes, kitchen cabinetry, vanity units, and reception desks.',
        image: IMG_FINISHING,
        covers: [
          'Custom floor-to-ceiling wardrobes with integrated LED sensor lighting and leather/linen drawer inserts',
          'Kitchen cabinetry, pantry systems, bathroom vanities, and built-in media walls',
          'Executive boardroom tables, reception counters, acoustic wall panelling, and bespoke timber shelving',
          'Moisture-resistant MDF, marine plywood, solid ash/oak/walnut, and bookmatched architectural veneers',
        ],
        delivery: [
          'Site-measured 3D shop drawings issued for sign-off before workshop CNC cutting begins',
          'PU-lacquered or natural oil finishes applied in dust-controlled spray booths',
          'Scribed filler panels closing cleanly to walls and ceilings without bulky trims',
        ],
        deliverables: [
          'Approved joinery shop drawings and hardware schedule (Blum, Hafele, or specified architectural bronze)',
          'Consistent 2–3mm door reveal gaps across multi-door wardrobe banks',
          'Integrated concealed power/data cable management on commercial desks',
        ],
        faqs: [
          {
            question: 'What core board do you recommend for wet-area vanities and kitchens?',
            answer: 'We use marine-grade plywood or high-density moisture-resistant MR-MDF for carcasses, sealed on all exposed edges to resist humidity.',
          },
          {
            question: 'When are site measurements taken for custom wardrobes?',
            answer: 'Final fabrication measurements are taken after wall plastering and floor screeds or tiles are laid so vertical heights and wall plumbness are exact.',
          },
          {
            question: 'Can you match timber stains to existing doors or flooring?',
            answer: 'Yes. Our finishing workshop produces stained sample blocks against your flooring or door veneer for approval prior to spraying.',
          },
        ],
      },
      {
        title: 'Doors, Glass & Aluminium Works',
        slug: 'doors-glass-aluminium-works',
        summary: 'Acoustic and fire-rated doors, slimline aluminium glazing, balustrades, and frameless shower systems.',
        image: IMG_EXT,
        covers: [
          'Solid-core timber, flush concealed-frame, and Civil Defence-certified fire-rated doors',
          'Thermally broken slimline aluminium sliding doors, casement windows, and curtain-wall glazing',
          'Double-glazed acoustic office partitions, laminated structural glass balustrades, and skylights',
          'Frameless shower screens, architectural mirrors, and brushed bronze or anodised ironmongery',
        ],
        delivery: [
          'Structural aperture checks, EPDM weather gaskets, and multi-point silicone perimeter sealing',
          'Laser-aligned tracks for large sliding patio doors ensuring smooth finger-tip rolling load',
          'Water-hose spray testing on external window and sliding door perimeters',
        ],
        deliverables: [
          'Certified tempered/laminated safety glass stamped to architectural specifications',
          'Smooth door latching, calibrated hydraulic closers, and aligned drop seals',
          'Watertight, acoustically insulated external glazing assemblies',
        ],
        faqs: [
          {
            question: 'Do you upgrade single-glazed villa windows to double-glazed thermal systems?',
            answer: 'Yes. Upgrading to thermally broken aluminium profiles with solar-control double glazing substantially reduces heat gain and external street noise.',
          },
          {
            question: 'Can you supply fire-rated doors with Civil Defence certification for commercial offices?',
            answer: 'Yes. We supply and install labelled 60- and 90-minute fire-rated timber and steel doors complete with intumescent seals and panic hardware.',
          },
          {
            question: 'How do you detail floor-to-ceiling sliding doors against dust and rain?',
            answer: 'We set recessed drainage channels into the threshold sill, use brush and EPDM compression seals, and seal perimeter frames with neutral-cure weather silicone.',
          },
        ],
      },
    ],
  },
  {
    number: '05',
    title: 'Building Maintenance & AMC',
    slug: 'building-maintenance-dubai',
    tagline: 'Planned Annual Maintenance Contracts, villa care, commercial upkeep, and pool engineering.',
    description:
      'Structured Annual Maintenance Contracts (AMC) and reactive technical call-outs across Dubai, preserving MEP asset reliability, building fabric condition, and water quality.',
    image: IMG_POOL,
    qualityPoints: [
      {
        title: 'One Contract, One Sequence',
        detail: 'Scheduled preventive visits cover HVAC, electrical, plumbing, and civil fabric under one coordinated calendar.',
      },
      {
        title: 'Scope Defined Before Pricing',
        detail: 'Asset registers, visit frequencies, SLA response windows, and spare-parts exclusions are documented upfront.',
      },
      {
        title: 'Approvals Built Into the Plan',
        detail: 'Community access passes, roof safety permits, and water-tank compliance certificates are maintained continuously.',
      },
      {
        title: 'Inspection at Every Stage',
        detail: 'Every preventive visit produces a digital checklist recording measurements, defects cleared, and recommendations.',
      },
    ],
    faqs: [
      {
        question: 'What is covered under a CLSF Annual Maintenance Contract (AMC)?',
        answer:
          'An AMC schedules quarterly or monthly preventive servicing for HVAC, electrical distribution, plumbing, pumps, and building fabric, alongside 24/7 priority reactive call-outs.',
      },
      {
        question: 'Are spare parts included in the AMC fee?',
        answer:
          'Standard consumables such as filters, belts, and grease can be included, while major replacement components are quoted transparently with pre-agreed mark-up or direct pass-through.',
      },
      {
        question: 'Do you build an asset register before starting a commercial building AMC?',
        answer:
          'Yes. Upon onboarding, our engineers tag and inventory every AC unit, pump, distribution board, and water tank so maintenance history is tracked by asset.',
      },
    ],
    children: [
      {
        title: 'Building Maintenance & AMC',
        slug: 'building-maintenance-amc',
        summary: 'Scheduled preventative engineering and rapid reactive maintenance for residential buildings, villas, and commercial estates.',
        image: IMG_MEP,
        covers: [
          'Preventative HVAC servicing: filter cleaning, coil chemical wash, drain flushing, and refrigerant pressure checks',
          'Electrical inspections: DB terminal torqueing, thermographic scans, emergency lighting tests, and fault tracing',
          'Plumbing & pump care: booster pump servicing, float switches, water tank chlorination, and leak rectification',
          'Building fabric upkeep: sealant renewal, door hardware adjustment, grouting, and minor plaster/paint touch-ups',
        ],
        delivery: [
          'Initial technical audit establishing baseline asset condition and immediate snag remediation list',
          'Fixed annual calendar of planned preventive maintenance (PPM) visits',
          'Defined emergency SLA response times for power outages, burst pipes, or AC failures',
        ],
        deliverables: [
          'Asset-by-asset PPM service reports after every scheduled visit',
          'Tracked history of recurring faults to inform capital replacement planning',
          'Single point of contact for both planned servicing and urgent repairs',
        ],
        faqs: [
          {
            question: 'How quickly do you respond to emergency call-outs under an AMC?',
            answer: 'Critical emergencies such as active water leaks, main electrical loss, or server-room cooling failure receive priority dispatch within agreed SLA windows.',
          },
          {
            question: 'Can we start an AMC on a building with existing deferred maintenance?',
            answer: 'Yes. We conduct an onboarding survey, quote any upfront corrective works separately, and bring the building onto a clean PPM baseline.',
          },
          {
            question: 'Do you provide water tank cleaning and Municipality-aligned microbiological testing?',
            answer: 'Yes. Scheduled GRP/concrete water tank disinfection and laboratory water sampling can be included in annual building contracts.',
          },
        ],
      },
      {
        title: 'Villa Maintenance',
        slug: 'villa-maintenance',
        summary: 'Comprehensive annual and reactive technical care keeping private villas cool, dry, and mechanically sound.',
        image: IMG_VILLA,
        covers: [
          'Quarterly AC filter, drain-pan, and outdoor condenser servicing ahead of summer peaks',
          'Electrical troubleshooting, garden lighting repairs, gate motor servicing, and RCD protection checks',
          'Water heater element/thermostat replacement, booster pump upkeep, and silicone wet-area resealing',
          'Roof drain clearing before winter rains, external facade pressure washing, and timber decking oiling',
        ],
        delivery: [
          'Vetted in-house technicians working cleanly inside occupied homes with shoe covers and drop sheets',
          'Pre-summer and pre-winter seasonal readiness checklists',
          'Clear written quotations before replacing any out-of-scope faulty component',
        ],
        deliverables: [
          'Quarterly inspection report summarising AC temperatures, pump health, and fabric condition',
          'Clean, reliable home systems with reduced emergency breakdowns',
          'Dedicated maintenance coordinator reachable directly by phone or email',
        ],
        faqs: [
          {
            question: 'Do you handle both annual villa packages and one-off repair visits?',
            answer: 'Yes. Homeowners can enrol in a structured annual plan or book single diagnostic site visits for AC, plumbing, electrical, or damp issues.',
          },
          {
            question: 'Can you fix recurring AC ceiling leaks in villas?',
            answer: 'Yes. We trace blocked condensate lines, failing drain-pan insulation, or missing P-traps, clear the blockage, and reinstate damaged gypsum neatly.',
          },
          {
            question: 'Do you service villa water chillers and solar water heaters?',
            answer: 'Yes. Our technicians inspect roof tank chillers, circulation pumps, and solar thermal collector loops during scheduled visits.',
          },
        ],
      },
      {
        title: 'Commercial Property Maintenance',
        slug: 'commercial-property-maintenance',
        summary: 'Facility upkeep for offices, retail units, warehouses, and multi-tenant commercial buildings in Dubai.',
        image: IMG_FITOUT,
        covers: [
          'Chilled water FCU/AHU servicing, fresh air filter replacement, and BMS sensor verification',
          'Office lighting driver/luminaire replacement, floor-box power servicing, and DB maintenance',
          'High-traffic washroom plumbing, sensor taps, automatic door closers, and partition repairs',
          'Warehouse bay door servicing, epoxy floor patching, and loading bay safety upkeep',
        ],
        delivery: [
          'Out-of-hours preventive servicing to keep daytime commercial operations uninterrupted',
          'Consolidated monthly maintenance logs for facility managers and property owners',
          'Rapid make-good and end-of-lease reinstatement works between tenant handovers',
        ],
        deliverables: [
          'Monthly asset performance summary and compliance checklist',
          'Predictable annual upkeep budgeting with itemised call-out logs',
          'Consistent presentation across client-facing offices and showrooms',
        ],
        faqs: [
          {
            question: 'Can you maintain multiple retail or office branches under one contract?',
            answer: 'Yes. Multi-site commercial portfolios are managed under a unified schedule and consolidated monthly reporting.',
          },
          {
            question: 'Do you carry out tenant handover reinstatement ("make-good") works?',
            answer: 'Yes. When commercial tenants vacate, we restore ceilings, partitions, MEP, and flooring to landlord Category A handover standards.',
          },
          {
            question: 'Are your technicians insured to work in Grade-A commercial towers?',
            answer: 'Yes. We provide full work permits, method statements, and insurance certificates required by commercial tower management.',
          },
        ],
      },
      {
        title: 'Swimming Pool Maintenance',
        slug: 'swimming-pool-maintenance',
        summary: 'Water chemistry balancing, filtration plant engineering, tile grouting, and chiller/heater servicing for private and residential pools.',
        image: IMG_POOL,
        covers: [
          'Twice-weekly or weekly skimming, vacuuming, brushing, and water chemistry balancing (pH, free chlorine, alkalinity, TDS)',
          'Circulation pump, sand/cartridge filter media, dosing pump, and UV/salt-chlorinator servicing',
          'Pool chiller and heat-pump maintenance for year-round temperature stability',
          'Underwater mosaic tile re-grouting, balance tank waterproofing repairs, and coping stone sealing',
        ],
        delivery: [
          'Digital photometer water testing recorded on every visit rather than guesswork strip testing',
          'Inspection of pool pump room mechanical seals, pressure gauges, and backwash valves',
          'Structural leak detection using pressure testing on skimmer, return, and main drain lines when water loss occurs',
        ],
        deliverables: [
          'Clear, balanced, algae-free pool water safe for swimmers',
          'Recorded chemical dosing and plant pressure logs',
          'Extended equipment life for pumps, chillers, and underwater LED lighting',
        ],
        faqs: [
          {
            question: 'My pool is losing water—can you test whether it is evaporation or a pipe leak?',
            answer: 'Yes. We run controlled bucket evaporation comparisons alongside hydrostatic line pressure tests and dye testing around skimmers, lights, and balance tanks.',
          },
          {
            question: 'Do you also refurbish older tiled pools or convert chlorine pools to salt/mineral systems?',
            answer: 'Yes. We drain, re-waterproof, re-tile with glass or porcelain mosaics, and upgrade filtration and sanitisation skids.',
          },
          {
            question: 'Why does pool water turn cloudy or green during peak Dubai summer?',
            answer: 'High water temperatures above 32°C accelerate chlorine loss and algae growth. Properly sized pool chillers and balanced cyanuric acid levels maintain clarity.',
          },
        ],
      },
      {
        title: 'Building Cleaning Services',
        slug: 'building-cleaning-services',
        summary: 'Post-construction builder cleans, facade and glazing washing, deep stone care, and commercial common-area cleaning.',
        image: IMG_EXT,
        covers: [
          'Post-construction deep cleaning: fine gypsum dust extraction, paint/grout residue removal, and window track detailing',
          'External facade pressure washing, cladding cleaning, and high-reach external glazing care',
          'Natural marble and travertine deep scrubbing, diamond honing, and crystallisation',
          'Scheduled common-area lobby, corridor, basement, and stairwell contract cleaning',
        ],
        delivery: [
          'pH-neutral cleaning agents matched to natural stone, anodised aluminium, and lacquered joinery to prevent etching',
          'HEPA vacuum extraction across ceiling coves, wardrobe interiors, and HVAC grilles prior to handover',
          'Supervised cleaning checklists aligned with snagging handover sign-off',
        ],
        deliverables: [
          'Handover-ready properties free from construction dust, adhesive marks, and grout haze',
          'Restored natural sheen on stone lobbies and external travertine terraces',
          'Scheduled cleaning logs for managed residential and commercial buildings',
        ],
        faqs: [
          {
            question: 'Do you use acidic cleaners on marble or limestone during post-construction cleans?',
            answer: 'Never. Acidic descalers permanently etch marble, travertine, and brushed bronze hardware. We use pH-neutral stone-safe solutions and plastic scrapers.',
          },
          {
            question: 'Can we book a standalone deep clean before moving into a newly handed-over villa?',
            answer: 'Yes. We provide pre-move-in deep cleaning covering interiors, kitchens, bathrooms, window tracks, and external terraces.',
          },
          {
            question: 'Do you clean external glass facades and courtyard stonework?',
            answer: 'Yes. We handle low- and mid-rise facade washing, pergola dusting, and pressure washing of driveways and pool decks.',
          },
        ],
      },
    ],
  },
];

export function findCategoryBySlug(slug: string): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find((cat) => cat.slug === slug);
}

export function findChildService(
  categorySlug: string,
  childSlug: string
): { category: ServiceCategory; service: ServiceCategory['children'][number] } | undefined {
  const category = findCategoryBySlug(categorySlug);
  if (!category) return undefined;
  const service = category.children.find((child) => child.slug === childSlug);
  if (!service) return undefined;
  return { category, service };
}
