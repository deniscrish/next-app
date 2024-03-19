import styles from "./SelectData.module.scss";
import landuse from "../../components/Map/landuse.json";
import object from "../../components/Map/object.json";

interface SelectDataProps {
  setData: () => void;
  setTypeData: () => string;
}

const SelectData = ({ setData, setTypeData }: any) => {
  const changeData = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeData(e.target.value);
    if (e.target.value === "landuse") {
      setData(landuse);
    } else if (e.target.value === "object") {
      setData(object);
    }
  };

  const selects = [
    { name: "Landuse", value: "landuse" },
    { name: "Object", value: "object" },
  ];

  const options = selects.map((data, i) => {
    return (
      <option key={i} value={data.value}>
        {data.name}
      </option>
    );
  });
  return (
    <select className={styles.select} onChange={changeData}>
      {options}
    </select>
  );
};

export default SelectData;
