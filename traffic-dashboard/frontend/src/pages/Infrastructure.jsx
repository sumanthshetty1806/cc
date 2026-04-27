import React from 'react';
import { useOutletContext } from 'react-router-dom';
import InfrastructureCards from '../components/InfrastructureCards';

export default function Infrastructure() {
  const { roadDefect, intersection, alignmentCrash, trafficwayRanking } = useOutletContext();

  return (
    <div>
      <h2 style={{ paddingLeft: '1rem', borderLeft: '4px solid #f85149', marginBottom: '2rem' }}>Road & Infrastructure Mathematics</h2>
      <InfrastructureCards 
          roadDefect={roadDefect}
          intersection={intersection}
          alignmentCrash={alignmentCrash}
          trafficwayRanking={trafficwayRanking}
      />
    </div>
  );
}
