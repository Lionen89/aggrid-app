import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-enterprise';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

import Api from './Api';
import Graph from './Graph';
import ImagePopup from './ImagePopup';
import Loader from './Loader';

function App() {
  const [data, setData] = React.useState([]);
  const gridStyle = React.useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [link, setLink] = React.useState('');
  const [isLoaded, setIsLoaded] = React.useState(true);

  const handlePopupOpen = (e) => {
    setIsPopupOpen(true);
    setLink(e.target.currentSrc);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const photo = (p) => {
    return (
      <img
        src={p.value}
        alt="Фото товара"
        style={{ height: 45 }}
        onClick={(e) => handlePopupOpen(e)}></img>
    );
  };
  const graph = (p) => {
    return (
      <div style={{ height: 45, display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        {p.value.map((item, key) => (
          <div
            key={key}
            style={{
              backgroundColor: '#3a52c9',
              width: 40,
              height: `${item.amount * 2}%`,
            }}></div>
        ))}
      </div>
    );
  };

  React.useEffect(() => {
    Api.getCards()
      .then((res) => {
        return Promise.all([Api.getCardsDetail(res), Api.getCardsPhoto(res)]);
      })
      .then(([detail, photo]) => {
        const arr = detail.map((item) => {
          Object.entries(photo).forEach((j) => {
            if (item.id === Number(j[0])) {
              item.photo = j[1];
              item.price = item.priceU / 100;
              item.graph = Graph.getGraph();
              return;
            }
          });
          return item;
        });
        setData(arr);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoaded(false));
  }, []);

  const rowData = data;
  const columns = [
    {
      headerName: 'Фото',
      field: 'photo',
      checkboxSelection: true,
      cellRenderer: React.memo(photo),
      sortable: false,
      filter: false,
      maxWidth: 150,
    },
    { headerName: 'Номенклатура', field: 'id', maxWidth: 180 },
    { headerName: 'Бренд', field: 'brand', maxWidth: 200 },
    { headerName: 'Название', field: 'name' },
    { headerName: 'Цена', field: 'price', maxWidth: 150 },
    {
      headerName: 'График заказов',
      field: 'graph',
      sortable: false,
      filter: false,
      minWidth: 450,
      cellRenderer: React.memo(graph),
      // cellRenderer: 'agSparklineCellRenderer', // в бесплатной версии график так не строится
      // cellRendererParams: {
      //   sparklineOptions: {
      //     type: 'column',
      //     fill: '#91cc75',
      //     stroke: '#91cc75',
      //     paddingInner: 0.3,
      //     paddingOuher: 0.1,
      //     yKey: 'data',
      //     xKey: 'amount',
      //     axis: {
      //       type: 'number',
      //     },
      //   },
      // },
    },
  ];
  const defColumnDefs = useMemo(
    () => ({ flex: 1, filter: true, resizable: true, sortable: true }),
    [],
  );
  return isLoaded ? (
    <Loader />
  ) : (
    <div style={{ height: '100vh', boxSizing: 'border-box' }}>
      <ImagePopup link={link} isOpen={isPopupOpen} onClose={handlePopupClose} />
      <div className="ag-theme-material" style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columns}
          defaultColDef={defColumnDefs}
          rowSelection="multiple"
          rowHeight={45}
          animateRows={true}
          sideBar={{
            toolPanels: [
              {
                id: 'columns',
                labelDefault: 'Столбцы',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel',
                toolPanelParams: {
                  suppressPivotMode: true,
                  suppressRowGroups: true,
                  suppressValues: true,
                  suppressColumnFilter: true,
                  suppressColumnSelectAll: true,
                },
              },
              {
                id: 'filters',
                labelDefault: 'Фильтры',
                labelKey: 'filters',
                iconKey: 'filter',
                toolPanel: 'agFiltersToolPanel',
                toolPanelParams: {
                  suppressFilterSearch: false,
                },
              },
              {
                id: 'options',
                labelDefault: 'Настройки',
                labelKey: 'Options',
                iconKey: 'menu',
                toolPanel: () => <h2>Какие то настройки</h2>,
              },
            ],
          }}
        />
      </div>
    </div>
  );
}

export default App;
