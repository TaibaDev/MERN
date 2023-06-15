import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "./App.css";

function ReactGrid() {
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
          fetch(`https://reqres.in/api/users?per_page=${perPage}&page=${page}`)
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
  const avatarFormatter = ({ value }) => {
    return <img src={value} width="50px" height="50px" alt="img" />;
  };
  const columnDefs = [
    {
      field: "first_name",
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: true,
    },
    {
      field: "last_name",
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
      field: "avatar",
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: true,
      cellRendererFramework: { avatarFormatter },
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
      <h2>
        ReactJS How to load data API in AG Grid React with loading content and
        Pagination
      </h2>
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

export default ReactGrid;
