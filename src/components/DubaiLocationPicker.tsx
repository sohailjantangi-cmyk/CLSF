import { useEffect, useRef, useState } from 'react';
import {
  AdvancedMarker,
  Map as GoogleMap,
  Pin,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { MapsProvider } from './MapsProvider';

interface LocationSelection {
  area: string;
  city: string;
  address: string;
}

interface DubaiLocationPickerProps {
  onSelectLocation: (loc: LocationSelection) => void;
}

const DUBAI_DEFAULT = { lat: 25.2048, lng: 55.2708 };

function LocationPickerInner({ onSelectLocation }: DubaiLocationPickerProps) {
  const map = useMap();
  const placesLibrary = useMapsLibrary('places');
  const autocompleteContainerRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelectLocation);
  onSelectRef.current = onSelectLocation;
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number }>(DUBAI_DEFAULT);
  const [selectedLabel, setSelectedLabel] = useState<string>('');

  useEffect(() => {
    if (!map || !placesLibrary || !autocompleteContainerRef.current) return;

    const autocomplete = new placesLibrary.PlaceAutocompleteElement({
      includedRegionCodes: ['ae'],
    });
    autocomplete.style.width = '100%';
    autocompleteContainerRef.current.appendChild(autocomplete);

    const handleSelect = (e: Event) => {
      interface AddressComponentShape {
        types: string[];
        longText?: string | null;
      }
      interface PlaceShape {
        viewport?: {
          getNorthEast(): { lat(): number; lng(): number };
          getSouthWest(): { lat(): number; lng(): number };
        };
        location?: { lat(): number; lng(): number };
        displayName?: string | null;
        formattedAddress?: string | null;
        addressComponents?: AddressComponentShape[];
        fetchFields(opts: { fields: string[] }): Promise<unknown>;
      }
      const selectEvent = e as Event & {
        placePrediction: { toPlace(): PlaceShape };
      };
      const place = selectEvent.placePrediction.toPlace();

      void place
        .fetchFields({
          fields: ['location', 'viewport', 'displayName', 'formattedAddress', 'addressComponents'],
        })
        .then(() => {
          if (place.viewport) {
            const ne = place.viewport.getNorthEast();
            const sw = place.viewport.getSouthWest();
            map.fitBounds({
              north: ne.lat(),
              east: ne.lng(),
              south: sw.lat(),
              west: sw.lng(),
            });
          } else if (place.location) {
            map.setCenter({ lat: place.location.lat(), lng: place.location.lng() });
            map.setZoom(14);
          }

          if (place.location) {
            setMarkerPos({
              lat: place.location.lat(),
              lng: place.location.lng(),
            });
          }

          const components = place.addressComponents || [];
          const sublocality =
            components.find(
              (c) =>
                c.types.includes('sublocality_level_1') ||
                c.types.includes('sublocality') ||
                c.types.includes('neighborhood')
            )?.longText || '';
          const city =
            components.find((c) => c.types.includes('locality') || c.types.includes('administrative_area_level_1'))
              ?.longText || 'Dubai';

          const displayName = place.displayName || '';
          const formattedAddress = place.formattedAddress || '';
          setSelectedLabel(displayName || formattedAddress);

          onSelectRef.current({
            area: sublocality || displayName || 'Dubai',
            city,
            address: formattedAddress,
          });
        })
        .catch(() => {
          // Non-fatal field fetch failure
        });
    };

    autocomplete.addEventListener('gmp-select', handleSelect);

    return () => {
      autocomplete.removeEventListener('gmp-select', handleSelect);
      if (autocompleteContainerRef.current) {
        autocompleteContainerRef.current.innerHTML = '';
      }
    };
  }, [map, placesLibrary]);

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-[hsl(var(--foreground))]">
          Search UAE Location (Google Maps)
        </p>
        <div
          ref={autocompleteContainerRef}
          className="min-h-[44px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-1"
        />
        {selectedLabel && (
          <p className="mt-2 text-xs text-[hsl(var(--accent))]">
            Pinned: {selectedLabel}
          </p>
        )}
      </div>

      <div className="h-[260px] w-full border border-[hsl(var(--border))]">
        <GoogleMap
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          defaultCenter={DUBAI_DEFAULT}
          defaultZoom={11}
          gestureHandling="cooperative"
          className="h-full w-full"
        >
          <AdvancedMarker position={markerPos}>
            <Pin background="#99774d" borderColor="#f2f0ec" glyphColor="#f2f0ec" />
          </AdvancedMarker>
        </GoogleMap>
      </div>
    </div>
  );
}

export function DubaiLocationPicker({ onSelectLocation }: DubaiLocationPickerProps) {
  return (
    <MapsProvider fallback={null}>
      <LocationPickerInner onSelectLocation={onSelectLocation} />
    </MapsProvider>
  );
}
