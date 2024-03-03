import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setDia,
  setThick,
  setFocus,
  setType,
  setIqi,
  setUg,
  setCap,
  setDiaMM,
} from '../Store/rtParams';

export default function RtCalc() {
  // VARIABLE
  const dispatch = useDispatch();

  const dia = useSelector((state: any) => state.rtParams.dia);
  const thick = useSelector((state: any) => state.rtParams.thick);
  const focus = useSelector((state: any) => state.rtParams.focus);
  const type = useSelector((state: any) => state.rtParams.type);
  const iqi = useSelector((state: any) => state.rtParams.iqi);
  const ug = useSelector((state: any) => state.rtParams.ug);
  const cap = useSelector((state: any) => state.rtParams.cap);
  const diaMM = useSelector((state: any) => state.rtParams.diaMM);

  const [curi, setCuri] = useState<number>(0);
  const [manual, setManual] = useState<string>('');
  const [auto, setAuto] = useState<string>('');

  const [checkDiaMM, setCheckDiaMM] = useState<boolean>(true);
  const [isPositionGood, setIsPositionGood] = useState<boolean>(true);
  const [isUgGood, setIsUgGood] = useState<boolean>(true);

  // CALCULATE PIPE DIAMETR IN INCH TO DIAMETR IN MM
  const transformDiametr = () => {
    setCheckDiaMM(true);
    switch (dia) {
      case 0.125:
        dispatch(setDiaMM(10.3));
        break;
      case 0.25:
        dispatch(setDiaMM(13.7));
        break;
      case 0.375:
        dispatch(setDiaMM(17.1));
        break;
      case 0.5:
        dispatch(setDiaMM(21.3));
        break;
      case 0.75:
        dispatch(setDiaMM(26.7));
        break;
      case 1:
        dispatch(setDiaMM(33.4));
        break;
      case 1.25:
        dispatch(setDiaMM(42.2));
        break;
      case 1.5:
        dispatch(setDiaMM(48.3));
        break;
      case 2:
        dispatch(setDiaMM(60.3));
        break;
      case 2.5:
        dispatch(setDiaMM(73));
        break;
      case 3:
        dispatch(setDiaMM(88.9));
        break;
      case 3.5:
        dispatch(setDiaMM(101.6));
        break;
      case 4:
        dispatch(setDiaMM(114.3));
        break;
      case 5:
        dispatch(setDiaMM(141.3));
        break;
      case 6:
        dispatch(setDiaMM(168.3));
        break;
      case 8:
        dispatch(setDiaMM(219.1));
        break;
      case 10:
        dispatch(setDiaMM(273));
        break;
      case 12:
        dispatch(setDiaMM(323.9));
        break;
      default:
        dispatch(setDiaMM(Math.round(dia * 25.4)));
        if (dia < 12 && dia > 0) setCheckDiaMM(false);
        break;
    }
  };

  // CALCULATE POSITION
  const calcType = () => {
    setIsPositionGood(true);
    if (focus > 1 && dia > 3 && diaMM + cap > focus) {
      dispatch(setType('SWSI'));
      if (diaMM - thick <= focus) setIsPositionGood(false);
    } else if (focus > 1 && dia >= 3) {
      dispatch(setType('DWSI'));
    } else if (focus > 1 && dia <= 2) {
      dispatch(setType('DWDI'));
    }
  };

  // CALCULATE MIN IQI SIZE
  const calcIqi = () =>
    dispatch(
      setIqi(Math.round((((thick + cap) * 2 * (type == 'DWDI' ? 2 : 1)) / 100) * 100) / 100),
    );

  // CALCULATE UG
  const calcUg = () => {
    if (type == 'DWDI') {
      dispatch(setUg(Math.round(((3.7 * (diaMM + cap)) / (focus - cap - diaMM)) * 100) / 100));
    } else if (type == 'SWSI' || type == 'DWSI') {
      dispatch(setUg(Math.round(((3.7 * (thick + cap)) / (focus - cap - thick)) * 100) / 100));
    }

    setIsUgGood(ug <= 0.5);
  };

  // CALCULATE EXPOSITION TIME
  const calcExposition = (method: string) => {
    let mult = 2;
    let density = 0;
    let transformThick = 0;
    if (type == 'SWSI') mult = 1;

    let densityTable = [
      [1.6, 0.09],
      [3.2, 0.092],
      [4.8, 0.098],
      [6.4, 0.11],
      [7.9, 0.12],
      [9.5, 0.13],
      [11.5, 0.14],
      [12.7, 0.16],
      [14.3, 0.17],
      [15.9, 0.18],
      [17.5, 0.19],
      [19.1, 0.21],
      [20.6, 0.23],
      [22.2, 0.25],
      [23.8, 0.27],
      [25.4, 0.3],
      [28.6, 0.35],
      [31.8, 0.41],
      [34.9, 0.49],
      [38.1, 0.59],
      [41.3, 0.7],
      [44.5, 0.81],
      [47.6, 1.0],
      [50.8, 1.25],
      [54.0, 1.5],
      [57.2, 1.7],
      [60.3, 2.0],
      [63.5, 2.4],
      [66.7, 2.9],
      [69.9, 3.4],
      [73.0, 4.0],
      [76.2, 4.7],
    ];

    densityTable.find((elem: any, index) => {
      if (elem[0] >= (thick + cap) * mult) {
        transformThick = elem[0];
        density = elem[1];
        return true;
      }
    });

    let exposition = ((focus / 25.4) ** 2 * 4.5 * density) / curi;

    function transformToMinute(value: number) {
      let wholeNum = Math.trunc(value);
      return wholeNum + 'min ' + Math.round((value - wholeNum) * 60) + 'sec';
    }

    if (method == 'manual') {
      setManual(transformToMinute(exposition));
    } else if (method == 'auto') {
      setAuto(transformToMinute(exposition + exposition * 0.285));
    } else {
      alert('Incorrect params on calcExposition()');
    }
  };

  // USE EFFECT
  useEffect(() => {
    transformDiametr();
    calcType();
    calcUg();
    calcIqi();
    calcExposition('manual');
    calcExposition('auto');
  }, [dia, thick, focus, cap, ug, curi, manual, auto]);

  //RENDERING-========================================================
  return (
    <div id="main">
      <div className="diametr">
        <label htmlFor="diametr">
          <b>Diametr (inch)</b>
        </label>
        <input
          lang="ru"
          id="diametr"
          name="diametr"
          type="number"
          min="0.00"
          max="80"
          step={0.01}
          onChange={(event) => dispatch(setDia(Number(event.target.value)))}
        />
        <br />
      </div>

      <div className="thickness">
        <label htmlFor="thickness">
          <b>Thickness (mm)</b>
        </label>
        <input
          id="thickness"
          name="thickness"
          type="number"
          min="0.00"
          max="300"
          step={0.01}
          onChange={(event) => dispatch(setThick(Number(event.target.value)))}
        />
        <br />

        <label htmlFor="cap">
          <i className="capCheckbox">add CAP (mm) </i>
        </label>
        <input
          type="number"
          id="cap"
          name="cap"
          min="0"
          max="20"
          step={0.1}
          value={cap}
          onChange={(event) => dispatch(setCap(Number(event.target.value)))}
        />

        <br />
      </div>

      <div className="focus">
        <label htmlFor="focus">
          <b>Focus (mm)</b>
        </label>
        <input
          id="focus"
          name="focus"
          type="number"
          min="0.00"
          max="1000"
          step={1}
          onChange={(event) => dispatch(setFocus(Number(event.target.value)))}
        />
        <br />
      </div>

      <div className="curi">
        <label htmlFor="curi">
          <b>Curi Ir-192</b>
        </label>
        <input
          id="curi"
          name="Curi"
          type="number"
          min="0.00"
          max="150"
          step={0.01}
          onChange={(event) => setCuri(Number(event.target.value))}
        />
        <br />
      </div>

      <div id="result">
        <hr />
        <div className="exposition">
          <p>Exposition time</p>
          <p>
            Manual: <b>{curi ? manual : ''}</b> Automat: <b>{curi ? auto : ''}</b>
          </p>
        </div>
        <hr />
        <div id="diametr-div">
          Diametr:{' '}
          <b>
            {dia ? dia : ''}
            {dia ? '"' : ''}
            {dia ? '  ' + diaMM + ' mm' : ''}
          </b>
          <p className="diaWorning">
            {!checkDiaMM
              ? '  **diameter does not comply with pipeline standards, so conversion from mm to inches is explicit'
              : ''}
          </p>
        </div>
        <p>
          Thickness:{' '}
          <b>
            {thick ? thick : ''}
            {thick ? ' mm' : ''}
          </b>
        </p>
        <p>
          Type: <b>{type}</b>
        </p>
        <div>
          <p className="focusWorning">{!isPositionGood ? '  **focus incorrect' : ''}</p>
          Focus:{' '}
          <b>
            {focus ? focus : ''}
            {focus ? ' mm' : ''}
          </b>
        </div>
        <p>
          Min IQI size:{' '}
          <b>
            {iqi >= 0.1 ? iqi : ''}
            {iqi >= 0.1 ? ' mm' : ''}
          </b>
        </p>
        <div>
          <p className="ugWorning">{isUgGood ? '' : '  **UG is not acceptable'}</p>
          UG: <b>{ug > 0 ? ug : ''}</b>
        </div>
      </div>
    </div>
  );
}
