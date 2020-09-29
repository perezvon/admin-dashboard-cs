import React, { useState } from 'react';
import moment from 'moment';

const useYear = () => {
  const [year, setYear] = useState(moment().format('YYYY'));
  return { year, setYear };
};

export default useYear;
