import React, { useState, useEffect } from 'react';
import { CChart } from '@coreui/react-chartjs'
import { CCard } from '@coreui/react';
import { fetchWidgetData } from '../../../api/widget';
import { useToken } from '../../../hooks/useToken';

interface CoronavirusData {
  dep: number,
  date: string,
  reg: number,
  lib_dep: string,
  lib_reg: string,
  tx_pos: number,
  tx_incid: number,
  TO: number,
  R: null,
  hosp: number,
  rea: number,
  rad: number,
  dchosp: number,
  reg_rea: number,
  incid_hosp: number,
  incid_rea: number,
  incid_rad: number,
  incid_dchosp: number,
  reg_incid_rea: number,
  pos: number,
  pos_7j: number,
  cv_dose1: null
}

const getDayName = (dateStr: string, locale: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });        
}

const CoronavirusWidget = ({ id }: { id: number }) => {
  const [covidData, setCovidData] = useState<CoronavirusData[]>([]);
  const token = useToken();

  const fetchCovidData = () => fetchWidgetData<CoronavirusData[]>(token.get(), id, 'GET');
  
  const updateData = () => {
    fetchCovidData()
      .then(setCovidData)
      .catch(console.error);
  }

  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, 300000);
    return () => clearInterval(interval);
  }, []);

  const dataLength = covidData.length;
  return (
    <div>
    {
      (dataLength > 0) ?
      <CCard style={{ width: '20rem' }}>
        <CChart
          width={1}
          height={1}
          type="bar"
          data={{
            labels: [
              getDayName(covidData[dataLength - 4 - 6].date, 'fr-FR'),
              getDayName(covidData[dataLength - 4 - 5].date, 'fr-FR'),
              getDayName(covidData[dataLength - 4 - 4].date, 'fr-FR'),
              getDayName(covidData[dataLength - 4 - 3].date, 'fr-FR'),
              getDayName(covidData[dataLength - 4 - 2].date, 'fr-FR'),
              getDayName(covidData[dataLength - 4 - 1].date, 'fr-FR'),
              getDayName(covidData[dataLength - 4].date, 'fr-FR'),
            ],
            datasets: [
              {
                label: 'number of covid case per day in ' + covidData[dataLength - 4].lib_dep,
                backgroundColor: '#f87979',
                data: [
                  covidData[dataLength - 4 - 6].pos,
                  covidData[dataLength - 4 - 5].pos,
                  covidData[dataLength - 4 - 4].pos,
                  covidData[dataLength - 4 - 3].pos,
                  covidData[dataLength - 4 - 2].pos,
                  covidData[dataLength - 4 - 1].pos,
                  covidData[dataLength - 4].pos,
                ],
              },
            ],
          }}
        />
      </CCard>
      :
      <></>
    }
    </div>
  );
}

export default CoronavirusWidget;