declare module 'react-select-country-list' {
    const countryList: () => {
      getData: () => Array<{ label: string; value: string }>;
    };
  
    export default countryList;
  }
  