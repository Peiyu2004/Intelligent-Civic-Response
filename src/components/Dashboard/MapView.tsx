import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { Report, Cluster } from "../../types";
import { getSeverityColor } from "../../utils/helpers.ts";
import { Plus, Minus } from "lucide-react";

interface MapViewProps {
  clusters: Cluster[]; // optional, can keep for reference
  reports: Report[];
  selectedReport: Report | null;
  onSelectReport: (report: Report) => void;
}

// Optional: auto-zoom when zoom state changes
const ZoomControl: React.FC<{ zoom: number }> = ({ zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setZoom(zoom);
  }, [zoom, map]);
  return null;
};

export const MapView: React.FC<MapViewProps> = ({
  clusters,
  reports,
  selectedReport,
  onSelectReport,
}) => {
  const [zoom, setZoom] = useState(12);
  const defaultCenter: [number, number] = [3.139, 101.6869]; // example: Kuala Lumpur

  // Function to create a colored marker icon
  const createColoredIcon = (color: string) =>
    new L.Icon({
      iconUrl:
        "data:image/svg+xml;base64," +
        btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
          </svg>
        `),
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });

  return (
    <div className="bg-white rounded-lg p-5">
      {/* Legend + Title */}
      <div className="p-3 flex justify-between items-center text-sm">
        {/* Title on the left */}
        <h2 className="text-2xl font-black">Report Map View</h2>

        {/* Legend on the right */}
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
            <span>Low Severity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
            <span>Moderate Severity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded-sm"></div>
            <span>High Severity</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-96 w-full rounded-lg overflow-hidden border-2 border-gray-300 z-0 relative">
        <MapContainer
          center={defaultCenter}
          zoom={zoom}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Optional zoom syncing */}
          <ZoomControl zoom={zoom} />

          {/* Marker clustering */}
          <MarkerClusterGroup>
            {reports.map((report) => (
              <Marker
                key={report.id}
                position={[report.latitude, report.longitude]}
                icon={createColoredIcon(getSeverityColor(report.severity))}
                eventHandlers={{
                  click: () => onSelectReport(report),
                }}
              >
                {/* <Popup>
                  <div>
                    <strong>{report.title}</strong>
                    <br />
                    Severity: {report.severity}
                  </div>
                </Popup> */}
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      {/* Zoom Controls */}
      {/* <div className="mt-4 flex gap-2 justify-end">
        <button
          onClick={() => setZoom((z) => Math.min(z + 1, 18))}
          className="bg-white p-2 rounded shadow hover:bg-gray-100"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 1, 1))}
          className="bg-white p-2 rounded shadow hover:bg-gray-100"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div> */}
    </div>
  );
};
