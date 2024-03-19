import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  LayersControl,
  AttributionControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import style from "../Layout/Layout.module.scss";
import L, { LatLngExpression, LeafletMouseEvent } from "leaflet";
import landuse from "./landuse.json";
import Legend from "../Legend";
import SelectData from "../SelectData";
import { useState, FC } from "react";
import MarkerClusterGroup from "../MarkerClusterGroup";
import { GeoJsonObject } from "geojson";

const { BaseLayer } = LayersControl;

export const mapPolygonColorToObject = (contribution: number | string) => {
  return contribution < 20 || contribution === "0 - 20"
    ? "pink"
    : (contribution >= 20 && contribution < 50) || contribution === "20 - 50"
    ? "red"
    : (contribution >= 50 && contribution < 80) || contribution === "50 - 80"
    ? "purple"
    : (contribution >= 80 && contribution < 100) || contribution === "80 - 100"
    ? "blue"
    : contribution === 100
    ? "black"
    : "white";
};

export const mapPolygonColorToLanduse = (landuse: string) => {
  return landuse === "allotments"
    ? "brown"
    : landuse === "residential"
    ? "blue"
    : landuse === "military"
    ? "#456649"
    : landuse === "grass"
    ? "#00ff10"
    : landuse === "cemetery"
    ? "black"
    : landuse === "retail"
    ? "pink"
    : landuse === "industrial"
    ? "gray"
    : landuse === "garages"
    ? "purple"
    : landuse === "construction"
    ? "yellow"
    : landuse === "farmland"
    ? "orange"
    : landuse === "logging"
    ? "#8a80ff"
    : landuse === "farmyard"
    ? "#f7f3b7"
    : landuse === "religious"
    ? "#00f2e7"
    : landuse === "reservoir"
    ? "#007dc8"
    : landuse === "quarry"
    ? "#885d25"
    : landuse === "greenhouse_horticulture"
    ? "#5bff65"
    : landuse === "railway"
    ? "#b5b5b5"
    : landuse === "orchard"
    ? "red"
    : landuse === "meadow"
    ? "#00bb38"
    : landuse === "forest"
    ? "green"
    : landuse === "landfill"
    ? "#402c2c"
    : landuse === "commercial"
    ? "#ffde90"
    : landuse === "brownfield"
    ? "#711f06"
    : landuse === "greenfield"
    ? "#3be145"
    : "white";
};

const currentColorLanduse = (selectedLanduse: string, eachLanduse: string) => {
  if (selectedLanduse === eachLanduse) {
    return mapPolygonColorToLanduse(selectedLanduse);
  } else {
    return "white";
  }
};

const Map: FC = () => {
  const [data, setData] = useState(landuse);
  const [typeData, setTypeData] = useState<string>("landuse");

  const [typeLanduse, setTypeLanduse] = useState<string | null>(null);

  const coordinates: [number, number] =
    landuse.features[0].geometry.coordinates[0][0];

  const position: LatLngExpression = [coordinates[1], coordinates[0]];

  const defaultIcon: L.DivIcon = L.icon({
    iconUrl: "./images/marker-icon.png",
    shadowUrl: "./images/marker-shadow.png",
  });
  L.Marker.prototype.options.icon = defaultIcon;

  const arrContribution = ["0 - 20", "20 - 50", "50 - 80", "80 - 100"];

  const uniqNamesLegend: string[] =
    typeData === "landuse"
      ? Array.from(new Set(landuse.features.map((el) => el.properties.landuse)))
      : arrContribution;

  const arrPolygons = data.features.filter(
    (el: any) => el.geometry?.type !== "Point"
  );

  const arrMarkers = data.features.filter(
    (el: any) => el.geometry?.type === "Point"
  );

  const markers = arrMarkers.map((el) => (
    <Marker
      key={el.id}
      position={[el.geometry.coordinates[1], el.geometry.coordinates[0]]}
      icon={defaultIcon}
      // draggable={true}
    >
      <Popup>
        Sector: {el.properties.sector}
        <br />
        {el.properties.main_contributors}: {el.properties.contribution_percent}%
      </Popup>
    </Marker>
  ));

  const onEachFeature = (feature: any, layer: L.Layer): void => {
    if (typeData === "landuse") {
      feature.properties.tags.name
        ? layer.bindPopup(
            `<div>Name: ${feature.properties.tags.name}</div>
              <div>Landuse: ${feature.properties.landuse}</div>`
          )
        : layer.bindPopup(
            `<div>Name: without name</div>
              <div>Landuse: ${feature.properties.landuse}</div>`
          );
    } else if (typeData === "object") {
      layer.bindPopup(
        `<div>Main_contributors: ${feature.properties.main_contributors} (${feature.properties.contribution_percent}%)</div>
              <div>Contribution_level: ${feature.properties.contribution_level}</div>`
      );
    }
    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const layer = e.target;
        layer.setStyle(selectedStyle(e.target.feature));
      },
      mouseout: (e: LeafletMouseEvent) => {
        const layer = e.target;
        layer.setStyle(defaultStyle(e.target.feature));
      },
      click: (e: LeafletMouseEvent) => {
        const layer = e.target;
        console.log(+e.target.feature.id);
      },
    });
  };

  const defaultStyle = (feature: any) => {
    return {
      fillColor: typeLanduse
        ? currentColorLanduse(typeLanduse, feature.properties.landuse)
        : typeData === "landuse"
        ? mapPolygonColorToLanduse(feature.properties.landuse)
        : mapPolygonColorToObject(feature.properties.contribution_percent),
      color: "#9370DB",
      fillOpacity: 1,
      weight: 1,
      dashArray: 3,
      opacity: 1,
    };
  };

  const selectedStyle = (feature: any) => {
    return {
      fillColor: "red",
      color: "red",
      fillOpacity: 0.5,
      weight: 3,
      dashArray: 1,
      opacity: 1,
    };
  };

  return (
    <MapContainer
      center={position}
      zoom={10}
      scrollWheelZoom={true}
      className={style.map}
      minZoom={3}
      attributionControl={false}
    >
      <LayersControl>
        <BaseLayer checked name="OpenStreetMap">
          <TileLayer
            attribution='<a target="_blank" href="https://leafletjs.com/">Leaflet</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>
        <BaseLayer name="Topo Map">
          <TileLayer
            attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>
        <BaseLayer name="NASA Gibs Blue Marble">
          <TileLayer
            attribution="&copy; NASA Gibs Blue Marble"
            url="https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg"
            maxNativeZoom={8}
          />
        </BaseLayer>
      </LayersControl>
      <AttributionControl position="bottomright" prefix={false} />
      <GeoJSON
        // @ts-ignore
        data={arrPolygons}
        key={typeData}
        // @ts-ignore
        style={defaultStyle}
        onEachFeature={onEachFeature}
      ></GeoJSON>

      <Legend
        uniqNamesLegend={uniqNamesLegend}
        typeData={typeData}
        setTypeLanduse={setTypeLanduse}
        typeLanduse={typeLanduse}
      />
      <MarkerClusterGroup>{markers}</MarkerClusterGroup>
      <SelectData setData={setData} setTypeData={setTypeData} />
    </MapContainer>
  );
};

export default Map;
