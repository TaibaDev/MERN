// localhost:5000/leads?per_page=5&page=5

import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "./App.css";

function LeadGrid() {
  const [gridApi, setGridApi] = useState(null);
  const perPage = 3;

  const onGridReady = (params) => {
    setGridApi(params.api);
  };
  //   "page": 3,
  //   "per_page": 3,
  //   "total": 12,
  //   "total_pages": 4,

  useEffect(() => {
    if (gridApi) {
      const dataSource = {
        getRows: (params) => {
          // Use startRow and endRow for sending pagination to Backend
          //   params.startRow = 2;
          //   params.endRow = 5;
          console.log({ params });
          gridApi.showLoadingOverlay();
          const page = params.endRow / perPage;
          fetch(`http://localhost:5000/leads?per_page=${perPage}&page=${page}`)
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

  return (
    <div className="App">
      <div
        className="ag-theme-alpine ag-style"
        style={{ height: "550px", width: "900px" }}
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
          defaultColDef={{ flex: 1 }}
          overlayLoadingTemplate={"Please wait while your rows are loading..."}
          overlayNoRowsTemplate={"No data found to display."}
        ></AgGridReact>
      </div>
    </div>
  );
}

export default LeadGrid;
