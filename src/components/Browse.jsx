import { useLoaderData, useNavigation, useSearchParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { useCallback } from 'react';
import { PAGE_SIZES } from "../config.js";

export function BrowseDataGrid(props) {
  const { columns } = props;

  const response = useLoaderData();

  const navigation = useNavigation();

  const getRowHeight = useCallback(() => 'auto', []);

  const paginationModel = {
    page: response.pageable.pageNumber,
    pageSize: response.pageable.pageSize,
  };

  const [searchParams, setSearchParams] = useSearchParams();

  const handlePaginationModelChange = useCallback(paginationModel => {
    const pageNumber = paginationModel.page;
    const pageSize = paginationModel.pageSize;

    if (pageNumber === 0) {
      searchParams.delete('page');
    } else {
      searchParams.set('page', `${pageNumber}`);
    }

    if (pageSize === 10) {
      searchParams.delete('size');
    } else {
      searchParams.set('size', `${pageSize}`);
    }
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  return (
      <DataGrid
          columns={columns}
          rows={response.content}
          rowCount={response.totalElements}
          disableColumnMenu
          disableRowSelectionOnClick
          getRowHeight={getRowHeight}
          pageSizeOptions={PAGE_SIZES}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={handlePaginationModelChange}
          loading={navigation.state === 'loading'}
      />
  );
}