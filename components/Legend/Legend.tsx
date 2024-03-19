import style from "./Legend.module.scss";
import { mapPolygonColorToLanduse, mapPolygonColorToObject } from "../Map/Map";

interface LegendProps {
  uniqNamesLegend: string[];
  typeData: string;
  setTypeLanduse: any;
  typeLanduse: any;
}

const Legend = ({
  uniqNamesLegend,
  typeData,
  setTypeLanduse,
  typeLanduse,
}: LegendProps) => {
  const getCurrentType = (currunetType: string) => {
    if (typeLanduse !== currunetType) {
      setTypeLanduse(currunetType);
    } else {
      setTypeLanduse(null);
    }
  };

  const opacityLegend = (selectedLanduse: string, eachLanduse: string) => {
    if (selectedLanduse === eachLanduse) {
      return 1;
    } else {
      return 0.2;
    }
  };

  const list = uniqNamesLegend.map((el, i) => {
    return (
      <div
        className={style.blockInCard}
        key={i}
        style={
          typeLanduse
            ? { opacity: opacityLegend(typeLanduse, el) }
            : { opacity: 1 }
        }
      >
        <div
          className={style.colorLegend}
          style={{
            backgroundColor:
              typeData === "landuse"
                ? mapPolygonColorToLanduse(el)
                : mapPolygonColorToObject(el),
          }}
        />
        <div className={style.nameLegend} onClick={() => getCurrentType(el)}>
          {el}
        </div>
      </div>
    );
  });

  return (
    <div className={style.card}>
      {typeData === "landuse" ? null : (
        <span className={style.titleLegend}>Contribution, %</span>
      )}
      {list}
    </div>
  );
};

export default Legend;
