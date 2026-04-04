import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import type { Plot } from "@/types";

interface LeafletMapProps {
  plots: Plot[];
  onPlotPress: (id: string) => void;
  initialRegion?: { lat: number; lng: number; zoom: number };
}

const DEFAULT_REGION = { lat: 38.7223, lng: -9.1393, zoom: 12 }; // Lisbon

function generateMapHTML(region: { lat: number; lng: number; zoom: number }): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
    .price-marker {
      background: #32632e;
      color: #fff;
      font-weight: 700;
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 16px;
      border: 2px solid #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      white-space: nowrap;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      transform: translate(-50%, -50%);
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
  <script>
    var map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([${region.lat}, ${region.lng}], ${region.zoom});

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    var markers = [];
    var hasInitialFit = false;

    function updateMarkers(plots) {
      markers.forEach(function(m) { map.removeLayer(m); });
      markers = [];

      plots.forEach(function(plot) {
        if (!plot.lat || !plot.lng) return;

        var icon = L.divIcon({
          className: '',
          html: '<div class="price-marker">\\u20AC' + Math.round(plot.price) + '</div>',
          iconSize: null,
          iconAnchor: [0, 0]
        });

        var marker = L.marker([plot.lat, plot.lng], { icon: icon }).addTo(map);

        marker.on('click', function() {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ type: 'plotPress', plotId: plot.id })
          );
        });

        markers.push(marker);
      });

      if (!hasInitialFit && markers.length > 0) {
        hasInitialFit = true;
        var group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
      }
    }

    window.ReactNativeWebView.postMessage(
      JSON.stringify({ type: 'mapReady' })
    );
  <\/script>
</body>
</html>`;
}

export default function LeafletMap({
  plots,
  onPlotPress,
  initialRegion,
}: LeafletMapProps) {
  const webViewRef = useRef<WebView>(null);
  const [webViewReady, setWebViewReady] = useState(false);

  const region = initialRegion ?? DEFAULT_REGION;
  const mapHTML = useMemo(() => generateMapHTML(region), [region]);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data: { type: string; plotId?: string } = JSON.parse(
          event.nativeEvent.data
        );
        if (data.type === "mapReady") {
          setWebViewReady(true);
        } else if (data.type === "plotPress" && data.plotId) {
          onPlotPress(data.plotId);
        }
      } catch {
        // ignore malformed messages
      }
    },
    [onPlotPress]
  );

  useEffect(() => {
    if (!webViewReady || !webViewRef.current) return;

    const plotData = plots.map((p) => ({
      id: p.id,
      lat: p.latitude,
      lng: p.longitude,
      price: p.price_per_month,
    }));

    webViewRef.current.injectJavaScript(
      `updateMarkers(${JSON.stringify(plotData)}); true;`
    );
  }, [plots, webViewReady]);

  return (
    <View className="overflow-hidden rounded-xl" style={{ height: 280 }}>
      {!webViewReady && (
        <View className="absolute inset-0 z-10 items-center justify-center bg-surface-container">
          <ActivityIndicator size="small" color="#32632e" />
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ html: mapHTML }}
        onMessage={handleMessage}
        style={{ flex: 1, backgroundColor: "transparent" }}
        scrollEnabled={false}
        bounces={false}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={["*"]}
        mixedContentMode="compatibility"
      />
    </View>
  );
}
