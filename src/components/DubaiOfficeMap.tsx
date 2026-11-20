import { useState } from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
} from '@vis.gl/react-google-maps';
import { BUSINESS_INFO } from '../data/business';
import { MapsProvider } from './MapsProvider';

interface HubMarker {
  id: string;
  name: string;
  subtitle: string;
  position: { lat: number; lng: number };
  primary?: boolean;
}

const CLSF_DUBAI_HUBS: HubMarker[] = [
  {
    id: 'hq-deira',
    name: 'CLSF Building Contracting — Head Office',
    subtitle: BUSINESS_INFO.address,
    position: { lat: 25.2571, lng: 55.3247 },
    primary: true,
  },
  {
    id: 'hub-business-bay',
    name: 'Business Bay & Downtown Corridor',
    subtitle: 'Commercial office fit-outs, MEP upgrades, and building AMC.',
    position: { lat: 25.1851, lng: 55.2654 },
  },
  {
    id: 'hub-dubai-hills',
    name: 'Dubai Hills & Emirates Living',
    subtitle: 'G+1 villa construction, structural extensions, and pool engineering.',
    position: { lat: 25.1072, lng: 55.2435 },
  },
  {
    id: 'hub-al-quoz',
    name: 'Al Quoz Showroom & Industrial Zone',
    subtitle: 'Retail showroom conversions, warehouses, and custom joinery logistics.',
    position: { lat: 25.1456, lng: 55.2286 },
  },
  {
    id: 'hub-marina',
    name: 'Dubai Marina & Jumeirah Coastal Strip',
    subtitle: 'Full strip-out apartment renovations, wet-zone waterproofing, and HVAC.',
    position: { lat: 25.0805, lng: 55.1403 },
  },
];

function OfficeMapInner() {
  const [selectedId, setSelectedId] = useState<string>('hq-deira');
  const selectedMarker = CLSF_DUBAI_HUBS.find((m) => m.id === selectedId) || null;

  return (
    <div className="h-[400px] w-full border border-[hsl(var(--border))] lg:h-[460px]">
      <GoogleMap
        mapId="DEMO_MAP_ID"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        defaultCenter={{ lat: 25.2571, lng: 55.3247 }}
        defaultZoom={11}
        gestureHandling="cooperative"
        className="h-full w-full"
      >
        {CLSF_DUBAI_HUBS.map((hub) => (
          <AdvancedMarker
            key={hub.id}
            position={hub.position}
            title={hub.name}
            onClick={() => setSelectedId(hub.id)}
          >
            <Pin
              background={hub.primary ? '#99774d' : '#1f1f1f'}
              borderColor="#f2f0ec"
              glyphColor="#f2f0ec"
            />
          </AdvancedMarker>
        ))}

        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedId('')}
          >
            <div className="max-w-xs p-1 text-[#1f1f1f]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#99774d]">
                {selectedMarker.primary ? 'Head Office' : 'Service Zone'}
              </p>
              <p className="mt-1 text-sm font-semibold">{selectedMarker.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#555555]">
                {selectedMarker.subtitle}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export function DubaiOfficeMap() {
  return (
    <MapsProvider>
      <OfficeMapInner />
    </MapsProvider>
  );
}
