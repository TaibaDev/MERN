// localhost:5000/leads?per_page=5&page=5

import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./App.css";
function TutsGrid() {
  const [gridApi, setGridApi] = useState(null);
  const perPage = 5;

  useEffect(() => {
    if (gridApi) {
      const dataSource = {
        getRows: (params) => {
          console.log(JSON.stringify(params, null, 1));
          const { sortModel, filterModel, startRow, endRow } = params;
          console.log({
            startRow,
            endRow,
            filterModel,
            sortModel,
          });
          gridApi.showLoadingOverlay();
          let baseUrl = `http://localhost:5000/leads?`;
          //sorting
          if (sortModel.length) {
            const { colId, sort } = sortModel[0];
            baseUrl += `_sort=${colId}&_order=${sort}&`;
          }
          //filtering
          const filterKeys = Object.keys(filterModel);
          filterKeys.forEach((filter) => {
            baseUrl += `${filter}=${filterModel[filter].filter}&`;
          });
          //pagination
          const page = params.endRow / perPage;
          baseUrl += `per_page=${perPage}&page=${page}`;
          //   baseUrl += `per_page=${startRow}&page=${endRow}`;
          fetch(baseUrl)
            .then((resp) => resp.json())
            .then((res) => {
              if (!res.data.length) {
                gridApi.showNoRowsOverlay();
              } else {
                gridApi.hideOverlay();
              }
              params.successCallback(res.data, res.total);
              console.log(res.total);
            })
            .catch((err) => {
              gridApi.showNoRowsOverlay();
              params.successCallback([], 0);
              console.log(err);
            });
        },
      };
      gridApi.setDatasource(dataSource);
    }
  }, [gridApi]);
  //onGridReady*****
  const onGridReady = (params) => {
    setGridApi(params.api);
  };
  const columnDefs = [
    {
      field: "customer_name",
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: true,
    },
    {
      field: "email",
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: true,
    },
    {
      field: "area",
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: true,
    },
  ];
  const gridOptions = {
    pagination: true,
    animateRows: true,
    filter: true,
    enableServerSideFilter: true,
    enableServerSideSorting: true,
  };
  // customer_name, email and area
  //
  return (
    <div className="App">
      <div
        className="ag-theme-alpine ag-style"
        style={{ height: "550px", width: "700px" }}
      >
        <AgGridReact
          pagination={true}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          rowModelType={"infinite"}
          paginationPageSize={perPage}
          cacheBlockSize={perPage}
          onGridReady={onGridReady}
          rowHeight={60}
          defaultColDef={{ filter: true, floatingFilter: true, sortable: true }}
          overlayLoadingTemplate={"Please wait while your rows are loading..."}
          overlayNoRowsTemplate={"No data found to display."}
        ></AgGridReact>
      </div>
    </div>
  );
}

export default TutsGrid;
